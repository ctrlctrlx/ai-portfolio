// 使用相对路径而非 @/ 别名：profile 数据层需要能被 Node 校验脚本直接加载
import type { AboutProfile } from "./types";

/**
 * 「关于我」公开资料。
 *
 * 隐私边界：本人明确同意公开政治面貌与微信号；电话号码（仅限正式简历 PDF）、
 * 生日、学号、导师联系方式、详细住址一律不进入本文件，由 scripts/verify-*.mjs 守住。
 * 籍贯字段已按本人要求全站移除。
 */
export const about: AboutProfile = {
  visibility: "public",
  verificationStatus: "verified",
  sourceId: "profile-about",
  /**
   * 求职意向：全站唯一口径，与 identity.jobTargets、首页首屏「求职方向」、
   * 在线简历页「求职意向」四处表述完全一致（见 scripts/verify-profile-data.mjs）。
   */
  jobTargets: [
    { zh: "计算机视觉算法工程师", en: "Computer Vision Algorithm Engineer" },
    { zh: "嵌入式AI/边缘部署工程师", en: "Embedded AI / Edge Deployment Engineer" },
  ],
  /**
   * 一句话核心标语（首页首屏）。
   * 术语与关于页简介、项目详情页保持一致：CLIP-ReID / 5 倍压缩 / 开放集识别 / Web 原型系统。
   */
  headline: {
    zh: "算法与硬件双线并进的工程型硕士，专注视觉算法工程化：主导 CLIP-ReID 特征 5 倍压缩与开放集识别方案，并集成至 Web 原型系统。",
    en: "An engineering-minded master's candidate working both ends of the stack, focused on engineering visual algorithms: led 5× CLIP-ReID feature compression and open-set recognition solutions, integrated into a web prototype.",
  },
  /**
   * 首页「个人简介」板块的精简版：只保留定位与两条主线能力。
   * 完整自我介绍与实践经历保留在 identity.bio 与 /[lang]/about 独立页。
   */
  summary: {
    zh: "研究方向为计算机视觉、个体重识别（ReID）与嵌入式智能感知。算法侧做过 CLIP-ReID 特征压缩与开放集拒识，硬件侧主导过 RFID 与多目视觉同步采集装置的整机搭建，习惯用可复现的实验数据验证结论。",
    en: "My research covers computer vision, individual re-identification (ReID), and embedded intelligent sensing. On the algorithm side I have worked on CLIP-ReID feature compression and open-set rejection; on the hardware side I led the construction of an RFID plus multi-camera synchronized acquisition device. I validate conclusions with reproducible experimental data.",
  },
  /**
   * 「关于我」页个人简介数据：标签行 + 量化增强正文 + 行事风格。
   *
   * 结构：① 开篇标签行（整行加粗，含学历/政治面貌/奖学金三个身份标签）
   * ② 量化正文（核心数据局部加粗）③ 行事风格。
   *
   * 展示约定：关于我页面只渲染 `[0]` 标签行，正文段落改由 6 个能力模块
   * （见下方 `strengths`）承载；`[1..]` 仍保留在数据层，作为求职问答
   * 「自我介绍」的取词来源（`career-agent.mjs` 的 buildIntroduction 与
   * `verify:chat` 的同源断言都依赖这段正文），因此不要删除。
   *
   * 注意：政治面貌字面量按 AGENTS.md 的隐私条款只允许出现在本文件。
   */
  bioSections: [
    {
      id: "identity-tags",
      segments: [
        {
          strong: true,
          text: {
            zh: "海南大学新一代电子信息技术工学硕士在读 | 中共党员 | 国家奖学金获得者",
            en: "M.Eng. Candidate in New Generation Electronic Information Technology, Hainan University | CPC Member | National Scholarship Winner",
          },
        },
      ],
    },
    {
      id: "quantified-profile",
      segments: [
        {
          text: {
            zh: "算法与硬件双线并进的工程型硕士，专注视觉模型落地与嵌入式感知系统交付。算法侧主导 CLIP-ReID 特征压缩与开放集识别方案，设计 Compact256 投影层将特征从 1280 维压缩至 256 维（",
            en: "An engineering-minded master's candidate working both ends of the stack, focused on landing vision models and delivering embedded perception systems. On the algorithm side I led CLIP-ReID feature compression and open-set recognition: the Compact256 projection layer compresses features from 1280 to 256 dimensions (",
          },
        },
        {
          strong: true,
          text: { zh: "5 倍降维", en: "5× dimensionality reduction" },
        },
        {
          text: { zh: "），", en: "), with " },
        },
        {
          strong: true,
          text: { zh: "精度损失<2%", en: "accuracy loss <2%" },
        },
        {
          text: {
            zh: "，已部署至 Web 原型系统；硬件侧主导 RFID 与三目视觉同步采集装置整机搭建，实现 ",
            en: ", already deployed to a web prototype. On the hardware side I led the full-device construction of an RFID plus three-camera synchronized acquisition rig, achieving ",
          },
        },
        {
          strong: true,
          text: { zh: "3 路 25fps 稳定采集", en: "3× 25 fps stable capture" },
        },
        {
          text: { zh: " 与 ", en: " and " },
        },
        {
          strong: true,
          text: { zh: "USB3.2 带宽优化", en: "USB 3.2 bandwidth optimization" },
        },
        {
          text: {
            zh: "，完成工业级防水封装，在文昌冯家湾基地高频驻场约6个月（每周3-4天）完成个体识别装置交付与标准化体系输出。",
            en: ", completed the industrial-grade waterproof enclosure, and spent about six months on high-frequency on-site work at the Fengjiawan base in Wenchang (3–4 days per week) delivering the individual-identification device and the standardized operating framework.",
          },
        },
      ],
    },
    {
      id: "working-style",
      segments: [
        {
          text: {
            zh: "习惯用可复现的实验数据与可交付的工程规范验证结论，坚持「方向确认后快速推进、迭代修正」，兼顾方案严谨性与落地节奏。",
            en: "I verify conclusions with reproducible experimental data and deliverable engineering practices, adhering to \"move fast once the direction is confirmed, iterate and correct along the way\" to balance rigor with delivery pace.",
          },
        },
      ],
    },
  ],
  /** 入党时间由本人提供，随政治面貌一并展示 */
  politicalStatus: {
    zh: "中共党员（2021.12）",
    en: "Member of the CPC (Dec. 2021)",
  },
  /**
   * 籍贯：本人先前要求全站移除，现已重新授权公开（重庆）。
   * 授权值与放行规则集中在 scripts/lib-approved-contacts.mjs 声明。
   */
  nativePlace: { zh: "重庆", en: "Chongqing" },
  /** 通用研究方向：与个人简介、机器人回答、首页与项目页标签三处术语统一 */
  researchDirections: [
    { id: "computer-vision", label: { zh: "计算机视觉", en: "Computer Vision" } },
    {
      id: "reid",
      label: {
        zh: "个体重识别（ReID）",
        en: "Individual Re-identification (ReID)",
      },
    },
    {
      id: "vision-language",
      label: { zh: "视觉语言模型", en: "Vision-Language Models" },
    },
    {
      id: "embedded-sensing",
      label: {
        zh: "嵌入式智能感知系统",
        en: "Embedded Intelligent Perception Systems",
      },
    },
  ],
  /**
   * 「关于我」的 6 个能力模块（自我介绍区域，3 列 2 行卡片展示）。
   * 属于对该条目的自我评价，不单独标注可见性，统一继承 AboutProfile 的
   * public + verified 状态；顺序即展示顺序，由 About 组件按 id 映射图标。
   */
  strengths: [
    {
      id: "algorithm-research",
      title: { zh: "算法研究能力", en: "Algorithm Research" },
      description: {
        zh: "海南大学电子信息类 2027 届硕士，研究方向为计算机视觉与开放世界个体识别。以第一作者发表 EI 国际会议论文 2 篇，独立完成从算法方案设计、模型训练调优到消融验证的完整研究闭环。研究工作中提出质量感知机制与 Compact256 紧凑投影层，前者将成像质量波动转化为可学习信号，后者在特征压缩至 1/5 的同时将精度损失控制在 2% 以内——具备“发现问题、抽象为算法问题、设计方案、实验验证”的完整科研方法论。",
        en: "M.Eng. candidate in Electronic Information at Hainan University (Class of 2027), researching computer vision and open-world individual recognition. First author of two EI international conference papers; I independently completed the full research loop from algorithm design and model training/tuning through ablation validation. My research proposed a quality-aware mechanism and the Compact256 compact projection layer — the former turns imaging-quality fluctuation into a learnable signal, the latter compresses features to 1/5 while holding accuracy loss within 2% — so I bring a complete research methodology: spot the problem, abstract it into an algorithmic problem, design a solution, validate it experimentally.",
      },
    },
    {
      id: "engineering-delivery",
      title: { zh: "工程落地能力", en: "Engineering Delivery" },
      description: {
        zh: "算法不止于论文：完成 PyTorch → ONNX 转换与边缘端部署适配，基于 FastAPI + MySQL + Nginx 搭建在线推理服务，针对现场稳定性问题设计五大运行时机制，将开放场景误报率降至 6.91%。驻场 6 个月完成系统部署与迭代，理解从“模型精度”到“系统可用”之间的工程距离。",
        en: "Algorithms do not stop at the paper: I completed PyTorch → ONNX conversion and edge-deployment adaptation, built an online inference service on FastAPI + MySQL + Nginx, designed five runtime mechanisms for on-site stability problems, and brought the false-acceptance rate in open scenarios down to 6.91%. Six months on site delivering and iterating the system taught me the engineering distance between “model accuracy” and “system availability”.",
      },
    },
    {
      id: "edge-ai-deployment",
      title: { zh: "边缘AI部署经验", en: "Edge AI Deployment" },
      description: {
        zh: "完成深度学习模型的轻量化压缩（特征压缩至 1/5、精度损失 <2%）与 ONNX 边缘推理适配，基于 Python/C 混合思路开发在线推理服务，针对现场真实约束设计五大运行时稳定性机制，系统达到工程冻结标准并在生产现场稳定运行 6 个月以上。驻场经历让我理解边缘系统的真实约束：算力、内存、带宽、散热、网络，每一个都会在实验室里看不见的地方爆发。",
        en: "I completed lightweight compression of a deep-learning model (features compressed to 1/5 with accuracy loss <2%) and ONNX edge-inference adaptation, developed an online inference service with a Python/C mixed approach, and designed five runtime stability mechanisms for real on-site constraints; the system reached the engineering freeze standard and has run stably in production for more than six months. Working on site taught me the real constraints of edge systems — compute, memory, bandwidth, thermals and network, each of which erupts where the lab cannot see it.",
      },
    },
    {
      id: "debugging-root-cause",
      title: { zh: "调试与问题定位", en: "Debugging & Root-Cause Analysis" },
      description: {
        zh: "习惯“现象复现 → 模块归因 → 最小验证 → 修复验证”的系统化调试流程：在采集终端项目中定位 USB 带宽瓶颈与多线程竞争，在识别系统现场定位轨迹断裂与帧质量问题。具备 C/C++ 与 Linux 基础，熟悉多线程编程与同步机制，能读懂硬件原理图，具备软硬件联调经验。",
        en: "I follow a systematic debugging routine — reproduce the symptom, attribute it to a module, verify minimally, then verify the fix: I located a USB bandwidth bottleneck and multi-thread contention in the acquisition-terminal project, and tracked down track breaks and frame-quality problems on site in the recognition system. I have C/C++ and Linux fundamentals, am familiar with multi-threaded programming and synchronization, can read hardware schematics, and have hardware-software co-debugging experience.",
      },
    },
    {
      id: "learning-potential",
      title: { zh: "学习力与潜力", en: "Learning Ability & Potential" },
      description: {
        zh: "研究生阶段绩点 3.6/4.0；本科获国家奖学金（全国获奖比例约 0.2‰）、省级优秀大学毕业生；获“大唐杯”全国大学生移动通信 5G 挑战赛全国三等奖。从视觉语言大模型微调到边缘部署再到全栈服务开发，持续在算法能力半径外扩展，学习迁移能力经过多方向验证。",
        en: "GPA 3.6/4.0 in graduate school; as an undergraduate I received the National Scholarship (awarded to roughly 0.2‰ of students nationwide) and the provincial Outstanding Graduate award; and I won a national 3rd prize in the “Datang Cup” National Collegiate Mobile Communication 5G Challenge. From vision-language model fine-tuning to edge deployment and full-stack service development, I keep extending beyond my algorithm comfort zone, with learning transfer validated across multiple directions.",
      },
    },
    {
      id: "overall-capability",
      title: { zh: "综合素质", en: "Overall Capability" },
      description: {
        zh: "担任社团社长与消防志愿者中心负责人，组织协调与跨部门沟通能力经过实战检验；长期撰写技术博客，技术表达清晰。认同“算法的价值在于解决真实问题”，期望在工业界将学术积累转化为产品竞争力。",
        en: "I served as a club president and as head of a fire-safety volunteer centre, so my organizing, coordination and cross-department communication skills are battle-tested; I have long written technical blogs and express technical ideas clearly. I believe the value of an algorithm lies in solving real problems, and I want to turn academic accumulation into product competitiveness in industry.",
      },
    },
  ],
  /**
   * 实践经历：本科与硕士阶段的学生工作、驻场经历。
   * 与 projects.ts 的科研项目分开，避免把学生工作混进科研项目列表。
   * 结构为「时间 + 职务 + 分项工作内容 + 量化成果」。
   */
  practice: [
    {
      id: "bachelor-practice",
      phase: { zh: "本科阶段", en: "Undergraduate" },
      entries: [
        {
          id: "bachelor-class-monitor",
          title: { zh: "班级班长", en: "Class Monitor" },
          period: { zh: "2019.09 – 2022.12", en: "2019.09 – 2022.12" },
          bullets: [
            {
              text: {
                zh: "统筹 30 人班级的评奖评优与团建活动，建立公平透明的评选标准与公示流程，实现评选零差错、零投诉。",
                en: "Coordinated award evaluations and team-building for a 30-member class, establishing transparent selection criteria and a public-notice process that produced zero errors and zero complaints.",
              },
            },
            {
              text: {
                zh: "担任师生沟通核心接口，精准传达解读学校与辅导员通知，主动收集反馈解决同学问题，班级信息触达率达 100%。",
                en: "Served as the primary faculty-student communication interface, relaying and interpreting school and counsellor notices, proactively collecting feedback and resolving classmates' issues, reaching 100% information coverage across the class.",
              },
              metric: { zh: "信息触达率 100%", en: "100% information reach" },
            },
            {
              text: {
                zh: "同学满意度位列年级前 10%。",
                en: "Classmate satisfaction ranked in the top 10% of the cohort.",
              },
              metric: { zh: "满意度年级前 10%", en: "Top 10% satisfaction" },
            },
          ],
        },
        {
          id: "bachelor-fire-volunteer",
          title: {
            zh: "“银杉特训队”社团社长 / 大学生消防志愿者中心负责人",
            en: "President of the \"Yinshan Special Training Team\" / Head of the University Fire Safety Volunteer Centre",
          },
          period: { zh: "2021.06 – 2022.06", en: "2021.06 – 2022.06" },
          bullets: [
            {
              text: {
                zh: "带领队员定期巡检全校消防设施，排查设备损坏、器材过期等隐患，保障设施完好率。",
                en: "Led team members in regular inspections of campus-wide fire safety facilities, identifying damaged equipment and expired apparatus to keep facilities fully serviceable.",
              },
            },
            {
              text: {
                zh: "统筹组织新学期迎新接待、新生汇报表演等大型活动，覆盖全年级新生。",
                en: "Organised large-scale events including new-semester orientation reception and the freshman showcase performance, covering the entire incoming cohort.",
              },
            },
            {
              text: {
                zh: "协助学校保卫处开展安全教育宣传与日常安全巡查工作。",
                en: "Assisted the campus security office with safety education outreach and routine safety patrols.",
              },
            },
          ],
        },
      ],
    },
    {
      id: "master-practice",
      phase: { zh: "硕士阶段", en: "Master's" },
      entries: [
        {
          id: "master-grouper-farm",
          title: {
            zh: "工厂化东星斑养殖智能管理项目",
            en: "Industrial Crimson Snapper Smart Aquaculture Management Project",
          },
          role: { zh: "驻场出差负责人", en: "On-site Lead" },
          location: { zh: "文昌冯家湾", en: "Fengjiawan, Wenchang" },
          period: { zh: "2025.12 – 至今", en: "2025.12 – Present" },
          bullets: [
            {
              text: {
                zh: "带领 2 名师弟完成多方案标记筛选实验：对比荧光标记、T 形标、RFID 芯片三类方案，经 4 批次、200 余尾样本迭代，确立「成鱼背部肌肉注射 + 幼鱼外挂标记」的分级方案，成鱼标记存活率从 0 提升至 80%。",
                en: "Led two junior team members through a multi-method tagging screen: compared fluorescent marking, T-bar tags, and RFID chips across 4 batches and 200+ fish, establishing a tiered scheme of dorsal muscle injection for adults plus external tagging for juveniles, raising adult tag survival from 0% to 80%.",
              },
              metric: { zh: "成鱼标记存活率 0 → 80%", en: "Adult tag survival 0% → 80%" },
            },
            {
              text: {
                zh: "主导制定 RFID 芯片注射标准化 SOP：覆盖 MS-222 麻醉、消毒、精准进针、组织胶封闭、充氧复苏全流程，单尾操作耗时压缩至 5~8 分钟。",
                en: "Authored the standardized RFID chip injection SOP covering the full workflow — MS-222 anaesthesia, disinfection, precise needle placement, tissue-glue sealing, and oxygenated recovery — compressing per-fish handling time to 5–8 minutes.",
              },
              metric: { zh: "单尾操作 5~8 分钟", en: "5–8 minutes per fish" },
            },
            {
              text: {
                zh: "搭建三合一数据集采集流水线：离水图像采集 + 体长人工真值测量 + RFID 绝对 ID 绑定，输出高质量标注数据集，支撑 EI 一作论文 1 篇。",
                en: "Built a three-in-one dataset pipeline combining out-of-water image capture, manual ground-truth body-length measurement, and RFID absolute ID binding, producing a high-quality annotated dataset that supported one first-author EI paper.",
              },
              metric: { zh: "支撑 EI 一作论文 1 篇", en: "Supported 1 first-author EI paper" },
            },
            {
              text: {
                zh: "排查并解决批量死亡风险：定位管道残留毒水、工具交叉感染寄生虫等核心问题，建立水质换水阈值表与病虫害防控制度。",
                en: "Diagnosed and resolved mass-mortality risks: identified residual toxic water in piping and parasite cross-contamination via tools, then established a water-exchange threshold table and a pest and disease control protocol.",
              },
            },
          ],
        },
      ],
    },
  ],
  /**
   * 实践经历配图：仅登记 public 下的相对路径，文件放在 public/images/about/。
   * 路径已在 scripts/lib-pending-assets.mjs 登记为「待放置资产」。
   */
  practiceImages: [
    {
      id: "practice-01",
      src: "/images/about/practice-01.jpg",
      caption: {
        zh: "图1 工厂化东星斑养殖现场与驻场工作环境",
        en: "Fig. 1 On-site working environment at the industrial crimson snapper aquaculture facility",
      },
      alt: {
        zh: "工厂化东星斑养殖现场与驻场工作环境",
        en: "On-site working environment at the industrial crimson snapper aquaculture facility",
      },
    },
    {
      id: "practice-02",
      src: "/images/about/practice-02.jpg",
      caption: {
        zh: "图2 多方案标记筛选实验：荧光标记、T形标与RFID芯片对比",
        en: "Fig. 2 Multi-method tagging screen: fluorescent marking, T-bar tags, and RFID chips",
      },
      alt: {
        zh: "多方案标记筛选实验对比",
        en: "Comparison of the multi-method tagging screen",
      },
    },
    {
      id: "practice-03",
      src: "/images/about/practice-03.jpg",
      caption: {
        zh: "图3 东星斑RFID推荐植入位点示意图",
        en: "Fig. 3 Schematic Diagram of Recommended RFID Implantation Sites for Crimson Snapper",
      },
      alt: {
        zh: "东星斑RFID推荐植入位点示意图",
        en: "Schematic Diagram of Recommended RFID Implantation Sites for Crimson Snapper",
      },
    },
  ],
  contactHeading: { zh: "联系我", en: "Get in Touch" },
  contactNote: {
    zh: "以下为公开联系方式，欢迎就岗位机会与我联系。",
    en: "These are my public contact details — feel free to reach out about opportunities.",
  },
  /**
   * 联系方式卡片本身不复制邮箱原始值：
   * 邮箱统一从 identity.ts 的公开求职邮箱读取（校验脚本要求全站只出现一次）。
   * 籍贯字段已按本人要求移除。
   */
  contacts: [
    {
      id: "contact-wechat",
      label: { zh: "微信", en: "WeChat" },
      value: { zh: "Galaxy24664", en: "Galaxy24664" },
    },
  ],
};
