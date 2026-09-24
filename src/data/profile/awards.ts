import type { Award, AwardLevel, BilingualText } from "@/src/data/profile/types";

/** 荣誉级别标签：荣誉页分级标题与机器人回答共用同一份文案 */
export const awardLevelLabels: Record<AwardLevel, BilingualText> = {
  national: { zh: "国家级奖励", en: "National Awards" },
  provincial: { zh: "省部级奖励", en: "Provincial Awards" },
  university: { zh: "校级奖励", en: "University-level Awards" },
};

/** 荣誉页分级展示顺序：国家级 → 省部级 → 校级 */
export const awardLevelOrder: AwardLevel[] = [
  "national",
  "provincial",
  "university",
];

/**
 * 荣誉奖项（评奖类），按时间倒序维护（最新在前）。
 * 竞赛获奖见 competitions.ts；证书与专利见 credentials.ts 与 patents.ts。
 *
 * 时间采用 YYYY.MM；级别取值见 AwardLevel。
 * 国家奖学金、国家励志奖学金均为教育部颁发的国家级奖励；
 * 四川工业科技学院本科阶段的七项校级荣誉集中在 2020–2022 年。
 */
export const awards: Award[] = [
  {
    id: "university-first-class-scholarship-2026",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-university-first-class-2026",
    title: {
      zh: "校级一等奖学金",
      en: "First-Class Scholarship (University Level)",
    },
    issuer: {
      zh: "海南大学",
      en: "Hainan University",
    },
    year: "2026.09",
    level: "university",
  },
  {
    id: "sichuan-outstanding-graduate-2023",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-sichuan-graduate-2023",
    title: {
      zh: "2023届四川省优秀大学毕业生",
      en: "Sichuan Province Outstanding University Graduate (Class of 2023)",
    },
    issuer: {
      zh: "四川省教育厅",
      en: "Sichuan Provincial Education Department",
    },
    year: "2023.06",
    level: "provincial",
  },
  {
    id: "national-scholarship-2022",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-national-scholarship-2022",
    title: { zh: "国家奖学金", en: "National Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2022.12",
    level: "national",
  },
  {
    id: "scust-outstanding-student-cadre-2022",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-outstanding-cadre-2022",
    title: { zh: "优秀学生干部", en: "Outstanding Student Cadre" },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2022.11",
    level: "university",
  },
  {
    id: "scust-outstanding-innovation-trainee-2022",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-innovation-trainee-2022",
    title: { zh: "创新优秀学员", en: "Outstanding Innovation Trainee" },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2022.07",
    level: "university",
  },
  {
    id: "national-encouragement-scholarship-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-national-encouragement-2021",
    title: { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2021.12",
    level: "national",
  },
  {
    id: "scust-three-good-student-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-three-good-student-2021",
    title: {
      zh: "三好学生",
      en: "Three Good Student",
    },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2021.11",
    level: "university",
  },
  {
    id: "scust-first-class-scholarship-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-first-class-scholarship-2021",
    title: {
      zh: "校级一等奖学金",
      en: "First-Class Scholarship (University-level)",
    },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2021.11",
    level: "university",
  },
  {
    id: "scust-may-fourth-pacesetter-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-may-fourth-pacesetter-2021",
    title: { zh: "五四红旗标兵", en: "May Fourth Red Banner Pacesetter" },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2021.05",
    level: "university",
  },
  {
    id: "scust-military-training-advanced-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-military-training-2021",
    title: {
      zh: "军事训练先进个人",
      en: "Advanced Individual in Military Training",
    },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2021.03",
    level: "university",
  },
  {
    id: "scust-young-marxist-programme-2020",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-scust-young-marxist-2020",
    title: {
      zh: "“青年马克思主义者培养工程学习班”结业证书",
      en: "Certificate of Completion, \"Young Marxist Training Programme\"",
    },
    issuer: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    year: "2020.12",
    level: "university",
  },
];
