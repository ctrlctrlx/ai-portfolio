import type { Award } from "@/src/data/profile/types";

/**
 * 竞赛获奖（学科竞赛类成果），按时间倒序维护。
 * 与 awards.ts（评奖）分开维护。
 *
 * 时间采用 YYYY.MM；两项均为省级赛区/省级奖励，级别记为 provincial。
 */
export const competitions: Award[] = [
  {
    id: "datang-cup-12th-3rd",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-competition-datang-cup-12",
    title: {
      zh: "第十二届“大唐杯”全国大学生新一代信息通信技术大赛 产教融合 5G+ 创新应用赛 团队三等奖",
      en: "12th Datang Cup National Collegiate New Generation ICT Competition — Industry-Education Integration 5G+ Innovation Application Track, Team 3rd Prize",
    },
    issuer: {
      zh: "中国通信企业协会",
      en: "China Association of Communication Enterprises",
    },
    year: "2025.05",
    level: "provincial",
  },
  {
    id: "lanqiao-13th-mcu-sichuan-3rd",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-competition-lanqiao-13",
    title: {
      zh: "第十三届蓝桥杯全国软件和信息技术专业人才大赛 四川赛区单片机设计与开发大学组 个人三等奖",
      en: "13th LanQiao Cup National Software and IT Professionals Competition — Sichuan Division, MCU Design & Development (University Group), Individual 3rd Prize",
    },
    issuer: {
      zh: "工业和信息化部人才交流中心",
      en: "MIIT Talent Exchange Center",
    },
    year: "2022.05",
    level: "provincial",
  },
];
