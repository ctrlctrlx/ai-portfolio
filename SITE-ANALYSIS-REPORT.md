# my-ai-portfolio 网站分析报告

分析对象：`E:\PRD\my-ai-portfolio`（杨冲的中英双语个人求职作品集）
分析方式：只读代码审阅 + 实测命令（`npm run verify:deploy`、`pdftotext`、`.next` 构建产物检查、`git ls-files` / `git diff`），另派两名独立审计代理分别做「代码质量 + 可访问性」与「部署 + 安全隐私」专项复核。
本报告不修改任何文件。

---

## 0. 结论速览

| 维度 | 评分 | 一句话结论 |
|---|---|---|
| 目录结构清晰度 | 8.5 / 10 | 五层分离（路由 / 组件 / 数据 / 逻辑 / 校验脚本），边界清楚；有 4 个死文件与根目录杂物 |
| 技术栈现代度 | 9 / 10 | Next.js 16 + React 19 + TS 严格 + Tailwind v4，均为当前主流版本 |
| 内容完整度 | 8 / 10 | 简介 / 项目 / 技能 / 荣誉 / 论文 / 专利 / 联系方式齐备且双语；博客为空、项目无代码链接 |
| 代码质量 | 8.5 / 10 | 事实数据层 + 5 个自动校验脚本，这套「证据约束」在小体量个人站里罕见；缺测试框架 |
| 响应式设计 | 8.5 / 10 | 真实做了移动端适配与防溢出处理；仅 320px 视口有 1~2 处裁切隐患 |
| 性能 | 6 / 10 | 图片策略优秀、零网络字体；但**全站无预渲染页面**（TTFB 走 Node）+ public 有 8.75MB 无用资源 |
| 可访问性 | 7 / 10 | lang / alt / 对比度 / focus 可见性达标；缺 skip link，灯箱无焦点管理 |
| 求职说服力 | 7.5 / 10 | 量化指标 + 诚实标注局限，工程味浓；缺可点的代码仓库与在线 Demo，论文会议名占位 |
| 部署就绪度 | 7 / 10 | Vercel 可零改造上线；`verify:deploy` 当前**失败 3 项**（含我在前几轮改出的一项回归） |
| 隐私合规 | 5.5 / 10 | 联系方式的授权白名单机制很好；但 `public/docs/*.pdf` 公开了动物麻醉/注射操作细节，与本仓库自身隐私条款冲突 |

---

## 1. 项目结构分析

### 1.1 顶层目录

```
my-ai-portfolio/
├─ app/                      Next.js App Router 路由与全局样式
├─ src/
│  ├─ components/            21 个 UI 组件（服务端为主，少量 "use client"）
│  ├─ data/
│  │  ├─ profile/            16 个文件：唯一事实数据层（双语 + 可见性 + 核验状态）
│  │  ├─ resumeData.ts       旧兼容适配层（已无人 import）
│  │  └─ publicProfile.ts    旧兼容适配层（仅被校验脚本读取）
│  ├─ lib/                   i18n、站点 URL、MDX 读取、Career Agent（.mjs）、DeepSeek 兜底
│  └─ providers/             ThemeProvider（next-themes 明暗主题）
├─ content/posts/            3 篇 MDX 技术文章（当前全部 draft: true）
├─ public/                   图片、简历 PDF、项目文档 PDF（17.1 MB）
├─ scripts/                  5 个校验脚本 + 3 个 lib + 构建期生成脚本
├─ docs/                     deployment-readiness.md（部署准备状态）
├─ proxy.ts                  Next 16 的「中间件替代文件」：语言前缀重写 + 注入 locale 头
├─ next.config.ts            AVIF/WebP 图片优化、/research 301 重定向
├─ package.json / tsconfig.json / eslint.config.mjs / postcss.config.mjs
├─ README.md / AGENTS.md / PRD.md
└─ 14 个 *-REPORT.md（历次改造报告，根目录堆积）
```

### 1.2 各模块职责

