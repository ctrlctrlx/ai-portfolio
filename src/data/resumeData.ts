// =============================================================================
// Core Data Architecture — resumeData.ts
// Single source of truth for the entire portfolio site.
// All content is bilingual (zh / en). UI components consume this via locale key.
// =============================================================================

// ---------------------------------------------------------------------------
// 1. Shared primitives
// ---------------------------------------------------------------------------

/** Supported locale keys. Extend here when adding languages. */
export type Locale = "zh" | "en";

/** Generic bilingual string container. */
export interface BilingualString {
  zh: string;
  en: string;
}

// ---------------------------------------------------------------------------
// 2. PersonalInfo
// ---------------------------------------------------------------------------

export interface SocialLink {
  platform: string;       // e.g. "GitHub", "LinkedIn", "Email"
  url: string;
  icon?: string;          // lucide-react icon name or custom SVG key
}

export interface PersonalInfo {
  /** Full name — bilingual */
  name: BilingualString;
  /** One-liner shown below the name in Hero */
  tagline: BilingualString;
  /** Multi-sentence bio rendered in About section */
  bio: BilingualString;
  /** Public email address */
  email: string;
  /** Avatar: local path under /public or remote URL */
  avatar: string;
  /** City / Country shown in contact bar */
  location: BilingualString;
  /** Resume / CV PDF download path under /public */
  resumePdfUrl: string;
  socialLinks: SocialLink[];
}

// ---------------------------------------------------------------------------
// 3. Education
// ---------------------------------------------------------------------------

export interface Education {
  id: string;
  institution: BilingualString;
  degree: BilingualString;
  major: BilingualString;
  startDate: string;   // "YYYY-MM"
  endDate: string;     // "YYYY-MM" | "Present"
  gpa?: string;
  logoUrl?: string;
  highlights: BilingualString[];
}

// ---------------------------------------------------------------------------
// 4. Publication — with author-highlight mechanism
// ---------------------------------------------------------------------------

/**
 * One entry in the authors list.
 * Set `isHighlighted: true` for the portfolio owner so the UI can render
 * their name in bold / accent color automatically.
 */
export interface Author {
  name: string;           // e.g. "Yang X." or "杨晓明"
  isHighlighted?: boolean; // true  → render in accent color
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];            // ordered list; UI renders "A, B*, C, D"
  venue: BilingualString;       // journal / conference name
  year: number;
  doi?: string;
  arxivUrl?: string;
  pdfUrl?: string;
  /** Patent application number when applicable */
  patentNo?: string;
  type: "journal" | "conference" | "patent" | "preprint";
  /** Short abstract / contribution summary */
  abstract: BilingualString;
  tags: string[];
}

// ---------------------------------------------------------------------------
// 5. Project — deep interview corpus
// ---------------------------------------------------------------------------

/**
 * STAR-structured project entry.
 * Designed to feed the AI Agent's System Prompt as interview corpus.
 */
export interface Project {
  id: string;
  title: BilingualString;
  /** One-line summary rendered as card subtitle */
  subtitle: BilingualString;

  // --- STAR fields ---
  situation: BilingualString;
  task: BilingualString;
  action: BilingualString;
  result: BilingualString;

  /** Quantified outcomes — shown as highlight badges, e.g. "+5.2 mAP" */
  metrics: BilingualString[];

  // --- [⭐ Core] Interview corpus ---
  /** Tech stack tags rendered as a tag wall + fed to AI System Prompt */
  coreSkill: string[];
  /** Guided talking points for interviewers (shown as collapsible chips) */
  interviewFocus: BilingualString[];

  // --- [⭐ SaaS evolution reserved] ---
  /** Whether this project has a live interactive demo entry */
  isInteractive: boolean;
  /** URL of the live demo (active only when isInteractive === true) */
  liveDemoUrl?: string;

  // --- Media ---
  coverImage?: string;   // path under /public or remote URL
  githubUrl?: string;
  startDate: string;
  endDate: string;
  /** Pin to the top of the showcase */
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// 6. WorkExperience  (optional, reserved for future use)
// ---------------------------------------------------------------------------

export interface WorkExperience {
  id: string;
  company: BilingualString;
  role: BilingualString;
  startDate: string;
  endDate: string;
  description: BilingualString[];
  techStack: string[];
}

// ---------------------------------------------------------------------------
// 7. Root export shape
// ---------------------------------------------------------------------------

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  publications: Publication[];
  projects: Project[];
  workExperience: WorkExperience[];
}

