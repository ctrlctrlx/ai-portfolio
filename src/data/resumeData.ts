// ─── Types ──────────────────────────────────────────────────────────────────

export interface BilingualText {
  zh: string;
  en: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface EducationEntry {
  id: string;
  institution: BilingualText;
  degree: BilingualText;
  major: BilingualText;
  gpa?: string;
  startDate: string;
  endDate: string;
  highlights: BilingualText[];
}

export interface Author {
  name: string;
  isHighlighted?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  venue: BilingualText;
  year: number;
  abstract: BilingualText;
  tags: string[];
  doi?: string;
  arxivUrl?: string;
  patentNo?: string;
  type: "paper" | "patent";
}

export interface Project {
  id: string;
  title: BilingualText;
  subtitle: BilingualText;
  featured: boolean;
  startDate: string;
  endDate: string;
  situation: BilingualText;
  task: BilingualText;
  action: BilingualText;
  result: BilingualText;
  coreSkill: string[];
  metrics: BilingualText[];
  interviewFocus: BilingualText[];
  githubUrl?: string;
  liveDemoUrl?: string;
  isInteractive?: boolean;
}

export interface Award {
  title: BilingualText;
  issuer: BilingualText;
  year: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

export const resumeData = {
  personalInfo: {
    name: { zh: "杨冲", en: "Yang Chong" },
    tagline: {
      zh: "AI 算法工程师 · 边缘计算方向",
      en: "AI Algorithm Engineer · Edge Computing",
    },
    bio: {
      zh: "新一代电子信息技术专业硕士在读。具备扎实的软硬件协同开发能力，专注于计算机视觉与深度学习模型的轻量化设计，拥有将 PyTorch 模型转化为 ONNX/NCNN 并部署到边缘计算设备的实战经验。对探索前沿 AI 技术落地抱有极大热情。",
      en: "M.S. candidate in New Generation Electronic Information Technology with a solid foundation in full-stack AI development. Engineered end-to-end edge deployment pipelines, converting PyTorch models through ONNX to NCNN for real-time inference on embedded hardware. Deeply passionate about bridging cutting-edge AI research with production-grade edge computing.",
    },
    location: { zh: "海南，中国", en: "Hainan, China" },
    avatar: "/head_photo.jpg",
    email: "18716985140@163.com",
    phone: "18716985140",
    resumePdfUrl: "/resume.pdf",
    socialLinks: [
      { platform: "GitHub", url: "https://github.com/ctrlctrlx", icon: "Github" },
      { platform: "Email", url: "mailto:18716985140@163.com", icon: "Mail" },
    ] as SocialLink[],
  },

  education: [
    {
      id: "hnu",
      institution: { zh: "海南大学", en: "Hainan University" },
      degree: { zh: "硕士", en: "Master's" },
      major: { zh: "新一代电子信息技术", en: "New Generation Electronic Information Technology" },
      startDate: "2024.09",
      endDate: "2027.06",
      highlights: [
        {
          zh: "研究方向：计算机视觉、多智能体强化学习、端侧模型部署",
          en: "Research: Computer Vision, Multi-Agent Reinforcement Learning (MARL) for UAV Path Planning, and Edge Deployment",
        },
        {
          zh: "信息与通信工程学院",
          en: "School of Information & Communication Engineering",
        },
      ],
    },
    {
      id: "scust",
      institution: { zh: "四川工业科技学院", en: "Sichuan University of Science and Technology" },
      degree: { zh: "本科", en: "Bachelor's" },
      major: { zh: "电子信息工程", en: "Electronic Information Engineering" },
      startDate: "2018.09",
      endDate: "2022.06",
      highlights: [
        {
          zh: "国家奖学金、国家励志奖学金",
          en: "National Scholarship, National Encouragement Scholarship",
        },
        {
          zh: "四川省优秀毕业生",
          en: "Sichuan Province Outstanding Graduate",
        },
        {
          zh: "连续获得校级一二等奖学金",
          en: "Consecutive University 1st & 2nd Class Scholarships",
        },
      ],
    },
  ] as EducationEntry[],

  publications: [] as Publication[],

  skills: {
    programming: ["Python", "C/C++", "Linux Shell"],
    frameworks: ["PyTorch", "ONNX", "NCNN", "TensorRT (学习中)"],
    hardware: ["Jetson Orin Nano", "单片机 (IAP15F2K61S2)", "M5stack V2unit"],
    others: ["Git", "Docker", "硬件驱动开发", "轻量化网络 (MobileNet/ShuffleNet)"],
  },

  projects: [
    {
      id: "audio-edge",
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
        { zh: "PyTorch → ONNX → NCNN 完整转换链路", en: "Full PyTorch → ONNX → NCNN conversion and cross-compilation pipeline" },
        { zh: "Adam vs SGD 对比实验", en: "Adam vs. SGD optimizer ablation study with TensorBoard visualization" },
      ],
      githubUrl: "https://github.com/ctrlctrlx",
      isInteractive: false,
    },
    {
      id: "smart-attendance",
      title: {
        zh: "智能教室考勤系统",
        en: "Intelligent Classroom Attendance System",
      },
      subtitle: {
        zh: "获国家实用新型专利授权",
        en: "Granted National Utility Model Patent · Multi-sensor Fusion System",
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
        zh: "作为主要发明人之一，获得国家实用新型专利授权",
        en: "Co-invented the system architecture and was granted a National Utility Model Patent by CNIPA, confirming the solution's technical novelty and industrial applicability.",
      },
      coreSkill: ["C/C++", "MCU", "HW Driver Dev.", "Sensor Fusion"],
      metrics: [
        { zh: "国家实用新型专利", en: "National Utility Model Patent" },
        { zh: "多传感器融合", en: "Multi-sensor Fusion" },
        { zh: "模块化架构", en: "Modular Architecture" },
      ],
      interviewFocus: [
        { zh: "硬件选型与系统架构设计", en: "Hardware component selection, BOM cost optimization, and modular system architecture design" },
        { zh: "获得国家实用新型专利", en: "Co-inventor of a granted National Utility Model Patent (CNIPA)" },
      ],
      isInteractive: false,
    },
  ] as Project[],