| 模块 | 作用 | 关键文件 |
|---|---|---|
| `app/` | 页面、布局、metadata、SEO、API | `app/[lang]/{page,about,projects,projects/[slug],honors,resume,contact,blog}`、`app/api/{chat,visitor}`、`app/sitemap.ts`、`app/robots.ts` |
| `app/globals.css` | 设计令牌（浅/深两套 CSS 变量）、focus 样式、防溢出、KaTeX/表格滚动、**A4 打印样式** | 244 行 |
| `src/components/` | 展示层；无一处硬编码个人事实（全部从数据层取值） | `Honors`、`Skills`、`Education`、`About`、`ChatBox`、`ImageGallery`、`AcademicOutput`… |
| `src/data/profile/` | **唯一事实来源**：双语字段 + `visibility` + `verificationStatus`，经 `public.ts` 过滤出 public+verified 集合 | `identity / about / education / projects / publications / patents / awards / competitions / credentials / skills / research` |
| `src/lib/` | 纯逻辑：语言、站点 URL、文章读取、问答规则引擎 | `career-agent.mjs`（844 行规则引擎）、`deepseekAgent.ts`（可选兜底）、`i18n.ts` |
| `scripts/` | 发布前自动校验（本项目最大工程亮点） | `verify-public-content / verify-profile-data / verify-chat-contract / verify-public-resume / verify-deploy-readiness` |
| `public/` | 静态资源：头像、简历 PDF、3 份项目文档 PDF、项目与配图 | 见 §3.3 |

### 1.3 结构层面的问题

1. **死文件 4 个**：`src/components/Awards.tsx`、`src/components/ResearchAreas.tsx`（全仓零引用）；`src/data/resumeData.ts`、`src/data/publicProfile.ts`（零 import，且 `verify-public-content.mjs:246-263` 明确把引用它们判为错误——项目自我禁用却还留着文件）。
2. **根目录杂物**：`nul`（2513 B，Windows 重定向产物）、`tsconfig.tsbuildinfo`（132 KB）、14 个 `*-REPORT.md`（约 200 KB）。均已被 `.gitignore` 覆盖或未跟踪，但仍在磁盘上。
3. **文档漂移**（比死代码更影响判断）：
   - `README.md:12` 称「没有安装或要求外部 AI 服务」，实际已有 DeepSeek 兜底层；
   - `README.md:53,132` 仍写「研究领域总览标签筛选」，该模块已在本会话中移除；
   - `README.md:102` 写「awards.ts 4 项荣誉」，实际已 11 项；
   - `README.md:140` 称「不提供 PDF 下载文件」，与 `:85-89` 的 `resume.pdf` 下载入口自相矛盾；
   - `docs/deployment-readiness.md:23` 称「28 条静态路由」，实测无任何页面被预渲染（见 §4.3）。
4. **同一份 install 文档两处维护**：README + deployment-readiness 内容重叠，容易继续漂移。

---

## 2. 技术栈识别

| 类别 | 技术 | 版本 / 证据 |
|---|---|---|
| 框架 | Next.js（App Router、Turbopack） | `package.json:26` `next 16.1.6`；构建输出 `▲ Next.js 16.1.6 (Turbopack)` |
| UI 库 | React / React DOM | `19.2.3` |
| 语言 | TypeScript 严格模式 | `tsconfig.json`（`strict`），`npx tsc --noEmit` 零错误 |
| 样式 | Tailwind CSS v4（CSS-first，`@import "tailwindcss"` + `@theme inline`） | `package.json:47`、`app/globals.css:1,41-46` |
| 主题 | next-themes（class 策略，`@custom-variant dark`） | `src/providers/ThemeProvider.tsx`、`globals.css:8` |
| 图标 | lucide-react | `package.json:25` |
| 内容 | MDX（gray-matter + next-mdx-remote）、KaTeX、remark-gfm/math | `package.json:21-23,27-28`、`src/lib/posts.ts` |
| 后端能力 | Route Handlers（`/api/chat`、`/api/visitor`）、Next 16 `proxy.ts`（原 middleware） | `app/api/**`、`proxy.ts` |
| 可选云服务 | Vercel KV（访客计数 + 聊天限流）、DeepSeek API（问答兜底） | `app/api/visitor/route.ts:16`、`src/lib/deepseekAgent.ts:70` |
| 构建/包管理 | npm（`packageManager: npm@10.9.2`）、ESLint 9 flat config、PostCSS + `@tailwindcss/postcss` | `package.json:4,7-23`、`eslint.config.mjs`、`postcss.config.mjs` |
| 脚本体系 | 7 个 npm script + 8 个 Node 脚本（含 `verify:all` 全链路） | `package.json:9-24` |
| 未使用 | 无测试框架（Jest/Vitest/Playwright 均未安装）、无 CI 配置（无 `.github/workflows`） | — |

