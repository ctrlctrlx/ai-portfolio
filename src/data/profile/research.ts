import type { BilingualText } from "@/src/data/profile/types";

export interface ResearchProfile {
  areas: BilingualText[];
  interviewContext: string;
}

export const research: ResearchProfile = {
  areas: [
    {
      zh: "计算机视觉、多智能体强化学习、端侧模型部署",
      en: "Computer Vision, Multi-Agent Reinforcement Learning (MARL) for UAV Path Planning, and Edge Deployment",
    },
  ],
  interviewContext: `候选人拥有极强的硬件底层理解力和深度学习模型部署能力。
本科期间多次获得国家级奖学金和省级优秀毕业生。
熟练掌握 PyTorch 模型向边缘端侧（如 NCNN、ONNX）的量化与部署流程。
目前正在海南大学攻读硕士，主攻 CV 和边缘端部署，具备优秀的抗压能力和团队协作能力。`,
};
