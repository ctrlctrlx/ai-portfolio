import type { Award } from "@/src/data/profile/types";

/**
 * 竞赛获奖（按重要性排序）。
 * 与 awards.ts 分开维护：本文件只放学科竞赛类成果。
 */
export const competitions: Award[] = [
  {
    id: "lanqiao-13th-mcu-sichuan-3rd",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-competition-lanqiao-13",
    title: {
      zh: "第十三届蓝桥杯全国软件大赛四川赛区单片机设计与开发 三等奖",
      en: "13th LanQiao Cup National Software Competition, Sichuan Division — MCU Design & Development, 3rd Prize",
    },
    issuer: {
      zh: "工业和信息化部人才交流中心",
      en: "MIIT Talent Exchange Center",
    },
    year: "2022",
  },
  {
    id: "datang-cup-12th-3rd",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-competition-datang-cup-12",
    title: {
      zh: "第十二届“大唐杯”全国大学生新一代信息通信技术大赛 三等奖",
      en: "12th Datang Cup National Collegiate New Generation ICT Competition, 3rd Prize",
    },
    issuer: {
      zh: "中国通信企业协会",
      en: "China Association of Communication Enterprises",
    },
    year: "2022",
  },
];
