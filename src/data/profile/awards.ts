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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-11-hainan-u-first-scholarship.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
  },
  {
    id: "sichuan-outstanding-graduate-2023",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-sichuan-graduate-2023",
    title: {
      zh: "四川省优秀大学毕业生",
      en: "Sichuan Province Outstanding Graduate",
    },
    issuer: {
      zh: "四川省教育厅",
      en: "Sichuan Provincial Education Department",
    },
    /** 获奖时间：与其它奖项统一采用 YYYY.MM（精确到月） */
    year: "2023.06",
    level: "provincial",
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-07-sichuan-outstanding-graduate-2023.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-06-national-scholarship-2022.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-05-outstanding-cadre-2022.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-08-innovation-excellent-2022.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-04-national-endeavor-scholarship-2021.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-02-merit-student-2021.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-03-first-scholarship-2021.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-13-youth-league-pacemaker.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "获奖证明",
        nameEn: "Award Proof",
        type: "image",
        path: "/attachments/awards/award-12-military-training-excellent.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
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
    attachments: [
      {
        name: "结业证明",
        nameEn: "Completion Proof",
        type: "image",
        path: "/attachments/awards/award-01-youth-marxism-program.jpg",
        format: "JPG 格式",
        formatEn: "JPG Format",
      },
    ],
  },
];
