import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  APPROVED_EMAIL,
  APPROVED_NATIVE_PLACE,
  APPROVED_PHONE,
  hasUnapprovedPhoneNumber,
} from "./lib-approved-contacts.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const profileDirectory = join(repositoryRoot, "src", "data", "profile");
const errors = [];
const approvedEmail = APPROVED_EMAIL;
const approvedWebsite = "https://ctrlctrlx.top";

function fail(rule, detail = "") {
  errors.push(detail ? `${rule}: ${detail}` : rule);
}

function isBilingual(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.zh === "string" &&
    value.zh.trim().length > 0 &&
    typeof value.en === "string" &&
    value.en.trim().length > 0
  );
}

function validateEvidence(entry, label) {
  if (!["public", "private", "hidden"].includes(entry.visibility)) {
    fail("invalid-visibility", label);
  }
  if (!["verified", "pending", "unavailable"].includes(entry.verificationStatus)) {
    fail("invalid-verification-status", label);
  }
  if (
    typeof entry.sourceId === "string" &&
    (entry.sourceId.includes("/") || entry.sourceId.includes("\\"))
  ) {
    fail("source-id-exposes-path", label);
  }
}

/** 附件允许的目录与扩展名：统一放在 public/attachments/<分类>/ 下 */
const ATTACHMENT_DIRECTORIES = new Set([
  "/attachments/awards/",
  "/attachments/credentials/",
  "/attachments/patents/",
]);
const ATTACHMENT_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ATTACHMENT_FILE_EXTENSIONS = [".pdf"];
/** 附件文件名规范：仅允许 ASCII 字母/数字/点/下划线/连字符，禁止中文与空格 */
const ATTACHMENT_FILENAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * 校验荣誉资质附件（奖项 / 证书 / 专利）：
 * - 结构：必填字段齐全、type 枚举合法；
 * - 路径：必须位于约定的三级目录、扩展名与 type 匹配、文件名仅 ASCII；
 * - 存在性：对应 public 下的文件必须真实存在，避免上线 404。
 */
function validateAttachments(attachments, label) {
  if (attachments === undefined) return;
  if (!Array.isArray(attachments)) {
    fail("invalid-attachments-type", label);
    return;
  }
  for (const attachment of attachments) {
    if (typeof attachment !== "object" || attachment === null) {
      fail("invalid-attachment-entry", label);
      continue;
    }
    for (const field of ["name", "nameEn", "path", "format", "formatEn"]) {
      if (
        typeof attachment[field] !== "string" ||
        attachment[field].trim().length === 0
      ) {
        fail("missing-attachment-field", `${label}:${field}`);
      }
    }
    if (!["image", "file"].includes(attachment.type)) {
      fail("invalid-attachment-kind", `${label}:${attachment.type}`);
      continue;
    }
    const path = typeof attachment.path === "string" ? attachment.path : "";
    if (
      ![...ATTACHMENT_DIRECTORIES].some((directory) =>
        path.startsWith(directory)
      )
    ) {
      fail("invalid-attachment-path", `${label}:${path}`);
      continue;
    }
    const fileName = path.split("/").at(-1) ?? "";
    if (!ATTACHMENT_FILENAME_PATTERN.test(fileName)) {
      fail("invalid-attachment-filename", `${label}:${fileName}`);
    }
    const lowerFileName = fileName.toLowerCase();
    const allowedExtensions =
      attachment.type === "image"
        ? ATTACHMENT_IMAGE_EXTENSIONS
        : ATTACHMENT_FILE_EXTENSIONS;
    if (!allowedExtensions.some((extension) => lowerFileName.endsWith(extension))) {
      fail("attachment-extension-mismatch", `${label}:${fileName}`);
    }
    if (!existsSync(join(repositoryRoot, "public", path.slice(1)))) {
      fail("missing-attachment-file", `${label}:${path}`);
    }
  }
}

async function loadProfileModule(fileName) {
  const moduleUrl = pathToFileURL(join(profileDirectory, fileName)).href;
  return import(moduleUrl);
}

