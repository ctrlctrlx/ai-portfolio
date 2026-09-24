# 投递前最终修复报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：统一全站求职意向文案、彻底清除英文页中文泄漏、全量校验
- 状态：**全部通过**（`npm run verify` 全链路绿；生产构建 30/30 静态页生成成功）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 结果 |
| --- | --- |
| 求职意向四处（首页 / 简历页 / about.jobTargets / identity.jobTargets） | 完全一致，单一数据源 |
| English 页面可见文本汉字数 | **0**（11 条路由全部为 0） |
| English 页面可见文本中文标点数 | **0** |
| English 页面 DOM 源码汉字数 | 10，全部位于根布局的双语 `<noscript>` 兜底提示内（含英文半句） |
| English 页面资源包（客户端 JS chunk）中的 profile 数据集 | **已完全移除** |
| 中文页面导航 / 页脚 | 与修改前**逐字节一致** |
| `npm run verify` | content / profile / chat / resume / lint / typecheck / build 全部通过 |
| 生产构建 | 30/30 静态页生成成功 |

### 0.1 一处需求冲突（已由你裁定）

任务书要求 `about.ts` 的 `jobTargets` 写成 `"AI 算法工程师" / "AI Algorithm Engineer"`，但
`scripts/verify-profile-data.mjs` 的「不可支持职业身份」守卫正则自首次重建提交起就禁止这两个字符串出现在
数据层（`/\bSenior\b|\bExpert\b|Published Researcher|AI Algorithm Engineer|SLAM Engineer|AI 算法工程师|资深|专家/i`），
两者无法同时满足。你裁定改为：

- zh：`计算机视觉算法工程师`、`嵌入式AI/边缘部署工程师`
- en：`Computer Vision Algorithm Engineer`、`Embedded AI / Edge Deployment Engineer`

该措辞不触发守卫，**校验脚本的防编造职称规则未被削弱**，同时满足「统一全站文案」与「verify:profile 通过」。

---

## 1. 修改文件清单与逐处说明

> 说明：工作区在本次开工前已存在 12 个文件的未提交改动（上一轮 skills 三分类重组、PublicationCard / ResumeDownloadButton 调整等）。这些改动我**完整保留**并在其上继续工作，下面单独标注。

### 1.1 本次修改：数据层

#### `src/data/profile/about.ts`
- `jobTargets`：3 条 → 2 条统一口径（`计算机视觉算法工程师` / `嵌入式AI/边缘部署工程师`），并补注释说明"全站唯一口径"。
- 其余字段（headline / summary / strengths / practice / practiceImages / contacts）**未改动**。
- 实践经历结束日期 `period` 原本已是双语（`zh: "2025.12 – 至今"` / `en: "2025.12 – Present"`），任务书 2.1③ 要求项**已满足**，无需改动。

#### `src/data/profile/identity.ts`
- `jobTargets`：`硬件测试 / 计算机视觉算法 / 嵌入式系统` → 与 `about.jobTargets` 完全一致的 2 条。
- 理由：该字段是任务书"全网站统一无歧义"的另一处求职意向来源（校验脚本要求其非空且双语），保留旧值会让仓库里同时存在两套矛盾口径。

#### `src/data/profile/projects.ts`
- `endDate`：`"至今"` → `{ zh: "至今", en: "Present" }`；另两条 `"2026.09"` / `"2026.08"` → 双语结构（中英同值，日期本身与语言无关）。
- `techTags`：`string[]` → `BilingualText[]`，逐条补专业英文（见 §2 对照表）。
- `coreSkill`：`string[]` → `BilingualText[]`，逐条补英文。**这是任务书未显式列出但必须处理的一项**：简历页直接渲染 `coreSkill`，其中 `特征压缩 / 实验设计 / 数据整理` 等会泄漏到 `/en/resume`。
- `getProjectTechTags()` 返回类型随之改为 `BilingualText[]`（回退到 `coreSkill` 的逻辑不变）。
- 标题 / 简介 / situation / task / action / result / highlights / metrics / images / documents / 数值指标 **全部未改动**。

#### `src/data/profile/skills.ts`
- 26 个技能条目、3 个分类、分组标题**均已为双语结构**（开工前的工作区状态已满足任务书 2.1② 与"分组标题：编程语言 / 框架与工具 / 研究方向"要求），本次**未改动**。
- 复核：条目数 4（编程语言）+ 15（框架与工具）+ 7（研究方向）= **26 条**，与任务书要求一致，无增删。

