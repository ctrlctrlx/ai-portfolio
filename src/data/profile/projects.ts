// 使用相对路径而非 @/ 别名：profile 数据层需要能被 Node 校验脚本直接加载
import type { BilingualText, Project } from "./types";
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
    id: "personal-portfolio-website",
    slug: "personal-portfolio-website",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-personal-portfolio-website",
    title: {
      zh: "基于 Next.js 的个人技术作品集网站",
      en: "Personal Technical Portfolio Website Based on Next.js",
    },
    subtitle: {
      zh: "独立开发的双语技术作品集：全域 SSG 静态预渲染 + Vercel 自动化部署",
      en: "A self-built bilingual portfolio: full-site SSG static pre-rendering with automated Vercel deployment",
    },
    role: { zh: "独立开发者 / 全栈开发", en: "Solo Developer / Full-Stack" },
    featured: true,
    startDate: "2026.08",
    endDate: { zh: "2026.09", en: "2026.09" },
    situation: {
      zh: "计算机视觉方向的科研项目、模型实验结果、学术论文与求职简历信息缺少统一的在线展示入口，面试官只能通过静态简历了解研究内容与工程实践。",
      en: "Research projects, model experiment results, academic papers and resume information in computer vision lacked a single online showcase — interviewers could only learn about the research and engineering work from a static resume.",
    },
    task: {
      zh: "独立开发一个基于 Next.js 的个人技术作品集网站，搭建项目图文展示模块、实现全响应式页面，并完成公网部署供面试官在线查看。",
      en: "Independently build a Next.js-based personal technical portfolio: project display modules, fully responsive pages, and a public deployment that interviewers can browse online.",
    },
    action: {
      zh: "以 Next.js + TypeScript + Tailwind CSS 实现前端与内容结构，用 Git 做版本管理并接入 Vercel 自动化部署流水线；搭建项目图文展示模块与图片灯箱画廊，通过 SSG 静态预渲染与 CDN 缓存优化首屏性能，并用 MDX 维护技术文章。",
      en: "Built the front end and content structure with Next.js, TypeScript and Tailwind CSS; managed the source with Git and wired an automated Vercel deployment pipeline; implemented project display modules and an image lightbox gallery, optimised first-screen performance with SSG static pre-rendering and CDN caching, and maintained technical articles in MDX.",
    },
    result: {
      zh: "完成网站公网部署，全域静态预渲染（SSG）并支持 CDN 缓存，首屏加载性能提升 60%+；搭建科研成果展示体系，可视化呈现鱼个体重识别项目的实验数据、流程图与核心指标；实现 GitHub + Vercel 自动化部署，代码提交后自动完成发布，上线周期缩短至 2 分钟；作为线上求职作品集替代传统静态简历。",
      en: "Delivered the public deployment with full-site SSG static pre-rendering and CDN caching, improving first-screen loading performance by over 60%; built a research showcase that visualises experiment data, flowcharts and key metrics of the fish individual re-identification projects; implemented a GitHub + Vercel automated deployment pipeline that releases after each commit, cutting the launch cycle to 2 minutes; and now serves as the online job portfolio in place of a traditional static resume.",
    },
    coreSkill: [
      { zh: "Next.js", en: "Next.js" },
      { zh: "TypeScript", en: "TypeScript" },
      { zh: "Tailwind CSS", en: "Tailwind CSS" },
      { zh: "Vercel", en: "Vercel" },
      { zh: "Git", en: "Git" },
      { zh: "MDX", en: "MDX" },
    ],
    techTags: [
      { zh: "Next.js", en: "Next.js" },
      { zh: "TypeScript", en: "TypeScript" },
      { zh: "Tailwind CSS", en: "Tailwind CSS" },
      { zh: "Vercel", en: "Vercel" },
      { zh: "Git", en: "Git" },
      { zh: "SSG", en: "SSG" },
      { zh: "响应式设计", en: "Responsive Design" },
      { zh: "MDX", en: "MDX" },
    ],
    /**
     * 该项目属于 Web 工程技术实践，沿用站内既有研究方向标签体系中最贴近的一项
     * （作品集本身用于承载并展示计算机视觉方向的研究成果）。
     */
    researchDirections: ["computer-vision"],
    highlights: [
      {
        zh: "完成网站公网部署，全域静态预渲染（SSG），支持 CDN 缓存，首屏加载性能提升 60%+",
        en: "Completed public deployment with full-site SSG static pre-rendering and CDN caching, improving first-screen loading performance by over 60%",
      },
      {
        zh: "搭建科研成果展示体系，可视化呈现鱼个体重识别项目实验数据、流程图与核心指标",
        en: "Built a research showcase visualising experiment data, flowcharts and key metrics of the fish individual re-identification projects",
      },
      {
        zh: "实现 GitHub + Vercel 自动化部署流水线，代码提交后自动完成校验与发布，上线周期缩短至 2 分钟",
        en: "Implemented a GitHub + Vercel automated CI/CD pipeline — automatic verification and release after each commit, cutting the launch cycle to 2 minutes",
      },
      {
        zh: "作为线上求职作品集，在面试中直观展示 CV 项目成果，替代传统静态简历",
        en: "Serves as an online job portfolio that presents CV project achievements directly in interviews, replacing a traditional static resume",
      },
    ],
    metrics: [
      { zh: "首屏加载性能提升 60%+", en: "60%+ faster first-screen loading" },
      { zh: "上线周期缩短至 2 分钟", en: "Launch cycle cut to 2 minutes" },
      { zh: "全域静态预渲染（SSG）+ CDN 缓存", en: "Full-site SSG with CDN caching" },
    ],
    /**
     * 项目展示图：首页 / 项目页 / 简历页三张实拍截图，中英文共用同一份图片资源。
     * 首图（首页截图）同时作为列表与首页卡片的封面图。
     */
    images: [
      {
        id: "p4-ui-1-home",
        src: "/images/projects/personal-portfolio-website/personal-portfolio-website-home.jpg",
        caption: {
          zh: "图1 作品集首页（首屏自我介绍与代表项目）",
          en: "Fig.1 Portfolio home page (hero introduction and featured projects)",
        },
        alt: {
          zh: "作品集网站首页截图：首屏展示姓名、求职定位、学历信息、研究方向标签与代表项目卡片",
          en: "Screenshot of the portfolio home page: hero section with name, target roles, education, research direction tags and featured project cards",
        },
      },
      {
        id: "p4-ui-2-projects",
        src: "/images/projects/personal-portfolio-website/personal-portfolio-website-projects.jpg",
        caption: {
          zh: "图2 项目经历页（STAR 叙述与核心量化数据）",
          en: "Fig.2 Projects page (STAR narrative and key quantitative results)",
        },
        alt: {
          zh: "项目经历页截图：项目卡片以 STAR 结构叙述并前置核心量化指标与技术标签",
          en: "Screenshot of the projects page: project cards with STAR narratives, key quantitative metrics and technology tags",
        },
      },
      {
        id: "p4-ui-3-resume",
        src: "/images/projects/personal-portfolio-website/personal-portfolio-website-resume.jpg",
        caption: {
          zh: "图3 在线简历页（教育 / 项目 / 技能 / 荣誉 / 专利）",
          en: "Fig.3 Online resume page (education, projects, skills, honors, patent)",
        },
        alt: {
          zh: "在线公开简历页截图：包含教育经历、项目经历、核心技能、荣誉奖项与专利板块",
          en: "Screenshot of the online public resume page: education, projects, core skills, honors and patent sections",
        },
      },
    ],
    /** 项目本身即为本站，暂不提供对外下载文档 */
    documents: [],
    isInteractive: false,
  },
  {
    id: "fish-reid-open-world",
    slug: "fish-reid-open-world",
    visibility: "public",
    verificationStatus: "verified",
    sourceId: "profile-project-fish-reid",
    title: {
      zh: "基于视觉语言先验的开放世界东星斑个体重识别研究",
      en: "Open-World Crimson Snapper Individual Re-Identification via Vision-Language Priors",
    },
    subtitle: {
      zh: "以 CLIP-ReID 为基座，做特征压缩与开放集拒识一体化设计；身份错误率优化27%，达成单鱼阶段工程冻结标准",
      en: "Feature compression and open-set rejection unified on a CLIP-ReID backbone; identity error rate improved by 27%, meeting the single-fish engineering freeze standard",
    },
    role: { zh: "核心研发", en: "Core R&D" },
    featured: true,
    startDate: "2025.03",
    endDate: { zh: "至今", en: "Present" },
    situation: {
      zh: "水产养殖场景下需要长期追踪东星斑个体，但个体外观差异细微、水下成像质量波动大，且实际部署中新个体与未注册个体持续出现，闭集识别假设不成立。",
      en: "Long-term tracking of individual crimson snapper in aquaculture is difficult: inter-individual appearance differences are subtle, underwater image quality fluctuates, and in real deployment new and unregistered individuals appear continuously — so a closed-set recognition assumption does not hold.",
    },
    task: {
      zh: "在视觉语言先验基础上构建一套既能识别已知身份、又能拒绝未知个体的开放世界识别方法，并把模型压缩到可部署规模。",
      en: "Build an open-world recognition method on vision-language priors that both identifies known identities and rejects unknown ones, while compressing the model to a deployable size.",
    },
    action: {
      zh: "基于 CLIP-ReID 设计 Compact256 投影层，将特征维度压缩至 1/5；提出 QACM 质量感知身份原型机制，把图像质量估计融入身份原型建模，实现已知识别与未知拒识一体化；构建覆盖 92 个身份、万余张图像的东星斑个体数据集，并完成闭集评测与部署级开放集评测。",
      en: "Designed a Compact256 projection layer on the CLIP-ReID backbone to compress feature dimensionality by 5×; proposed a Quality-Aware Identity Prototype Mechanism (QACM) that folds image-quality estimation into identity prototype modelling, unifying known-identity recognition and unknown-identity rejection; built a crimson snapper individual dataset covering 92 identities and over ten thousand images, then ran both closed-set and deployment-level open-set evaluations.",
    },
    /**
     * 结果段落：精简为两段（核心机制 → 工程价值）。
     * 空行分段，**…** 为页面加粗标记（RichText 渲染，问答层会剥离标记）。
     * 量化指标统一收敛到 metrics 模块，本段不再重复展开学术讨论。
     */
    result: {
      zh: "本项目构建了面向开放世界鱼类个体识别的单鱼视频运行时系统，围绕轨迹级身份生命周期管理，通过Fast Warm-up、确认后身份保持、动态置信度更新等五大核心机制，解决了轨迹断裂、帧质量波动、身份冲突等场景下的稳定识别问题。\n\n系统V3.1.1已达到单鱼阶段工程冻结标准，可输出稳定、可审计的身份结果，为后续多鱼场景的主动身份管理、多轨迹冲突处理提供可复用技术基线。",
      en: "This project delivers a single-fish video runtime system for open-world fish individual re-identification. Centred on track-level identity lifecycle management, five core mechanisms — including Fast Warm-up, post-confirmation identity retention, and dynamic confidence updating — solve stable recognition under track breaks, frame-quality fluctuation, and identity conflicts.\n\nSystem V3.1.1 meets the single-fish engineering freeze standard: it outputs stable, auditable identity results and provides a reusable technical baseline for active identity management and multi-track conflict handling in future multi-fish scenarios.",
    },
    coreSkill: [
      { zh: "Python", en: "Python" },
      { zh: "PyTorch", en: "PyTorch" },
      { zh: "CLIP", en: "CLIP" },
      { zh: "ReID", en: "ReID" },
      { zh: "Open-Set Recognition", en: "Open-Set Recognition" },
      { zh: "特征压缩", en: "Feature Compression" },
    ],
    techTags: [
      { zh: "PyTorch", en: "PyTorch" },
      { zh: "CLIP-ReID", en: "CLIP-ReID" },
      { zh: "特征压缩", en: "Feature Compression" },
      { zh: "开放集识别", en: "Open-Set Recognition" },
      { zh: "论文成果", en: "Research Publication" },
    ],
    researchDirections: ["computer-vision", "reid", "vision-language"],
    highlights: [
      { zh: "Compact256 投影层实现 5 倍维度压缩", en: "Compact256 projection layer: 5× dimensionality compression" },
      { zh: "QACM 实现已知识别与未知拒识一体化", en: "QACM unifies known-ID recognition with unknown rejection" },
      { zh: "自建 92 身份、万余张图像数据集", en: "Self-built dataset: 92 identities, 10k+ images" },
    ],
    /**
     * 核心量化数据：本模块只保留部署级与 dev70 运营口径指标（数值保持原值）。
     * 闭集/论文口径指标与后续迭代类描述均已按要求整条移除，
     * 数值、变量与注释均不在代码中残留。
     */
    metrics: [
      { zh: "部署级 FAR 6.91%", en: "Deployment-level FAR 6.91%" },
      { zh: "特征维度压缩 5×", en: "5× feature compression" },
      { zh: "dev70 已知个体错误率 20.10% → 14.65%（相对优化 27%）", en: "dev70 known-identity error rate 20.10% → 14.65% (27% relative improvement)" },
      { zh: "dev70 未知鱼误接收率 25.90% → 20.75%（相对优化 20%）", en: "dev70 unknown-fish false acceptance 25.90% → 20.75% (20% relative improvement)" },
    ],
    /**
     * 项目展示图：界面图在前（视频识别 → 鱼档案 → 新个体注册），算法框架图收尾。
     * 界面截图存放于 /images/projects/open-world-reid/，中英文共用同一份图片资源。
     */
    images: [
      {
        id: "p1-ui-1-video-inference",
        src: "/images/projects/open-world-reid/open-world-reid-video-inference.jpg",
        caption: {
          zh: "图1 视频识别实时检测界面",
          en: "Fig.1 Real-time Video Recognition Interface",
        },
        alt: {
          zh: "Web 视频识别界面实时检测画面：东星斑被绿色检测框标注为 ID 3，置信度 1.0",
          en: "Real-time detection view in the web video recognition interface: a crimson snapper marked with a green bounding box labelled ID 3 at confidence 1.0",
        },
      },
      {
        id: "p1-ui-2-fish-registry",
        src: "/images/projects/open-world-reid/open-world-reid-fish-registry.jpg",
        caption: {
          zh: "图2 鱼个体档案管理列表",
          en: "Fig.2 Fish Individual Registry List",
        },
        alt: {
          zh: "鱼个体档案管理列表界面：已登记 80 条个体记录，列出 Fish ID、名称别名、来源、登记状态、Prototype 状态与更新时间",
          en: "Fish individual registry list interface: 80 registered records listing Fish ID, name or alias, source, registration status, prototype status, and update time",
        },
      },
      {
        id: "p1-ui-3-enrollment",
        src: "/images/projects/open-world-reid/open-world-reid-enrollment.jpg",
        caption: {
          zh: "图3 新个体注册审核界面",
          en: "Fig.3 New Individual Enrollment Interface",
        },
        alt: {
          zh: "新个体注册审核界面：待审 Candidate 列表含状态、样本数与正常纳入进度，并提示下一个可用 Dynamic ID",
          en: "New individual enrollment review interface: candidate list with status, sample counts and acceptance progress, plus the next available Dynamic ID",
        },
      },
      {
        id: "p1-fig-4-framework",
        src: "/images/projects/project-1/fig-1-framework.jpg",
        caption: {
          zh: "图4 算法整体框架图",
          en: "Fig.4 Overall algorithm framework",
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
      zh: "RFID 与多目视觉双模态东星斑识别数据采集装置",
      en: "RFID and Multi-View Vision Dual-Modality Crimson Snapper Data Acquisition Device",
    },
    subtitle: {
      zh: "从过鱼通道结构设计到多线程同步采集程序的整机工程实现",
      en: "Full-device engineering: from the fish passage structure to multi-threaded synchronized acquisition software",
    },
    role: { zh: "项目负责人", en: "Project Lead" },
    featured: true,
    startDate: "2025.06",
    endDate: { zh: "2026.09", en: "2026.09" },
    situation: {
      zh: "双模态东星斑识别研究需要同一时刻的标签与多视角图像，但人工拍摄与标注无法保证 ID 与图像严格对应，数据一致性差、采集效率低。",
      en: "Dual-modality crimson snapper recognition research needs labels and multi-view images captured at the same instant, but manual shooting and annotation cannot guarantee a strict ID-to-image correspondence — data consistency was poor and throughput low.",
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
    coreSkill: [
      { zh: "嵌入式系统", en: "Embedded Systems" },
      { zh: "RFID", en: "RFID" },
      { zh: "全局快门相机", en: "Global Shutter Cameras" },
      { zh: "Python 多线程", en: "Python Multithreading" },
      { zh: "USB 3.2", en: "USB 3.2" },
      { zh: "UPVC 结构设计", en: "UPVC Structural Design" },
    ],
    techTags: [
      { zh: "Python", en: "Python" },
      { zh: "多线程", en: "Multithreading" },
      { zh: "RFID", en: "RFID" },
      { zh: "机器视觉", en: "Machine Vision" },
      { zh: "嵌入式系统", en: "Embedded Systems" },
      { zh: "硬件搭建", en: "Hardware Assembly" },
      { zh: "AutoCAD", en: "AutoCAD" },
    ],
    researchDirections: ["computer-vision", "embedded-sensing"],
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
          zh: "图3 天线外壳CAD结构设计图",
          en: "Fig. 3 CAD Structural Design of Antenna Housing",
        },
        alt: {
          zh: "天线外壳 CAD 结构设计图",
          en: "CAD structural design of the antenna housing",
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
      en: "Screening and Standardization of Individual Tagging Methods for Crimson Snapper",
    },
    subtitle: {
      zh: "多方案对照实验驱动的标记工艺标准化与选型指南",
      en: "A controlled multi-method experiment driving tagging standardization and selection guidance",
    },
    role: { zh: "实验负责人", en: "Experiment Lead" },
    featured: true,
    startDate: "2025.12",
    endDate: { zh: "2026.08", en: "2026.08" },
    situation: {
      zh: "东星斑个体标记缺乏统一工艺标准，不同规格鱼体在芯片植入与体外标记下的存活率与标记保持率差异明显，实验结果难以横向比较。",
      en: "Individual tagging of crimson snapper lacked a unified process standard: survival and tag-retention rates varied markedly across fish sizes and between chip implantation and external marking, making results hard to compare.",
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
    coreSkill: [
      { zh: "实验设计", en: "Experimental Design" },
      { zh: "对照实验", en: "Control Experiment" },
      { zh: "标准化流程", en: "Standardized Workflow" },
      { zh: "动物标记技术", en: "Animal Tagging Techniques" },
      { zh: "数据整理", en: "Data Consolidation" },
    ],
    techTags: [
      { zh: "对照实验", en: "Control Experiment" },
      { zh: "SOP标准化", en: "SOP Standardization" },
      { zh: "工程落地", en: "Engineering Implementation" },
    ],
    researchDirections: ["embedded-sensing"],
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
 * 两者均为双语结构，调用方按当前 locale 取词。
 */
export function getProjectTechTags(project: Project): BilingualText[] {
  return project.techTags.length > 0 ? project.techTags : project.coreSkill;
}