const [
  { about },
  { awards },
  { competitions },
  { credentials },
  { education },
  { identity },
  { patents },
  { projects },
  { publications },
  { research },
  { skills },
  { isPublicVerified },
] = await Promise.all([
  loadProfileModule("about.ts"),
  loadProfileModule("awards.ts"),
  loadProfileModule("competitions.ts"),
  loadProfileModule("credentials.ts"),
  loadProfileModule("education.ts"),
  loadProfileModule("identity.ts"),
  loadProfileModule("patents.ts"),
  loadProfileModule("projects.ts"),
  loadProfileModule("publications.ts"),
  loadProfileModule("research.ts"),
  loadProfileModule("skills.ts"),
  loadProfileModule("visibility.ts"),
]);

if (identity.name.zh !== "杨冲") fail("incorrect-identity-name-zh");
if (identity.name.en !== "Yang Chong") fail("incorrect-identity-name-en");
validateEvidence(identity, "identity");

// 联系方式标签完整性：邮箱、手机号各必须存在且带双语标签（全站展示依赖这两项）
const publicContacts = identity.contacts.filter(isPublicVerified);
const emailContacts = publicContacts.filter((contact) => contact.kind === "email");
const phoneContacts = publicContacts.filter((contact) => contact.kind === "phone");
const websiteContacts = publicContacts.filter((contact) => contact.kind === "website");
const githubContacts = publicContacts.filter((contact) => contact.kind === "github");
if (emailContacts.length !== 1 || emailContacts[0]?.value !== approvedEmail) {
  fail("incorrect-public-email");
}
if (phoneContacts.length !== 1 || phoneContacts[0]?.value !== APPROVED_PHONE) {
  fail("incorrect-public-phone");
}
if (websiteContacts.length !== 1 || websiteContacts[0]?.value !== approvedWebsite) {
  fail("incorrect-public-website");
}
if (
  githubContacts.length !== 1 ||
  githubContacts[0]?.value !== "https://github.com/ctrlctrlx"
) {
  fail("incorrect-public-github");
}
for (const contact of identity.contacts) {
  validateEvidence(contact, `contact:${contact.id}`);
  if (!isBilingual(contact.label)) fail("missing-bilingual-field", `contact:${contact.id}:label`);
}

const profileFiles = readdirSync(profileDirectory)
  .filter((fileName) => fileName.endsWith(".ts"))
  .map((fileName) => join(profileDirectory, fileName));
const profileSource = profileFiles
  .map((filePath) => readFileSync(filePath, "utf8"))
  .join("\n");

for (const [name, expectedCount] of [["杨冲", 1], ["Yang Chong", 1]]) {
  const count = profileSource.split(name).length - 1;
  if (count !== expectedCount) fail("identity-name-not-unique", `${name}=${count}`);
}

const collections = [
  ["education", education],
  ["projects", projects],
  ["publications", publications],
  ["patents", patents],
  ["awards", awards],
  ["competitions", competitions],
  ["credentials", credentials],
  ["research", research.areas],
  ["skills", skills],
];

for (const [collectionName, entries] of collections) {
  if (!Array.isArray(entries)) fail("collection-not-array", collectionName);
  for (const entry of entries) {
    validateEvidence(entry, `${collectionName}:${entry.id ?? "unknown"}`);
  }
}

for (const entry of education) {
  for (const field of ["institution", "degree", "major"]) {
    if (!isBilingual(entry[field])) fail("missing-bilingual-field", `education:${entry.id}:${field}`);
  }
  // GPA 与专业排名为双语结构（中文全角括号 / 英文半角括号），缺英文即视为非法
  if (entry.gpa !== undefined && !isBilingual(entry.gpa)) {
    fail("missing-bilingual-field", `education:${entry.id}:gpa`);
  }
}