#### `src/data/profile/types.ts`
- `Project.endDate`：`string` → `BilingualText`
- `Project.coreSkill`：`string[]` → `BilingualText[]`
- `Project.techTags`：`string[]` → `BilingualText[]`
- 以上三处均补了字段注释。

### 1.2 本次修改：渲染层

#### `app/[lang]/page.tsx`（首页）
- 项目预览卡日期：`{project.endDate}` → `{project.endDate[locale]}`（消除 `/en` 的"至今"）。
- 首屏「求职方向」段落：不再硬编码文案，改为读取 `publicAbout.jobTargets`（`求职方向：` / `Job Objective: ` 前缀 + `join(" / ")`），与简历页共用同一数据源；`<p>` 的 className / style 完全保留。
- 首屏 `h1`：`杨冲` 中文姓名对照**仅在中文首页渲染**；`/en` 首屏不再出现中文字符（原为 `publicIdentity.name[oppositeLocale]`）。
- 移除随之不再使用的 `oppositeLocale` 变量。

#### `app/[lang]/projects/page.tsx`（项目列表）
- 卡片日期：`{proj.endDate}` → `{proj.endDate[locale]}`。
- 技术标签：`{proj.techTags.map(...)}` 改为按 `locale` 取词，`key` 由 `tag`（原为字符串）改为 `tag.zh`（稳定唯一，且不依赖 locale）。
- 标签 `<span>` 的 className / style **逐字保留**。

#### `app/[lang]/projects/[slug]/page.tsx`（项目详情）
- 头部日期：`{project.endDate}` → `{project.endDate[locale]}`。
- 技术标签区：`[...project.techTags, ...highlights]` → `[...techTags.map(t => t[locale]), ...highlights.map(h => h[locale])]`；数量、顺序、`<li>` 样式不变。
- 指标 `key`：`metric.zh` → `metric.en`。

#### `app/[lang]/resume/page.tsx`（在线简历）
- 项目起止日期：`{project.endDate}` → `{project.endDate[locale]}`。
- 项目核心技能行：`{project.coreSkill.join(" · ")}` → `{project.coreSkill.map(e => e[locale]).join(" · ")}`（消除 `/en` 的中文技能条目）。
- 教育 `highlights` 的 `key`：`highlight.zh` → `highlight.en`。
- 微信联系行：全角冒号改为按 locale 取 `：` / `: `。
- 求职意向行 `publicAbout.jobTargets.map(t => t[locale]).join(" / ")` 原本已正确，仅随数据变化更新文案。

#### `app/[lang]/research/page.tsx`（学术成果）
- 论文指标 `key`：`metric.zh` → `metric.en`。
- 论文 `tags` 数据本身即为英文（`Blockchain` / `Spectrum Sensing` / `Fish Re-ID` …），中英文页展示相同，**保持不动**（改动会破坏"中文页与修改前一致"）。

#### `src/components/Education.tsx`
- 教育 `highlights` 的 `key`：`highlight.zh` → `highlight.en`。
- `startDate` / `endDate` 为纯数字日期（`2024.09` / `2027.06`），与语言无关，保持 `string`。

#### `src/components/About.tsx`
- 「政治面貌」两处（首页精简版 + 内页完整版）：全角冒号改为 `政治面貌：` / `Political status: `。
- 实践经历条目 `key`：`bullet.text.zh` → `bullet.text.en`。
- `ImageGallery` 调用：传入按 locale 解析后的纯字符串（见下）。

#### `src/components/ImageGallery.tsx`
- `GalleryImage` 接口的 `caption` / `alt`：`{ zh, en }` → `string`；`lightboxLabel`：`{ zh, en }` → `string`。
- 原因：本组件是**客户端组件**，接收双语对象会让 React 把中英两套文本一并序列化进 /en 页面的 RSC payload（`图1 算法整体框架图`、`项目展示图片预览` 等）。改为调用方（服务端组件）先按 locale 解析。
- 组件内所有 className / style / 交互（灯箱、键盘 Esc/←/→、懒加载、`sizes`）**完全未改动**。

### 1.3 本次修改：清除 /en 资源包中的双语数据集

这三处不改任何视觉与文案，只把"客户端组件直接引用数据层"的依赖挪到服务端。

#### `src/components/Navbar.tsx`
- 移除 `import { publicAbout, publicAwards, ... } from "@/src/data/profile"`。
- 改为接收服务端传入的 `name: string` 与 `hasAbout` / `hasResearch` / `hasHonors: boolean`。
- `getNavLinks()` 与所有渲染逻辑、className、style 不变。

