// 使用相对路径而非 @/ 别名：profile 数据层需要能被 Node 校验脚本直接加载
import type { Project } from "./types";
import {
  projectOneDocuments,
  projectThreeDocuments,
  projectTwoDocuments,
} from "./projectMedia.ts";

/**
 * 核心项目经历，按重要性排序（数组顺序即展示顺序）。
 *
 * 事实原则：所有指标均来自本人确认的实验记录与论文草稿；
 * 未达成的结论不得写入 result，性能边界在 metrics 中如实呈现。
 */
export const projects: Project[] = [
  {
    id: "fish-reid-open-world",
    slug: "fish-reid-open-world",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-fish-reid",
    title: {
      zh: "基于视觉语言先验的开放世界鱼类个体重识别研究",
      en: "Open-World Fish Individual Re-Identification via Vision-Language Priors",
    },
    subtitle: {
      zh: "以 CLIP-ReID 为基座，做特征压缩与开放集拒识一体化设计",
      en: "Feature compression and open-set rejection unified on a CLIP-ReID backbone",
    },
    role: { zh: "核心研发", en: "Core R&D" },
    featured: true,
    startDate: "2025.03",
    endDate: "至今",
    situation: {
      zh: "水产养殖场景下需要长期追踪鱼类个体，但个体外观差异细微、水下成像质量波动大，且实际部署中新个体与未注册个体持续出现，闭集识别假设不成立。",
      en: "Long-term tracking of individual fish in aquaculture is difficult: inter-individual appearance differences are subtle, underwater image quality fluctuates, and in real deployment new and unregistered individuals appear continuously — so a closed-set recognition assumption does not hold.",
    },
    task: {
      zh: "在视觉语言先验基础上构建一套既能识别已知身份、又能拒绝未知个体的开放世界识别方法，并把模型压缩到可部署规模。",
      en: "Build an open-world recognition method on vision-language priors that both identifies known identities and rejects unknown ones, while compressing the model to a deployable size.",
    },
    action: {
      zh: "基于 CLIP-ReID 设计 Compact256 投影层，将特征维度压缩至 1/5；提出 QACM 质量感知身份原型机制，把图像质量估计融入身份原型建模，实现已知识别与未知拒识一体化；构建覆盖 92 个身份、万余张图像的鱼类个体数据集，并完成闭集评测与部署级开放集评测。",
      en: "Designed a Compact256 projection layer on the CLIP-ReID backbone to compress feature dimensionality by 5×; proposed a Quality-Aware Identity Prototype Mechanism (QACM) that folds image-quality estimation into identity prototype modelling, unifying known-identity recognition and unknown-identity rejection; built a fish individual dataset covering 92 identities and over ten thousand images, then ran both closed-set and deployment-level open-set evaluations.",
    },
    result: {
      zh: "闭集 Rank-1 达到 76.3%；部署级测试中 FAR 6.91%、AUROC 0.7108；研究成果写入论文，并集成 Web 原型系统用于交互式验证。",
      en: "Reached 76.3% closed-set Rank-1; deployment-level evaluation gave FAR 6.91% and AUROC 0.7108. The results were written into a paper and integrated into a web prototype for interactive validation.",
    },
    coreSkill: ["Python", "PyTorch", "CLIP", "ReID", "Open-Set Recognition", "特征压缩"],
    techTags: ["PyTorch", "CLIP-ReID", "特征压缩", "开放集识别", "论文成果"],
    highlights: [
      { zh: "Compact256 投影层实现 5 倍维度压缩", en: "Compact256 projection layer: 5× dimensionality compression" },
      { zh: "QACM 实现已知识别与未知拒识一体化", en: "QACM unifies known-ID recognition with unknown rejection" },
      { zh: "自建 92 身份、万余张图像数据集", en: "Self-built dataset: 92 identities, 10k+ images" },
    ],
    metrics: [
      { zh: "闭集 Rank-1 76.3%", en: "Closed-set Rank-1 76.3%" },
      { zh: "部署级 FAR 6.91%", en: "Deployment-level FAR 6.91%" },
      { zh: "AUROC 0.7108", en: "AUROC 0.7108" },
      { zh: "特征维度压缩 5×", en: "5× feature compression" },
    ],
    interviewFocus: [
      {
        zh: "为什么用 CLIP 的视觉语言先验做 ReID，而不是纯视觉度量学习？",
        en: "Why use CLIP vision-language priors for ReID rather than purely visual metric learning?",
      },
      {
        zh: "Compact256 投影层如何在压缩 5 倍维度的同时保持检索精度？",
        en: "How does the Compact256 projection layer preserve retrieval accuracy at 5× compression?",
      },
      {
        zh: "QACM 的质量估计具体如何参与身份原型建模？",
        en: "How exactly does QACM's quality estimate participate in identity prototype modelling?",
      },
      {
        zh: "开放集场景下 AUROC 0.7108 说明什么？哪些因素仍然是瓶颈？",
        en: "What does AUROC 0.7108 tell us in the open-set setting, and which factors remain bottlenecks?",
      },
    ],
    images: [
      {
        id: "p1-fig-1-framework",
        src: "/images/projects/project-1/fig-1-framework.jpg",
        caption: {
          zh: "图1 算法整体框架图",
          en: "Fig. 1 Overall algorithm framework",
        },
        alt: {
          zh: "算法整体框架图",
          en: "Overall algorithm framework diagram",
        },
      },
    ],
    documents: projectOneDocuments,
    isInteractive: false,
  },
  {
    id: "rfid-multiview-acquisition",
    slug: "rfid-multiview-acquisition",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-rfid-acquisition",
    title: {
      zh: "RFID 与多目视觉双模态鱼类识别数据采集装置",
      en: "RFID and Multi-View Vision Dual-Modality Fish Data Acquisition Device",
    },
    subtitle: {
      zh: "从过鱼通道结构设计到多线程同步采集程序的整机工程实现",
      en: "Full-device engineering: from the fish passage structure to multi-threaded synchronized acquisition software",
    },
    role: { zh: "项目负责人", en: "Project Lead" },
    featured: true,
    startDate: "2025.06",
    endDate: "2026.09",
    situation: {
      zh: "双模态鱼类识别研究需要同一时刻的标签与多视角图像，但人工拍摄与标注无法保证 ID 与图像严格对应，数据一致性差、采集效率低。",
      en: "Dual-modality fish recognition research needs labels and multi-view images captured at the same instant, but manual shooting and annotation cannot guarantee a strict ID-to-image correspondence — data consistency was poor and throughput low.",
    },
    task: {
      zh: "负责整机方案设计与落地，实现 RFID 标签触发下的多机位同步采集，并让数据按个体 ID 自动归档。",
      en: "Own the design and delivery of the complete device: RFID-triggered multi-camera synchronized capture, with data automatically archived per individual ID.",
    },
    action: {
      zh: "设计跨壁式倒 U 型 UPVC 过鱼通道，集成 134.2kHz RFID 读写单元与 3 路全局快门视觉单元；基于 Python 开发多线程同步采集程序，实现 RFID 触发录像、三机位同步与数据按 ID 自动归档；通过 USB3.2 解决多路视频流的带宽瓶颈，并沉淀完整的工程化搭建与操作规范。",
      en: "Designed a cross-wall inverted-U UPVC fish passage integrating a 134.2 kHz RFID reader unit and three global-shutter vision units; wrote a multi-threaded Python acquisition program delivering RFID-triggered recording, three-camera synchronization, and automatic per-ID data archiving; resolved the multi-stream bandwidth bottleneck via USB 3.2 and documented a complete engineering build-and-operation standard.",
    },
    result: {
      zh: "3 路 25fps 视频稳定采集，采集与标注效率较人工方式提升 80%；形成可复用的工程化搭建与操作规范，支撑后续数据集生产。",
      en: "Three 25 fps video streams are captured stably, and acquisition-plus-annotation efficiency improved by 80% over the manual workflow. A reusable engineering build-and-operation standard now supports downstream dataset production.",
    },
    coreSkill: ["嵌入式系统", "RFID", "全局快门相机", "Python 多线程", "USB 3.2", "UPVC 结构设计"],
    techTags: ["Python", "多线程", "RFID", "机器视觉", "嵌入式系统", "硬件搭建"],
    highlights: [
      { zh: "RFID 触发 + 三机位同步采集", en: "RFID-triggered, three-camera synchronized capture" },
      { zh: "数据按个体 ID 自动归档", en: "Automatic per-ID data archiving" },
      { zh: "效率较人工标注提升 80%", en: "80% efficiency gain over manual annotation" },
    ],
    metrics: [
      { zh: "3 路 25fps 稳定采集", en: "3× 25 fps stable capture" },
      { zh: "134.2kHz RFID 集成", en: "134.2 kHz RFID integration" },
      { zh: "采集效率提升 80%", en: "80% acquisition efficiency gain" },
    ],
    interviewFocus: [
      {
        zh: "跨壁式倒 U 型过鱼通道的结构约束是如何确定的？鱼体通过姿态如何影响成像？",
        en: "How were the structural constraints of the cross-wall inverted-U fish passage determined, and how does passage posture affect imaging?",
      },
      {
        zh: "多线程同步采集程序如何保证三机位的时间对齐？同步误差来源有哪些？",
        en: "How does the multi-threaded program guarantee temporal alignment across three cameras, and what are the sources of synchronization error?",
      },
      {
        zh: "USB3.2 带宽瓶颈的具体表现是什么？如何评估带宽余量？",
        en: "How did the USB 3.2 bandwidth bottleneck manifest, and how is bandwidth headroom assessed?",
      },
      {
        zh: "采集与标注效率提升 80% 的统计口径是什么？",
        en: "What is the measurement basis for the 80% efficiency improvement?",
      },
    ],
    images: [
      {
        id: "p2-device-1-overview",
        src: "/images/projects/project-2/device-1-overview.jpg",
        caption: {
          zh: "图1 个体识别采集装置整体实拍",
          en: "Fig. 1 Overall photo of the individual-identification acquisition device",
        },
        alt: {
          zh: "数据采集装置整体实拍",
          en: "Overall photo of the acquisition device",
        },
      },
      {
        id: "p2-device-2-software",
        src: "/images/projects/project-2/device-2-software.jpg",
        caption: {
          zh: "图2 RFID读卡模块上位机测试界面",
          en: "Fig. 2 Host-computer test interface of the RFID reader module",
        },
        alt: {
          zh: "RFID 读卡模块上位机测试界面",
          en: "Host-computer test interface of the RFID reader module",
        },
      },
      {
        id: "p2-device-3-cad",
        src: "/images/projects/project-2/device-3-cad.jpg",
        caption: {
          zh: "图3 天线外壳3D结构设计图",
          en: "Fig. 3 3D structural design of the antenna housing",
        },
        alt: {
          zh: "天线外壳 3D 结构设计图",
          en: "3D structural design of the antenna housing",
        },
      },
      {
        id: "p2-device-4-side",
        src: "/images/projects/project-2/device-4-side.jpg",
        caption: {
          zh: "图4 通道侧视采集画面",
          en: "Fig. 4 Side-view capture frame of the passage",
        },
        alt: {
          zh: "通道侧视采集画面",
          en: "Side-view capture frame of the passage",
        },
      },
      {
        id: "p2-device-5-top",
        src: "/images/projects/project-2/device-5-top.jpg",
        caption: {
          zh: "图5 通道俯视采集画面",
          en: "Fig. 5 Top-view capture frame of the passage",
        },
        alt: {
          zh: "通道俯视采集画面",
          en: "Top-view capture frame of the passage",
        },
      },
      {
        id: "p2-device-6-front",
        src: "/images/projects/project-2/device-6-front.jpg",
        caption: {
          zh: "图6 通道正视采集画面",
          en: "Fig. 6 Front-view capture frame of the passage",
        },
        alt: {
          zh: "通道正视采集画面",
          en: "Front-view capture frame of the passage",
        },
      },
    ],
    documents: projectTwoDocuments,
    isInteractive: false,
  },
  {
    id: "grouper-tagging-standard",
    slug: "grouper-tagging-standard",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-grouper-tagging",
    title: {
      zh: "东星斑个体标记方法筛选与标准化体系建立",
      en: "Screening and Standardization of Individual Tagging Methods for Leopard Coral Grouper",
    },
    subtitle: {
      zh: "多方案对照实验驱动的标记工艺标准化与选型指南",
      en: "A controlled multi-method experiment driving tagging standardization and selection guidance",
    },
    role: { zh: "实验负责人", en: "Experiment Lead" },
    featured: true,
    startDate: "2025.12",
    endDate: "2026.08",
    situation: {
      zh: "东星斑个体标记缺乏统一工艺标准，不同规格鱼体在芯片植入与体外标记下的存活率与标记保持率差异明显，实验结果难以横向比较。",
      en: "Individual tagging of leopard coral grouper lacked a unified process standard: survival and tag-retention rates varied markedly across fish sizes and between chip implantation and external marking, making results hard to compare.",
    },
    task: {
      zh: "通过多方案对照实验筛选适用标记方法，建立标准化操作与术后养护流程，并输出不同规格鱼体的标记方案选型指南。",
      en: "Screen applicable tagging methods through controlled multi-method experiments, establish standardized operating and post-operative care procedures, and produce selection guidance by fish size.",
    },
    action: {
      zh: "设计多方案对照实验，完成百余尾不同规格鱼体的全流程验证；建立标准化芯片植入操作与术后养护流程；对比背部注射标记等不同方案在不同规格鱼体上的存活与保持表现，并整理成选型依据。",
      en: "Designed controlled multi-method experiments and ran the full workflow on over one hundred fish across different size classes; established a standardized chip implantation and post-operative care procedure; compared dorsal injection marking and other approaches for survival and retention across size classes, and consolidated the results into selection criteria.",
    },
    result: {
      zh: "成鱼背部注射标记存活率提升至 80%；形成不同规格鱼体的标记方案选型指南，为后续个体识别数据集建设提供稳定的标记基础。",
      en: "Dorsal injection marking survival for adult fish improved to 80%; a tagging-method selection guide by fish size class was produced, providing a stable marking basis for subsequent individual-recognition dataset construction.",
    },
    coreSkill: ["实验设计", "对照实验", "标准化流程", "动物标记技术", "数据整理"],
    techTags: ["对照实验", "SOP标准化", "工程落地"],
    highlights: [
      { zh: "百余尾多规格鱼体全流程验证", en: "100+ fish across size classes, full-workflow validation" },
      { zh: "成鱼背部注射标记存活率提升至 80%", en: "Adult dorsal injection survival raised to 80%" },
      { zh: "形成分规格标记方案选型指南", en: "Size-class tagging selection guide established" },
    ],
    metrics: [
      { zh: "成鱼存活率 80%", en: "Adult survival rate 80%" },
      { zh: "百余尾鱼体全流程验证", en: "100+ fish validated end to end" },
      { zh: "标准化操作与养护流程", en: "Standardized operating and care procedure" },
    ],
    interviewFocus: [
      {
        zh: "对照实验的分组与样本量是如何确定的？如何处理个体差异带来的干扰？",
        en: "How were the experiment groups and sample sizes determined, and how was individual variation controlled?",
      },
      {
        zh: "存活率 80% 的统计样本与观测周期是怎样的？",
        en: "What sample and observation window underlie the 80% survival figure?",
      },
      {
        zh: "为什么不同规格鱼体需要不同的标记方案？关键约束是什么？",
        en: "Why do different size classes need different tagging methods, and what are the key constraints?",
      },
    ],
    images: [
      {
        id: "p3-exp-1-anesthesia",
        src: "/images/projects/project-3/exp-1-anesthesia.jpg",
        caption: {
          zh: "图1 MS-222麻醉镇静操作",
          en: "Fig. 1 MS-222 anaesthesia and sedation procedure",
        },
        alt: {
          zh: "MS-222 麻醉镇静操作",
          en: "MS-222 anaesthesia and sedation procedure",
        },
      },
      {
        id: "p3-exp-2-implant",
        src: "/images/projects/project-3/exp-2-implant.jpg",
        caption: {
          zh: "图2 背部肌肉芯片植入",
          en: "Fig. 2 Chip implantation into the dorsal muscle",
        },
        alt: {
          zh: "背部肌肉芯片植入",
          en: "Chip implantation into the dorsal muscle",
        },
      },
      {
        id: "p3-exp-3-disinfect",
        src: "/images/projects/project-3/exp-3-disinfect.jpg",
        caption: {
          zh: "图3 碘伏伤口消毒",
          en: "Fig. 3 Wound disinfection with iodophor",
        },
        alt: {
          zh: "碘伏伤口消毒",
          en: "Wound disinfection with iodophor",
        },
      },
      {
        id: "p3-exp-4-sealant",
        src: "/images/projects/project-3/exp-4-sealant.jpg",
        caption: {
          zh: "图4 组织胶水封闭针口",
          en: "Fig. 4 Sealing the needle site with tissue adhesive",
        },
        alt: {
          zh: "组织胶水封闭针口",
          en: "Sealing the needle site with tissue adhesive",
        },
      },
      {
        id: "p3-exp-5-record",
        src: "/images/projects/project-3/exp-5-record.jpg",
        caption: {
          zh: "图5 芯片编号身份记录",
          en: "Fig. 5 Recording identity against the chip number",
        },
        alt: {
          zh: "芯片编号身份记录",
          en: "Recording identity against the chip number",
        },
      },
      {
        id: "p3-exp-6-recovery",
        src: "/images/projects/project-3/exp-6-recovery.jpg",
        caption: {
          zh: "图6 水下充氧复苏养护",
          en: "Fig. 6 Oxygenated underwater recovery and aftercare",
        },
        alt: {
          zh: "水下充氧复苏养护",
          en: "Oxygenated underwater recovery and aftercare",
        },
      },
    ],
    documents: projectThreeDocuments,
    isInteractive: false,
  },
];

/**
 * 排序规则：精选优先；同优先级按开始时间倒序，保证新增项目时展示顺序稳定。
 */
export function sortProjects(projectEntries: readonly Project[]): Project[] {
  return [...projectEntries].sort((first, second) => {
    if (first.featured && !second.featured) return -1;
    if (!first.featured && second.featured) return 1;
    return second.startDate.localeCompare(first.startDate);
  });
}

export function findProjectBySlug(
  projectEntries: readonly Project[],
  slug: string
): Project | null {
  return projectEntries.find((project) => project.slug === slug) ?? null;
}

/**
 * 卡片/详情页使用的技术标签：优先使用为展示准备的 techTags，
 * 为空时回退到简历上的 coreSkill，保证任何项目都有标签可渲染。
 */
export function getProjectTechTags(project: Project): string[] {
  return project.techTags.length > 0 ? project.techTags : project.coreSkill;
}
