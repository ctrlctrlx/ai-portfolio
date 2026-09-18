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
  jobTargets: [
    { zh: "硬件测试工程师", en: "Hardware Test Engineer" },
    { zh: "计算机视觉算法工程师", en: "Computer Vision Algorithm Engineer" },
    { zh: "嵌入式系统工程师", en: "Embedded Systems Engineer" },
  ],
  headline: {
    zh: "算法与硬件双线并进的工程型硕士，专注把视觉模型落到真实设备上。",
    en: "An engineering-minded M.S. candidate working both ends of the stack, focused on landing vision models on real devices.",
  },
  /**
   * 首页「个人简介」板块的精简版：只保留定位与两条主线能力。
   * 完整自我介绍与实践经历保留在 identity.bio 与 /[lang]/about 独立页。
   */
  summary: {
    zh: "研究方向为计算机视觉、个体重识别（ReID）与嵌入式智能感知。算法侧做过 CLIP-ReID 特征压缩与开放集拒识，硬件侧主导过 RFID 与多目视觉同步采集装置的整机搭建，习惯用可复现的实验数据验证结论。",
    en: "My research covers computer vision, individual re-identification (ReID), and embedded intelligent sensing. On the algorithm side I have worked on CLIP-ReID feature compression and open-set rejection; on the hardware side I led the construction of an RFID plus multi-camera synchronized acquisition device. I validate conclusions with reproducible experimental data.",
  },
  politicalStatus: { zh: "中共党员", en: "Member of the Communist Party of China" },
  /**
   * 三大核心优势属于对该条目的自我评价，不单独标注可见性，
   * 统一继承 AboutProfile 的 public + verified 状态。
   */
  strengths: [
    {
      id: "full-stack-engineering",
      title: { zh: "全栈工程能力", en: "Full-Stack Engineering" },
      description: {
        zh: "从算法建模、模型压缩到硬件搭建与边缘部署可独立打通全链路：独立完成 CLIP-ReID 投影层设计与训练，也独立完成 RFID 与三路全局快门相机的整机结构设计、防水封装与多线程同步采集程序开发。",
        en: "Able to carry a project end to end alone — from algorithm design and model compression through hardware construction and edge deployment. I designed and trained the CLIP-ReID projection layer myself, and also built the full mechanical structure, waterproof enclosure, and multi-threaded synchronized acquisition software for an RFID plus three global-shutter camera rig.",
      },
    },
    {
      id: "rigorous-research",
      title: { zh: "严谨科研素养", en: "Rigorous Research Practice" },
      description: {
        zh: "习惯用可复现实验与量化指标说话：自建 92 个身份、万余张图像的鱼类数据集，闭集 Rank-1 达 76.3%，并额外报告部署级 FAR 6.91% 与 AUROC 0.7108，不回避开放集场景下的性能边界。",
        en: "I let reproducible experiments and quantified metrics speak. I built a fish dataset of 92 identities and over ten thousand images, reached 76.3% closed-set Rank-1, and additionally reported deployment-level FAR 6.91% and AUROC 0.7108 rather than hiding the limits of open-set performance.",
      },
    },
    {
      id: "comprehensive-quality",
      title: { zh: "综合素质过硬", en: "Comprehensive Capability" },
      description: {
        zh: "中共党员，本科获国家奖学金、国家励志奖学金并获评四川省优秀毕业生；担任项目负责人期间独立完成实验设计、跨学科沟通与工程规范沉淀，具备把复杂任务拆解并推进到交付的能力。",
        en: "A CPC member who earned the National Scholarship, the National Encouragement Scholarship, and the Sichuan Province Outstanding Graduate award as an undergraduate. As project lead I owned experimental design, cross-disciplinary coordination, and engineering documentation — the ability to break a complex task down and drive it to delivery.",
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
          period: { zh: "2020.09 – 2023.06", en: "2020.09 – 2023.06" },
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
            en: "Industrial Leopard Coral Grouper Smart Aquaculture Management Project",
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
        en: "Fig. 1 On-site working environment at the industrial grouper aquaculture facility",
      },
      alt: {
        zh: "工厂化东星斑养殖现场与驻场工作环境",
        en: "On-site working environment at the industrial grouper aquaculture facility",
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
        zh: "图3 RFID芯片注射标准化操作流程执行现场",
        en: "Fig. 3 Executing the standardized RFID chip injection procedure",
      },
      alt: {
        zh: "RFID 芯片注射标准化操作流程执行现场",
        en: "Executing the standardized RFID chip injection procedure",
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
