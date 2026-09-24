export const CHAT_LIMITS = Object.freeze({
  maxMessages: 12,
  maxMessageCharacters: 2_000,
  maxTotalCharacters: 8_000,
});

/** @typedef {"zh" | "en"} CareerLocale */
/** @typedef {"user" | "assistant"} ChatRole */
/** @typedef {{ role: ChatRole, content: string }} ChatMessage */

/**
 * @param {unknown} body
 * @returns {ChatMessage[] | null}
 */
export function parseChatMessages(body) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const messages = body.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > CHAT_LIMITS.maxMessages
  ) {
    return null;
  }

  let totalCharacters = 0;
  /** @type {ChatMessage[]} */
  const parsed = [];

  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      Array.isArray(message)
    ) {
      return null;
    }

    const { role, content } = message;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const trimmedContent = content.trim();
    if (
      trimmedContent.length === 0 ||
      content.length > CHAT_LIMITS.maxMessageCharacters
    ) {
      return null;
    }

    totalCharacters += content.length;
    if (totalCharacters > CHAT_LIMITS.maxTotalCharacters) return null;
    parsed.push({ role, content: trimmedContent });
  }

  if (parsed.at(-1)?.role !== "user") return null;
  return parsed;
}

/**
 * @param {string} message
 * @returns {CareerLocale}
 */
export function getMessageLocale(message) {
  return /[\u3400-\u9fff]/.test(message) ? "zh" : "en";
}

/**
 * @param {string} message
 * @returns {boolean}
 */
export function isPromptInjection(message) {
  return [
    /ignore (?:all |the )?(?:previous|prior|above) (?:instructions|rules)/i,
    /忽略(?:之前|以上|所有).*(?:指令|规则|要求)/,
    /\b(?:system|developer)\s+(?:prompt|message|instructions?)\b/i,
    /(?:系统|开发者)(?:提示词|消息|指令)/,
    /(?:show|reveal|print|expose).*(?:hidden|private|secret|prompt|token|key)/i,
    /(?:显示|泄露|输出|打印).*(?:隐藏|私密|秘密|提示词|令牌|密钥)/,
  ].some((pattern) => pattern.test(message));
}

const FALLBACK = {
  zh: "当前公开资料中没有足够信息支持这一结论。",
  en: "The currently available public information is insufficient to support that conclusion.",
};

const EMPTY_PATENTS = {
  zh: "当前公开资料中暂无可确认的专利信息。",
  en: "There is currently no confirmed public patent information.",
};

const EMPTY_AWARDS = {
  zh: "当前公开资料中暂无可确认的奖项信息。",
  en: "There is currently no confirmed public award information.",
};

/**
 * 友好兜底文案。
 *
 * 使用场景：规则引擎未命中且外部模型不可用（未配置密钥 / 超时 / 调用失败）时使用。
 * 注意：提示词注入与「资料不足」的拒绝回答仍使用 FALLBACK，
 * 以保留 AGENTS.md 规定的显式拒绝编造信号。
 */
const FRIENDLY_FALLBACK = {
  zh: "该问题建议查看站内对应页面了解详情，或通过联系方式直接与我沟通。",
  en: "For this question, please refer to the relevant page on this site, or reach out to me directly using the contact details provided.",
};

/**
 * @param {CareerLocale} locale
 * @returns {string}
 */
