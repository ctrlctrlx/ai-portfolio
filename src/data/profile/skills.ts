export interface SkillGroups {
  programming: string[];
  frameworks: string[];
  hardware: string[];
  others: string[];
}

export const skills: SkillGroups = {
  programming: ["Python", "C/C++", "Linux Shell"],
  frameworks: ["PyTorch", "ONNX", "NCNN", "TensorRT (学习中)"],
  hardware: ["Jetson Orin Nano", "单片机 (IAP15F2K61S2)", "M5stack V2unit"],
  others: ["Git", "Docker", "硬件驱动开发", "轻量化网络 (MobileNet/ShuffleNet)"],
};
