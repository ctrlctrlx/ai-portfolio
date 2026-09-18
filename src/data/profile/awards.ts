import type { Award } from "@/src/data/profile/types";

/**
 * 荣誉奖项（按重要性排序）。
 * 竞赛获奖见 competitions.ts；证书与专利见 credentials.ts。
 */
export const awards: Award[] = [
  {
    id: "national-scholarship-2021",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-national-scholarship-2021",
    title: { zh: "国家奖学金", en: "National Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2021",
  },
  {
    id: "national-encouragement-scholarship-2020",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-national-encouragement-2020",
    title: { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2020",
  },
  {
    id: "sichuan-outstanding-graduate-2023",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-sichuan-graduate-2023",
    title: { zh: "四川省优秀毕业生", en: "Sichuan Province Outstanding Graduate" },
    issuer: {
      zh: "四川省教育厅",
      en: "Sichuan Provincial Education Department",
    },
    year: "2023",
  },
  {
    id: "university-scholarship-three-years",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-award-university-scholarship",
    title: {
      zh: "连续三年校级奖学金（2026 年获校级一等奖学金）",
      en: "University Scholarship for Three Consecutive Years (First-Class in 2026)",
    },
    issuer: {
      zh: "海南大学",
      en: "Hainan University",
    },
    year: "2026",
  },
];