**没有** HTML/CSS/JS 手写栈、Vue、Webpack 自定义配置、第三方 UI 组件库或网络字体——UI 全部自研 + Tailwind 令牌。

---

## 3. 功能与内容梳理

### 3.1 页面清单（中英双语各一份，共 10 个 page 文件 / 20 个公开 URL）

| 路由 | 内容 |
|---|---|
| `/[lang]` | 首屏：求职定位标签、姓名、学历行（院校·专业·学位·GPA·起止）、政治面貌、求职方向、研究方向标签、一句话卖点、籍贯/现居、按钮组（下载简历 / 查看项目 / 关于我 / 联系我 / 打开 AI 助理）+ 教育经历 + 荣誉预览（前 3 条）+ 技能栈 + 代表项目 3 张卡 |
| `/[lang]/about` | 个人简介（三段式量化正文）、研究方向、教育经历、实践经历（本科学生工作 + 硕士驻场项目含 4 条量化 bullet）、三大核心优势、实践配图 3 张 |
| `/[lang]/projects` | 「项目经历」+ 3 张项目卡（STAR 叙述、量化指标、技术标签；卡片只展开首段）+ 学术成果与专利区块 |
| `/[lang]/projects/[slug]` | 单项目详情：STAR 四段、核心量化数据、项目展示图集（1~6 张 + 灯箱缩放）、技术标签、相关文档下载 |
| `/[lang]/honors` | 荣誉与资质：国家级 / 省部级 / 校级三级 + 证书与专利 + 学术论文，共 5 类 |
| `/[lang]/resume` | 在线公开简历（教育 / 项目 / 技能 / 荣誉 / 专利 5 板块），含 A4 打印样式；下载入口指向 `public/resume.pdf` |
| `/[lang]/contact` | 公开求职邮箱、微信、电话（`tel:` 协议） |
| `/[lang]/blog`、`/[lang]/blog/[slug]` | 博客；**当前 3 篇文章全部 `draft: true`，路由可访问但没有内容，导航入口已隐藏** |
| `/api/chat` | 求职问答：规则引擎优先 → 可选 DeepSeek 兜底 → 友好兜底 |
| `/api/visitor` | 可选访客计数（未配 KV 时返回 `{available:false}`） |
| `/robots.txt`、`/sitemap.xml` | 由 `getSiteUrl()` 动态生成；`/api/` 已 disallow |

另有 `/[lang]/research` → 301 → `/[lang]/projects`（`next.config.ts:16-24`）；`app/[lang]/{error,loading,not-found}.tsx` 与 `app/global-error.tsx` 提供错误与加载态。

### 3.2 内容资产（`verify:profile` 实测计数）

3 个公开项目 · 3 个研究方向 · 2 篇 EI 会议论文（均一作、均有 DOI） · 1 项实用新型专利 · **11 项荣誉奖项** · 2 项竞赛获奖 · 5 项证书与论文引用 · 2 个实践阶段 · 技能 27 条（3 大类 9 个子组） · 联系方式 4 项（邮箱 / 电话 / 网站 / GitHub）。

你问的每一项都**有**：个人简介 ✔、项目经历 ✔、技能 ✔、联系方式 ✔、论文 ✔、专利 ✔；此外还有荣誉资质、教育经历、在线简历、可下载 PDF 简历、AI 问答助理。

### 3.3 静态资源

| 资源 | 体积 | 说明 |
|---|---|---|
| `public/resume.pdf` | 331 KB | 正式版简历，唯一对外下载入口，已纳入文本审计 |
| `public/head_photo.jpg` | 225 KB | 首屏头像（`loading="eager"` + `preload` + `fetchPriority="high"`） |
| `public/docs/*.pdf` ×3 | 0.2 / 0.5 / 2.5 MB | 标记筛选报告、RFID 视觉装置报告、芯片注射 SOP（⚠️ 见 §6.4） |
| `public/images/projects/**` | 约 5.9 MB | 项目 1 图 1 张 + 界面截图 3 张、项目 2 图 6 张、项目 3 图 6 张 |
| `public/images/about/*` | 1.1 MB | 实践经历配图 3 张 |
| `public/images/projects/project-1/resources/` | **8.75 MB / 22 文件** | ⚠️ 与本项目无关的 AI 生成素材，零引用（见 §4.3 / §7） |

