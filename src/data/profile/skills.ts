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
 * 技能栈：按「编程语言 / 框架与工具 / 研究方向」三类组织。
 *
 * 条目总数为 27 条：编程语言 5 + 框架与工具 15 + 研究方向 7。
 * 本次新增 1 条「C/C++」（编程语言分组），其余条目沿用既有内容，未增删。
 *
 * 组内顺序按求职场景的核心度排列（越靠前越能代表主力能力），
 * 而非按字母序：Python / C/C++ 先行，随后是数据处理与单片机、并发能力；
 * 框架组以深度学习与视觉工具打头，再是系统与部署、最后硬件与结构工具；
 * 研究方向组先列网络架构，再按「个体重识别 → 开放集识别 → 特征压缩 → 图像分类」
 * 的主线任务顺序排列。
 *
 * groups 用于「分类标题 + 分组小标题 + 标签云」的层级展示；
 * items 为扁平回退集合（在线简历页按此渲染），两者 id 集合与顺序保持一致。
 */
export const skills: SkillCategory[] = [
  {
    id: "languages",
    label: { zh: "编程语言", en: "Programming Languages" },
    note: {
      zh: "算法实现与设备端编程的常用语言与并发能力",
      en: "Languages and concurrency skills used for algorithm implementation and on-device programming",
    },
    ...publicVerified,
    sourceId: "profile-skills-languages",
    groups: [
      {
        id: "languages-core",
        label: { zh: "语言与编程能力", en: "Languages & Programming" },
        items: [
          skill("python", "Python", "Python"),
          skill("c-cpp", "C/C++", "C/C++"),
          skill("vba", "VBA 批量数据处理", "VBA batch data processing"),
          skill("mcu-51-stm32", "51 / STM32 单片机", "8051 / STM32 microcontrollers"),
          skill("multithreading", "多线程编程", "Multi-threaded programming"),
        ],
      },
    ],
    items: [
      skill("python", "Python", "Python"),
      skill("c-cpp", "C/C++", "C/C++"),
      skill("vba", "VBA 批量数据处理", "VBA batch data processing"),
      skill("mcu-51-stm32", "51 / STM32 单片机", "8051 / STM32 microcontrollers"),
      skill("multithreading", "多线程编程", "Multi-threaded programming"),
    ],
  },
  {
    id: "frameworks-tools",
    label: { zh: "框架与工具", en: "Frameworks & Tools" },
    note: {
      zh: "从模型训练、数据处理到硬件与结构落地的完整工具箱",
      en: "The full toolkit from model training and data processing to hardware and structure delivery",
    },
    ...publicVerified,
    sourceId: "profile-skills-frameworks-tools",
    groups: [
      {
        id: "frameworks-vision",
        label: { zh: "深度学习与视觉", en: "Deep Learning & Vision" },
        items: [
          skill("pytorch", "PyTorch", "PyTorch"),
          skill("opencv", "OpenCV", "OpenCV"),
          skill("onnx", "ONNX 模型转换", "ONNX model conversion"),
          skill("ffmpeg", "FFmpeg", "FFmpeg"),
        ],
      },
      {
        id: "frameworks-systems",
        label: { zh: "系统与部署", en: "Systems & Deployment" },
        items: [
          skill("linux", "Linux 系统", "Linux systems"),
          skill("edge-deployment", "边缘端部署", "Edge deployment"),
          skill("serial", "串口通信", "Serial communication"),
          skill("usb", "USB 总线协议（USB 3.2）", "USB bus protocols (USB 3.2)"),
        ],
      },
      {
        id: "frameworks-hardware",
        label: { zh: "硬件与结构工具", en: "Hardware & Structure Tools" },
        items: [
          skill("rfid", "RFID 射频系统（134.2kHz）", "RFID systems (134.2 kHz)"),
          skill("analog-digital", "模数电路调试", "Analog and digital circuit debugging"),
          skill("device-assembly", "装置整机搭建", "Full-device assembly and commissioning"),
          skill("mechanical-design", "机械结构设计", "Mechanical structure design"),
          skill("ip-enclosure", "工业级硬件防水封装", "Industrial-grade waterproof enclosure"),
          skill("autocad", "AutoCAD 结构设计", "AutoCAD structure design"),
          skill("office", "Office 套件", "Microsoft Office suite"),
        ],
      },
    ],
    items: [
      skill("pytorch", "PyTorch", "PyTorch"),
      skill("opencv", "OpenCV", "OpenCV"),
      skill("onnx", "ONNX 模型转换", "ONNX model conversion"),
      skill("ffmpeg", "FFmpeg", "FFmpeg"),
      skill("linux", "Linux 系统", "Linux systems"),
      skill("edge-deployment", "边缘端部署", "Edge deployment"),
      skill("serial", "串口通信", "Serial communication"),
      skill("usb", "USB 总线协议（USB 3.2）", "USB bus protocols (USB 3.2)"),
      skill("rfid", "RFID 射频系统（134.2kHz）", "RFID systems (134.2 kHz)"),
      skill("analog-digital", "模数电路调试", "Analog and digital circuit debugging"),
      skill("device-assembly", "装置整机搭建", "Full-device assembly and commissioning"),
      skill("mechanical-design", "机械结构设计", "Mechanical structure design"),
      skill("ip-enclosure", "工业级硬件防水封装", "Industrial-grade waterproof enclosure"),
      skill("autocad", "AutoCAD 结构设计", "AutoCAD structure design"),
      skill("office", "Office 套件", "Microsoft Office suite"),
    ],
  },
  {
    id: "research-directions",
    label: { zh: "研究方向", en: "Research Directions" },
    note: {
      zh: "以计算机视觉与个体重识别为主线的方法与任务积累",
      en: "Methods and tasks centred on computer vision and individual re-identification",
    },
    ...publicVerified,
    sourceId: "profile-skills-research-directions",
    groups: [
      {
        id: "research-architectures",
        label: { zh: "网络架构", en: "Architectures" },
        items: [
          skill("cnn", "CNN", "CNN"),
          skill("transformer", "Transformer", "Transformer"),
          skill("clip", "CLIP 视觉语言模型", "CLIP vision-language models"),
        ],
      },
      {
        id: "research-tasks",
        label: { zh: "任务方向", en: "Task Areas" },
        items: [
          skill("reid", "个体重识别（ReID）", "Individual re-identification (ReID)"),
          skill("open-set", "开放集识别", "Open-set recognition"),
          skill("feature-compression", "特征压缩", "Feature compression"),
          skill("classification", "图像分类", "Image classification"),
        ],
      },
    ],
    items: [
      skill("cnn", "CNN", "CNN"),
      skill("transformer", "Transformer", "Transformer"),
      skill("clip", "CLIP 视觉语言模型", "CLIP vision-language models"),
      skill("reid", "个体重识别（ReID）", "Individual re-identification (ReID)"),
      skill("open-set", "开放集识别", "Open-set recognition"),
      skill("feature-compression", "特征压缩", "Feature compression"),
      skill("classification", "图像分类", "Image classification"),
    ],
  },
];
