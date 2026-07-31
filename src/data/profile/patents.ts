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
    grantDate: "2022-07-12",
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