### 3.4 内容层面的缺口

1. **博客空转**：3 篇全草稿，其中《鱼类 Re-ID：从三元组损失到 BoT-SORT 的数学直觉》（含 LaTeX 推导）质量看起来足以支撑「科研深度」叙事，却没发布。
2. **3 个项目全部没有代码仓库链接或在线 Demo**（`projects.ts` 中 `githubUrl` / `liveDemoUrl` 零出现，`isInteractive: false`）；身份层虽有个人 GitHub 主页，但项目卡片无对应仓库。
3. **2 篇论文的 `venue` 仍是【待补充会议全称】占位**，而 DOI 已存在（`10.1117/12.3073439`、`10.1109/PRMVAI70103.2026.11605618`），会议全称可由 DOI 反查补齐；也没有论文 PDF / arXiv 链接。
4. `public/resume.pdf` 是二进制资产，与站点最新文案（荣誉名称、量化指标、驻场表述）已经不同步。

---

## 4. 代码质量评估

### 4.1 结构与工程规范：好

- **事实数据层 + 证据状态**：每个条目带 `visibility` / `verificationStatus`，`src/data/profile/public.ts` 统一过滤 public+verified，UI 与 AI 共用同一集合——这类「数据治理」在个人站点里非常少见。
- **服务端/客户端边界正确**：`app/[lang]/layout.tsx:29-59` 在服务端把双语数据解析成纯字符串/布尔再传给 `Navbar`/`Footer`/`ChatBox`，避免整个双语数据集进客户端 chunk（注释与实现一致）。
- **5 个校验脚本**覆盖内容、数据、问答契约、简历、部署准备，`npm run verify` 串起 content→profile→chat→resume→lint→typecheck→build。实测全部通过（`verify:deploy` 除外，见 §6.5）。
- **不足**：无单元/端到端测试；无 CI（改动只有靠人手动跑 `npm run verify`）。

### 4.2 响应式设计：好

- 断点体系真实落地：页面 `px-4 sm:px-6`，导航桌面 `lg:flex` / 移动抽屉 `lg:hidden`（`Navbar.tsx:104,115,191`），图集 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`（`ImageGallery.tsx:146`），页脚 `sm:grid-cols-2 lg:grid-cols-3`。
- 防溢出有系统化措施：`globals.css:66-69` `overflow-x: clip`；`:60-63` `img,svg{max-width:100%}`；`:157-162` GFM 表格改为块级横向滚动；`:105-112` KaTeX 公式横向滚动。
- 细节到位：`Navbar.tsx:86-93` 监听 `matchMedia`，桌面放大后不会残留 `aria-expanded=true`。
- **隐患 2 处**：`app/[lang]/page.tsx:383` 的 `max-w-[21rem]` 在 320–336px 视口会被 `overflow-x: clip` 裁掉（无滚动条但内容缺失）；`Footer.tsx:186` 的「最后更新」行 `whitespace-nowrap` 在 320px 下可能被裁。

### 4.3 性能：一般（有两处结构性问题）

**做得好**：
- 图片 100% 走 `next/image`，图集统一 `loading="lazy"` + `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`；`next.config.ts:8-10` 输出 AVIF/WebP 且缓存 30 天；首屏头像 eager + preload 分级正确。
- 零网络字体（系统字体栈 `globals.css:44-45,51`），无第三方 CSS/JS，仅 1 个 keyframe 动画。
- 大量路由使用 `generateStaticParams`。

**问题 1：全站没有静态页面（P1）**
`app/layout.tsx:9` 用 `await headers()` 读取 `x-portfolio-locale` 来决定 `<html lang>`，这使整棵路由树退化为按请求渲染。实测：
- `.next/server/app` 下**只有 1 个** `.html`（`_global-error.html`）；
- `.next/prerender-manifest.json` 里只有 `/_global-error`、`/favicon.ico`、`/robots.txt`、`/sitemap.xml`，**没有任何页面路由**；
- 构建日志的「28/28」只是「生成的路由条目数」，不等于「28 个静态页面」（`docs/deployment-readiness.md:23` 的表述不准确，我此前几轮报告里跟着复述过这句，属于我的表述问题）。

影响：TTFB 依赖 Node 渲染、无法 CDN 直出、每次请求都跑一遍数据层；页面级 `generateStaticParams`（7 处）实际未生效。修法思路：`src/components/DocumentLocale.tsx` 已经在客户端同步 `document.documentElement.lang`，因此根布局可以不再依赖 `headers()`，把 locale 交给 `[lang]` 段/客户端处理，即可恢复 SSG。

**问题 2：`public/` 里有 8.75 MB 零引用资源（P0）**
`public/images/projects/project-1/resources/background_clothing_conf/icon/` 下 22 个文件（婚纱人像、布达拉宫、富士山、宇航员猫等 AI 素材），全仓 grep `resources|background_clothing_conf` **0 命中**，占 `public/` 总体积的 48.7%。目前未被 git 跟踪，但会被构建/部署原样发布。

### 4.4 可访问性：一般

**达标项**：`html lang` 随语言正确输出（`app/layout.tsx:32-33` + `DocumentLocale.tsx:8` 双重保障）；图片 alt 完整且描述性强；交互元素都有 `aria-label`；全局 `*:focus-visible{outline:2px solid var(--accent); outline-offset:3px}`；对比度实测达标（浅色 `--muted #5b6b7f` on `#fff` ≈ 7.4:1，深色 `#9ca3af` on `#0a0a0a` ≈ 9.6:1）；灯箱有 `role="dialog"` / `aria-modal` / Esc、←、→ 键支持 / body 滚动锁定。

