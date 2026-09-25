# Yang Chong — Evidence-based Portfolio

杨冲 / Yang Chong 的中英双语个人求职作品集。页面、metadata、在线简历、简历 PDF 与求职信息助理
统一使用 `src/data/profile/` 中**允许公开且已经核验**的结构化资料；未经确认、非公开或待核验条目
不会进入页面、不会进入 AI 回答，也不会进入导出的 PDF。

- 站点内容：算法（鱼类个体重识别 / 开放集识别 / 特征压缩）+ 硬件（RFID 与多目视觉采集装置）双线项目与量化成果
- 渲染形态：公开页面全部**静态预渲染（SSG）**，仅 `/api/*` 为按请求执行的 Route Handler
- 语言：`zh` / `en` 两套完整文案，无硬编码单语言文本；英文页零中文字符残留

---

## 一、技术栈

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Next.js（App Router + Turbopack） | 16.1.6 |
| UI | React / React DOM | 19.2.3 |
| 语言 | TypeScript（`strict`） | 5.x |
| 样式 | Tailwind CSS（CSS-first，`@theme inline` 令牌） | 4.x |
| 主题 | next-themes（`class` 策略，浅色 / 深色两套 CSS 变量） | 0.4.x |
| 图标 | lucide-react | 0.575.x |
| 内容 | MDX（gray-matter + next-mdx-remote）、KaTeX、remark-gfm / remark-math | — |
| 可选服务 | Vercel KV（访客计数 + 聊天限流）、DeepSeek API（问答兜底） | — |
| 工具 | ESLint 9（flat config）、PostCSS + `@tailwindcss/postcss` | — |
| 运行时 | Node.js ≥ 22.15.0、npm 10.9.2 | `package.json` 的 `engines` / `packageManager` |

不依赖任何第三方 UI 组件库与网络字体（使用系统字体栈），无自建 Webpack 配置。

---

## 二、项目结构

```
app/                        路由层（App Router）
  layout.tsx                根布局：只做静态判定，禁止使用 headers()/cookies() 等动态 API
  [lang]/
    layout.tsx              语言段布局：导航、页脚、AI 助理、Skip Link、<main id="main-content">
    page.tsx                首页    about/ 关于我    projects/ 项目列表    projects/[slug]/ 项目详情
    honors/ 荣誉与资质         resume/ 在线简历        contact/ 联系我        blog/[slug]/ 技术文章
    not-found.tsx           404 边界
  api/chat/route.ts         求职问答（规则引擎优先，可选外部模型兜底）
  api/visitor/route.ts      可选访客计数（未配置 KV 时返回不可用）
  robots.ts / sitemap.ts / globals.css
proxy.ts                    Next 16 的中间件替代文件：语言前缀重写 + 注入 x-portfolio-locale
src/
  components/               21 个展示组件（服务端为主，ChatBox / ImageGallery / ThemeProvider 为客户端）
  data/profile/             唯一事实数据层（16 个文件：identity / about / education / projects /
                            publications / patents / awards / competitions / credentials / skills /
                            research / types / visibility / public / index / projectMedia）
  data/{resumeData,publicProfile}.ts   旧兼容适配层（禁止新代码引用，仅校验脚本读取）
  lib/                      i18n、siteUrl、MDX 读取、career-agent.mjs（规则引擎）、deepseekAgent.ts
  providers/ThemeProvider.tsx
content/posts/              MDX 技术文章（当前 3 篇均为 draft，不公开、不进 sitemap）
public/                     头像、双语简历 PDF、项目文档、项目与实践配图
scripts/                    发布前校验脚本（见「五、校验」）+ 构建期 lastUpdated 生成
docs/deployment-readiness.md  部署准备状态与人工验收清单
```

---

## 三、当前路由与页面

