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
  /** 与 about.jobTargets 保持同一口径，避免同一站点出现两套求职意向表述 */
  jobTargets: [
    { zh: "计算机视觉算法工程师", en: "Computer Vision Algorithm Engineer" },
    { zh: "嵌入式AI/边缘部署工程师", en: "Embedded AI / Edge Deployment Engineer" },
  ],
  headline: {
    zh: "做得了算法，也焊得动电路——能把计算机视觉模型从论文推到板子上的工程型硕士。",
    en: "Equally at home deriving a loss function and debugging a circuit: an engineering-minded M.S. candidate who takes computer vision from paper to board.",
  },
  tagline: {
    zh: "计算机视觉 · 个体重识别 · 嵌入式智能感知 | 工学硕士在读",
    en: "Computer Vision · Individual Re-Identification · Embedded Sensing | M.S. Candidate",
  },
  /**
   * 完整自我介绍（纯文本）：供页面 meta description 复用。
   * 文案与 about.bioSections 的量化增强版保持一致；政治面貌按 AGENTS.md 的
   * 隐私条款只保留在 about.ts（标签行内），因此本字段不含该表述。
   */
  bio: {
    zh: "海南大学新一代电子信息技术工学硕士在读 | 国家奖学金获得者。算法与硬件双线并进的工程型硕士，专注视觉模型落地与嵌入式感知系统交付。算法侧主导 CLIP-ReID 特征压缩与开放集识别方案，设计 Compact256 投影层将特征从 1280 维压缩至 256 维（5 倍降维），精度损失<2%，已部署至 Web 原型系统；硬件侧主导 RFID 与三目视觉同步采集装置整机搭建，实现 3 路 25fps 稳定采集与 USB3.2 带宽优化，完成工业级防水封装，在文昌冯家湾基地高频驻场约6个月（每周3-4天）完成个体识别装置交付与标准化体系输出。习惯用可复现的实验数据与可交付的工程规范验证结论，坚持「方向确认后快速推进、迭代修正」，兼顾方案严谨性与落地节奏。",
    en: "M.Eng. Candidate in New Generation Electronic Information Technology, Hainan University | National Scholarship Winner. An engineering-minded master's candidate working both ends of the stack, focused on landing vision models and delivering embedded perception systems. On the algorithm side I led CLIP-ReID feature compression and open-set recognition: the Compact256 projection layer compresses features from 1280 to 256 dimensions (5× dimensionality reduction), with accuracy loss <2%, already deployed to a web prototype. On the hardware side I led the full-device construction of an RFID plus three-camera synchronized acquisition rig, achieving 3× 25 fps stable capture and USB 3.2 bandwidth optimization, completed the industrial-grade waterproof enclosure, and spent about six months on high-frequency on-site work at the Fengjiawan base in Wenchang (3–4 days per week) delivering the individual-identification device and the standardized operating framework. I verify conclusions with reproducible experimental data and deliverable engineering practices, adhering to \"move fast once the direction is confirmed, iterate and correct along the way\" to balance rigor with delivery pace.",
  },
  /** 现居地；籍贯单独维护在 about.nativePlace */
  location: { zh: "海南海口", en: "Haikou, Hainan" },
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
      id: "public-phone",
      kind: "phone",
      label: { zh: "电话", en: "Phone" },
      /**
       * 本人已授权在求职场景主动公开手机号。
       * 该号码字面值只允许出现在本文件与 public/resume.pdf，
       * 白名单见 scripts/lib-approved-contacts.mjs。
       */
      value: "18716985140",
      icon: "Phone",
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-contact-phone",
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
