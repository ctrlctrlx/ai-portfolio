import type { Credential } from "@/src/data/profile/types";

/**
 * 证书、专利与学术论文。
 * 与 awards.ts（评奖）、competitions.ts（竞赛）分开维护。
 * - 实用新型专利的事实与 patents.ts 保持一致，此处仅作「荣誉与资质」展示引用。
 * - 论文条目的完整事实以 publications.ts 为准，此处仅作分类展示引用（kind: "paper"）。
 */
export const credentials: Credential[] = [
  {
    id: "ncree-level-2-c",
    kind: "certificate",
    title: {
      zh: "全国计算机等级考试二级（C 语言程序设计）",
      en: "National Computer Rank Examination Level 2 (C Programming)",
    },
    issuer: {
      zh: "教育部教育考试院",
      en: "National Education Examinations Authority, MOE",
    },
    /** 取证时间；与全站经历类信息一致采用 YYYY.MM */
    year: "2021.03",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-credential-ncree-level-2",
  },
  {
    id: "cet-4",
    kind: "certificate",
    title: { zh: "大学英语四级（CET-4）", en: "College English Test Band 4 (CET-4)" },
    issuer: {
      zh: "教育部教育考试院",
      en: "National Education Examinations Authority, MOE",
    },
    /** 取证时间；与全站经历类信息一致采用 YYYY.MM */
    year: "2022.06",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-credential-cet4",
  },
  {
    id: "utility-model-attendance-system",
    kind: "patent",
    title: {
      zh: "实用新型专利《一种智能教室考勤系统》",
      en: "Utility Model Patent: An Intelligent Classroom Attendance System",
    },
    issuer: {
      zh: "国家知识产权局（第二发明人）",
      en: "China National Intellectual Property Administration (Second Inventor)",
    },
    /** 授权时间：与 patents.ts 的 grantDate 同源，精确到月 */
    year: "2022.03",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-credential-utility-model",
  },
  {
    id: "paper-blockchain-spectrum-sensing",
    kind: "paper",
    title: {
      zh: "Blockchain-Enhanced Spectrum Sensing with PoAS and Game-Theoretic Detection",
      en: "Blockchain-Enhanced Spectrum Sensing with PoAS and Game-Theoretic Detection",
    },
    issuer: { zh: "EI 会议 · 第一作者", en: "EI Conference · First Author" },
    year: "2025",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-credential-paper-blockchain-spectrum-sensing",
  },
  {
    id: "paper-quality-aware-temporal-fish-reid",
    kind: "paper",
    title: {
      zh: "Quality-Aware Temporal Contrastive Learning for Robust Open-Set Fish Re-Identification",
      en: "Quality-Aware Temporal Contrastive Learning for Robust Open-Set Fish Re-Identification",
    },
    issuer: { zh: "EI 会议 · 第一作者", en: "EI Conference · First Author" },
    year: "2026",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-credential-paper-quality-aware-temporal-reid",
  },
];