| 路由 | 内容 | 渲染 |
| --- | --- | --- |
| `/` | 按 `Accept-Language` 进入 `zh` / `en` | 静态（重定向） |
| `/[lang]` | 首页：求职定位、学历行、政治面貌、研究方向标签、代表项目 4 张卡、荣誉预览、技能栈 | SSG |
| `/[lang]/about` | 关于我：三段式简介、研究方向、教育经历、实践经历、三大核心优势、实践配图 | SSG |
| `/[lang]/projects` | 项目经历：4 张项目卡（STAR + 量化指标 + 技术标签）+ 学术成果与专利 | SSG |
| `/[lang]/projects/[slug]` | 项目详情：STAR 四段、核心量化数据、项目图集（灯箱缩放）、技术标签、相关文档下载 | SSG |
| `/[lang]/honors` | 荣誉与资质：国家级 / 省部级 / 校级 + 证书与专利 + 学术论文 | SSG |
| `/[lang]/resume` | 在线公开简历（教育 / 项目 / 技能 / 荣誉 / 专利）+ A4 打印样式 + 正式简历 PDF 下载 | SSG |
| `/[lang]/contact` | 联系我：公开求职邮箱、微信、电话（`tel:`） | SSG |
| `/[lang]/blog`、`/[lang]/blog/[slug]` | 技术文章；当前无已发布文章（3 篇草稿），导航入口隐藏且不进入 sitemap | SSG |
| `/[lang]/research` | **已永久重定向（301）到 `/[lang]/projects`**，研究内容并入项目经历页 | 重定向 |
| `/api/chat`、`/api/visitor` | 求职问答 / 可选访客计数 | 动态 |
| `/robots.txt`、`/sitemap.xml` | 按确认域名生成；sitemap 只收录真实存在的公开路由 | 静态 |

**静态化约束（重要）**：`app/layout.tsx`、`app/[lang]/layout.tsx` 以及 404 组件都不得调用
`headers()` / `cookies()` 等动态 API——一旦调用，整棵路由树会被强制改为按请求渲染，页面级
`generateStaticParams` 全部失效，`.next` 中不会产出任何页面 HTML。语言由 `proxy.ts` 注入的请求头
仅用于 404 文案，正常页面的 `<html lang>` 由 `DocumentLocale` 按当前路由在客户端校正。

---

## 四、内容资产（`src/data/profile/`）

| 集合 | 数量 | 说明 |
| --- | --- | --- |
| 项目经历 | 4 | 本站作品集（最新）→ 鱼类 ReID 研究 → RFID 多目视觉采集装置 → 东星斑标记标准化 |
| 研究方向 | 3 | 计算机视觉、个体重识别（ReID）、嵌入式智能感知 |
| 论文 | 2 | 均为第一作者 EI 会议论文，含 DOI；会议全称待补充（占位不得改写为「已收录」） |
| 专利 | 1 | 已授权实用新型专利，年份与授权日期一致 |
| 荣誉奖项 | 11 | 国家级 2、省部级 1、校级 8（含 1 项结业证书） |
| 竞赛获奖 | 2 | 大唐杯（省级）、蓝桥杯（省级） |
| 证书与论文引用 | 5 | `kind: "paper"` 条目由 `verify:profile` 校验与 `publications.ts` 标题一一对应 |
| 技能 | 27 | 3 大类 9 个子组（`groups` 与扁平 `items` 必须一致） |
| 实践经历 | 2 个阶段 | 本科学生工作 + 硕士驻场项目 |
| 联系方式 | 4 | 邮箱、电话、个人网站、GitHub |

### 正式简历 PDF

| 文件 | 语言 | 来源 | 说明 |
| --- | --- | --- | --- |
| `public/杨冲个人简历.pdf` | 中文（正式版） | 本人提供 | 全站唯一官方简历文件，中英文页面共用 |

- 中文页与英文页的下载按钮都指向同一份 `/杨冲个人简历.pdf`（`ResumeDownloadButton` 按 locale 只切换另存文件名：
  `杨冲-个人简历.pdf` / `Yang Chong Resume.pdf`），页面内不再有浏览器打印入口，也不再自动生成 PDF。
