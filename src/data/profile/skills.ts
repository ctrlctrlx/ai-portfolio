import type { SkillCategory } from "@/src/data/profile/types";

const publicVerified = {
  visibility: "public",
  verificationStatus: "verified",
} as const;

export const skills: SkillCategory[] = [
  {
    id: "programming",
    label: { zh: "编程语言", en: "Programming" },
    ...publicVerified,
    sourceId: "profile-skills-programming",
    items: [
      { id: "python", name: { zh: "Python", en: "Python" }, ...publicVerified },
      { id: "cpp", name: { zh: "C/C++", en: "C/C++" }, ...publicVerified },
      {
        id: "linux-shell",
        name: { zh: "Linux Shell", en: "Linux Shell" },
        ...publicVerified,
      },
    ],
  },
  {
    id: "frameworks",
    label: { zh: "框架与部署", en: "Frameworks & Deployment" },
    ...publicVerified,
    sourceId: "profile-skills-frameworks",
    items: [
      { id: "pytorch", name: { zh: "PyTorch", en: "PyTorch" }, ...publicVerified },
      { id: "onnx", name: { zh: "ONNX", en: "ONNX" }, ...publicVerified },
      { id: "ncnn", name: { zh: "NCNN", en: "NCNN" }, ...publicVerified },
      {
        id: "tensorrt-learning",
        name: { zh: "TensorRT（学习中）", en: "TensorRT (learning)" },
        ...publicVerified,
      },
    ],
  },
  {
    id: "hardware",
    label: { zh: "硬件平台", en: "Hardware" },
    ...publicVerified,
    sourceId: "profile-skills-hardware",
    items: [
      {
        id: "jetson-orin-nano",
        name: { zh: "Jetson Orin Nano", en: "Jetson Orin Nano" },
        ...publicVerified,
      },
      {
        id: "iap15f2k61s2",
        name: { zh: "单片机（IAP15F2K61S2）", en: "IAP15F2K61S2 MCU" },
        ...publicVerified,
      },
      {
        id: "m5stack-v2unit",
        name: { zh: "M5Stack V2Unit", en: "M5Stack V2Unit" },
        ...publicVerified,
      },
    ],
  },
  {
    id: "engineering",
    label: { zh: "工程能力", en: "Engineering" },
    ...publicVerified,
    sourceId: "profile-skills-engineering",
    items: [
      { id: "git", name: { zh: "Git", en: "Git" }, ...publicVerified },
      { id: "docker", name: { zh: "Docker", en: "Docker" }, ...publicVerified },
      {
        id: "driver-development",
        name: { zh: "硬件驱动开发", en: "Hardware driver development" },
        ...publicVerified,
      },
      {
        id: "lightweight-networks",
        name: {
          zh: "轻量化网络（MobileNet/ShuffleNet）",
          en: "Lightweight networks (MobileNet/ShuffleNet)",
        },
        ...publicVerified,
      },
    ],
  },
];
