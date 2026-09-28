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
| 统计 | `@vercel/analytics`（Vercel 原生访问统计 + 自定义事件） | ^2.0.1 |
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
| `/[lang]/about` | 关于我：简介标签行 + 6 个能力模块卡片（3×2）+ 教育经历 + 实践经历 + 实践配图 | SSG |
| `/[lang]/projects` | 项目经历：4 张项目卡（STAR + 量化指标 + 技术标签）+ 学术成果与专利（论文自带完整 DOI 编号） | SSG |
| `/[lang]/projects/[slug]` | 项目详情：STAR 四段、核心量化数据、项目图集（灯箱缩放）、技术标签、相关文档下载 | SSG |
| `/[lang]/honors` | 荣誉与资质：国家级 / 省部级 / 校级 + 证书与专利 + 学术论文；奖项 / 证书 / 专利支持配置证明材料附件 | SSG |
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

### 荣誉资质附件（奖项 / 证书 / 专利）

三类条目都支持可选的 `attachments` 字段（数据层，初始化为 `[]`），用于挂载获奖证明、证书扫描件、专利证书等材料：

```ts
attachments?: Array<{
  name: string;      // 中文显示名
  nameEn: string;    // 英文显示名
  type: "image" | "file";   // image 走灯箱预览；file 走原生下载
  path: string;      // 统一放在 public/attachments/<分类>/ 下
  format: string;    // 例如「JPG 格式」
  formatEn: string;  // 例如 "JPG"
}>
```

- 目录约定：`public/attachments/awards/`、`public/attachments/credentials/`、`public/attachments/patents/`。
- 渲染位置（一处配置、全站同步）：荣誉资质页三类卡片（图片走全站 `ImageGallery` 灯箱、文件走原生下载按钮）、
  首页荣誉预览（精简为「N 个证明材料」）、项目页与本页的专利卡片；条目没有附件时不渲染任何元素。
- 命名规范（由 `verify:profile` 与 `verify:content` 校验）：文件名只允许 ASCII 字母/数字/点/下划线/连字符，
  **禁止中文文件名与空格**；`image` 允许 `.jpg/.jpeg/.png/.webp`，`file` 允许 `.pdf`；登记的路径必须真实存在，否则校验失败。
- ⚠️ 文件名中不要出现 `patent` / `certificate` / `证书` / `专利` 等字样：`verify:content` 会把它判定为未脱敏的原始证书素材并拦截
  （目录名 `attachments/patents/` 本身不受影响）。请只上传已脱敏、无二维码/条形码的版本。
- 论文（`kind: "paper"`）与教育经历按约定**不挂本地附件**：论文只保留 DOI 官方链接，教育模块无下载入口。

### 时间格式约定

- **数据层唯一格式**：`YYYY.MM`（或 ISO `YYYY-MM-DD`，如专利授权日），按字典序即等于时间倒序；
  荣誉、证书、论文、教育与学生工作的日期字段都由 `verify:profile` 强制校验该格式。
- **展示层本地化**：统一走 `src/lib/dateFormat.ts`
  - 中文：`2025.04`
  - 英文：`Mon. YYYY`（如 `Apr. 2025`）
  - `formatDateRange` 用于区间（`2024.09 – 2027.06` → `Sep. 2024 – Jun. 2027`），
    `formatDateTokens` 用于数据层以双语字符串维护的时间描述（如实践经历 `period`）。
  新增日期展示时请复用这三个函数，不要在组件里手写 `YYYY.MM` 拼接。

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

## 五、访问统计（Vercel Analytics）

站点接入 Vercel 原生 Analytics（`@vercel/analytics`，统计入口为客户端组件 `src/components/SiteAnalytics.tsx`，在 `app/[lang]/layout.tsx` 底部渲染），**仅站长在后台可见，前端零展示**。

- **采集内容**：页面访问量（PV）/ 独立访客（UV）、各页面访问排行、访问来源与外部引荐、设备类型、国家/地区、页面性能指标；全部为匿名聚合数据，不使用 Cookie 跟踪个人身份，符合隐私合规要求。
- **自定义事件**：点击任意简历下载入口（首页 / 关于我 / 联系我 / 在线简历共用 `ResumeDownloadButton`）触发 `resume_download`，携带 `language`（`zh` / `en`）与 `page`（`home` / `about` / `resume` / `contact`），用于区分语言与入口的转化效果。事件通过 `track()` 入队，**非阻塞、不 `preventDefault`**，不影响下载行为与文件名规则。
- **查看路径**：Vercel 控制台 → 选择本项目 → 顶部 **Analytics** 面板
  - `Overview`：总访问量与趋势、Top Pages（各模块访问排行）、Top Referrers、设备/浏览器/国家分布；
  - `Events`（自定义事件）：查看 `resume_download` 的触发次数与按 `language` / `page` 的分布；
  - `Speed Insights`（如已启用）：真实用户的首屏性能指标。
- **本地行为**：`/_vercel/insights/script.js` 是 Vercel 边缘提供的脚本，本地 `next start` 访问会得到 404（属预期，不影响页面）；部署到 Vercel 后自动生效，其他托管平台（自建 Node / Netlify 等）需额外配置或改用其它统计方案。
- **性能**：组件渲染 `null`，脚本在 hydration 后才注入，静态 HTML 中不含任何统计引用（实测 0 处），因此不增加首屏 HTML 体积与请求数；包含该 SDK 的客户端 chunk 约 32 KB 原始 / 12 KB gzip（与其它客户端组件共享）。