validateEvidence(about, "about");
if (!isBilingual(about.headline)) fail("missing-bilingual-field", "about:headline");
if (!isBilingual(about.politicalStatus)) {
  fail("missing-bilingual-field", "about:politicalStatus");
}
if (!Array.isArray(about.jobTargets) || about.jobTargets.length === 0) {
  fail("missing-about-job-targets");
} else {
  for (const target of about.jobTargets) {
    if (!isBilingual(target)) fail("missing-bilingual-field", "about:jobTarget");
  }
}
// 「关于我」的能力模块卡片：6 个（算法研究 / 工程落地 / 边缘AI部署 / 调试定位 / 学习力 / 综合素质）
if (!Array.isArray(about.strengths) || about.strengths.length !== 6) {
  fail("incorrect-about-strength-count");
} else {
  for (const strength of about.strengths) {
    if (!isBilingual(strength.title) || !isBilingual(strength.description)) {
      fail("missing-bilingual-field", `about:strength:${strength.id}`);
    }
  }
}
// 关于页三段式简介：每段至少一个片段，片段文本必须双语齐全
if (!Array.isArray(about.bioSections) || about.bioSections.length === 0) {
  fail("missing-about-bio-sections");
} else {
  for (const section of about.bioSections) {
    if (!Array.isArray(section.segments) || section.segments.length === 0) {
      fail("empty-about-bio-section", section.id ?? "unknown");
      continue;
    }
    for (const segment of section.segments) {
      if (!isBilingual(segment.text)) {
        fail("missing-bilingual-field", `about:bio:${section.id}:segment`);
      }
    }
  }
}

for (const contact of about.contacts) {
  if (!isBilingual(contact.label) || !isBilingual(contact.value)) {
    fail("missing-bilingual-field", `about:contact:${contact.id}`);
  }
}

// 联系方式：微信号必须公开且准确
const wechatContact = about.contacts.find((contact) => contact.id === "contact-wechat");
if (!wechatContact) {
  fail("missing-public-wechat-contact");
} else if (wechatContact.value.zh !== "Galaxy24664") {
  fail("incorrect-public-wechat-id");
}
if (about.contacts.some((contact) => contact.id === "contact-hometown")) {
  fail("hometown-contact-still-present");
}

/**
 * 籍贯：本人先前要求全站移除，现已重新授权公开重庆。
 * 授权值集中在 scripts/lib-approved-contacts.mjs 声明：
 * 此处只放行该授权值，其它籍贯值或未授权字段仍然拦截。
 */
if (!isBilingual(about.nativePlace)) {
  fail("missing-bilingual-field", "about:nativePlace");
} else if (
  about.nativePlace.zh !== APPROVED_NATIVE_PLACE.zh ||
  about.nativePlace.en !== APPROVED_NATIVE_PLACE.en
) {
  fail("unapproved-native-place", `${about.nativePlace.zh}/${about.nativePlace.en}`);
}

// 通用研究方向：至少一项、id 合法、标签双语齐全（机器人/首页/项目页标签组的数据源）
const RESEARCH_DIRECTION_IDS = [
  "computer-vision",
  "reid",
  "vision-language",
  "embedded-sensing",
];
if (!Array.isArray(about.researchDirections) || about.researchDirections.length === 0) {
  fail("missing-about-research-directions");
} else {
  const seenDirectionIds = new Set();
  for (const direction of about.researchDirections) {
    if (!RESEARCH_DIRECTION_IDS.includes(direction.id)) {
      fail("invalid-research-direction-id", String(direction.id));
    }
    if (seenDirectionIds.has(direction.id)) {
      fail("duplicate-research-direction-id", String(direction.id));
    }
    seenDirectionIds.add(direction.id);
    if (!isBilingual(direction.label)) {
      fail("missing-bilingual-field", `about:researchDirection:${direction.id}`);
    }
  }
  if (seenDirectionIds.size !== RESEARCH_DIRECTION_IDS.length) {
    fail("incomplete-research-directions", `count=${seenDirectionIds.size}`);
  }
}

