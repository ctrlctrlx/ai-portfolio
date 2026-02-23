
# 📄 终极产品需求文档 (PRD)：AI 全栈求职引擎与成长工作站

## 1. 产品愿景与目标 (Vision & Goals)

- **产品定位**：面向 2026 年 AI 算法岗秋招的**高度模块化个人技术工作站**。前期作为极客风求职简历，降维打击传统 PDF；后期平滑升级为“自动化职业增长 Agent”闭环 SaaS 系统。
- **核心受众**：顶级互联网大厂与 AI 独角兽企业的 HR、技术总监、算法 Leader。
- **核心价值**：全方位展现算法研发（CV/VIO/SLAM 等）、边缘端工程部署，以及现代 Web 全栈架构的综合落地实力。

## 2. 技术选型与底层架构 (Tech Stack & Architecture)

- **核心框架**：Next.js 14+ (App Router) + React + TypeScript。
- **全球化路由 (i18n)**：基于 App Router 目录结构与 Middleware 实现 URL 级别的中英双语无缝切换。
- **视觉与样式**：Tailwind CSS + `next-themes`（支持极客暗黑与纯净明亮双主题）。
- **云端与状态层**：Vercel 托管部署，Vercel KV (Redis) 处理高并发，Vercel Web Analytics 追踪访问漏斗。
- **内容与数据层**：
  - 结构化配置：`data/resumeData.ts`。
  - 学术洞察博客：`content/*.mdx`，集成 `remark-math` + `rehype-mathjax` 原生支持 LaTeX。

## 3. 核心数据结构设计 (Core Data Architecture)

`data/resumeData.ts` 是整个网站的灵魂，采用强类型定义。

- **基础模块**：双语个人信息、教育背景、论文/专利（包含作者高亮机制）。
- **[⭐ 核心采纳] 深度面试语料库 (Project Interface)**：
  - 为项目增加 `coreSkill: string[]`（如 `["PyTorch", "TensorRT", "YOLOv11"]`）。
  - 增加 `interviewFocus: string[]`（如 `["边缘端显存优化", "BoT-SORT 多目标跟踪调优"]`）。
  - **作用**：在前端渲染标签墙，同时作为 System Prompt 的核心语料喂给 AI Agent，引导面试官向你最擅长的技术难点提问。
- **SaaS 演进预留**：预留 `isInteractive: boolean` 与 `liveDemoUrl: string`，为未来接入自动化技能反哺系统预留专属交互入口。

## 4. 核心功能模块详细设计 (Core Modules)

### 4.1 极客门面与代码自证 (Hero & GitHub Live)

- 首屏终端打字机特效引入，包含组件化姓名 `<Yang />`。
- 调用 GitHub GraphQL API 实时渲染 Contribution Graph（绿点热力图），自证代码活跃度。

### 4.2 STAR 项目长廊 (Projects Showcase)

- 基于 STAR 法则拆解项目（情境、任务、行动、结果），突出量化成果（如 mAP 指标提升）。
- **加载体验**：严格使用 Next.js `<Image>` 配合灰色脉冲动画 (Skeleton) 实现懒加载。
- **[⭐ 核心采纳] 移动端极简折叠**：针对手机端浏览，强制使用 HTML 原生的 `<details>` 和 `<summary>` 标签包裹长段的 STAR 描述与技术细节。默认仅展示标题与量化成果，点击丝滑展开，零 JS 开销实现极致移动端 UX。

### 4.3 技术洞察与学习笔记 (Tech Insights / Logs)

- 支持 Markdown 与 React 组件混编 (MDX)。
- **[⭐ 核心采纳] LaTeX 移动端缩放防御**：除了常规的横向滚动 (`overflow-x-auto`)，在全局 CSS 层面为所有的数学公式容器 (`.katex-display`) 增加 `touch-action: pan-x pinch-zoom;` 属性，允许 HR 在手机上双指放大复杂的矩阵推导公式，提供极其贴心的学术阅读体验。

### 4.4 悬浮 AI 数字分身 (AI Agent)

- 右下角悬浮暗黑风终端 Chatbox，对接 DeepSeek-Chat API。
- 严格的 System Prompt 约束，化身“专业技术面试官助理”，拒绝闲聊。
- **[⭐ 核心采纳] API 降级策略 (Circuit Breaker) 与 Token 限流**：
  - **钱包防御**：在后端 `/api/chat` 中严格限制单次请求的 `max_tokens`，并结合 Redis 实现 IP 级别的请求频率限流（如 5次/分钟）。
  - **体验兜底**：前端代码捕获 `429 Too Many Requests` 或超时错误。一旦触发，Chatbox 平滑降级，UI 提示“AI 助理正在忙碌”，并自动在对话框下方弹出**预设好的静态 Q&A 快捷按钮**（如：“介绍一下你的鱼类 ReID 项目”），点击直接返回静态答案，绝不出现报错白屏。

### 4.5 简历增强组件 (Enhancements)

- **纯净 PDF 一键导出**：基于 `react-to-print` 与 `@media print` 媒体查询，导出时自动隐藏悬浮窗与主题切换键，强制白底黑字。
- **极客访客计数器**：Footer 底部对接 Redis 实现全网原子自增。
- **社交分享优化**：配置完整的 Open Graph (SEO) 标签，确保微信/钉钉分享时解析出精美卡片。

## 5. 演进路线图 (Roadmap)

- **Phase 1：骨架与学术基建** (跑通 Vercel 部署、双语路由、MDX 与 STAR 项目折叠渲染)。
- **Phase 2：数字分身与高可用防护** (上线带限流与降级策略的 DeepSeek 助理、访客计数器)。
- **Phase 3：SaaS 级职业闭环系统** (后期激活 `/career-agent` 路由，打通自动化数据抓取与技能雷达看板)。