### 5.1 自访过滤使用方法（站长本人）

过滤由 `src/components/SiteAnalytics.tsx` 的 `beforeSend` 回调实现：**URL 参数标记 + localStorage 持久化**，纯客户端执行，不依赖 IP、不影响任何访客。

| 操作 | 效果 |
| --- | --- |
| 访问任意页面并在网址后加 `?self=1`，例如 `https://<你的域名>/zh?self=1` | 把当前浏览器标记为「站长设备」，**本次及之后所有访问都不计入统计**（短链同理，只要最终 URL 带该参数） |
| 正常访问其他页面（不带参数） | 已标记的浏览器继续被过滤，无需重复加参数 |
| 访问 `?self=0`（如 `https://<你的域名>/?self=0`） | 清除标记，该浏览器恢复正常统计 |
| 清除浏览器的 localStorage | 等同取消标记（键名 `va_self_exclude`） |

- **过滤范围**：该浏览器后续的**页面浏览（PV/UV）、简历下载 `resume_download`、以及今后新增的任何自定义事件**全部被丢弃，一次标记长期生效。
- **多设备支持**：电脑、手机、平板各自在浏览器里访问一次 `?self=1` 即可，标记互相独立（换浏览器或清除站点数据后需重新标记）。
- **不依赖 IP**：标记只存在浏览器本地，网络环境变化（换 Wi-Fi、切 4G/5G、公司网络等）都不会影响过滤效果。
- **普通访客零影响**：不带参数且没有标记的访客，事件原样上报；隐私模式或禁用 localStorage 时不会报错，且带 `?self=1` 的这次访问仍会被过滤。
- **实现位置**：`beforeSend` 是函数，无法从服务端组件跨 RSC 边界传递，因此统计入口抽为客户端组件 `SiteAnalytics`（等价于在根布局写 `<Analytics beforeSend={...} />`），SSG 与水合行为不变。

---

## 六、本地开发与校验

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

## 七、环境变量

复制 `.env.example` 中的变量名，**不要提交任何 `.env*` 文件**（`.env.local` 仅本地使用，其存在会使 `verify:deploy` 失败，属预期设计）。

| 变量 | 必填 | 作用 | 未配置时 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 建议 | canonical / Open Graph / sitemap / robots 的 origin；只接受无路径、无凭据的 HTTPS origin | 回退已确认的 `https://ctrlctrlx.top` |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | 生产建议 | 访客计数与 `/api/chat` 频率限制 | 访客计数不可用；**聊天限流放行** |
| `DEEPSEEK_API_KEY` | 可选 | 规则未命中时的外部模型兜底 | 静默降级为纯规则引擎模式 |

`DEEPSEEK_API_KEY` 仅服务端读取，无 `NEXT_PUBLIC_` 前缀，`verify:chat` 会断言它不进入客户端 chunk。

---

## 八、求职信息助理（双层架构）

1. **规则引擎（主路径）**：`src/lib/career-agent.mjs` 从 public + verified 数据确定性作答，零成本、秒响应，
   覆盖自我介绍、教育、技能、项目、研究方向、专利、实践经历、证书、荣誉、联系方式、简历与文档等高频问题。
2. **外部模型（兜底）**：配置 `DEEPSEEK_API_KEY` 后，规则未命中的开放问题由 `src/lib/deepseekAgent.ts`
   以同一份公开语料作为 RAG 上下文作答；未配置则直接使用友好兜底文案。

- 提示词注入由规则引擎直接拒绝，**不会**转发给外部模型。
- 资料不足时统一回答「当前公开资料中没有足够信息支持这一结论。」。
- 任何一层都不得输出公开数据之外的个人信息。

---

## 九、Profile 事实原则

- 公开个人事实只能维护在 `src/data/profile/`；UI、metadata、简历 PDF 与助理必须使用 public + verified 过滤集合。
- `pending`、`private`、`hidden` 不得进入公开集合。
- 不得猜测或补写论文、专利、奖项、项目角色、设备、指标、链接或状态。
- 当前公开论文集合为 2 篇 EI 会议论文，均为第一作者：
  - `publications.ts` 是论文事实的唯一来源；`credentials.ts` 中 `kind: "paper"` 条目仅为分类引用，由 `verify:profile` 校验标题一一对应。
  - 会议全称尚未确认，`venue` 保留【待补充会议全称】占位；在补全之前只能表述为「EI 会议论文」，不得声称 EI 已收录。
  - 论文的 `metrics` 字段为可选：当前两篇论文的量化指标均按本人要求未在站点展示（字段保留为空数组），
    因此论文卡片只呈现创新点与摘要；项目①的部署级指标（FAR 6.91%）与论文口径无关，仍在项目页如实标注。
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

## 十、无障碍与响应式

- 顶部提供「跳转至主内容 / Skip to main content」Skip Link，键盘首次 Tab 即可聚焦并跳过导航。
- 图片灯箱：打开时焦点移入对话框、`Tab` / `Shift+Tab` 在灯箱内循环、`Esc` 关闭、`←`/`→` 切换图片，关闭后焦点归还触发按钮。
- 全局 `*:focus-visible` 主题色描边；浅色/深色两套令牌的正文与次要文字对比度均达到 WCAG AA 以上。
- 响应式：移动端单列、`sm` 两列、`lg` 三列；`overflow-x: clip`、图片 `max-width: 100%`、GFM 表格与 KaTeX 公式横向滚动，避免窄屏溢出。

---

## 十一、部署

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