#### `src/components/Footer.tsx`
- 移除 `import { getContactHref, getPublicContact, publicIdentity } from "@/src/data/profile"`。
- 改为接收 `brandName` / `copyrightName` / `email` / `hasHonors` / `extraContacts`。
- 页脚两处全角冒号改为按 locale 取 `：` / `: `。
- 因 `footer.ts` 被本客户端组件引用，同步处理 ↓

#### `src/data/site/footer.ts`
- 移除 `import { publicAbout, publicAwards, publicCompetitions, publicCredentials, publicIdentity } from "@/src/data/profile"`。
- `getFooterDictionary(locale)` → `getFooterDictionary(locale, summary)`，`summary` 由服务端布局传入（`name` / `hasHonors` / `extraContacts`）。
- `FooterExtraContact.label` 由 `Record<Locale, string>` 改为已解析的 `string`。
- 版权行仍固定使用英文姓名（`publicIdentity.name.en ?? "Yang Chong"`），行为与改动前一致。

#### `src/components/ChatBox.tsx`
- 移除 `import { publicIdentity } from "@/src/data/profile"`（仅在开场白里用到姓名）。
- 开场白改为服务端下发的 `greeting: string` 属性；开场白文案与改动前**逐字一致**。

#### `app/[lang]/layout.tsx`
- 新增服务端派生并下发：`chatGreeting`、`siteName`、`copyrightName`、`publicEmail`、`hasHonors`、`footerContacts`（`about.contacts` 的 label / value 按 locale 解析）。
- 客户端组件不再引用数据层。

#### `src/lib/i18n.ts`
- 新增 `localeSwitchLabels`（按"当前页面语言"取切换按钮文案）：`zh: "EN"`（不变）、`en: "Chinese"`。
- 原 `localeLabels`（`zh: "中文"`）保留未删。

### 1.4 本次修改：校验脚本（结构性适配，非放宽）

#### `scripts/verify-profile-data.mjs`
```diff
-  } else if (project.techTags.some((tag) => typeof tag !== "string" || tag.length === 0)) {
+  } else if (project.techTags.some((tag) => !isBilingual(tag))) {
     fail("invalid-project-tech-tag", project.id);
   }
   if (!Array.isArray(project.coreSkill) || project.coreSkill.length === 0) {
     fail("missing-project-core-skill", project.id);
+  } else if (project.coreSkill.some((entry) => !isBilingual(entry))) {
+    fail("invalid-project-core-skill", project.id);
   }
+  if (!isBilingual(project.endDate)) {
+    fail("missing-bilingual-field", `project:${project.id}:endDate`);
+  }
```
- 这是 `techTags` 由 `string[]` 改为 `BilingualText[]` 的必然适配。
- 规则强度**提高**而非降低：原来只检查"非空字符串"，现在要求中英两语均非空；并新增了 `coreSkill` 双语校验与 `endDate` 双语校验。
- 「不可支持职业身份」等隐私与事实守卫**未做任何改动**。

### 1.5 开工前已存在的未提交改动（我原样保留）

`app/[lang]/page.tsx`、`app/[lang]/projects/page.tsx`、`app/[lang]/projects/[slug]/page.tsx`、
`app/[lang]/research/page.tsx`、`src/components/PublicationCard.tsx`、`src/components/ResumeDownloadButton.tsx`、
`src/components/Skills.tsx`、`src/data/profile/projects.ts`、`src/data/profile/publications.ts`、
`src/data/profile/skills.ts`、`src/data/profile/types.ts`、`src/data/site/lastUpdated.ts`

其中 `src/data/site/lastUpdated.ts` 由 `prebuild` 的 `generate-last-updated.mjs` 从 git 提交时间生成
（`iso` 变为 `2026-09-18T11:48:24.000Z`），属构建副产物，非人工编辑。

---

## 2. 翻译字段对照表

### 2.1 求职意向（全站统一口径）

| 字段 | 中文 | 英文 |
| --- | --- | --- |
| `about.jobTargets[0]` / `identity.jobTargets[0]` | 计算机视觉算法工程师 | Computer Vision Algorithm Engineer |
| `about.jobTargets[1]` / `identity.jobTargets[1]` | 嵌入式AI/边缘部署工程师 | Embedded AI / Edge Deployment Engineer |

渲染位（共 4 处，均为同一数据源）：