// 实践经历：阶段 → 职务条目 → 分项工作内容 + 可选量化成果
if (!Array.isArray(about.practice) || about.practice.length === 0) {
  fail("missing-about-practice");
} else {
  for (const phase of about.practice) {
    if (!isBilingual(phase.phase)) {
      fail("missing-bilingual-field", `about:practice:${phase.id}:phase`);
    }
    if (!Array.isArray(phase.entries) || phase.entries.length === 0) {
      fail("missing-about-practice-entries", phase.id);
      continue;
    }
    for (const entry of phase.entries) {
      if (!isBilingual(entry.title)) {
        fail("missing-bilingual-field", `about:practice:${entry.id}:title`);
      }
      if (!isBilingual(entry.period)) {
        fail("missing-bilingual-field", `about:practice:${entry.id}:period`);
      }
      if (entry.role && !isBilingual(entry.role)) {
        fail("missing-bilingual-field", `about:practice:${entry.id}:role`);
      }
      if (entry.location && !isBilingual(entry.location)) {
        fail("missing-bilingual-field", `about:practice:${entry.id}:location`);
      }
      if (!Array.isArray(entry.bullets) || entry.bullets.length === 0) {
        fail("missing-about-practice-bullets", entry.id);
        continue;
      }
      for (const bullet of entry.bullets) {
        if (!isBilingual(bullet.text)) {
          fail("missing-bilingual-field", `about:practice:${entry.id}:bullet`);
        }
        if (bullet.metric && !isBilingual(bullet.metric)) {
          fail("missing-bilingual-field", `about:practice:${entry.id}:metric`);
        }
      }
    }
  }
}

// 实践经历配图：双语图注/替代文本齐全，路径必须落在 /images/about/
if (!Array.isArray(about.practiceImages)) {
  fail("missing-about-gallery-field");
} else {
  for (const image of about.practiceImages) {
    if (!isBilingual(image.caption)) {
      fail("missing-bilingual-field", `about:gallery:${image.id}:caption`);
    }
    if (!isBilingual(image.alt)) {
      fail("missing-bilingual-field", `about:gallery:${image.id}:alt`);
    }
    if (typeof image.src !== "string" || !image.src.startsWith("/images/about/")) {
      fail("invalid-about-gallery-path", `${image.id}:${image.src}`);
    }
  }
}
// 「关于我」不得复制手机号或邮箱原始值，避免绕过全站唯一性约束
if (/\b1[3-9]\d{9}\b/.test(JSON.stringify(about))) {
  fail("about-contact-exposes-phone");
}
for (const field of ["headline", "tagline", "bio"]) {
  if (!isBilingual(identity[field])) fail("missing-bilingual-field", `identity:${field}`);
}
if (!Array.isArray(identity.jobTargets) || identity.jobTargets.length === 0) {
  fail("missing-identity-job-targets");
} else {
  for (const target of identity.jobTargets) {
    if (!isBilingual(target)) fail("missing-bilingual-field", "identity:jobTarget");
  }
}