  awards: [
    {
      title: { zh: "国家奖学金", en: "National Scholarship" },
      issuer: { zh: "中华人民共和国教育部", en: "Ministry of Education, PRC" },
      year: "2021",
    },
    {
      title: { zh: "国家励志奖学金", en: "National Encouragement Scholarship" },
      issuer: { zh: "中华人民共和国教育部", en: "Ministry of Education, PRC" },
      year: "2020",
    },
    {
      title: { zh: "四川省优秀毕业生", en: "Sichuan Province Outstanding Graduate" },
      issuer: { zh: "四川省教育厅", en: "Sichuan Provincial Education Department" },
      year: "2022",
    },
    {
      title: {
        zh: "蓝桥杯全国软件和信息技术专业人才大赛（四川省三等奖）",
        en: "LanQiao Cup National Competition – Sichuan Province 3rd Prize",
      },
      issuer: { zh: "工业和信息化部人才交流中心", en: "MIIT Talent Exchange Center" },
      year: "2021",
    },
    {
      title: {
        zh: "实用新型专利授权（智能教室考勤系统）",
        en: "National Utility Model Patent (Intelligent Attendance System)",
      },
      issuer: { zh: "国家知识产权局", en: "China National Intellectual Property Administration" },
      year: "2022",
    },
  ] as Award[],

  // 传给 AI 助理的独家系统提示词（简历里不显示，只有 AI 知道）
  interviewFocus: `候选人拥有极强的硬件底层理解力和深度学习模型部署能力。
本科期间多次获得国家级奖学金和省级优秀毕业生。
熟练掌握 PyTorch 模型向边缘端侧（如 NCNN、ONNX）的量化与部署流程。
目前正在海南大学攻读硕士，主攻 CV 和边缘端部署，具备优秀的抗压能力和团队协作能力。`,
};

// ─── Helper Functions ────────────────────────────────────────────────────────

export function formatAuthors(pub: Publication): { name: string; isHighlighted: boolean }[] {
  return pub.authors.map((a) => ({
    name: a.name,
    isHighlighted: a.isHighlighted ?? false,
  }));
}

export function getSortedProjects(): Project[] {
  return [...resumeData.projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}
