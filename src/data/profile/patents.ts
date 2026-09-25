import type { Patent } from "@/src/data/profile/types";

export const patents: Patent[] = [
  {
    id: "intelligent-classroom-attendance-system",
    title: {
      zh: "一种智能教室考勤系统",
      en: "An Intelligent Classroom Attendance System",
    },
    type: "utility-model",
    patentNumber: "ZL 2022 2 0475134.9",
    publicationNumber: "CN 216957023 U",
    applicationDate: "2022-03-04",
    /**
     * 授权时间：按本人确认修正为 2022.03（展示层按 YYYY.MM 输出，日期部分仅用于排序与格式化）。
     */
    grantDate: "2022-03-01",
    inventorOrder: 2,
    role: {
      zh: "第二发明人",
      en: "Second Inventor",
    },
    stageLabel: {
      zh: "本科阶段工程创新成果",
      en: "Undergraduate Engineering Innovation",
    },
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-patent-classroom-attendance",
    sourceNote: "Verified from user-provided patent certificate.",
  },
];