for (const project of projects) {
  for (const field of [
    "title",
    "subtitle",
    "role",
    "situation",
    "task",
    "action",
    "result",
  ]) {
    if (!isBilingual(project[field])) fail("missing-bilingual-field", `project:${project.id}:${field}`);
  }
  if (!Array.isArray(project.highlights) || project.highlights.length === 0) {
    fail("missing-project-highlights", project.id);
  } else {
    for (const highlight of project.highlights) {
      if (!isBilingual(highlight)) {
        fail("missing-bilingual-field", `project:${project.id}:highlight`);
      }
    }
  }
  if (!Array.isArray(project.metrics) || project.metrics.length === 0) {
    fail("missing-project-metrics", project.id);
  }
  if (!isBilingual(project.endDate)) {
    fail("missing-bilingual-field", `project:${project.id}:endDate`);
  }
  if (!Array.isArray(project.techTags) || project.techTags.length === 0) {
    fail("missing-project-tech-tags", project.id);
  } else if (project.techTags.some((tag) => !isBilingual(tag))) {
    // techTags 已改造为 BilingualText[]：中英任一为空即视为非法标签
    fail("invalid-project-tech-tag", project.id);
  }
  if (!Array.isArray(project.coreSkill) || project.coreSkill.length === 0) {
    fail("missing-project-core-skill", project.id);
  } else if (project.coreSkill.some((entry) => !isBilingual(entry))) {
    // coreSkill 同步双语化，防止中文技能条目泄漏到英文页面
    fail("invalid-project-core-skill", project.id);
  }
  // 项目所属通用研究方向：必须是合法 id，且至少标注一个（项目页方向筛选依赖该映射）
  if (!Array.isArray(project.researchDirections) || project.researchDirections.length === 0) {
    fail("missing-project-research-directions", project.id);
  } else {
    for (const directionId of project.researchDirections) {
      if (!RESEARCH_DIRECTION_IDS.includes(directionId)) {
        fail("invalid-project-research-direction", `${project.id}:${directionId}`);
      }
    }
  }

  // 项目展示图片：双语图注/替代文本齐全，路径必须落在约定的项目图片目录
  if (!Array.isArray(project.images)) {
    fail("missing-project-images-field", project.id);
  } else {
    for (const image of project.images) {
      if (!isBilingual(image.caption)) {
        fail("missing-bilingual-field", `project:${project.id}:image:${image.id}:caption`);
      }
      if (!isBilingual(image.alt)) {
        fail("missing-bilingual-field", `project:${project.id}:image:${image.id}:alt`);
      }
      if (
        typeof image.src !== "string" ||
        !image.src.startsWith("/images/projects/")
      ) {
        fail("invalid-project-image-path", `${project.id}:${image.src}`);
      }
    }
  }

  // 相关文档：双语标题/类型标签齐全，路径必须落在 public/docs/ 且为 PDF
  if (!Array.isArray(project.documents)) {
    fail("missing-project-documents-field", project.id);
  } else {
    for (const document of project.documents) {
      if (!isBilingual(document.title)) {
        fail("missing-bilingual-field", `project:${project.id}:document:${document.id}:title`);
      }
      if (!isBilingual(document.tag)) {
        fail("missing-bilingual-field", `project:${project.id}:document:${document.id}:tag`);
      }
      if (
        typeof document.pdfUrl !== "string" ||
        !document.pdfUrl.startsWith("/docs/") ||
        !document.pdfUrl.endsWith(".pdf")
      ) {
        fail("invalid-project-document-path", `${project.id}:${document.pdfUrl}`);
      }
    }
  }
}

for (const area of research.areas) {
  if (!isBilingual(area.title)) fail("missing-bilingual-field", `research:${area.id}:title`);
}

for (const category of skills) {
  if (!isBilingual(category.label)) fail("missing-bilingual-field", `skills:${category.id}:label`);
  for (const item of category.items) {
    validateEvidence(item, `skills:${category.id}:${item.id}`);
    if (!isBilingual(item.name)) fail("missing-bilingual-field", `skills:${category.id}:${item.id}:name`);
  }
}

// 荣誉：标题/颁发方双语齐全、时间非空、级别合法（荣誉页与机器人回答都按级别分组）
const AWARD_LEVELS = ["national", "provincial", "university"];
for (const item of [...awards, ...competitions]) {
  if (!isBilingual(item.title) || !isBilingual(item.issuer)) {
    fail("missing-bilingual-field", `honor:${item.id}`);
  }
  if (typeof item.year !== "string" || item.year.length === 0) {
    fail("missing-honor-year", item.id);
  }
  if (!AWARD_LEVELS.includes(item.level)) {
    fail("invalid-honor-level", `${item.id}:${item.level}`);
  }
}
// 荣誉时间格式统一为 YYYY.MM（与证书集合的取证时间不同：奖项一律精确到月），
// 保证列表按字典序即等于时间倒序
for (const item of [...awards, ...competitions]) {
  if (typeof item.year === "string" && !/^\d{4}\.\d{2}$/.test(item.year)) {
    fail("invalid-honor-date-format", `${item.id}:${item.year}`);
  }
}
// 荣誉附件（竞赛条目同样使用 Award 结构，未配置时跳过校验）
for (const item of [...awards, ...competitions]) {
  validateAttachments(item.attachments, `honor:${item.id}`);
}

