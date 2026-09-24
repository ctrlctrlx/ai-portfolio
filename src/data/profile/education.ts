import type { EducationEntry } from "@/src/data/profile/types";

export const education: EducationEntry[] = [
  {
    id: "hnu",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-education-hnu",
    institution: { zh: "海南大学", en: "Hainan University" },
    degree: { zh: "工学硕士", en: "M.Eng." },
    major: {
      zh: "新一代电子信息技术",
      en: "New Generation Electronic Information Technology",
    },
    /**
     * GPA：仅保留绩点，不展示专业排名。
     * 展示层用次级文字色弱化，字号与同级文字一致。
     */
    gpa: { zh: "3.6/4.0", en: "3.6/4.0" },
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
      {
        zh: "校级一等奖学金（2026.09）",
        en: "First-Class Scholarship (University Level, Sep. 2026)",
      },
      {
        zh: "第十二届“大唐杯”全国大学生新一代信息通信技术大赛 产教融合 5G+ 创新应用赛 团队三等奖（2025.05）",
        en: "12th Datang Cup National Collegiate New Generation ICT Competition — Industry-Education Integration 5G+ Innovation Application Track, Team 3rd Prize (May 2025)",
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
    degree: { zh: "工学学士", en: "B.Eng." },
    major: { zh: "电子信息工程", en: "Electronic Information Engineering" },
    /**
     * GPA：仅保留绩点，不展示专业排名。
     * 展示层用次级文字色弱化，字号与同级文字一致。
     */
    gpa: { zh: "3.9/4.0", en: "3.9/4.0" },
    startDate: "2019.09",
    endDate: "2023.06",
    highlights: [
      {
        zh: "2023届四川省优秀大学毕业生（2023.06）",
        en: "Sichuan Province Outstanding University Graduate, Class of 2023 (Jun. 2023)",
      },
      {
        zh: "国家奖学金（2022.12）",
        en: "National Scholarship (Dec. 2022)",
      },
      {
        zh: "第十三届蓝桥杯全国软件和信息技术专业人才大赛 四川赛区单片机设计与开发大学组 个人三等奖（2022.05）",
        en: "13th LanQiao Cup National Software and IT Professionals Competition — Sichuan Division, MCU Design & Development (University Group), Individual 3rd Prize (May 2022)",
      },
      {
        zh: "国家励志奖学金（2021.12）",
        en: "National Encouragement Scholarship (Dec. 2021)",
      },
    ],
  },
];