- 该 PDF 的文字由 `verify:content`、`verify:resume`、`verify:deploy` 提取并审计：只允许出现已批准的邮箱与手机号，
  且必须包含候选人姓名，避免拿到空白或错误的文件。
- 替换简历时直接覆盖 `public/杨冲个人简历.pdf`，然后重跑 `npm run verify`。

---

## 五、本地开发与校验

```bash
npm ci            # 安装依赖（有 package-lock.json）
npm run dev       # 开发服务器 http://localhost:3000
```

| 命令 | 作用 |
| --- | --- |
| `npm run lint` | ESLint（`eslint.config.mjs`） |
| `npm run typecheck` | `tsc --noEmit`，严格模式 |
| `npm run build` | 生产构建（`prebuild` 自动生成 `lastUpdated`） |
| `npm run verify:content` | 公开文案、禁用内容、草稿、静态资产、双语简历 PDF 文字审计 |
| `npm run verify:profile` | 事实数据层：证据状态、双语字段、slug、隐私边界、数量守卫 |
| `npm run verify:chat` | 问答请求契约、快捷问题、项目问答、注入拒绝、密钥不进入客户端 |
| `npm run verify:resume` | 在线简历路由、数据边界、隐私字段、双语 PDF 审计 |
| `npm run verify:deploy` | 运行时版本、脚本、构建产物、环境文件、站点 URL、sitemap 契约 |
| `npm run verify` | content → profile → chat → resume → lint → typecheck → build（提交前必过） |
| `npm run verify:all` | 在 `verify` 之后追加 `verify:deploy`（发布前在有 `pdftotext` 的机器上执行） |

---

## 六、环境变量

复制 `.env.example` 中的变量名，**不要提交任何 `.env*` 文件**（`.env.local` 仅本地使用，其存在会使 `verify:deploy` 失败，属预期设计）。

| 变量 | 必填 | 作用 | 未配置时 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 建议 | canonical / Open Graph / sitemap / robots 的 origin；只接受无路径、无凭据的 HTTPS origin | 回退已确认的 `https://ctrlctrlx.top` |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | 生产建议 | 访客计数与 `/api/chat` 频率限制 | 访客计数不可用；**聊天限流放行** |
| `DEEPSEEK_API_KEY` | 可选 | 规则未命中时的外部模型兜底 | 静默降级为纯规则引擎模式 |

`DEEPSEEK_API_KEY` 仅服务端读取，无 `NEXT_PUBLIC_` 前缀，`verify:chat` 会断言它不进入客户端 chunk。

---

## 七、求职信息助理（双层架构）

1. **规则引擎（主路径）**：`src/lib/career-agent.mjs` 从 public + verified 数据确定性作答，零成本、秒响应，
   覆盖自我介绍、教育、技能、项目、研究方向、专利、实践经历、证书、荣誉、联系方式、简历与文档等高频问题。
2. **外部模型（兜底）**：配置 `DEEPSEEK_API_KEY` 后，规则未命中的开放问题由 `src/lib/deepseekAgent.ts`
   以同一份公开语料作为 RAG 上下文作答；未配置则直接使用友好兜底文案。

- 提示词注入由规则引擎直接拒绝，**不会**转发给外部模型。
- 资料不足时统一回答「当前公开资料中没有足够信息支持这一结论。」。
- 任何一层都不得输出公开数据之外的个人信息。

---

## 八、Profile 事实原则

