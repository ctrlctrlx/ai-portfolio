import type { Project } from "@/src/data/profile/types";

export const projects: Project[] = [
  {
    id: "audio-edge",
    slug: "audio-edge",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-audio-edge",
    title: {
      zh: "轻量级环境音分类模型训练与边缘端部署",
      en: "Lightweight Environmental Sound Classification & Edge Deployment",
    },
    subtitle: {
      zh: "端到端深度学习音频分类全链路",
      en: "Full-cycle Edge AI: From Data Augmentation to Cross-compiled Embedded Inference",
    },
    featured: true,
    startDate: "2021.09",
    endDate: "2022.06",
    situation: {
      zh: "需要在资源受限的边缘设备上实现高效的环境音分类",
      en: "Target embedded hardware (M5Stack V2unit) had severely constrained compute and memory, demanding a highly optimized model and deployment workflow for real-time environmental sound classification.",
    },
    task: {
      zh: "构建完整的端到端模型训练与部署流程",
      en: "Architect and deliver a complete, reproducible model training-to-edge-deployment pipeline targeting an embedded Linux device.",
    },
    action: {
      zh: "基于 ESC50 数据集进行梅尔频谱转换和数据增强，5 折交叉验证，使用 PyTorch 训练后通过 ONNX 转换为 NCNN 格式，交叉编译部署到 M5stack V2unit",
      en: "Engineered a Mel spectrogram feature extraction pipeline on the ESC-50 dataset with audio augmentation; trained a CNN classifier in PyTorch using 5-fold cross-validation and conducted Adam vs. SGD optimizer ablation; converted the trained model via PyTorch → ONNX → NCNN and cross-compiled the inference runtime for the M5Stack V2unit via SSH.",
    },
    result: {
      zh: "成功实现完整部署链路，模型在边缘端稳定运行",
      en: "Delivered a fully operational edge inference system with stable real-time performance on embedded hardware, validating the complete PyTorch → ONNX → NCNN cross-compilation workflow.",
    },
    coreSkill: ["PyTorch", "ONNX", "NCNN", "Python", "Cross-compilation"],
    metrics: [
      { zh: "5 折交叉验证", en: "5-fold Cross Validation" },
      { zh: "梅尔频谱增强", en: "Mel Spectrogram Augmentation" },
      { zh: "边缘端稳定推理", en: "Stable Edge Inference" },
    ],
    interviewFocus: [
      {
        zh: "PyTorch → ONNX → NCNN 完整转换链路",
        en: "Full PyTorch → ONNX → NCNN conversion and cross-compilation pipeline",
      },
      {
        zh: "Adam vs SGD 对比实验",
        en: "Adam vs. SGD optimizer ablation study with TensorBoard visualization",
      },
    ],
    isInteractive: false,
  },
  {
    id: "smart-attendance",
    slug: "smart-attendance",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-smart-attendance",
    title: {
      zh: "智能教室考勤系统",
      en: "Intelligent Classroom Attendance System",
    },
    subtitle: {
      zh: "本科阶段工程创新项目与实用新型专利成果",
      en: "Undergraduate engineering project and utility model patent outcome",
    },
    featured: true,
    startDate: "2020.09",
    endDate: "2021.06",
    situation: {
      zh: "传统课堂考勤效率低下，需要硬件级自动化解决方案",
      en: "Traditional manual attendance in classroom settings was time-consuming and error-prone, with no automated hardware-level solution available at low cost.",
    },
    task: {
      zh: "设计并实现多传感器融合的自动考勤系统",
      en: "Architect a low-cost, highly reliable multi-sensor fusion system to fully automate classroom attendance tracking.",
    },
    action: {
      zh: "集成 AS608 指纹芯片、热释电红外传感器及 DS18B20 温度传感器，采用模块化设计降低硬件成本并提高可维护性",
      en: "Architected a multi-sensor pipeline integrating an AS608 optical fingerprint module, a pyroelectric infrared (PIR) presence sensor, and a DS18B20 digital temperature sensor; authored modular C/C++ firmware to maximize reusability and portability, significantly reducing BOM cost and system complexity.",
    },
    result: {
      zh: "项目成果获得实用新型专利授权，本人为第二发明人",
      en: "The project resulted in a granted utility model patent, with the candidate listed as the second inventor.",
    },
    coreSkill: ["C/C++", "MCU", "HW Driver Dev.", "Sensor Fusion"],
    metrics: [
      { zh: "实用新型专利", en: "Utility Model Patent" },
      { zh: "多传感器融合", en: "Multi-sensor Fusion" },
      { zh: "模块化架构", en: "Modular Architecture" },
    ],
    interviewFocus: [
      {
        zh: "硬件选型与系统架构设计",
        en: "Hardware component selection, BOM cost optimization, and modular system architecture design",
      },
      {
        zh: "实用新型专利第二发明人",
        en: "Second inventor on the granted utility model patent",
      },
    ],
    isInteractive: false,
  },
];

export function sortProjects(projectEntries: readonly Project[]): Project[] {
  return [...projectEntries].sort((first, second) => {
    if (first.featured && !second.featured) return -1;
    if (!first.featured && second.featured) return 1;
    return 0;
  });
}

export function findProjectBySlug(
  projectEntries: readonly Project[],
  slug: string
): Project | null {
  return projectEntries.find((project) => project.slug === slug) ?? null;
}