export function getFriendlyFallback(locale) {
  return FRIENDLY_FALLBACK[locale] ?? FRIENDLY_FALLBACK.zh;
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
  return value.toLocaleLowerCase().replace(/[\s'"“”‘’.,!?？！，。:：()（）/\\_-]+/g, "");
}

/**
 * @param {string} normalized
 * @param {string[]} terms
 * @returns {boolean}
 */
function containsAny(normalized, terms) {
  return terms.some((term) => normalized.includes(normalize(term)));
}

/**
 * 项目起止时间：startDate 是 "YYYY.MM" 字符串，endDate 是双语结构
 * （{ zh, en }，进行中项目为「至今 / Present」），必须按 locale 取值再序列化，
 * 否则会输出 [object Object]。
 *
 * @param {object} project
 * @param {CareerLocale} locale
 * @returns {string}
 */
function projectPeriod(project, locale) {
  const end = project.endDate?.[locale] ?? project.endDate?.zh ?? "";
  return `${project.startDate}–${end}`;
}

/**
 * 项目「结果」的纯文本口径。
 *
 * 页面上的结果段落已升级为四段式工程化叙述，含空行分段与 **加粗** 标记
 * （由 RichText 渲染）；聊天界面按纯文本渲染（whitespace-pre-wrap），
 * 因此这里统一剥离标记，并把段落还原为逐行文本。
 *
 * @param {object} project
 * @param {CareerLocale} locale
 * @param {{ lead?: boolean }} [options] lead=true 时只取首段概述（列表类回答保持简短）
 * @returns {string}
 */
function projectResultText(project, locale, options = {}) {
  const raw = project.result?.[locale] ?? project.result?.zh ?? "";
  const paragraphs = raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\*\*/g, "").trim())
    .filter((paragraph) => paragraph.length > 0);
  const selected = options.lead ? paragraphs.slice(0, 1) : paragraphs;
  return selected.join("\n");
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildIntroduction(corpus, locale) {
  const identity = corpus.identity;
  if (!identity) return FALLBACK[locale];

  const about = corpus.about ?? {};
  const nativePlace = about.nativePlace?.[locale];
  const email = identity.contacts.find((contact) => contact.kind === "email");

  /**
   * 结构：身份定位 → 核心成果 → 研究方向 → 核心能力 → 联系方式引导。
   * 「身份定位」与「核心成果」直接取自 about.bioSections（与关于页同一数据源），
   * 保证机器人自我介绍与页面简介口径完全一致，无需两处维护。
   */
  const bioSections = about.bioSections ?? [];
  const segmentText = (section) =>
    (section?.segments ?? []).map((segment) => segment.text[locale]).join("");
  const tagRow = segmentText(bioSections[0]);
  const achievementBody = bioSections.slice(1).map(segmentText).join(" ");

  const directions = (about.researchDirections ?? []).map(
    (direction) => direction.label[locale]
  );
  const skills = corpus.skills ?? [];
  const skillSummary = skills.map(
    (category) =>
      `${category.label[locale]}${locale === "zh" ? "：" : ": "}${category.items
        .map((item) => item.name[locale])
        .join(locale === "zh" ? "、" : ", ")}`
  );

  const lines = [];
  lines.push(
    locale === "zh"
      ? `【身份定位】${identity.name.zh} · ${tagRow}${nativePlace ? ` · 籍贯${nativePlace}` : ""}`
      : `[Profile] ${identity.name.en} · ${tagRow}${nativePlace ? ` · Native of ${nativePlace}` : ""}`
  );
  if (achievementBody) {
    lines.push(
      locale === "zh"
        ? `【核心成果】${achievementBody}`
        : `[Key results] ${achievementBody}`
    );
  }
  if (directions.length > 0) {
    lines.push(
      locale === "zh"
        ? `【研究方向】${directions.join("、")}`
        : `[Research focus] ${directions.join(", ")}`
    );
  }
  if (skillSummary.length > 0) {
    lines.push(
      locale === "zh"
        ? `【核心能力】\n${skillSummary.map((line) => `• ${line}`).join("\n")}`
        : `[Core skills]\n${skillSummary.map((line) => `• ${line}`).join("\n")}`
    );
  }
  if (email) {
    lines.push(
      locale === "zh"
        ? `【联系方式】有意向欢迎通过公开求职邮箱 ${email.value} 与我联系。`
        : `[Contact] Feel free to reach me at the public contact email ${email.value}.`
    );
  }

  return lines.join("\n\n");
}

/**
 * 教育经历：直接输出核心学历信息（要点式），不跳转页面、不展开获奖与研究方向。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildEducation(corpus, locale) {
  const entries = corpus.education ?? [];
  if (entries.length === 0) return FALLBACK[locale];

  const lines = entries.map((entry) =>
    locale === "zh"
      ? `• ${entry.degree[locale]}：${entry.institution[locale]} · ${entry.major[locale]}`
      : `• ${entry.degree[locale]}: ${entry.institution[locale]} · ${entry.major[locale]}`
  );
  return locale === "zh"
    ? `教育背景：\n${lines.join("\n")}`
    : `Education:\n${lines.join("\n")}`;
}

/**
 * 文档下载：一步说明下载入口，不引导跳转。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildDocuments(corpus, locale) {
  const lines =
    locale === "zh"
      ? [
          "• 个人简历 PDF：在首页、关于我、联系我页面均设有「下载简历 PDF」按钮，点击即可保存到本地",
        ]
      : [
          "• Resume PDF: the \"Download resume PDF\" button is available on the Home, About, and Contact pages — click it to save the file locally",
        ];

  const projectsWithDocuments = (corpus.projects ?? []).filter(
    (project) => (project.documents ?? []).length > 0
  );
  if (projectsWithDocuments.length > 0) {
    lines.push(
      locale === "zh"
        ? "• 项目相关文档（设计文档、实验报告、操作规范）：各项目详情页底部的「相关文档下载」区"
        : "• Project documents (design docs, experiment reports, operating specifications): the \"Related Documents\" section at the bottom of each project detail page"
    );
  }

  return locale === "zh"
    ? `文档下载：\n${lines.join("\n")}`
    : `Document downloads:\n${lines.join("\n")}`;
}

/**
 * 实践经历 / 学生工作：直接列出阶段与条目（含起止时间），不跳转页面。
 * 班长等学生职务的任期由此处输出，与关于页「实践经历」同源。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildPractice(corpus, locale) {
  const phases = corpus.about?.practice ?? [];
  if (phases.length === 0) return FALLBACK[locale];

  const lines = phases.flatMap((phase) => [
    locale === "zh" ? `【${phase.phase.zh}】` : `[${phase.phase.en}]`,
    ...phase.entries.map((entry) => {
      const meta = [entry.period[locale]];
      if (entry.role) meta.push(entry.role[locale]);
      if (entry.location) meta.push(entry.location[locale]);
      return `• ${entry.title[locale]}（${meta.join(" · ")}）`;
    }),
  ]);

  return locale === "zh"
    ? `实践经历：\n${lines.join("\n")}`
    : `Practical experience:\n${lines.join("\n")}`;
}

/**
 * 证书资质：直接列出已公开证书（含取证时间），不跳转页面。
 * 论文类引用条目（kind: "paper"）不在此重复展示。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildCredentials(corpus, locale) {
  const certificates = (corpus.credentials ?? []).filter(
    (entry) => entry.kind === "certificate"
  );
  if (certificates.length === 0) return FALLBACK[locale];

  const lines = certificates.map(
    (entry) =>
      `• ${entry.title[locale]}${entry.year ? `（${entry.year}）` : ""}`
  );
  return locale === "zh"
    ? `证书资质：\n${lines.join("\n")}`
    : `Certificates:\n${lines.join("\n")}`;
}

/**
 * 生成 RAG 上下文：把公开且已核验的 Profile 数据整理成纯文本，
 * 供外部模型在「规则引擎未命中」时据实回答。
 *
 * 仅包含 public + verified 集合；内容全部来自 src/data，无额外推断。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
export function buildProfileContext(corpus, locale) {
  const zh = locale === "zh";
  const identity = corpus.identity;
  const about = corpus.about ?? {};
  const blocks = [];

  if (identity) {
    blocks.push(
      [
        zh ? `姓名：${identity.name.zh}` : `Name: ${identity.name.en}`,
        zh ? `一句话简介：${identity.tagline.zh}` : `Tagline: ${identity.tagline.en}`,
        zh ? `完整简介：${identity.bio.zh}` : `Bio: ${identity.bio.en}`,
      ].join("\n")
    );

    const contacts = [];
    const email = identity.contacts.find((contact) => contact.kind === "email");
    const phone = identity.contacts.find((contact) => contact.kind === "phone");
    if (email) contacts.push(zh ? `邮箱 ${email.value}` : `email ${email.value}`);
    if (phone) contacts.push(zh ? `电话 ${phone.value}` : `phone ${phone.value}`);
    if (contacts.length > 0) {
      blocks.push(
        `${zh ? "公开联系方式" : "Public contact"}: ${contacts.join(zh ? "；" : "; ")}`
      );
    }
  }

  if (about.nativePlace) {
    blocks.push(zh ? `籍贯：${about.nativePlace.zh}` : `Native place: ${about.nativePlace.en}`);
  }
  if (about.politicalStatus) {
    blocks.push(
      zh
        ? `政治面貌：${about.politicalStatus.zh}`
        : `Political status: ${about.politicalStatus.en}`
    );
  }
  if (Array.isArray(about.researchDirections) && about.researchDirections.length > 0) {
    blocks.push(
      `${zh ? "研究方向" : "Research directions"}: ${about.researchDirections
        .map((direction) => direction.label[locale])
        .join(zh ? "、" : ", ")}`
    );
  }

  const education = corpus.education ?? [];
  if (education.length > 0) {
    blocks.push(
      [
        zh ? "教育经历：" : "Education:",
        ...education.map(
          (entry) =>
            `- ${entry.institution[locale]} · ${entry.degree[locale]} · ${entry.major[locale]}（${entry.startDate}–${entry.endDate}）`
        ),
      ].join("\n")
    );
  }

  const practice = about.practice ?? [];
  if (practice.length > 0) {
    blocks.push(
      [
        zh ? "实践经历（含学生工作）：" : "Practical experience (incl. student work):",
        ...practice.flatMap((phase) =>
          phase.entries.map(
            (entry) =>
              `- [${phase.phase[locale]}] ${entry.title[locale]}（${entry.period[locale]}）`
          )
        ),
      ].join("\n")
    );
  }

  const certificates = (corpus.credentials ?? []).filter(
    (entry) => entry.kind === "certificate"
  );
  if (certificates.length > 0) {
    blocks.push(
      [
        zh ? "证书资质：" : "Certificates:",
        ...certificates.map(
          (entry) =>
            `- ${entry.title[locale]}${entry.year ? `（${entry.year}）` : ""}`
        ),
      ].join("\n")
    );
  }

  const projects = corpus.projects ?? [];
  if (projects.length > 0) {
    blocks.push(
      [
        zh ? "项目经历：" : "Projects:",
        ...projects.map((project) =>
          [
            `- ${project.title[locale]}（${project.role[locale]}，${project.startDate}–${project.endDate[locale]}）`,
            `  ${projectResultText(project, locale, { lead: true })}`,
            zh
              ? `  核心技术：${project.coreSkill.map((item) => item.zh).join("、")}`
              : `  Core technologies: ${project.coreSkill.map((item) => item.en).join(", ")}`,
          ].join("\n")
        ),
      ].join("\n")
    );
  }

  const publications = corpus.publications ?? [];
  if (publications.length > 0) {
    blocks.push(
      [
        zh ? "论文成果：" : "Publications:",
        ...publications.map((publication) => {
          const meta = [
            publication.venue[locale],
            publication.month ?? publication.year,
          ];
          if (publication.authorRole) meta.push(publication.authorRole[locale]);
          if (publication.doi) meta.push(`DOI ${publication.doi}`);
          return `- ${publication.title[locale]} · ${meta.join(" · ")}\n  ${publication.abstract[locale]}`;
        }),
      ].join("\n")
    );
  }

  const patents = corpus.patents ?? [];
  if (patents.length > 0) {
    blocks.push(
      [
        zh ? "专利：" : "Patents:",
        ...patents.map(
          (patent) =>
            zh
              ? `- ${patent.title.zh}（${patent.role.zh}，专利号 ${patent.patentNumber}，${patent.grantDate.slice(0, 4)} 年授权）`
              : `- ${patent.title.en} (${patent.role.en}, patent number ${patent.patentNumber}, granted ${patent.grantDate.slice(0, 4)})`
        ),
      ].join("\n")
    );
  }

  const skills = corpus.skills ?? [];
  if (skills.length > 0) {
    blocks.push(
      [
        zh ? "技能：" : "Skills:",
        ...skills.map(
          (category) =>
            `- ${category.label[locale]}${zh ? "：" : ": "}${category.items.map((item) => item.name[locale]).join(zh ? "、" : ", ")}`
        ),
      ].join("\n")
    );
  }

  const honors = [...(corpus.awards ?? []), ...(corpus.competitions ?? [])];
  if (honors.length > 0) {
    blocks.push(
      [
        zh ? "荣誉奖励：" : "Honors:",
        ...honors.map(
          (item) => `- ${item.year} ${item.title[locale]}（${item.issuer[locale]}）`
        ),
      ].join("\n")
    );
  }

  return blocks.join("\n\n");
}

/**
 * 研究方向回答：使用 about.researchDirections 的通用研究方向术语，
 * 不再罗列具体课题/项目名，与个人简介表述保持一致。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildResearch(corpus, locale) {
  const directions = (corpus.about?.researchDirections ?? []).map(
    (direction) => direction.label[locale]
  );
  if (directions.length === 0) return FALLBACK[locale];

  const lines = directions.map((direction) => `• ${direction}`);
  return locale === "zh"
    ? `当前公开的研究方向：\n${lines.join("\n")}`
    : `Current public research focus:\n${lines.join("\n")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildProjects(corpus, locale) {
  if (corpus.projects.length === 0) return FALLBACK[locale];
  const lines = corpus.projects.map(
    (project) =>
      `• ${project.title[locale]}（${projectPeriod(project, locale)}）\n  ${projectResultText(project, locale, { lead: true })}`
  );
  return locale === "zh"
    ? `当前公开的项目经历：\n${lines.join("\n\n")}`
    : `Current public project experience:\n${lines.join("\n\n")}`;
}

/**
 * @param {object} project
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildProject(project, locale) {
  const period = projectPeriod(project, locale);
  // 单项目深度问答：给出完整四段式工程化叙述（已剥离加粗标记）
  const result = projectResultText(project, locale);
  return locale === "zh"
    ? `${project.title.zh}（${period}）：${result}\n核心技术：${project.coreSkill.map((item) => item.zh).join("、")}`
    : `${project.title.en} (${period}): ${result}\nCore technologies: ${project.coreSkill.map((item) => item.en).join(", ")}`;
}

/**
 * 核心技能回答：按分组要点式输出，保证 CAD（AutoCAD 结构设计）、机械结构设计
 * 等硬件工具类技能与其它技能一样被完整列出。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildSkills(corpus, locale) {
  if (corpus.skills.length === 0) return FALLBACK[locale];
  const separator = locale === "zh" ? "、" : ", ";
  const labelSeparator = locale === "zh" ? "：" : ": ";
  const lines = corpus.skills.flatMap((category) => {
    const groups = (category.groups ?? []).filter((group) => group.items.length > 0);
    if (groups.length === 0) {
      return [
        `• ${category.label[locale]}${labelSeparator}${category.items.map((item) => item.name[locale]).join(separator)}`,
      ];
    }
    return [
      `• ${category.label[locale]}`,
      ...groups.map(
        (group) =>
          `  - ${group.label[locale]}${labelSeparator}${group.items.map((item) => item.name[locale]).join(separator)}`
      ),
    ];
  });
  return locale === "zh"
    ? `当前公开的核心技能：\n${lines.join("\n")}`
    : `Current public core skills:\n${lines.join("\n")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildPatents(corpus, locale) {
  if (corpus.patents.length === 0) return EMPTY_PATENTS[locale];
  const lines = corpus.patents.map((patent) =>
    locale === "zh"
      ? `• ${patent.title.zh} — 实用新型专利，${patent.role.zh}，专利号 ${patent.patentNumber}，${patent.grantDate.slice(0, 4)} 年授权，${patent.stageLabel.zh}。`
      : `• ${patent.title.en} — Utility Model Patent, ${patent.role.en}, patent number ${patent.patentNumber}, granted in ${patent.grantDate.slice(0, 4)}; ${patent.stageLabel.en}.`
  );
  return locale === "zh"
    ? `公开且已核验的专利经历：\n${lines.join("\n")}`
    : `Public and verified patent experience:\n${lines.join("\n")}`;
}

/**
 * 荣誉资质回答：合并评奖（awards）与竞赛（competitions），
 * 按级别「国家级 → 省部级 → 校级」分组、组内按时间倒序，要点式输出。
 * 级别文案来自数据层的 awardLevelLabels，与荣誉页展示完全一致。
 *
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildAwards(corpus, locale) {
  const items = [...(corpus.awards ?? []), ...(corpus.competitions ?? [])];
  if (items.length === 0) return EMPTY_AWARDS[locale];

  const levelLabels = corpus.awardLevelLabels ?? {};
  const levelOrder =
    corpus.awardLevelOrder ?? ["national", "provincial", "university"];

  const sections = levelOrder
    .map((level) => {
      const group = items
        .filter((item) => item.level === level)
        // 时间倒序；同年月返回 0 以保持数据层既定顺序（稳定排序）
        .sort((first, second) =>
          first.year < second.year ? 1 : first.year > second.year ? -1 : 0
        );
      if (group.length === 0) return null;

      const heading = levelLabels[level]?.[locale] ?? level;
      // 时间在前的要点式输出：便于按时间倒序扫读
      const lines = group.map((item) => `• ${item.year} ${item.title[locale]}`);
      return locale === "zh"
        ? `【${heading}】\n${lines.join("\n")}`
        : `[${heading}]\n${lines.join("\n")}`;
    })
    .filter((section) => section !== null);

  if (sections.length === 0) return EMPTY_AWARDS[locale];

  return locale === "zh"
    ? `当前公开且已核验的荣誉资质（按级别分类）：\n\n${sections.join("\n\n")}`
    : `Current public and verified honors, grouped by level:\n\n${sections.join("\n\n")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildContact(corpus, locale) {
  const email = corpus.identity?.contacts.find(
    (contact) => contact.kind === "email"
  );
  if (!email) return FALLBACK[locale];
  return locale === "zh"
    ? `公开求职邮箱为 ${email.value}。`
    : `The public contact email is ${email.value}.`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
/**
 * 简历回答:在线简历页 + 正式版 PDF 的下载入口。
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildResume(corpus, locale) {
  if (!corpus.identity) return FALLBACK[locale];
  return locale === "zh"
    ? "在线公开简历：/zh/resume。正式版 PDF 可在首页、关于页、联系页或在线简历页页头直接下载。"
    : "Online public resume: /en/resume. The formal PDF can be downloaded from the home page, About page, Contact page, or the header of the online resume page.";
}

/**
 * 规则引擎匹配。
 *
 * 返回值：
 * - `string` —— 命中规则，直接作为回答（零成本、秒响应）
 * - `null`   —— 未命中任何规则，交由上层决定是否调用外部模型兜底
 *
 * 提示词注入属于「命中」：直接返回标准拒绝答复，**不会**被转发给外部模型。
 *
 * @param {object} corpus
 * @param {string} message
 * @returns {string | null}
 */
export function matchCareerReply(corpus, message) {
  const locale = getMessageLocale(message);
  if (isPromptInjection(message)) return FALLBACK[locale];

  const normalized = normalize(message);
  const matchingProject = corpus.projects.find((project) =>
    [project.slug, project.title.zh, project.title.en].some((term) =>
      normalized.includes(normalize(term))
    )
  );
  if (matchingProject) return buildProject(matchingProject, locale);

  if (
    containsAny(normalized, [
      "自我介绍",
      "介绍一下自己",
      "你是谁",
      "tell me about yourself",
      "introduce yourself",
      "who are you",
    ])
  ) {
    return buildIntroduction(corpus, locale);
  }
  if (
    containsAny(normalized, [
      "教育",
      "学历",
      "毕业院校",
      "学校",
      "education",
      "academic background",
      "university",
    ])
  ) {
    return buildEducation(corpus, locale);
  }
  if (containsAny(normalized, ["核心技能", "技术栈", "skills", "tech stack"])) {
    return buildSkills(corpus, locale);
  }
  if (containsAny(normalized, ["项目", "project experience", "projects"])) {
    return buildProjects(corpus, locale);
  }
  if (
    containsAny(normalized, [
      "研究方向",
      "研究内容",
      "research focus",
      "research direction",
    ])
  ) {
    return buildResearch(corpus, locale);
  }
  if (containsAny(normalized, ["专利", "patent"])) {
    return buildPatents(corpus, locale);
  }
  // 实践经历 / 学生工作（含班长等职务任期）
  if (
    containsAny(normalized, [
      "实践经历",
      "学生工作",
      "校园经历",
      "职务",
      "班长",
      "社长",
      "社团",
      "practical experience",
      "student work",
      "campus experience",
      "leadership",
    ])
  ) {
    return buildPractice(corpus, locale);
  }
  if (
    containsAny(normalized, [
      "荣誉",
      "奖项",
      "获奖",
      "奖励",
      "奖学金",
      "竞赛",
      // 英文只匹配复数/所属语境，避免「Did he win the Turing Award?」这类
      // 关于他人奖项的提问被误判为查询本人荣誉（应回退到资料不足的标准答复）
      "awards",
      "honors",
      "scholarship",
      "competition",
    ])
  ) {
    return buildAwards(corpus, locale);
  }
  // 证书资质（含取证时间）。必须放在「荣誉资质」之后：
  // 「荣誉资质」应命中荣誉回答，而「证书资质 / 有哪些证书」落到这里。
  if (
    containsAny(normalized, [
      "证书",
      "资质",
      "资格证",
      "计算机等级",
      "certificate",
      "certification",
      "credential",
    ])
  ) {
    return buildCredentials(corpus, locale);
  }
  if (
    containsAny(normalized, [
      "联系方式",
      "联系",
      "邮箱",
      "电话",
      "contact",
      "email",
      "phone",
    ])
  ) {
    return buildContact(corpus, locale);
  }
  if (containsAny(normalized, ["简历", "resume", "cv"])) {
    return buildResume(corpus, locale);
  }
  // 文档下载：放在简历之后，保证「下载简历」优先命中简历回答
  if (
    containsAny(normalized, [
      "文档",
      "附件",
      "下载",
      "document",
      "attachment",
      "download",
      "pdf",
    ])
  ) {
    return buildDocuments(corpus, locale);
  }

  // 未命中任何规则：交由上层做外部模型兜底
  return null;
}

/**
 * 规则引擎回答（对外保持原有契约：未命中时返回标准兜底文案）。
 *
 * @param {object} corpus
 * @param {string} message
 * @returns {string}
 */
export function createCareerReply(corpus, message) {
  const locale = getMessageLocale(message);
  return matchCareerReply(corpus, message) ?? FALLBACK[locale];
}
