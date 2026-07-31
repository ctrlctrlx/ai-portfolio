import type { EducationEntry } from "@/src/data/profile/types";

export const education: EducationEntry[] = [
  {
    id: "hnu",
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
        zh: "研究方向：计算机视觉、多智能体强化学习、端侧模型部署",
        en: "Research: Computer Vision, Multi-Agent Reinforcement Learning (MARL) for UAV Path Planning, and Edge Deployment",
      },
      {
        zh: "信息与通信工程学院",
        en: "School of Information & Communication Engineering",
      },
    ],
  },
  {
    id: "scust",
    institution: {
      zh: "四川工业科技学院",
      en: "Sichuan University of Science and Technology",
    },
    degree: { zh: "本科", en: "Bachelor's" },
    major: { zh: "电子信息工程", en: "Electronic Information Engineering" },
    startDate: "2018.09",
    endDate: "2022.06",
    highlights: [
      {
        zh: "国家奖学金、国家励志奖学金",
        en: "National Scholarship, National Encouragement Scholarship",
      },
      {
        zh: "四川省优秀毕业生",
        en: "Sichuan Province Outstanding Graduate",
      },
      {
        zh: "连续获得校级一二等奖学金",
        en: "Consecutive University 1st & 2nd Class Scholarships",
      },
    ],
  },
];