| 位置 | 中文呈现 | 英文呈现 |
| --- | --- | --- |
| `/zh`·`/en` 首页首屏「求职方向」 | 求职方向：计算机视觉算法工程师 / 嵌入式AI/边缘部署工程师 | Job Objective: Computer Vision Algorithm Engineer / Embedded AI / Edge Deployment Engineer |
| `/zh`·`/en` 简历页「求职意向」 | 求职意向：计算机视觉算法工程师 / 嵌入式AI/边缘部署工程师 | Target roles: Computer Vision Algorithm Engineer / Embedded AI / Edge Deployment Engineer |

### 2.2 项目 `endDate`

| 项目 | 中文 | 英文 |
| --- | --- | --- |
| fish-reid-open-world | 至今 | Present |
| rfid-multiview-acquisition | 2026.09 | 2026.09 |
| grouper-tagging-standard | 2026.08 | 2026.08 |

### 2.3 项目 `techTags`（卡片 + 详情页标签）

| 项目 | 中文 | 英文 |
| --- | --- | --- |
| ① 鱼类个体重识别 | PyTorch | PyTorch |
| ① | CLIP-ReID | CLIP-ReID |
| ① | 特征压缩 | Feature Compression |
| ① | 开放集识别 | Open-Set Recognition |
| ① | 论文成果 | Research Publication |
| ② RFID/多目视觉装置 | Python | Python |
| ② | 多线程 | Multithreading |
| ② | RFID | RFID |
| ② | 机器视觉 | Machine Vision |
| ② | 嵌入式系统 | Embedded Systems |
| ② | 硬件搭建 | Hardware Assembly |
| ③ 东星斑标记标准化 | 对照实验 | Control Experiment |
| ③ | SOP标准化 | SOP Standardization |
| ③ | 工程落地 | Engineering Implementation |

### 2.4 项目 `coreSkill`（简历页核心技能行）

| 项目 | 中文 | 英文 |
| --- | --- | --- |
| ① | Python / PyTorch / CLIP / ReID / Open-Set Recognition | 同左（原即英文） |
| ① | 特征压缩 | Feature Compression |
| ② | 嵌入式系统 | Embedded Systems |
| ② | RFID | RFID |
| ② | 全局快门相机 | Global Shutter Cameras |
| ② | Python 多线程 | Python Multithreading |
| ② | USB 3.2 | USB 3.2 |
| ② | UPVC 结构设计 | UPVC Structural Design |
| ③ | 实验设计 | Experimental Design |
| ③ | 对照实验 | Control Experiment |
| ③ | 标准化流程 | Standardized Workflow |
| ③ | 动物标记技术 | Animal Tagging Techniques |
| ③ | 数据整理 | Data Consolidation |

### 2.5 已确认无需改造（复核结论）

| 字段 | 结论 |
| --- | --- |
| `skills` 全部条目 / 分组标题 / 分类标题 / 分类说明 | 已为 `BilingualText`，26 条无增删 |
| `about.practice[].period` | 已为双语（`2025.12 – 至今` / `2025.12 – Present`） |
| `education.startDate` / `endDate` | 纯数字日期，与语言无关 |
| `publications[].tags` | 数据本身即英文，中英页一致 |
| `award.year` / `patent.*Date` | 数字或 ISO 日期，与语言无关 |
| `--`（em dash） | 英文排版用长破折号（U+2014），非中文标点，保留 |

---

## 3. 全量校验结果汇总

命令：`npm run verify`（= `verify:content && verify:profile && verify:chat && verify:resume && lint && typecheck && build`）

| 步骤 | 命令 | 结果 |
| --- | --- | --- |
| 公开内容校验 | `verify:content` | ✅ passed（65 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| Profile 数据校验 | `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| Chat 契约校验 | `verify:chat` | ✅ passed（18 quick prompts, 3 public projects） |
| 简历校验 | `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| Lint | `eslint` | ✅ 无输出（0 error / 0 warning） |
| 类型检查 | `tsc --noEmit` | ✅ 零错误 |
| 生产构建 | `next build` | ✅ 30/30 静态页面生成成功 |

`verify:profile` 通过项包含：姓名唯一性（`杨冲` = 1、`Yang Chong` = 1）、证据状态合法性、
双语字段完整性、slug 稳定性、技能分组与扁平列表 ID 集合一致、论文/专利/荣誉计数、
未授权手机号与邮箱拦截、禁止编造职称。

**PDF 文本审计**：本机存在 `pdftotext`（MiKTeX）。在受限沙箱下 Node 无法创建命名管道（`spawn EPERM`），
审计会退化为字节级扫描；本次最终校验在放宽权限下运行，`resume.pdf` **完成了完整文本审计**
（已批准手机号、邮箱、姓名均已核对命中）。

