import type { EvidenceStatus, ResearchArea } from "@/src/data/profile/types";

export interface ResearchProfile extends EvidenceStatus {
  areas: ResearchArea[];
}

export const research: ResearchProfile = {
  visibility: "public",
  verificationStatus: "verified",
  sourceId: "profile-research",
  areas: [
    {
      id: "fish-reid",
      slug: "fish-individual-reid",
      title: {
        zh: "鱼类个体重识别（ReID）与开放集识别",
        en: "Fish Individual Re-Identification (ReID) and Open-Set Recognition",
      },
      relatedProjectSlugs: ["fish-reid-open-world"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-fish-reid",
    },
    {
      id: "vision-language-prior",
      slug: "vision-language-prior",
      title: {
        zh: "视觉语言先验与视觉语言模型（CLIP 系列）",
        en: "Vision-Language Priors and Vision-Language Models (CLIP family)",
      },
      relatedProjectSlugs: ["fish-reid-open-world"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-vision-language-prior",
    },
    {
      id: "embedded-sensing",
      slug: "embedded-intelligent-sensing",
      title: {
        zh: "嵌入式智能感知系统与多模态数据采集",
        en: "Embedded Intelligent Sensing Systems and Multimodal Data Acquisition",
      },
      relatedProjectSlugs: ["rfid-multiview-acquisition", "grouper-tagging-standard"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-embedded-sensing",
    },
  ],
};
