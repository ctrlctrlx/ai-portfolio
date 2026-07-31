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
      id: "cv-marl-edge",
      slug: "computer-vision-marl-edge",
      title: {
        zh: "计算机视觉、多智能体强化学习、端侧模型部署",
        en: "Computer Vision, Multi-Agent Reinforcement Learning for UAV Path Planning, and Edge Deployment",
      },
      relatedProjectSlugs: ["audio-edge"],
      visibility: "public",
      verificationStatus: "verified",
      sourceId: "profile-research-cv-marl-edge",
    },
  ],
};
