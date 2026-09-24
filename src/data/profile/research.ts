import type { EvidenceStatus, ResearchArea } from "@/src/data/profile/types";

export interface ResearchProfile extends EvidenceStatus {
  areas: ResearchArea[];
}

/**
 * 研究方向：3 个互不重合的方向，每个方向对应一个独立落地项目。
 *
 * 结构说明（相较上一版）：
 * - 原「鱼类个体重识别（ReID）与开放集识别」与「视觉语言先验与视觉语言模型（CLIP 系列）」
 *   合并为「东星斑个体识别与开放集视觉理解」——两者本就指向同一个项目
 *   （基于视觉语言先验的开放世界东星斑个体重识别研究），合并后消除重合。
 * - 原「嵌入式智能感知系统与多模态数据采集」拆分为装置类与标记标准化类两个方向，
 *   分别对应 RFID 多目视觉采集装置与东星斑标记标准化体系两个独立项目。
 * - 每个方向的功能图标在展示层按 id 映射（见 src/components/ResearchAreas.tsx），
 *   数据层不引入展示字段，保持数据结构不变。
 */
export const research: ResearchProfile = {
  visibility: "public",
  verificationStatus: "verified",
  sourceId: "profile-research",
  areas: [
    {
      id: "fish-open-set",
      slug: "fish-open-set-visual-understanding",
      title: {
        zh: "东星斑个体识别与开放集视觉理解",
        en: "Crimson Snapper Individual Recognition & Open-Set Visual Understanding",
      },
      relatedProjectSlugs: ["fish-reid-open-world"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-fish-open-set",
    },
    {
      id: "rfid-multiview-acquisition",
      slug: "rfid-multiview-dual-modal-acquisition",
      title: {
        zh: "RFID与多目视觉双模态采集装置",
        en: "RFID & Multi-View Vision Dual-Modal Acquisition Device",
      },
      relatedProjectSlugs: ["rfid-multiview-acquisition"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-rfid-multiview-acquisition",
    },
    {
      id: "aquaculture-marking-standardization",
      slug: "aquaculture-marking-standardization",
      title: {
        zh: "水产养殖标记方法与标准化体系",
        en: "Aquaculture Marking Method & Standardization System",
      },
      relatedProjectSlugs: ["grouper-tagging-standard"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-aquaculture-marking",
    },
  ],
};