---

## 4. 英文页验收结果（生产服务器实测）

`npx next start -p 3311` 后逐路由抓取 HTML 并扫描。

### 4.1 可见文本（剥离 `<script>` / `<style>` / `<noscript>`）

| 路由 | 汉字数 | 中文标点数 |
| --- | --- | --- |
| `/en` | 0 | 0 |
| `/en/about` | 0 | 0 |
| `/en/projects` | 0 | 0 |
| `/en/projects/fish-reid-open-world` | 0 | 0 |
| `/en/projects/rfid-multiview-acquisition` | 0 | 0 |
| `/en/projects/grouper-tagging-standard` | 0 | 0 |
| `/en/resume` | 0 | 0 |
| `/en/honors` | 0 | 0 |
| `/en/research` | 0 | 0 |
| `/en/contact` | 0 | 0 |
| `/en/blog` | 0 | 0 |

### 4.2 DOM 源码

各路由仅剩 10 个汉字 + 1 个中文句号，全部位于 `app/layout.tsx` 根布局的
`<noscript>请开启 JavaScript 以正常浏览本站。 / Please enable JavaScript to browse this site properly.</noscript>`。
该节点是**有意的双语兜底提示**（自带英文半句，仅在浏览器禁用 JS 时显示）；根布局无 locale 上下文，
按语言拆分需要把 noscript 上移到 `[lang]/layout.tsx`，会使 `/`、404 等路由失去兜底，故保留。详见 §7。

### 4.3 关键文案抽样（实测输出）

| 位置 | 实测 |
| --- | --- |
| `/en` 首页求职方向 | `Job Objective: Computer Vision Algorithm Engineer / Embedded AI / Edge Deployment Engineer` |
| `/en` 首页项目日期 | `2025.03 – Present` |
| `/en/projects` 标签 | Control Experiment / Engineering Implementation / Feature Compression / Hardware Assembly / Machine Vision / Multithreading / Open-Set Recognition / Present / Research Publication / SOP Standardization |
| `/en/resume` | `Target roles: Computer Vision Algorithm Engineer / Embedded AI / Edge Deployment Engineer` |
| `/en`·`/en/resume` 页脚微信 | `WeChat: Galaxy24664` |
| `/en` 页脚更新时间 | `Last updated: 09/18/2026` |
| `/en/about` 政治面貌 | `Political status: Member of the Communist Party of China` |
| `/en` 首屏 `h1` | `Yang Chong`（不再附带中文姓名） |
| `/en` 语言切换按钮 | `Chinese` |

### 4.4 资源包

- **profile 双语数据集已完全移出客户端 bundle**：全量扫描 `.next/static/chunks/*.js`，已找不到 `profile-about` / `profile-project-fish-reid` 等数据标识（此前由 `Navbar` / `Footer` / `ChatBox` / `site/footer.ts` 在客户端模块图中引入，约 62 KB、4009 个汉字的 `about / projects / publications / skills` 全文随每个页面下发）。
- 剩余 376 个汉字分布在 4 个**中英共用**的客户端 chunk 中，全部是 `locale === "zh" ? "…" : "…"` 的**中文分支 UI 文案**（图片灯箱按钮、错误边界、AI 助理快捷问题等），在 `/en` 永不渲染。详见 §7。

---

## 5. 中文页回归验证

在改动前先抓取 `/zh`、`/zh/resume`、`/zh/projects` 的 `<nav>` 与 `<footer>` 原文作为基线，
改动后逐字节比对：

| 路由 | `<nav>` | `<footer>` |
| --- | --- | --- |
| `/zh` | ✅ IDENTICAL | ✅ IDENTICAL |
| `/zh/resume` | ✅ IDENTICAL | ✅ IDENTICAL |
| `/zh/projects` | ✅ IDENTICAL | ✅ IDENTICAL |

`/en` 的 `<nav>` 同样逐字节一致；`<footer>` 的差异**仅为**两处全角冒号 → 半角冒号（本次有意修复）。

中文页文案抽样（与修改前一致）：`求职意向：计算机视觉算法工程师 / 嵌入式AI/边缘部署工程师`、
`微信：Galaxy24664`、`最后更新：2026/09/18`、`政治面貌：中共党员`、
标签 `至今 / 特征压缩 / 开放集识别 / 论文成果 / 对照实验 / SOP标准化 / 工程落地 / 机器视觉 / 多线程 / 硬件搭建`。

