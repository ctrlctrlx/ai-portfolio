import type {
  BilingualText,
  ContactPoint,
  EvidenceStatus,
} from "@/src/data/profile/types";

export interface ProfileIdentity extends EvidenceStatus {
  name: BilingualText;
  /** 求职意向方向，用于首页首屏与在线简历 */
  jobTargets: BilingualText[];
  /** 一句话个人简介，用于首页首屏 */
  headline: BilingualText;
  tagline: BilingualText;
  bio: BilingualText;
  location: BilingualText;
  avatar: string;
  contacts: ContactPoint[];
}

export const identity: ProfileIdentity = {
  visibility: "public",
  verificationStatus: "verified",
  sourceId: "profile-identity",
  name: {
    zh: "杨冲",
    en: "Yang Chong",
  },
  jobTargets: [
    { zh: "硬件测试", en: "Hardware Testing" },
    { zh: "计算机视觉算法", en: "Computer Vision Algorithms" },
    { zh: "嵌入式系统", en: "Embedded Systems" },
  ],
  headline: {
    zh: "做得了算法，也焊得动电路——能把计算机视觉模型从论文推到板子上的工程型硕士。",
    en: "Equally at home deriving a loss function and debugging a circuit: an engineering-minded M.S. candidate who takes computer vision from paper to board.",
  },
  tagline: {
    zh: "计算机视觉 · 个体重识别 · 嵌入式智能感知 | 工学硕士在读",
    en: "Computer Vision · Individual Re-Identification · Embedded Sensing | M.S. Candidate",
  },
  bio: {
    zh: "新一代电子信息技术专业工学硕士在读，研究方向为计算机视觉、个体重识别（ReID）、视觉语言模型与嵌入式智能感知系统。具备完整的软硬件协同能力：算法侧做过 CLIP-ReID 特征压缩与开放集拒识，硬件侧主导过 RFID 与多目视觉同步采集装置的整机搭建。习惯用可复现的实验数据和可交付的工程规范来验证结论。",
    en: "M.S. candidate in New Generation Electronic Information Technology, researching computer vision, individual re-identification (ReID), vision-language models, and embedded intelligent sensing systems. Comfortable across the full stack: on the algorithm side I have worked on CLIP-ReID feature compression and open-set rejection; on the hardware side I led the construction of an RFID plus multi-camera synchronized acquisition device. I validate conclusions with reproducible experiments and deliverable engineering standards.",
  },
  location: { zh: "海南，中国", en: "Hainan, China" },
  avatar: "/head_photo.jpg",
  contacts: [
    {
      id: "public-email",
      kind: "email",
      label: { zh: "公开求职邮箱", en: "Public contact email" },
      value: "yangc202706@163.com",
      icon: "Mail",
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-contact-email",
    },
    {
      id: "website",
      kind: "website",
      label: { zh: "个人网站", en: "Website" },
      value: "https://ctrlctrlx.top",
      icon: "Globe",
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-contact-website",
    },
    {
      id: "github",
      kind: "github",
      label: { zh: "GitHub", en: "GitHub" },
      value: "https://github.com/ctrlctrlx",
      icon: "Github",
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-social-github",
    },
  ],
};