**缺陷**：
1. **没有 skip link**，`app/[lang]/layout.tsx:70` 是裸 `<main>`（无 `id`）——键盘用户每页都要穿 6 项导航。
2. **灯箱焦点管理缺失**：`ImageGallery.tsx:216-226` 的对话框无 `tabIndex`，打开时焦点不进入、`Tab` 可逃到背景、关闭后不归还触发按钮；关闭/前后键在深色遮罩上的 focus 圈对比度也不佳。
3. 5 处纯装饰图标漏 `aria-hidden`（如 `projects/page.tsx:167` 的 `<Github size={12}/>`、`projects/[slug]/page.tsx:137` 的 `<ArrowLeft/>`）。
4. 标题层级基本正确（h1→h2→h3 有序），`Contact.tsx:79` 在隐藏标题时同步去掉 `aria-labelledby`，处理得当。

---

## 5. 求职展示效果分析

以「算法 / 开发 / 科研岗」招聘方视角评估。

### 5.1 明显强于平均水平的地方

1. **量化到位的成果叙述**：项目①有 `FAR 6.91%`、`5×` 特征压缩、`dev70 错误率 20.10%→14.65%（27%）`；项目②有 `3 路 25fps`、`采集效率 +80%`、`134.2kHz RFID`；项目③有 `成鱼存活率 0→80%`、`200+ 尾`、`单尾 5~8 分钟`。这些数字对算法岗是硬通货。
2. **诚实标注边界**：论文指标与项目部署级指标明确区分口径、不互相覆盖；项目页保留「跨数据集泛化仍有提升空间」类表述（本轮按你的要求删除了其中一句）。这种克制在求职站里是加分项，也经得起面试追问。
3. **算法 + 硬件双线**：CLIP-ReID 特征压缩 / 开放集识别 + RFID 触发多目同步采集装置 / UPVC 结构设计与防水封装，跨度大且都有实物与截图证据，非常适合「边缘 AI / 端侧部署 / 具身硬件」方向。
4. **界面即证据**：项目①有 3 张真实 Web 系统界面截图（视频识别实时检测、鱼档案管理、新个体注册审核），比只放架构图更有说服力。
5. **双语文案质量**：英文页实测无 1 个中文字符残留，术语统一（`individual-identification device`、`open-set recognition`、`Fast Warm-up`）。
6. **结构化的自我呈现**：荣誉页按国家级/省部级/校级三级分组共 11 项，教育线（本科四川工业科技学院 → 硕士海南大学）与荣誉、论文、专利互相印证。
7. **有 AI 助理**：面试官可以直接问「介绍下你的项目」「有什么荣誉」，回答口径与页面完全一致——本身就是工程能力的展示。

### 5.2 需要补齐的短板（按影响排序）