---

## 6. 视觉一致性保证

- 所有标签仍复用原有类名与主题令牌（`--tag-bg` / `--tag-text` / `--tag-border` / `--card` / `--card-border` / `--muted` / `--accent`），**未新增任何自定义样式**。
- 技术标签、指标、日期、技能标签的圆角（`rounded-full`）、间距（`gap-2` / `px-2.5 py-1` / `px-3 py-1`）、字号（`text-xs` / `text-sm`）逐字保留。
- 标签数量与顺序不变（`techTags` 与 `coreSkill` 均未增删条目）。
- `<nav>` / `<footer>` / 首页 `h1` / 求职方向 `<p>` 的 DOM 结构与 className 未变；`<nav>`、`<footer>` 已用逐字节比对证明无偏移。
- 唯一有意的可见文本变化：`/en` 的两处全角冒号 → 半角冒号；`/en` 首页 `h1` 去掉中文姓名对照；`/en` 语言切换按钮 `中文` → `Chinese`。中文页零变化。

---

## 7. 残留事项（不影响本次验收）

1. **根布局 `<noscript>` 双语兜底**（`app/layout.tsx`）：`/en` 的 HTML 源码中仍含
   `请开启 JavaScript 以正常浏览本站。`（同一节点内含英文半句）。仅在浏览器禁用 JS 时可见。
   若要彻底消除，需把该节点迁入 `app/[lang]/layout.tsx` 并接受 `/`、404 等无 lang 路由失去兜底。

2. **中英共用客户端 chunk 中的中文分支文案**（4 个文件、376 个汉字）：属同 bundle 双语的固有形态
   （`ImageGallery` 灯箱按钮、`app/[lang]/error.tsx` 错误页、`ChatBox` 快捷问题、`src/lib/i18n.ts` 的
   `localeLabels`），在 `/en` 永不渲染。彻底消除需按 locale 做代码分割，收益不可见，建议不做。

3. **`public/resume.pdf` 未重新生成**：`pdftotext` 抽取确认该 PDF **不含**「求职意向 / 求职方向」行
   （只有「研究方向」与「课题方向」），因此与网页端新文案不存在冲突；同时不含任何未授权手机号/邮箱。
   若你希望 PDF 也出现新的求职意向措辞，需要重新排版该 PDF——本次未改动该二进制资产。

4. **`localeLabels`（`src/lib/i18n.ts`）已无引用**：`Navbar` 改用 `localeSwitchLabels`。
   保留未删以免影响潜在消费者；如需清理可后续删除。

5. **工作区未提交改动**：本次未创建任何 commit。开工前已有的 12 个文件改动与本次改动仍在同一工作区中，
   提交前请自行确认这两批改动都要保留。

---

## 8. 部署前检查清单

### 校验
- [x] `npm run verify` 全链路通过（content / profile / chat / resume / lint / typecheck / build）
- [x] `npx tsc --noEmit` 零错误
- [x] `npm run lint` 零告警
- [x] `next build` 30/30 静态页生成成功
- [x] `verify:profile`：姓名唯一性、证据状态、双语完整性、slug 稳定性全部通过
- [x] `resume.pdf` 完成 PDF 文本级隐私审计（已批准手机号 / 邮箱 / 姓名命中）

### 英文页
- [x] 11 条 `/en` 路由可见文本汉字数 = 0、中文标点数 = 0
- [x] 首页求职方向、技能分类与标签全部英文
- [x] `/en/projects` 标签、指标、日期全部英文（日期含 `Present`）
- [x] `/en/projects/[slug]` 三个详情页标签、文案、日期全部英文
- [x] `/en/resume` 日期、技能、标签全部英文
- [x] 页脚「微信」「最后更新」为半角冒号
- [x] 语言切换按钮显示 `Chinese`
- [x] 客户端资源包中不再包含 profile 双语数据集

### 中文页
- [x] `/zh`、`/zh/resume`、`/zh/projects` 的 `<nav>`、`<footer>` 与改动前逐字节一致
- [x] 求职意向新文案在首页与简历页一致呈现
- [x] 项目标签、日期、技能标签仍为中文，无错乱

### 发布
- [x] 本次未部署、未创建 commit / tag / branch / push（按仓库规则）
- [ ] 由你决定是否提交（注意：工作区含开工前已有的 12 个文件改动）
- [ ] 若正式验收需要 PDF 文本审计，请在具备 `pdftotext` 的环境执行 `npm run verify:all`
      （本机在放宽权限下已完成该审计）