for (const credential of credentials) {
  if (!isBilingual(credential.title) || !isBilingual(credential.issuer)) {
    fail("missing-bilingual-field", `credential:${credential.id}`);
  }
  if (!["certificate", "patent", "paper"].includes(credential.kind)) {
    fail("invalid-credential-kind", credential.id);
  }
  // 时间格式：证书/专利允许 YYYY 或 YYYY.MM
  if (
    credential.year !== undefined &&
    !/^\d{4}(\.\d{2})?$/.test(credential.year)
  ) {
    fail("invalid-credential-year-format", `${credential.id}:${credential.year}`);
  }
  // 论文条目必须精确到月（YYYY.MM），避免再次出现只有年份的展示
  if (
    credential.kind === "paper" &&
    (typeof credential.year !== "string" ||
      !/^\d{4}\.\d{2}$/.test(credential.year))
  ) {
    fail("invalid-paper-credential-year-format", `${credential.id}:${credential.year}`);
  }
  validateAttachments(credential.attachments, `credential:${credential.id}`);
  // 论文条目按约定不挂本地附件，只保留 DOI 官方链接
  if (credential.kind === "paper" && (credential.attachments?.length ?? 0) > 0) {
    fail("paper-credential-has-attachments", credential.id);
  }
}

// 论文条目必须完整，且所有关联项目 slug 都能解析
for (const publication of publications) {
  if (!isBilingual(publication.title) || !isBilingual(publication.abstract)) {
    fail("missing-bilingual-field", `publication:${publication.id}`);
  }
  if (typeof publication.month !== "string" || !/^\d{4}\.\d{2}$/.test(publication.month)) {
    fail("invalid-publication-month", publication.id);
  }
  if (publication.publicationType !== "ei-conference") {
    fail("unexpected-publication-type", publication.id);
  }
  /**
   * DOI：必须存在、格式合法（`10.<注册机构>/<后缀>`），
   * 保证展示层拼出的 `https://doi.org/<doi>` 是有效检索链接。
   */
  if (typeof publication.doi !== "string" || publication.doi.trim().length === 0) {
    fail("missing-publication-doi", publication.id);
  } else if (!/^10\.\d{4,9}\/[A-Za-z0-9._;()/:+-]+$/.test(publication.doi)) {
    fail("invalid-publication-doi", `${publication.id}:${publication.doi}`);
  }
  if (!isBilingual(publication.authorRole)) {
    fail("missing-publication-author-role", publication.id);
  }
  if (!isBilingual(publication.coreContribution)) {
    fail("missing-publication-core-contribution", publication.id);
  }
  /**
   * 量化指标：字段可省略或为空数组（论文版本指标可能按本人要求不下沉到站点），
   * 但只要提供了条目，就必须是中英双语完整结构，避免出现半截指标。
   */
  if (publication.metrics !== undefined) {
    if (!Array.isArray(publication.metrics)) {
      fail("invalid-publication-metrics", publication.id);
    } else {
      for (const metric of publication.metrics) {
        if (!isBilingual(metric)) {
          fail("missing-bilingual-field", `publication:${publication.id}:metric`);
        }
      }
    }
  }
  const firstAuthor = publication.authors?.find((author) => author.order === 1);
  if (!firstAuthor) {
    fail("missing-first-author", publication.id);
  } else if (firstAuthor.isCandidate !== true || firstAuthor.isHighlighted !== true) {
    fail("first-author-not-identified-as-candidate", publication.id);
  }
  // 本人姓名不得在论文数据里重复出现，唯一来源是 identity.ts
  if (publication.authors.some((author) => typeof author.name === "string")) {
    fail("publication-repeats-author-name", publication.id);
  }
  for (const slug of publication.relatedProjectSlugs ?? []) {
    if (!projects.some((project) => project.slug === slug)) {
      fail("publication-related-project-unresolved", `${publication.id}:${slug}`);
    }
  }
}

// 论文在「荣誉与资质」中的引用条目必须与 publications.ts 一一对应
for (const publication of publications) {
  const matching = credentials.filter(
    (entry) => entry.kind === "paper" && entry.title.zh === publication.title.zh
  );
  if (matching.length !== 1) {
    fail("paper-credential-mismatch", publication.id);
  }
}