| 优先级 | 短板 | 为什么影响求职 | 建议动作 |
|---|---|---|---|
| P0 | **项目没有任何代码仓库或在线 Demo 链接** | 算法/开发岗 HR 与技术面试官的第一反应是「代码呢？」；现在只能看描述与截图 | 为 3 个项目补 `githubUrl`（可放脱敏后的代码或复现说明）；项目①的 Web 系统若能部署个公开 Demo，价值最高（`isInteractive: true` + `liveDemoUrl`） |
| P0 | **论文 `venue` 占位【待补充会议全称】** | 「EI 会议论文」却看不到会议名，会让人怀疑；DOI 已存在（可点开），但页面本身没写全称 | 由 DOI 反查补全（`10.1117/12.3073439` 属 SPIE 系列；`10.1109/PRMVAI70103.2026.11605618` 属 IEEE PRMVAI 2026），或补论文 PDF / 预印本链接 |
| P1 | **博客空转** | 技术博客是「持续学习 + 表达能力」的证据；现在路由存在但零内容 | 至少发布 1 篇（《鱼类 Re-ID 数学直觉》含 LaTeX 推导，最适合作科研岗加分项），并在导航露出 |
| P1 | **简历 PDF 与站点不同步** | HR 下载的 PDF 与网页内容不一致（荣誉名称、指标、驻场时长为旧版），是硬伤 | 重新导出 `public/resume.pdf` 后跑 `npm run verify` |
| P1 | **缺少「一页纸项目视觉摘要」** | 单项目详情页信息密度大但缺一张总览图（架构+指标+界面并列） | 用现有截图与框架图拼一张 1600×900 概览图放在详情页顶部 |
| P2 | **技能无熟练度/年限维度** | 27 条技能是标签云，招聘方无法判断深度 | 给核心 6~8 项加「使用场景 + 年限/项目映射」 |
| P2 | **无求职状态与时间信息** | 2027 届毕业生，招聘方想知道「何时可入职/实习」 | 在首屏或关于页加一行「2027.06 毕业 · 可实习时间」 |
| P2 | **无第三方背书链接** | 竞赛/项目成果无可点验证入口 | 蓝桥杯、大唐杯等可放官网获奖查询或证书截图（注意脱敏） |

### 5.3 一句话结论

**合格且有亮点，属于「前 20%」的个人作品集**：内容真实、量化充分、双语完整、工程规范度远超一般求职站。**距离「优秀」的差距集中在两处——可点的代码/演示证据，以及持续输出的公开技术内容。**

---

## 6. 部署可行性分析

### 6.1 构建与运行条件

| 项目 | 值 | 证据 |
|---|---|---|
| 运行时要求 | Node ≥ 22.15.0、npm 10.9.2 | `package.json:5-8`（本机实测 node v24.19.0 / npm 11.17.0，**版本不匹配**） |
| 安装 | `npm ci`（有 `package-lock.json`） | — |
| 构建 | `npm run build`（prebuild 自动 `generate:last-updated`） | `package.json:11-13` |
| 启动 | `npm start` = `next start`，默认 3000 端口 | `package.json:14` |
| 输出形态 | **标准 SSR 应用，不可静态导出**（无 `output: 'export'`；且依赖 `headers()`、2 个 API Route、`proxy.ts` 中间件、`next/image` 优化、301 重定向） | `next.config.ts` 全文、`app/layout.tsx:9` |

### 6.2 环境变量

| 变量 | 必填 | 作用 | 未配置时的行为 |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 建议（默认值已内置） | canonical / OG / sitemap / robots 的 origin；必须是 origin-only HTTPS，拒绝 localhost、凭据、路径、query、hash | 回退到已确认的 `https://ctrlctrlx.top`（`src/lib/siteUrl.ts:2,6,15-28`） |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | 生产建议 | 访客计数 + 聊天限流 | `/api/visitor` 返回 `{available:false}`；**`/api/chat` 限流直接放行**（`app/api/chat/route.ts:52-54`） |
| `DEEPSEEK_API_KEY` | 可选 | 规则未命中时的 RAG 兜底 | 静默降级为纯规则引擎（`src/lib/deepseekAgent.ts:43-44,64`）；密钥仅服务端读取，无 `NEXT_PUBLIC_` 前缀，`verify:chat` 断言其不进入客户端 bundle |

### 6.3 平台适配性