- 公开个人事实只能维护在 `src/data/profile/`；UI、metadata、简历 PDF 与助理必须使用 public + verified 过滤集合。
- `pending`、`private`、`hidden` 不得进入公开集合。
- 不得猜测或补写论文、专利、奖项、项目角色、设备、指标、链接或状态。
- 当前公开论文集合为 2 篇 EI 会议论文，均为第一作者：
  - `publications.ts` 是论文事实的唯一来源；`credentials.ts` 中 `kind: "paper"` 条目仅为分类引用，由 `verify:profile` 校验标题一一对应。
  - 会议全称尚未确认，`venue` 保留【待补充会议全称】占位；在补全之前只能表述为「EI 会议论文」，不得声称 EI 已收录。
  - 论文指标（Rank-1 94.83% / AUROC 87.75%）与项目①的部署级指标（FAR 6.91%）口径不同，两处分别如实标注，不互相覆盖。
  - 本人姓名唯一来源仍是 `identity.ts`。
- 当前公开奖励与证书：`awards.ts` 11 项荣誉、`competitions.ts` 2 项竞赛、`credentials.ts` 5 项证书与论文引用、`patents.ts` 1 项专利。
- 技能栈 `groups` 与扁平 `items` 的 id 集合与顺序必须一致（由 `verify:profile` 校验）。
- 不得公开生日、学号、住址、证件、密钥或原始私有研究数据。
- **已授权公开的例外**（唯一声明位置：`scripts/lib-approved-contacts.mjs`）：
  - 手机号只允许出现在 `src/data/profile/identity.ts` 与两份简历 PDF；其它 11 位号码一律拦截。
  - 政治面貌只允许出现在 `src/data/profile/about.ts`，不得进入在线简历路由与简历 PDF。
  - 籍贯只允许作为 `about.nativePlace`，且必须等于授权值。
  - 删除该文件中的常量即恢复全面禁止。

`src/data/resumeData.ts` 与 `src/data/publicProfile.ts` 是旧代码兼容适配器，不维护独立事实，新代码不得依赖。

---

## 九、无障碍与响应式

- 顶部提供「跳转至主内容 / Skip to main content」Skip Link，键盘首次 Tab 即可聚焦并跳过导航。
- 图片灯箱：打开时焦点移入对话框、`Tab` / `Shift+Tab` 在灯箱内循环、`Esc` 关闭、`←`/`→` 切换图片，关闭后焦点归还触发按钮。
- 全局 `*:focus-visible` 主题色描边；浅色/深色两套令牌的正文与次要文字对比度均达到 WCAG AA 以上。
- 响应式：移动端单列、`sm` 两列、`lg` 三列；`overflow-x: clip`、图片 `max-width: 100%`、GFM 表格与 KaTeX 公式横向滚动，避免窄屏溢出。

---

## 十、部署

**形态**：标准 Next.js SSR/SSG 应用，**不支持静态导出**（需要 Node 运行时承载 Route Handler 与 `proxy.ts`）。

| 平台 | 可行性 | 说明 |
| --- | --- | --- |
| Vercel | ✅ 推荐，零改造 | `proxy.ts`、API Route、`next/image`、KV 原生支持 |
| 自建 / 阿里云 ECS / Docker | ✅ 可行 | `node:22-alpine` + `npm ci && npm run build && npm start`；需安装 `sharp`、反代透传 `x-forwarded-for`、自建 Redis 限流 |
| Netlify | ⚠️ 需 `@netlify/plugin-nextjs` | 中间件与图片优化能力受限 |
| GitHub Pages | ❌ 不可用 | 纯静态托管无法承载 API Route、`proxy.ts`、`next/image` 优化与 301 重定向 |

发布前：`npm run verify:all` 全绿（含 PDF 文字审计）→ 人工浏览器验收 → 由维护者手动 push 与部署
（仓库内不包含任何自动 push / deploy 脚本）。

换域名只需改两处：部署环境的 `NEXT_PUBLIC_SITE_URL` 与仓库内 `.env.example`（`verify:deploy` 校验两者一致），
再在平台绑定域名并配置 DNS / HTTPS；canonical、Open Graph、`robots.txt`、`sitemap.xml` 会自动跟随。

详细状态与人工验收清单见 [`docs/deployment-readiness.md`](docs/deployment-readiness.md)。
