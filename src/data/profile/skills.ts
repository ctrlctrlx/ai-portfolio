import type { SkillCategory } from "@/src/data/profile/types";

const publicVerified = {
  visibility: "public",
  verificationStatus: "verified",
} as const;

/** 构造技能条目：名称双语，证据状态统一继承分类的 public + verified */
function skill(id: string, zh: string, en: string) {
  return { id, name: { zh, en }, ...publicVerified };
}

/**
 * 技能栈，严格按简历的四大分类与分号分组展示。
 * groups 用于「分类标题 + 标签云」中的逻辑分组；items 为扁平回退集合，
 * 两者内容保持一致，避免下游消费者拿到不完整的技能列表。
 */
export const skills: SkillCategory[] = [
  {
    id: "algorithm",
    label: { zh: "算法与框架", en: "Algorithms & Frameworks" },
    note: {
      zh: "以计算机视觉与个体重识别为主线",
      en: "Centred on computer vision and individual re-identification",
    },
    ...publicVerified,
    sourceId: "profile-skills-algorithm",
    groups: [
      {
        id: "algorithm-languages",
        label: { zh: "语言与工具", en: "Languages & Tools" },
        items: [
          skill("python", "Python", "Python"),
          skill("pytorch", "PyTorch", "PyTorch"),
          skill("opencv", "OpenCV", "OpenCV"),
          skill("ffmpeg", "FFmpeg", "FFmpeg"),
        ],
      },
      {
        id: "algorithm-architectures",
        label: { zh: "网络架构", en: "Architectures" },
        items: [
          skill("cnn", "CNN", "CNN"),
          skill("transformer", "Transformer", "Transformer"),
          skill("clip", "CLIP 视觉语言模型", "CLIP vision-language models"),
        ],
      },
      {
        id: "algorithm-tasks",
        label: { zh: "任务方向", en: "Task Areas" },
        items: [
          skill("reid", "个体重识别（ReID）", "Individual re-identification (ReID)"),
          skill("classification", "图像分类", "Image classification"),
          skill("feature-compression", "特征压缩", "Feature compression"),
          skill("open-set", "开放集识别", "Open-set recognition"),
        ],
      },
    ],
    items: [
      skill("python", "Python", "Python"),
      skill("pytorch", "PyTorch", "PyTorch"),
      skill("opencv", "OpenCV", "OpenCV"),
      skill("ffmpeg", "FFmpeg", "FFmpeg"),
      skill("cnn", "CNN", "CNN"),
      skill("transformer", "Transformer", "Transformer"),
      skill("clip", "CLIP 视觉语言模型", "CLIP vision-language models"),
      skill("reid", "个体重识别（ReID）", "Individual re-identification (ReID)"),
      skill("classification", "图像分类", "Image classification"),
      skill("feature-compression", "特征压缩", "Feature compression"),
      skill("open-set", "开放集识别", "Open-set recognition"),
    ],
  },
  {
    id: "hardware",
    label: { zh: "硬件与嵌入式", en: "Hardware & Embedded" },
    note: {
      zh: "从电路调试到整机结构落地",
      en: "From circuit debugging to full-device construction",
    },
    ...publicVerified,
    sourceId: "profile-skills-hardware",
    groups: [
      {
        id: "hardware-electronics",
        label: { zh: "电子与射频", en: "Electronics & RF" },
        items: [
          skill("mcu-51-stm32", "51 / STM32 单片机", "8051 / STM32 microcontrollers"),
          skill("rfid", "RFID 射频系统（134.2kHz）", "RFID systems (134.2 kHz)"),
          skill("analog-digital", "模数电路调试", "Analog and digital circuit debugging"),
        ],
      },
      {
        id: "hardware-structure",
        label: { zh: "结构与整机", en: "Structure & Assembly" },
        items: [
          skill("mechanical-design", "机械结构设计", "Mechanical structure design"),
          skill("ip-enclosure", "工业级硬件防水封装", "Industrial-grade waterproof enclosure"),
          skill("device-assembly", "装置整机搭建", "Full-device assembly and commissioning"),
        ],
      },
    ],
    items: [
      skill("mcu-51-stm32", "51 / STM32 单片机", "8051 / STM32 microcontrollers"),
      skill("rfid", "RFID 射频系统（134.2kHz）", "RFID systems (134.2 kHz)"),
      skill("analog-digital", "模数电路调试", "Analog and digital circuit debugging"),
      skill("mechanical-design", "机械结构设计", "Mechanical structure design"),
      skill("ip-enclosure", "工业级硬件防水封装", "Industrial-grade waterproof enclosure"),
      skill("device-assembly", "装置整机搭建", "Full-device assembly and commissioning"),
    ],
  },
  {
    id: "engineering",
    label: { zh: "工程与部署", en: "Engineering & Deployment" },
    note: {
      zh: "关注模型从训练到设备落地",
      en: "Focused on taking models from training to deployed devices",
    },
    ...publicVerified,
    sourceId: "profile-skills-engineering",
    groups: [
      {
        id: "engineering-platform",
        label: { zh: "系统与部署", en: "Systems & Deployment" },
        items: [
          skill("linux", "Linux 系统", "Linux systems"),
          skill("onnx", "ONNX 模型转换", "ONNX model conversion"),
          skill("edge-deployment", "边缘端部署", "Edge deployment"),
        ],
      },
      {
        id: "engineering-io",
        label: { zh: "编程与通信", en: "Programming & Communication" },
        items: [
          skill("multithreading", "多线程编程", "Multi-threaded programming"),
          skill("serial", "串口通信", "Serial communication"),
          skill("usb", "USB 总线协议（USB 3.2）", "USB bus protocols (USB 3.2)"),
        ],
      },
    ],
    items: [
      skill("linux", "Linux 系统", "Linux systems"),
      skill("onnx", "ONNX 模型转换", "ONNX model conversion"),
      skill("edge-deployment", "边缘端部署", "Edge deployment"),
      skill("multithreading", "多线程编程", "Multi-threaded programming"),
      skill("serial", "串口通信", "Serial communication"),
      skill("usb", "USB 总线协议（USB 3.2）", "USB bus protocols (USB 3.2)"),
    ],
  },
  {
    id: "tools",
    label: { zh: "工具与其他", en: "Tools & Others" },
    ...publicVerified,
    sourceId: "profile-skills-tools",
    groups: [
      {
        id: "tools-design",
        label: { zh: "设计工具", en: "Design Tools" },
        items: [skill("autocad", "AutoCAD 结构设计", "AutoCAD structure design")],
      },
      {
        id: "tools-office",
        label: { zh: "办公与数据处理", en: "Office & Data Processing" },
        items: [
          skill("office", "Office 套件", "Microsoft Office suite"),
          skill("vba", "VBA 批量数据处理", "VBA batch data processing"),
        ],
      },
    ],
    items: [
      skill("autocad", "AutoCAD 结构设计", "AutoCAD structure design"),
      skill("office", "Office 套件", "Microsoft Office suite"),
      skill("vba", "VBA 批量数据处理", "VBA batch data processing"),
    ],
  },
];