| 平台 | 可行性 | 说明 |
|---|---|---|
| **Vercel** | ✅ 零改造（推荐） | `proxy.ts`、API Routes、`next/image`、KV 全部原生支持；导入仓库即可，需保持 Node/npm 版本 |
| **自建 / 阿里云 ECS / Docker** | ✅ 可行 | `node:22-alpine` + `npm ci && npm run build && npm start`；需自装 `sharp`、Nginx 反代并透传 `x-forwarded-for`（`app/api/chat/route.ts:102-105` 靠它取 IP）、自建 Redis 做限流 |
| **Netlify** | ⚠️ 需适配 | 必须启用 `@netlify/plugin-nextjs`；中间件与图片优化能力受限，需回归测试 |
| **GitHub Pages** | ❌ 不可用 | 纯静态托管无法承载 2 个 API Route、`proxy.ts` 中间件、`headers()` 动态渲染、`next/image` 优化与 301 重定向；要用必须砍掉这些功能并改为静态导出 |
| Cloudflare Pages | ⚠️ 未验证 | 需 `@cloudflare/next-on-pages` 适配，KV/图片优化需替换方案 |

### 6.4 安全与隐私

**做得好的部分**：`.env.local` 未被 git 跟踪（`.gitignore:37`）；`*.pem` 已忽略；`git ls-files` 无 `.env`/证书；手机号 / 政治面貌 / 籍贯三项敏感字段集中在 `scripts/lib-approved-contacts.mjs` 一处授权并全校验；`DEEPSEEK_API_KEY` 无客户端泄漏路径。

**需要处理的风险**：

1. **`public/docs/` 三个 PDF 已入库且公开可直链下载**，其中 `spec-rfid-inject-standard.pdf`（芯片注射标准化操作规范）实测含 `麻醉 ×8`、`MS-222 ×2`、`剂量 ×2`、`mg ×12`、`注射 ×18`、`消毒 ×11`、`复苏 ×10` 等动物麻醉与操作细节——这命中本仓库 `AGENTS.md` 明令禁止公开的「Animal surgical instructions or drug dosage details」。同时，`verify:content` / `verify:resume` / `verify:deploy` **只对 `public/resume.pdf` 做文本审计，不审计 `public/docs/*.pdf`**。
   （好消息：我抽查了 3 个 PDF 的全文，**没有**手机号与邮箱泄漏。）
2. **`public/images/projects/project-1/resources/`（8.75 MB）** 目前未跟踪，一旦 `git add .` 就会连同原始素材一起发布。
3. **端点滥用**：`POST /api/chat` 无 KV 时完全无限流（可刷爆 DeepSeek 计费）；`POST|GET /api/visitor` 在任何情况下都无限流，计数可被脚本刷高；`robots.ts` 的 `disallow: /api/` 不具备防护能力。
4. `.env.local` 虽未跟踪，但会导致 `verify:deploy` 失败（设计如此，属发布前清理项）。

### 6.5 `verify:deploy` 当前实测失败（3 项）

```
Deploy readiness verification failed: local-environment-file-present: .env.local
Deploy readiness verification failed: npm-version-mismatch
Deploy readiness verification failed: sitemap-public-route-contract-missing
[exit code: 1]
```

- 前 2 项是环境性的（本机 `.env.local` 与 npm 版本差异），部署机上不存在。
- **第 3 项是本会话早前工作的回归，属于我的责任**：删除 `/[lang]/research` 时我从 `app/sitemap.ts` 移除了 `publicPatents` / `publicResearchAreas`，而 `scripts/verify-deploy-readiness.mjs:283-294` 仍断言这两个符号必须出现。修法有两种：把断言更新为新契约（研究页已删除，专利/研究方向并入 `/projects`），或在 `sitemap.ts` 保留这两个导入用于条件判断（后者已无实际意义）。**建议改校验脚本**，一行即可恢复全绿。
- 另有 notice `resume-pdf-text-not-audited:no-pdf-text-extractor`：这是沙箱限制（脚本内 `spawnSync(pdftotext)` 被拒），我直接调用 `pdftotext` 是成功的（`resume.pdf` 文本只含已授权手机号）。发布前请在普通终端跑一次 `npm run verify:all` 确认。

### 6.6 自定义域名

换域名只需改 2 处：`.env` 部署环境变量里的 `NEXT_PUBLIC_SITE_URL` 与仓库内 `.env.example:2`（`verify-deploy-readiness.mjs:265-280` 会校验两者一致），再在平台侧绑定域名并配 DNS/HTTPS。canonical、Open Graph URL、`robots.txt` 与 `sitemap.xml` 会自动跟着变，无需改代码。