// 技能分组必须与扁平 items 一致，避免下游消费者拿到不完整的技能列表
for (const category of skills) {
  if (!Array.isArray(category.groups) || category.groups.length === 0) {
    fail("missing-skill-groups", category.id);
    continue;
  }
  const flatIds = new Set(category.items.map((item) => item.id));
  const groupedIds = new Set();
  for (const group of category.groups) {
    if (!isBilingual(group.label)) {
      fail("missing-bilingual-field", `skills:${category.id}:${group.id}:label`);
    }
    if (!Array.isArray(group.items) || group.items.length === 0) {
      fail("empty-skill-group", `${category.id}:${group.id}`);
      continue;
    }
    for (const item of group.items) {
      validateEvidence(item, `skills:${category.id}:${group.id}:${item.id}`);
      if (!isBilingual(item.name)) {
        fail("missing-bilingual-field", `skills:${category.id}:${group.id}:${item.id}:name`);
      }
      groupedIds.add(item.id);
    }
  }
  for (const id of groupedIds) {
    if (!flatIds.has(id)) fail("skill-group-item-missing-from-flat-list", `${category.id}:${id}`);
  }
  for (const id of flatIds) {
    if (!groupedIds.has(id)) fail("skill-flat-item-missing-from-groups", `${category.id}:${id}`);
  }
}

for (const patent of patents) {
  if (
    !isBilingual(patent.title) ||
    !isBilingual(patent.role) ||
    !isBilingual(patent.stageLabel)
  ) {
    fail("missing-bilingual-field", `patent:${patent.id}`);
  }
  validateAttachments(patent.attachments, `patent:${patent.id}`);
}

const publicPatents = patents.filter(isPublicVerified);
if (publicPatents.length !== 1) fail("incorrect-public-patent-count");
const [publicPatent] = publicPatents;
if (publicPatent) {
  if (publicPatent.type !== "utility-model") fail("incorrect-patent-type");
  if (publicPatent.inventorOrder !== 2) fail("incorrect-inventor-order");
  if (publicPatent.patentNumber !== "ZL 2022 2 0475134.9") {
    fail("incorrect-patent-number");
  }
  if (publicPatent.publicationNumber !== "CN 216957023 U") {
    fail("incorrect-patent-publication-number");
  }
  if (publicPatent.applicationDate !== "2022-03-04") {
    fail("incorrect-patent-application-date");
  }
  // 授权时间按本人确认修正为 2022.03（ISO 日期中月份为 03）
  if (publicPatent.grantDate !== "2022-03-01") {
    fail("incorrect-patent-grant-date");
  }
}

// 公开项目条目数：CV 研究 1 + 采集装置 1 + 标记标准化 1 + 本站作品集 1
if (projects.filter(isPublicVerified).length !== 4) {
  fail("incorrect-public-project-count");
}
// 公开评奖条目数：海南大学 1 项 + 四川工业科技学院本科阶段 8 项（含 1 项省级优秀毕业生）
if (awards.filter(isPublicVerified).length !== 11) {
  fail("incorrect-public-award-count");
}
if (competitions.filter(isPublicVerified).length !== 2) {
  fail("incorrect-public-competition-count");
}
// 期望值由数据推导：证书与专利 3 条 + 每条公开论文 1 条引用条目
const expectedCredentialCount =
  credentials.filter((entry) => entry.kind !== "paper").length +
  publications.filter(isPublicVerified).length;
if (credentials.filter(isPublicVerified).length !== expectedCredentialCount) {
  fail("incorrect-public-credential-count");
}
// 证书与专利分类中的专利条目必须与 patents.ts 的授权事实一致（年份必须一致，
// 允许 YYYY 或 YYYY.MM 两种精度）
const credentialPatent = credentials.find((entry) => entry.kind === "patent");
if (!credentialPatent) {
  fail("missing-credential-patent-entry");
} else if (
  publicPatent &&
  credentialPatent.year.slice(0, 4) !== publicPatent.grantDate.slice(0, 4)
) {
  fail("credential-patent-year-mismatch-patents-source");
}
if (publications.filter(isPublicVerified).length !== 2) {
  fail("incorrect-public-publication-count");
}
const pendingPublicationCase = {
  visibility: "public",
  verificationStatus: "pending",
};
if (isPublicVerified(pendingPublicationCase)) {
  fail("pending-publication-entered-public-collection");
}

