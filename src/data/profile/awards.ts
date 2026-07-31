import type { Award } from "@/src/data/profile/types";

export const awards: Award[] = [
  {
    title: { zh: "国家奖学金", en: "National Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2021",
  },
  {
    title: { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
    issuer: {
      zh: "中华人民共和国教育部",
      en: "Ministry of Education, PRC",
    },
    year: "2020",
  },
  {
    title: { zh: "四川省优秀毕业生", en: "Sichuan Province Outstanding Graduate" },
    issuer: {
      zh: "四川省教育厅",
      en: "Sichuan Provincial Education Department",
    },
    year: "2022",
  },
  {
    title: {
      zh: "蓝桥杯全国软件和信息技术专业人才大赛（四川省三等奖）",
      en: "LanQiao Cup National Competition – Sichuan Province 3rd Prize",
    },
    issuer: {
      zh: "工业和信息化部人才交流中心",
      en: "MIIT Talent Exchange Center",
    },
    year: "2021",
  },
  {
    title: {
      zh: "实用新型专利授权（智能教室考勤系统）",
      en: "National Utility Model Patent (Intelligent Attendance System)",
    },
    issuer: {
      zh: "国家知识产权局",
      en: "China National Intellectual Property Administration",
    },
    year: "2022",
  },
];
