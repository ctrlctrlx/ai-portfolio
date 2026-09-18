import type { EducationEntry } from "@/src/data/profile/types";

export const education: EducationEntry[] = [
  {
    id: "hnu",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-education-hnu",
    institution: { zh: "海南大学", en: "Hainan University" },
    degree: { zh: "工学硕士", en: "Master of Engineering" },
    major: {
      zh: "新一代电子信息技术",
      en: "New Generation Electronic Information Technology",
    },
    startDate: "2024.09",
    endDate: "2027.06",
    highlights: [
      {
        zh: "信息与通信工程学院",
        en: "School of Information & Communication Engineering",
      },
      {
        zh: "研究方向：计算机视觉、个体重识别（ReID）、视觉语言模型、嵌入式智能感知系统",
        en: "Research focus: computer vision, individual re-identification (ReID), vision-language models, embedded intelligent sensing systems",
      },
    ],
  },
  {
    id: "scust",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-education-scust",
    institution: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    degree: { zh: "工学学士", en: "Bachelor of Engineering" },
    major: { zh: "电子信息工程", en: "Electronic Information Engineering" },
    startDate: "2019.09",
    endDate: "2023.06",
    highlights: [
      { zh: "国家奖学金", en: "National Scholarship" },
      { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
      { zh: "四川省优秀毕业生", en: "Sichuan Province Outstanding Graduate" },
    ],
  },
];