const slugEntries = [
  ...projects.map((entry) => ["project", entry.id, entry.slug]),
  ...research.areas.map((entry) => ["research", entry.id, entry.slug]),
  ...publications.map((entry) => ["publication", entry.id, entry.slug]),
];
const seenSlugs = new Set();
for (const [kind, id, slug] of slugEntries) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail("unstable-slug", `${kind}:${id}`);
  }
  if (seenSlugs.has(slug)) fail("duplicate-slug", slug);
  seenSlugs.add(slug);
}

/**
 * 条目 id 全局唯一：id 同时是列表渲染的 React key，
 * 重复会导致「Encountered two children with the same key」告警与卡片重复。
 * （历史上的重复块来自分支合并时整块叠加，见本次修复记录。）
 */
const seenIds = new Set();
for (const [kind, id] of slugEntries) {
  if (seenIds.has(`${kind}:${id}`)) fail("duplicate-entry-id", `${kind}:${id}`);
  seenIds.add(`${kind}:${id}`);
}

for (const project of projects) {
  if (project.slug !== project.id) fail("project-slug-changed-from-stable-id", project.id);
}

const syntheticVisibilityCases = [
  { visibility: "public", verificationStatus: "verified", expected: true },
  { visibility: "public", verificationStatus: "pending", expected: false },
  { visibility: "private", verificationStatus: "verified", expected: false },
  { visibility: "hidden", verificationStatus: "verified", expected: false },
];
for (const entry of syntheticVisibilityCases) {
  if (isPublicVerified(entry) !== entry.expected) {
    fail("public-filter-contract-failed", `${entry.visibility}:${entry.verificationStatus}`);
  }
}

const serializedProfile = JSON.stringify({
  about,
  awards,
  competitions,
  credentials,
  education,
  identity,
  projects,
  publications,
  patents,
  research,
  skills,
});
const forbiddenPatterns = [
  ["legacy-name", /\bMingyuan(?:\s+Yang)?\b/i],
  ["fixed-visitor-count", /\b1024\b/],
  [
    "unsupported-professional-identity",
    /\bSenior\b|\bExpert\b|Published Researcher|AI Algorithm Engineer|SLAM Engineer|AI 算法工程师|资深|专家/i,
  ],
];
for (const [rule, pattern] of forbiddenPatterns) {
  if (pattern.test(serializedProfile)) fail(rule);
}

/**
 * 手机号：本人已授权公开 APPROVED_PHONE，因此数据层允许出现该号码，
 * 但任何其它号码仍然拦截。白名单见 scripts/lib-approved-contacts.mjs。
 */
if (hasUnapprovedPhoneNumber(serializedProfile)) {
  fail("unapproved-phone-number");
}

// 邮箱仍保持唯一放行值
const serializedWithoutApprovedEmail = serializedProfile.replaceAll(approvedEmail, "");
if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(serializedWithoutApprovedEmail)) {
  fail("unapproved-email-address");
}

// 若数据层写入手机号，必须是已授权的那一个
if (
  /\b1[3-9]\d{9}\b/.test(serializedProfile) &&
  !serializedProfile.includes(APPROVED_PHONE)
) {
  fail("approved-phone-number-missing-from-identity");
}

if (!existsSync(join(repositoryRoot, "public", identity.avatar.slice(1)))) {
  fail("missing-identity-avatar");
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Profile verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Profile verification passed (${projects.length} projects, ${research.areas.length} research areas, ${publications.length} publications, ${patents.length} patents, ${awards.length} awards, ${competitions.length} competitions, ${credentials.length} credentials, ${about.practice.length} practice phases).`
  );}
