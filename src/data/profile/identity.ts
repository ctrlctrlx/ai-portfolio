import type {
  BilingualText,
  EvidenceStatus,
  SocialLink,
} from "@/src/data/profile/types";

export interface ProfileIdentity extends EvidenceStatus {
  name: BilingualText;
  tagline: BilingualText;
  bio: BilingualText;
  location: BilingualText;
  avatar: string;
  resumePdfUrl: string | null;
  socialLinks: SocialLink[];
}

export const identity: ProfileIdentity = {
  visibility: "public",
  verificationStatus: "verified",
  sourceId: "profile-identity",
  name: {
    zh: "杨冲",
    en: "Yang Chong",
  },
  tagline: {
    zh: "计算机视觉与边缘部署 · 硕士在读",
    en: "M.S. Candidate · Computer Vision & Edge Deployment",
  },
  bio: {
    zh: "新一代电子信息技术专业硕士在读。具备扎实的软硬件协同开发能力，专注于计算机视觉与深度学习模型的轻量化设计，拥有将 PyTorch 模型转化为 ONNX/NCNN 并部署到边缘计算设备的实战经验。对探索前沿 AI 技术落地抱有极大热情。",
    en: "M.S. candidate in New Generation Electronic Information Technology with a solid foundation in full-stack AI development. Engineered end-to-end edge deployment pipelines, converting PyTorch models through ONNX to NCNN for real-time inference on embedded hardware. Deeply passionate about bridging cutting-edge AI research with production-grade edge computing.",
  },
  location: { zh: "海南，中国", en: "Hainan, China" },
  avatar: "/head_photo.jpg",
  resumePdfUrl: null,
  socialLinks: [
    {
      id: "github",
      platform: "GitHub",
      url: "https://github.com/ctrlctrlx",
      icon: "Github",
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-social-github",
    },
  ],
};