---

## 7. 改进建议（按优先级）

### P0 — 上线前必须处理

1. **删除 `public/images/projects/project-1/resources/`**（-8.75 MB，占 public 体积 48.7%），并考虑在校验脚本里加一条「`public/` 下不允许出现 `resources/` 路径」的守卫。
2. **决策 `public/docs/` 三个 PDF 的公开范围**：至少把含麻醉/剂量细节的 `spec-rfid-inject-standard.pdf` 撤下或脱敏；并把 `public/docs/*.pdf` 纳入文本审计（当前脚本只审 `resume.pdf`）。
3. **修 `sitemap-public-route-contract-missing`**：更新 `scripts/verify-deploy-readiness.mjs:283-294` 的契约，让 `npm run verify:deploy` 恢复通过（这项回归是我引入的）。
4. **补项目代码/演示链接**：3 个项目至少各补 1 个 `githubUrl`；项目①的 Web 系统若可公开访问，加 `isInteractive: true` + `liveDemoUrl`，这是简历转化率最高的一项。
5. **清理 `.env.local` 后重跑 `npm run verify:all`**，确认 PDF 文本审计与部署检查全绿。

### P1 — 显著提升展示与体验

6. **恢复静态预渲染**：去掉 `app/layout.tsx:9` 对 `headers()` 的依赖（`DocumentLocale.tsx` 已在客户端兜底），让 20 个公开页面变成预渲染 HTML，TTFB 与 CDN 缓存收益明显。
7. **可访问性两处补强**：加 skip link（`<main id="main-content" tabIndex={-1}>`）与灯箱焦点管理（打开聚焦、Tab 循环、关闭归还焦点）。
8. **补全论文会议全称**（可由 DOI 反查）与论文 PDF/预印本链接，去掉【待补充会议全称】占位。
9. **发布 1 篇博客**（推荐《鱼类 Re-ID 数学直觉》），导航露出入口。
10. **重新导出 `public/resume.pdf`**，与站点最新荣誉名称、量化指标、驻场表述对齐。
11. **更新文档漂移**：`README.md:12,53,102,132,140` 与 `docs/deployment-readiness.md:23` 的多处过期/矛盾描述（含「28 条静态路由」的准确表述）。

### P2 — 打磨与长期维护

12. 清理死代码：`src/components/Awards.tsx`、`src/components/ResearchAreas.tsx`、`src/data/resumeData.ts`、`src/data/publicProfile.ts`（以及校验脚本里对后两者的断言）。
13. 清理根目录：`nul`、`tsconfig.tsbuildinfo`、14 个 `*-REPORT.md`（建议移入 `docs/reports/` 或删除）。
14. 给 `/api/visitor` 加限流；为 5 处装饰图标补 `aria-hidden`；修 320px 视口下 `max-w-[21rem]` 与页脚 `whitespace-nowrap` 的裁切。
15. 给核心技能补「熟练度 + 项目映射」；首屏加「2027.06 毕业 · 可实习时间」；为竞赛补可验证链接。
16. 增加 CI（GitHub Actions 跑 `npm run verify`），把「发布前必过校验」自动化。

---

## 附：本报告用到的实测证据

| 证据 | 命令 / 位置 |
|---|---|
| 全链路校验通过、28/28 路由生成 | `npm run verify` |
| 部署检查失败 3 项 | `npm run verify:deploy` → exit 1 |
| 无页面被预渲染 | `.next/server/app` 仅 `_global-error.html`；`.next/prerender-manifest.json` 仅 4 条非页面路由 |
| sitemap 契约回归来源 | `git diff -- app/sitemap.ts`（删除了 `publicPatents` / `publicResearchAreas`） |
| 注射 SOP 含麻醉/剂量细节 | `pdftotext -layout public/docs/spec-rfid-inject-standard.pdf` 关键词计数 |
| 3 份项目 PDF 无手机号/邮箱 | 同一命令 + 正则扫描 |
| 项目无代码/演示链接 | `src/data/profile/projects.ts` 无 `githubUrl` / `liveDemoUrl` |
| public 体积构成 | `Get-ChildItem -Recurse public` 汇总：17.97 MB，其中 `resources/` 8.75 MB |
| 死代码 | 全仓 grep `components/Awards`、`components/ResearchAreas`、`resumeData`、`publicProfile` 零引用 |
