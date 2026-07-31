import type { EducationEntry } from "@/src/data/profile/types";

export const education: EducationEntry[] = [
  {
    id: "hnu",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-education-hnu",
    institution: { zh: "海南大学", en: "Hainan University" },
    degree: { zh: "硕士", en: "Master's" },
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
    degree: { zh: "本科", en: "Bachelor's" },
    major: { zh: "电子信息工程", en: "Electronic Information Engineering" },
    startDate: "2018.09",
    endDate: "2022.06",
    highlights: [],
  },
];