// =============================================================================
// DUMMY DATA — replace with real content before production
// =============================================================================

export const resumeData: ResumeData = {
  // -------------------------------------------------------------------------
  // Personal Info
  // -------------------------------------------------------------------------
  personalInfo: {
    name: {
      zh: "杨明远",
      en: "Mingyuan Yang",
    },
    tagline: {
      zh: "CV / VIO / SLAM 算法工程师 · 边缘端 AI 部署 · Next.js 全栈",
      en: "CV / VIO / SLAM Algorithm Engineer · Edge AI Deployment · Next.js Full-Stack",
    },
    bio: {
      zh: "研究生，专注于计算机视觉与 SLAM 方向，具备从算法设计到边缘端（NVIDIA Jetson）全链路落地经验。热爱用现代 Web 技术将学术成果可视化，探索 AI × Web 的无限可能。",
      en: "Graduate researcher specializing in Computer Vision and SLAM, with full-pipeline experience from algorithm design to edge deployment on NVIDIA Jetson. Passionate about visualizing academic work through modern web technology.",
    },
    email: "mingyuan@example.com",
    avatar: "https://avatars.githubusercontent.com/u/9999999?v=4",
    location: { zh: "中国·广州", en: "Guangzhou, China" },
    resumePdfUrl: "/resume-mingyuan-yang.pdf",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/mingyuan-yang", icon: "Github" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/mingyuan-yang", icon: "Linkedin" },
      { platform: "Email", url: "mailto:mingyuan@example.com", icon: "Mail" },
    ],
  },

  // -------------------------------------------------------------------------
  // Education
  // -------------------------------------------------------------------------
  education: [
    {
      id: "edu-ms",
      institution: { zh: "华南理工大学", en: "South China University of Technology" },
      degree: { zh: "工学硕士", en: "Master of Engineering" },
      major: { zh: "计算机科学与技术", en: "Computer Science and Technology" },
      startDate: "2023-09",
      endDate: "2026-06",
      gpa: "3.8 / 4.0",
      highlights: [
        { zh: "研究方向：水下目标检测与多目标跟踪", en: "Research focus: Underwater object detection & multi-object tracking" },
        { zh: "实验室：计算机视觉与智能系统实验室", en: "Lab: Computer Vision & Intelligent Systems Lab" },
      ],
    },
    {
      id: "edu-bs",
      institution: { zh: "华南理工大学", en: "South China University of Technology" },
      degree: { zh: "工学学士", en: "Bachelor of Engineering" },
      major: { zh: "软件工程", en: "Software Engineering" },
      startDate: "2019-09",
      endDate: "2023-06",
      gpa: "3.7 / 4.0",
      highlights: [
        { zh: "优秀毕业论文", en: "Outstanding Graduation Thesis" },
        { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
      ],
    },
  ],

  // -------------------------------------------------------------------------
  // Publications
  // -------------------------------------------------------------------------
  publications: [
    {
      id: "pub-fish-reid",
      title: "Lightweight Fish Re-Identification via Part-Aware Feature Fusion for Aquaculture IoT Systems",
      authors: [
        { name: "Mingyuan Yang", isHighlighted: true },
        { name: "Wei Chen" },
        { name: "Haoran Liu" },
        { name: "Jianfeng Zhang" },
      ],
      venue: {
        zh: "IEEE 物联网期刊",
        en: "IEEE Internet of Things Journal",
      },
      year: 2025,
      doi: "10.1109/JIOT.2025.0000001",
      arxivUrl: "https://arxiv.org/abs/2501.00001",
      type: "journal",
      abstract: {
        zh: "提出一种轻量化鱼类重识别方法，结合部位感知特征融合策略，在边缘端 Jetson Nano 上实现 20+ FPS 的实时推理，mAP 较基线提升 5.2%。",
        en: "We propose a lightweight fish re-identification method combining part-aware feature fusion, achieving 20+ FPS real-time inference on Jetson Nano with 5.2% mAP improvement over baselines.",
      },
      tags: ["ReID", "Edge AI", "IoT", "Aquaculture", "TensorRT"],
    },
    {
      id: "patent-yolo-prune",
      title: "一种面向嵌入式端的 YOLOv11 通道剪枝与量化压缩方法",
      authors: [
        { name: "杨明远", isHighlighted: true },
        { name: "陈伟" },
        { name: "刘浩然" },
      ],
      venue: {
        zh: "中国国家知识产权局",
        en: "China National Intellectual Property Administration",
      },
      year: 2024,
      patentNo: "CN202410000001.X",
      type: "patent",
      abstract: {
        zh: "提出一种针对 YOLOv11 的系统性压缩方案，通过结构化通道剪枝与 INT8 量化，将模型体积压缩 60%，推理速度提升 3.7×，满足嵌入式端实时部署需求。",
        en: "A systematic compression scheme for YOLOv11 via structured channel pruning and INT8 quantization, reducing model size by 60% and achieving 3.7× inference speedup for embedded real-time deployment.",
      },
      tags: ["YOLOv11", "Pruning", "Quantization", "Embedded", "Patent"],
    },
  ],

  // -------------------------------------------------------------------------
  // Projects — STAR + Interview Corpus
  // -------------------------------------------------------------------------
  projects: [
    {
      id: "proj-fish-reid-system",
      title: { zh: "鱼类水下重识别与跟踪系统", en: "Underwater Fish Re-ID & Tracking System" },
      subtitle: {
        zh: "基于 YOLOv11 + BoT-SORT 的边缘端实时多目标跟踪流水线",
        en: "Edge real-time MOT pipeline based on YOLOv11 + BoT-SORT",
      },
      situation: {
        zh: "水产养殖场缺乏低成本、可扩展的鱼群个体识别方案，传统人工盘点耗时且误差大。",
        en: "Aquaculture farms lacked affordable, scalable individual fish identification solutions; manual counting was time-consuming and error-prone.",
      },
      task: {
        zh: "在 NVIDIA Jetson Nano（4GB）上实现实时鱼群多目标跟踪，达到 ≥20 FPS，ID Switch 率 ≤5%。",
        en: "Achieve real-time multi-object fish tracking on NVIDIA Jetson Nano (4GB) with ≥20 FPS and ID Switch rate ≤5%.",
      },
      action: {
        zh: "采用 YOLOv11n 为检测骨干，通过结构化通道剪枝（L1范数准则）将参数量压缩 60%；INT8 量化后用 TensorRT 8 构建推理引擎；跟踪器选用 BoT-SORT 并针对鱼类外观相似场景调优 ReID 权重与卡尔曼噪声参数；部署时利用 CUDA Streams 实现检测与跟踪的双流并行。",
        en: "Used YOLOv11n as the detection backbone; applied structured channel pruning (L1-norm criterion) to reduce parameters by 60%; built a TensorRT 8 inference engine with INT8 quantization; tuned BoT-SORT ReID weights and Kalman noise parameters for visually similar fish; deployed with CUDA Streams for parallel detection-tracking pipelines.",
      },
      result: {
        zh: "最终推理速度达 23 FPS（提升 3.7×），ID Switch 率降至 3.1%，mAP@50 达 87.6%（较基线 +5.2%），论文录用至 IEEE IoTJ。",
        en: "Achieved 23 FPS inference (3.7× speedup), reduced ID Switch rate to 3.1%, mAP@50 of 87.6% (+5.2% over baseline); paper accepted at IEEE IoTJ.",
      },
      metrics: [
        { zh: "+5.2% mAP@50", en: "+5.2% mAP@50" },
        { zh: "推理速度 3.7×↑", en: "3.7× Inference Speedup" },
        { zh: "ID Switch 率 3.1%", en: "3.1% ID Switch Rate" },
        { zh: "模型体积 −60%", en: "−60% Model Size" },
      ],
      coreSkill: ["PyTorch", "TensorRT", "YOLOv11", "BoT-SORT", "CUDA", "Jetson Nano", "INT8 量化", "结构化剪枝"],
      interviewFocus: [
        { zh: "边缘端显存优化策略：INT8 量化精度损失控制", en: "Edge memory optimization: controlling INT8 quantization accuracy loss" },
        { zh: "BoT-SORT 多目标跟踪调优：ReID 权重 vs 运动模型的 tradeoff", en: "BoT-SORT tuning: trade-off between ReID weight and motion model" },
        { zh: "结构化剪枝准则选择：L1 范数 vs BN 因子 vs Taylor 展开", en: "Pruning criterion selection: L1-norm vs BN factor vs Taylor expansion" },
        { zh: "CUDA Streams 双流并行设计与同步开销", en: "CUDA Streams dual-pipeline design and synchronization overhead" },
      ],
      isInteractive: true,
      liveDemoUrl: "/demo/fish-reid",
      coverImage: "/images/projects/fish-reid-cover.jpg",
      githubUrl: "https://github.com/mingyuan-yang/fish-reid-jetson",
      startDate: "2023-09",
      endDate: "2024-12",
      featured: true,
    },
    {
      id: "proj-vio-slam",
      title: { zh: "水下 VIO-SLAM 定位系统", en: "Underwater VIO-SLAM Localization System" },
      subtitle: {
        zh: "融合 IMU 与单目相机的紧耦合视觉惯性里程计原型",
        en: "Tightly-coupled Visual-Inertial Odometry prototype fusing IMU and monocular camera",
      },
      situation: {
        zh: "水下机器人在无 GPS 环境下缺乏精确的自身定位能力，现有 SLAM 方案对水下散射光照鲁棒性较差。",
        en: "Underwater robots lacked precise self-localization in GPS-denied environments; existing SLAM solutions were poorly robust to underwater scattering illumination.",
      },
      task: {
        zh: "基于 ORB-SLAM3 框架改造，集成 IMU 预积分，在水下模拟数据集上使 ATE RMSE ≤ 0.05m。",
        en: "Modify ORB-SLAM3 framework with IMU pre-integration to achieve ATE RMSE ≤ 0.05m on an underwater simulation dataset.",
      },
      action: {
        zh: "在 ORB-SLAM3 的前端引入水下图像增强（暗通道先验去雾），改进特征提取鲁棒性；为 IMU 预积分模块重新标定水下振动噪声参数（Allan方差分析）；后端优化使用 g2o 进行关键帧位姿图优化；整套系统在 ROS2 Humble 上封装为可复用节点。",
        en: "Introduced underwater image enhancement (dark channel prior dehazing) in ORB-SLAM3 front-end; recalibrated IMU pre-integration noise parameters for underwater vibrations (Allan variance analysis); used g2o for back-end keyframe pose graph optimization; wrapped the entire system as reusable ROS2 Humble nodes.",
      },
      result: {
        zh: "ATE RMSE 达 0.043m，轨迹重建视觉效果清晰，成功在课题组演示；相关技术写入毕业论文第三章。",
        en: "Achieved ATE RMSE of 0.043m with clear trajectory reconstruction; successfully demonstrated in the research group; technical content included in dissertation Chapter 3.",
      },
      metrics: [
        { zh: "ATE RMSE 0.043m", en: "ATE RMSE 0.043m" },
        { zh: "IMU-Camera 时延 < 2ms", en: "IMU-Camera Latency < 2ms" },
      ],
      coreSkill: ["ORB-SLAM3", "ROS2", "IMU 预积分", "g2o", "C++17", "暗通道先验", "Allan 方差", "Eigen3"],
      interviewFocus: [
        { zh: "VIO 初始化策略：视觉辅助 vs IMU 单独初始化", en: "VIO initialization strategy: vision-aided vs IMU-only initialization" },
        { zh: "IMU 噪声建模：随机游走 vs 零偏稳定性的 Allan 方差分析", en: "IMU noise modeling: random walk vs bias stability in Allan variance" },
        { zh: "水下环境特征点稀疏问题应对方案", en: "Handling sparse feature points in underwater environments" },
        { zh: "位姿图优化收敛性与鲁棒核函数选取", en: "Pose graph optimization convergence and robust kernel selection" },
      ],
      isInteractive: false,
      coverImage: "/images/projects/vio-slam-cover.jpg",
      githubUrl: "https://github.com/mingyuan-yang/underwater-vio-slam",
      startDate: "2024-03",
      endDate: "2025-06",
      featured: true,
    },
    {
      id: "proj-ai-portfolio",
      title: { zh: "AI 全栈求职引擎（本站）", en: "AI Full-Stack Career Engine (This Site)" },
      subtitle: {
        zh: "Next.js 14 App Router + DeepSeek AI Agent + Redis 全站工程实践",
        en: "Next.js 14 App Router + DeepSeek AI Agent + Redis full-stack engineering practice",
      },
      situation: {
        zh: "传统 PDF 简历无法展示算法工程师的工程深度，需要一个能自证技术栈、可实时交互的数字名片。",
        en: "Traditional PDF resumes cannot demonstrate an algorithm engineer's engineering depth; a self-proving, interactable digital business card was needed.",
      },
      task: {
        zh: "在 2 周内独立完成从设计到上线的全栈个人主页，集成 AI 面试助理与 MDX 学术博客。",
        en: "Independently deliver a full-stack personal homepage from design to production within 2 weeks, integrating an AI interview assistant and MDX academic blog.",
      },
      action: {
        zh: "前端使用 Next.js 14 App Router + Tailwind CSS v4 + next-themes 双主题；i18n 基于 middleware 实现 URL 级双语路由；AI Agent 对接 DeepSeek-Chat，后端用 Vercel KV (Redis) 做 IP 级别的 Rate Limiting（5次/分钟）与 Circuit Breaker 降级；学术博客使用 next-mdx-remote + remark-math + rehype-mathjax。",
        en: "Frontend: Next.js 14 App Router + Tailwind CSS v4 + next-themes dual theme; i18n via middleware for URL-level bilingual routing; AI Agent backed by DeepSeek-Chat with Vercel KV (Redis) for IP-level rate limiting (5 req/min) and circuit breaker fallback; academic blog with next-mdx-remote + remark-math + rehype-mathjax.",
      },
      result: {
        zh: "成功部署至 Vercel，Lighthouse 性能分 95+，支持微信/钉钉 Open Graph 卡片分享。",
        en: "Successfully deployed on Vercel with Lighthouse performance score 95+; supports WeChat/DingTalk Open Graph card sharing.",
      },
      metrics: [
        { zh: "Lighthouse 性能 95+", en: "Lighthouse 95+" },
        { zh: "首屏 LCP < 1.2s", en: "LCP < 1.2s" },
      ],
      coreSkill: ["Next.js 14", "App Router", "TypeScript", "Tailwind CSS v4", "DeepSeek API", "Redis", "next-mdx-remote", "Vercel"],
      interviewFocus: [
        { zh: "App Router RSC vs Client Component 拆分边界设计", en: "App Router RSC vs Client Component boundary design" },
        { zh: "Redis Rate Limiting 原子操作与 Lua 脚本保证原子性", en: "Redis rate limiting atomic operations and Lua script atomicity" },
        { zh: "MDX 服务端渲染与 XSS 安全防护", en: "MDX server-side rendering and XSS security" },
      ],
      isInteractive: true,
      liveDemoUrl: "/",
      githubUrl: "https://github.com/mingyuan-yang/ai-portfolio",
      startDate: "2025-07",
      endDate: "Present",
      featured: false,
    },
  ],

  // -------------------------------------------------------------------------
  // Work Experience (reserved)
  // -------------------------------------------------------------------------
  workExperience: [
    {
      id: "work-intern-cv",
      company: { zh: "某互联网大厂（AI Lab）", en: "Major Internet Company (AI Lab)" },
      role: { zh: "计算机视觉算法实习生", en: "Computer Vision Algorithm Intern" },
      startDate: "2024-07",
      endDate: "2024-09",
      description: [
        { zh: "负责目标检测模型在移动端的压缩与部署优化", en: "Responsible for compressing and deploying object detection models on mobile devices" },
        { zh: "参与内部数据集标注流程规范化", en: "Participated in standardizing the internal dataset annotation pipeline" },
      ],
      techStack: ["PyTorch", "ONNX", "MNN", "Python"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Convenience helpers consumed by UI components
// ---------------------------------------------------------------------------

/**
 * Returns projects sorted by featured first, then by startDate descending.
 */
export function getSortedProjects(): Project[] {
  return [...resumeData.projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.startDate.localeCompare(a.startDate);
  });
}

/**
 * Renders a Publication's author list as a formatted string.
 * The highlighted author is wrapped in a marker token for the UI to style.
 * e.g. → ["Mingyuan Yang*", "Wei Chen", "Haoran Liu"]
 */
export function formatAuthors(pub: Publication): { name: string; isHighlighted: boolean }[] {
  return pub.authors.map((a) => ({
    name: a.isHighlighted ? `${a.name}` : a.name,
    isHighlighted: !!a.isHighlighted,
  }));
}
