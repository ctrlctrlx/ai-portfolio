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

const EMPTY_PUBLICATIONS = {
  zh: "当前公开资料中暂无可确认的论文信息。",
  en: "There is currently no confirmed public publication information.",
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
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildIntroduction(corpus, locale) {
  const identity = corpus.identity;
  if (!identity) return FALLBACK[locale];

  return locale === "zh"
    ? `${identity.name.zh}，${identity.tagline.zh}。${identity.bio.zh}`
    : `${identity.name.en} — ${identity.tagline.en}. ${identity.bio.en}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildEducation(corpus, locale) {
  if (corpus.education.length === 0) return FALLBACK[locale];
  const lines = corpus.education.map(
    (entry) =>
      `• ${entry.institution[locale]} — ${entry.degree[locale]} · ${entry.major[locale]} (${entry.startDate}–${entry.endDate})`
  );
  return locale === "zh"
    ? `当前公开的教育经历：\n${lines.join("\n")}`
    : `Current public education:\n${lines.join("\n")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildResearch(corpus, locale) {
  if (corpus.research.length === 0) return FALLBACK[locale];
  const lines = corpus.research.map((area) => `• ${area.title[locale]}`);
  return locale === "zh"
    ? `当前公开且已核验的研究方向：\n${lines.join("\n")}`
    : `Current public and verified research focus:\n${lines.join("\n")}`;
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
      `• ${project.title[locale]} (${project.startDate}–${project.endDate})\n  ${project.result[locale]}`
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
  return locale === "zh"
    ? `${project.title.zh}（${project.startDate}–${project.endDate}）：${project.result.zh}\n核心技术：${project.coreSkill.join("、")}`
    : `${project.title.en} (${project.startDate}–${project.endDate}): ${project.result.en}\nCore technologies: ${project.coreSkill.join(", ")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildSkills(corpus, locale) {
  if (corpus.skills.length === 0) return FALLBACK[locale];
  const lines = corpus.skills.map(
    (category) =>
      `• ${category.label[locale]}：${category.items.map((item) => item.name[locale]).join(locale === "zh" ? "、" : ", ")}`
  );
  return locale === "zh"
    ? `当前公开的核心技能：\n${lines.join("\n")}`
    : `Current public core skills:\n${lines.join("\n")}`;
}

/**
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildPublications(corpus, locale) {
  if (corpus.publications.length === 0) return EMPTY_PUBLICATIONS[locale];
  return corpus.publications
    .map(
      (publication) =>
        `• ${publication.title[locale]} (${publication.year}) — ${publication.status}`
    )
    .join("\n");
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
 * @param {object} corpus
 * @param {CareerLocale} locale
 * @returns {string}
 */
function buildAwards(corpus, locale) {
  if (corpus.awards.length === 0) return EMPTY_AWARDS[locale];
  const lines = corpus.awards.map(
    (award) => `• ${award.title[locale]} — ${award.issuer[locale]} (${award.year})`
  );
  return locale === "zh"
    ? `当前公开且已核验的奖项：\n${lines.join("\n")}`
    : `Current public and verified awards:\n${lines.join("\n")}`;
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
function buildResume(corpus, locale) {
  if (!corpus.identity) return FALLBACK[locale];
  return locale === "zh"
    ? "在线公开简历：/zh/resume。PDF 下载版仍待人工审核，当前不提供下载。"
    : "Online public resume: /en/resume. A downloadable PDF is still pending manual review and is not currently available.";
}

/**
 * @param {object} corpus
 * @param {string} message
 * @returns {string}
 */
export function createCareerReply(corpus, message) {
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
  if (containsAny(normalized, ["教育", "学历", "education", "academic background"])) {
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
  if (containsAny(normalized, ["论文", "publication", "paper"])) {
    return buildPublications(corpus, locale);
  }
  if (containsAny(normalized, ["专利", "patent"])) {
    return buildPatents(corpus, locale);
  }
  if (containsAny(normalized, ["研究成果", "research output", "research result"])) {
    const publicationReply = buildPublications(corpus, locale);
    const patentReply = buildPatents(corpus, locale);
    return `${publicationReply}\n${patentReply}`;
  }
  if (
    containsAny(normalized, [
      "有哪些奖项",
      "获得的奖项",
      "荣誉奖项",
      "what awards",
      "awards has",
      "honors",
    ])
  ) {
    return buildAwards(corpus, locale);
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

  return FALLBACK[locale];
}
