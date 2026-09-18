import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  APPROVED_EMAIL,
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

const publicContacts = identity.contacts.filter(isPublicVerified);
const emailContacts = publicContacts.filter((contact) => contact.kind === "email");
const websiteContacts = publicContacts.filter((contact) => contact.kind === "website");
const githubContacts = publicContacts.filter((contact) => contact.kind === "github");
if (emailContacts.length !== 1 || emailContacts[0]?.value !== approvedEmail) {
  fail("incorrect-public-email");
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
if (!Array.isArray(about.strengths) || about.strengths.length !== 3) {
  fail("incorrect-about-strength-count");
} else {
  for (const strength of about.strengths) {
    if (!isBilingual(strength.title) || !isBilingual(strength.description)) {
      fail("missing-bilingual-field", `about:strength:${strength.id}`);
    }
  }
}
for (const contact of about.contacts) {
  if (!isBilingual(contact.label) || !isBilingual(contact.value)) {
    fail("missing-bilingual-field", `about:contact:${contact.id}`);
  }
}

// 联系方式：微信号必须公开且准确；籍贯字段已按本人要求全站移除
const wechatContact = about.contacts.find((contact) => contact.id === "contact-wechat");
if (!wechatContact) {
  fail("missing-public-wechat-contact");
} else if (wechatContact.value.zh !== "Galaxy24664") {
  fail("incorrect-public-wechat-id");
}
if (about.contacts.some((contact) => contact.id === "contact-hometown")) {
  fail("hometown-contact-still-present");
}
if (/"籍贯"|Chongqing/.test(JSON.stringify(about))) {
  fail("native-place-still-present-in-about");
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
  if (!Array.isArray(project.techTags) || project.techTags.length === 0) {
    fail("missing-project-tech-tags", project.id);
  } else if (project.techTags.some((tag) => typeof tag !== "string" || tag.length === 0)) {
    fail("invalid-project-tech-tag", project.id);
  }
  if (!Array.isArray(project.coreSkill) || project.coreSkill.length === 0) {
    fail("missing-project-core-skill", project.id);
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

for (const item of [...awards, ...competitions]) {
  if (!isBilingual(item.title) || !isBilingual(item.issuer)) {
    fail("missing-bilingual-field", `honor:${item.id}`);
  }
  if (typeof item.year !== "string" || item.year.length === 0) {
    fail("missing-honor-year", item.id);
  }
}

for (const credential of credentials) {
  if (!isBilingual(credential.title) || !isBilingual(credential.issuer)) {
    fail("missing-bilingual-field", `credential:${credential.id}`);
  }
  if (!["certificate", "patent", "paper"].includes(credential.kind)) {
    fail("invalid-credential-kind", credential.id);
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
  if (!isBilingual(publication.authorRole)) {
    fail("missing-publication-author-role", publication.id);
  }
  if (!isBilingual(publication.coreContribution)) {
    fail("missing-publication-core-contribution", publication.id);
  }
  if (!Array.isArray(publication.metrics) || publication.metrics.length === 0) {
    fail("missing-publication-metrics", publication.id);
  } else {
    for (const metric of publication.metrics) {
      if (!isBilingual(metric)) {
        fail("missing-bilingual-field", `publication:${publication.id}:metric`);
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
  if (publicPatent.grantDate !== "2022-07-12") {
    fail("incorrect-patent-grant-date");
  }
}

if (awards.filter(isPublicVerified).length !== 4) {
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
// 证书与专利分类中的专利条目必须与 patents.ts 的授权事实一致
const credentialPatent = credentials.find((entry) => entry.kind === "patent");
if (!credentialPatent) {
  fail("missing-credential-patent-entry");
} else if (publicPatent && credentialPatent.year !== publicPatent.grantDate.slice(0, 4)) {
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
