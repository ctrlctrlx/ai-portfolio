// 使用相对路径而非 @/ 别名：profile 数据层需要能被 Node 校验脚本直接加载
import type { ProjectDocument } from "./types";

/**
 * 项目相关文档路径登记表：只登记 public/docs/ 下的相对路径与元信息，
 * 文件名与实际存放的英文文件名完全一致（大小写一致）。
 *
 * 目录约定：全部文档放在 public/docs/。
 *
 * 项目1（东星斑个体重识别研究）当前未挂载可下载文档：
 *   其 EI 论文全文未放入 public/docs/，论文条目本身已在
 *   /[lang]/honors 与 /[lang]/research 的「学术成果」中完整展示。
 *   后续如需提供下载，在 projectOneDocuments 中补一条即可，组件会自动渲染。
 */
export const projectOneDocuments: ProjectDocument[] = [];

/** 项目2：RFID 与多目视觉双模态东星斑识别数据采集装置 */
export const projectTwoDocuments: ProjectDocument[] = [
  {
    id: "p2-design-doc",
    title: {
      zh: "基于 RFID 与多目视觉双模态关联的东星斑个体识别数据采集装置",
      en: "Crimson Snapper Individual Identification Data Acquisition Device Based on RFID and Multi-View Vision Dual-Modality Association",
    },
    tag: { zh: "设计文档", en: "Design Document" },
    pdfUrl: "/docs/report-rfid-vision-device.pdf",
  },
];

/** 项目3：东星斑个体标记方法筛选与标准化体系建立 */
export const projectThreeDocuments: ProjectDocument[] = [
  {
    id: "p3-experiment-report",
    title: {
      zh: "东星斑个体标记方法筛选实验报告",
      en: "Experiment Report on Screening Individual Tagging Methods for Crimson Snapper",
    },
    tag: { zh: "实验报告", en: "Experiment Report" },
    pdfUrl: "/docs/report-fish-marker-screen.pdf",
  },
  {
    id: "p3-tag-spec",
    title: {
      zh: "东星斑鱼体标记方法对比与 RFID 芯片注射标准化操作规范",
      en: "Comparison of Tagging Methods and Standardized Operating Specification for RFID Chip Injection in Crimson Snapper",
    },
    tag: { zh: "操作规范", en: "Operating Specification" },
    pdfUrl: "/docs/spec-rfid-inject-standard.pdf",
  },
];
