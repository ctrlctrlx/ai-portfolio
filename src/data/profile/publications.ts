import type { Author, Publication } from "@/src/data/profile/types";

/**
 * 公开论文集合。
 *
 * 事实边界：
 * - 两篇均为本人第一作者（一作），类型为 EI 会议论文。
 * - 会议的具体名称/全称尚未确认，venue 中保留【待补充会议全称】占位，
 *   在补全之前不得声称 EI 已收录（indexed），只能表述为 EI 会议论文。
 * - 指标为本人提供的论文版本数值，与项目 ① 的部署级数值口径不同，见 sourceNote。
 *
 * 作者说明：authors 只写顺序，不在本文件重复本人姓名
 * （verify:profile 要求公开姓名在全数据层只出现一次，唯一来源是 identity.ts），
 * 展示时由 getPublicationAuthorDisplay 从 identity 派生姓名。
 */
export const publications: Publication[] = [
  {
    id: "blockchain-spectrum-sensing-poas",
    slug: "blockchain-spectrum-sensing-poas",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-publication-blockchain-spectrum-sensing",
    title: {
      zh: "Blockchain-Enhanced Spectrum Sensing with PoAS and Game-Theoretic Detection",
      en: "Blockchain-Enhanced Spectrum Sensing with PoAS and Game-Theoretic Detection",
    },
    authors: [
      { order: 1, isCandidate: true, isHighlighted: true },
      { order: 2 },
      { order: 3 },
    ],
    venue: {
      zh: "EI 会议 ·【待补充会议全称】",
      en: "EI Conference · [full conference name pending]",
    },
    year: 2025,
    month: "2025.04",
    publicationType: "ei-conference",
    authorRole: { zh: "第一作者", en: "First Author" },
    abstract: {
      zh: "面向区块链赋能的频谱感知场景，提出 PoAS 混合共识机制与博弈论恶意节点检测方法：以权益与活跃度联合的混合共识提升链上感知数据可信度，并将恶意节点识别建模为博弈过程进行求解。检测概率由 0.5 提升至 0.9，节点收益差提升 454 单位。",
      en: "For blockchain-enhanced spectrum sensing, this work proposes a PoAS hybrid consensus mechanism together with a game-theoretic malicious-node detection method: a hybrid consensus combining stake and activity improves the trustworthiness of on-chain sensing data, and malicious-node identification is modelled and solved as a game. Detection probability improves from 0.5 to 0.9, and the node payoff gap increases by 454 units.",
    },
    coreContribution: {
      zh: "提出 PoAS 混合共识机制与博弈论恶意节点检测方法，解决链上频谱感知数据的可信度与恶意节点识别问题。",
      en: "Proposes a PoAS hybrid consensus mechanism and a game-theoretic malicious-node detection method, addressing on-chain spectrum-sensing data trustworthiness and malicious-node identification.",
    },
    metrics: [
      { zh: "检测概率 0.5 → 0.9", en: "Detection probability 0.5 → 0.9" },
      { zh: "节点收益差提升 454 单位", en: "Node payoff gap +454 units" },
    ],
    tags: ["Blockchain", "Spectrum Sensing", "PoAS", "Game Theory"],
    status: "published",
    sourceNote:
      "第一作者；EI 会议论文。会议全称待补充，因此不标记为 indexed。",
  },
  {
    id: "quality-aware-temporal-contrastive-fish-reid",
    slug: "quality-aware-temporal-contrastive-fish-reid",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-publication-quality-aware-temporal-reid",
    title: {
      zh: "Quality-Aware Temporal Contrastive Learning for Robust Open-Set Fish Re-Identification",
      en: "Quality-Aware Temporal Contrastive Learning for Robust Open-Set Fish Re-Identification",
    },
    authors: [
      { order: 1, isCandidate: true, isHighlighted: true },
      { order: 2 },
      { order: 3 },
    ],
    venue: {
      zh: "EI 会议 ·【待补充会议全称】",
      en: "EI Conference · [full conference name pending]",
    },
    year: 2026,
    month: "2026.05",
    publicationType: "ei-conference",
    authorRole: { zh: "第一作者", en: "First Author" },
    abstract: {
      zh: "针对水下鱼类个体重识别中图像质量波动与未知个体持续出现的双重挑战，提出质量感知时序对比学习框架：将图像质量估计融入时序对比学习，在低维身份特征下同时提升闭集识别与开放集拒识性能。闭集 Rank-1 达 94.83%，开放集 AUROC 达 87.75%。",
      en: "Addressing both fluctuating underwater image quality and the continual appearance of unknown individuals in fish re-identification, this work proposes a quality-aware temporal contrastive learning framework that folds image-quality estimation into temporal contrastive learning, improving closed-set recognition and open-set rejection simultaneously under low-dimensional identity features. Closed-set Rank-1 reaches 94.83% and open-set AUROC reaches 87.75%.",
    },
    coreContribution: {
      zh: "提出质量感知时序对比学习框架，实现低维度特征下的高精度个体重识别，并与「基于视觉语言先验的开放世界鱼类个体重识别研究」项目形成成果落地闭环。",
      en: "Proposes a quality-aware temporal contrastive learning framework achieving high-accuracy re-identification under low-dimensional features, closing the loop with the open-world fish re-identification research project.",
    },
    metrics: [
      { zh: "闭集 Rank-1 94.83%", en: "Closed-set Rank-1 94.83%" },
      { zh: "开放集 AUROC 87.75%", en: "Open-set AUROC 87.75%" },
    ],
    tags: ["Fish Re-ID", "Temporal Contrastive Learning", "Open-Set Recognition", "Image Quality"],
    status: "published",
    relatedProjectSlugs: ["fish-reid-open-world"],
    sourceNote:
      "第一作者；EI 会议论文。指标为论文版本数值，与项目①部署级口径（Rank-1 76.3% / AUROC 0.7108）不同，两者分别如实标注。",
  },
];

/**
 * 把作者顺序 + 是否本人解析为可展示的姓名。
 *
 * 本人姓名不在本文件里重复书写（verify:profile 要求公开姓名在全数据层只出现一次），
 * 因此由调用方从 identity 传入 candidateName。其余合著者姓名未核验，展示为占位。
 * 本函数保持纯函数且不依赖路径别名，保证 Node 校验脚本可直接加载本模块。
 */
export function getPublicationAuthors(
  publication: Publication,
  candidateName: string,
  locale: "zh" | "en" = "zh"
): { order: number; name: string; isCandidate: boolean }[] {
  return [...publication.authors]
    .sort((first, second) => first.order - second.order)
    .map((author: Author) => ({
      order: author.order,
      name: author.isCandidate
        ? candidateName
        : locale === "zh"
          ? `合作者 ${author.order}`
          : `Co-author ${author.order}`,
      isCandidate: author.isCandidate === true,
    }));
}
