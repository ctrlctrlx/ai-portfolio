# P0 三项核心修复 + P1 四项重要优化 改造报告

项目：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TypeScript 严格模式 + Tailwind v4 的双语求职作品集）
本轮共 7 项任务，全部完成；`npm run verify` 全链路通过，公开页面全部恢复静态预渲染。
未引入任何新的第三方依赖，未升级任何核心包版本，未新增自定义 CSS 类与颜色。

---

## 0. 完成总览

| 任务 | 状态 | 关键验收证据 |
|---|---|---|
| P0-1 sitemap 路由对齐 + 部署校验修复 | ✅ | sitemap 输出 18 条真实公开路由；`sitemap-public-route-contract-missing` 已消除 |
| P0-2 删除冗余素材 | ✅ | 删除 22 个文件 / 8,750,264 B；public 体积 **-48.7%**；全量扫描 25 个文件 **0 个零引用** |
| P0-3 移除 GitHub/Demo 按钮 | ✅ | 项目页中英文 `GitHub` / `在线演示` / `Live Demo` 命中数 **0**；`ProjectLinks` 组件与死导入一并删除 |
| P1-1 恢复静态预渲染 | ✅ | 全部页面路由 ● SSG；静态 HTML **1 → 23 个**；`x-nextjs-cache: HIT` + `s-maxage=31536000` |
| P1-2 可访问性 | ✅ | CDP 真机键盘测试 **18/18 断言通过**（含焦点环与焦点归还） |
| P1-3 简历 PDF 同步 | ✅ | 重新生成中英双语 PDF（A4 3 页 / 4 页）；文字审计无未授权联系方式、无政治面貌/籍贯/年龄 |
| P1-4 README 更新 | ✅ | 全量重写 10 个章节，删除全部过期描述，补齐环境变量/校验/部署/结构说明 |

---

## 一、P0-1 sitemap 路由对齐与部署校验修复

### 1.1 `app/sitemap.ts`

- 移除已下线路由：`/[lang]/research`（301 到 `/[lang]/projects`）不再收录；`publicPatents` / `publicResearchAreas` 导入此前已删除，本轮补齐注释说明「研究内容已并入项目经历页」。
- 补全并收敛有效公开路由为 **9 条/语言 × 2 = 18 条**：`/[lang]`、`/[lang]/projects`、`/[lang]/about`、`/[lang]/contact`、`/[lang]/honors`、`/[lang]/resume`、3 条 `/[lang]/projects/[slug]`。
- **消除冗余**：`/[lang]/blog` 与文章路由改为「仅当存在已发布（非草稿）文章时收录」。当前 3 篇文章均为草稿，因此 sitemap 不再指向空列表页；将来发布第一篇后会自动重新收录。
- 收录条件仍由数据层的 public + verified 集合驱动（无 about 不收录 about，无荣誉不收录 honors）。

构建产物实测（`.next/server/app/sitemap.xml.body`）：

```
https://ctrlctrlx.top/zh            https://ctrlctrlx.top/en
…/zh/projects                       …/en/projects
…/zh/about                          …/en/about
…/zh/contact                        …/en/contact
…/zh/honors                         …/en/honors
…/zh/resume                         …/en/resume
…/zh/projects/fish-reid-open-world  …/en/projects/fish-reid-open-world
…/zh/projects/rfid-multiview-acquisition   …/en/projects/rfid-multiview-acquisition
…/zh/projects/grouper-tagging-standard     …/en/projects/grouper-tagging-standard
```

### 1.2 `scripts/verify-deploy-readiness.mjs`

原断言要求 `sitemap.ts` 必须包含 `publicResearchAreas` / `publicPatents`（这两个符号在删除研究页后已无意义），导致 `sitemap-public-route-contract-missing` 恒失败。改为**按当前真实路由清单**校验：

- 必须包含 `/${locale}`、`/${locale}/projects`、`/${locale}/about`、`/${locale}/contact`、`/${locale}/honors`、`/${locale}/resume`、`publicProjects`、`getAllPostMetas`；
- 新增反向断言：sitemap 中不得再出现 `${locale}/research`（`sitemap-lists-retired-route`）。

结果：该错误已消除。`verify:deploy` 现在只剩 2 项**环境性**失败（见 §12）。

---

## 二、P0-2 删除冗余项目素材

- 完整删除 `public/images/projects/project-1/resources/`（22 个文件，8,750,264 B）。
- 同步检查配置与路径映射：全仓检索 `resources` / `background_clothing_conf` **0 命中**，无需改动数据层或组件（该目录从未被引用）。
- 全量资源扫描（脚本内 `public/**` 与 app/src/content/scripts 全文交叉比对）：`public` 现有 **25 个文件全部被引用，零引用文件 0 个**。
- 页面引用的 23 个静态资源（图片 / 项目文档 PDF / 两份简历 PDF）实测全部 `200`，无 404。

---

## 三、P0-3 项目页移除 GitHub / Demo 按钮及占位

| 文件 | 改动 |
|---|---|
| `app/[lang]/projects/page.tsx` | 删除卡片中的 `proj.githubUrl` / `proj.isInteractive && proj.liveDemoUrl` 两个条件渲染块；操作区只保留「查看详情 / View details」并按既有 `ml-auto` 右对齐，无空白缺口；移除已无用的 `Github`、`ExternalLink` 导入 |
| `app/[lang]/projects/[slug]/page.tsx` | 整块删除 `ProjectLinks` 组件及其在 `<header>` 中的调用；移除 `ExternalLink`、`Github` 与仅被该组件使用的 `Project` 类型导入；头部保留「返回项目列表 + 时间 + 标题」 |

- 数据层 `githubUrl` / `liveDemoUrl` / `isInteractive` 字段**保留未动**（不破坏数据结构），后续拿到真实仓库或演示地址时，恢复渲染约需 15 行代码。
- 实测：中英文项目列表页与详情页中 `GitHub`、`在线演示`、`Live Demo` 命中数均为 **0**；卡片操作区仅 1 个链接（查看详情）；列表页剩余的 2 处 `target="_blank"` 来自学术成果区的论文 DOI 链接（有效外链）。
- 视觉核对：1280×900 截图确认卡片头部（精选徽章 / 标题 / 时间 / 角色徽章 / 指标行 / 概述 / 亮点 / 「查看详情」右对齐按钮）与 STAR 区块排版正常、间距匀称。

> 说明：本轮按你的指令**移除**了这两个入口。若后续想恢复「代码仓库/在线演示」以增强求职说服力，数据字段已就位，只需把渲染块加回即可。

---

## 四、P1-1 恢复全站静态预渲染（SSG）

### 4.1 根因与修复

两处动态 API 依赖让整棵路由树退化为按请求渲染，页面级 `generateStaticParams` 全部失效：

1. `app/layout.tsx` 用 `await headers()` 读取 `x-portfolio-locale` 决定 `<html lang>`；
2. `src/components/LocalizedNotFound.tsx` 同样用 `headers()`，而它被 `app/[lang]/not-found.tsx` 引用——404 边界位于 `[lang]` 段内，**同样会把该段所有页面拖成动态渲染**（这是第一轮只修根布局后页面仍是 ƒ 的原因）。

修复方式：

- `app/layout.tsx`：改为纯静态导出——`export const metadata`（`metadataBase` + 兜底标题）+ `lang={defaultLocale}`；删除 `headers()` 与 `getRequestLocale()`，并在注释中固化「根布局禁止动态 API」的约束。真实语言由既有的 `DocumentLocale`（客户端组件）在 hydration 时按当前路由校正 `document.documentElement.lang`。
- `LocalizedNotFound.tsx`：由服务端组件改为客户端组件，语言改由 `usePathname()` 首段判定（404 页面不需要 SEO 预渲染，无副作用），彻底移除 `next/headers` 依赖。

### 4.2 验收结果

```
Route (app)                    Before → After
┌ /                            ƒ → ○  (Static)
├ /_not-found                  ƒ → ○  (Static)
├ /[lang]                      ƒ → ●  (SSG)
├ /[lang]/about                ƒ → ●
├ /[lang]/blog                 ƒ → ●
├ /[lang]/blog/[slug]          ● → ●
├ /[lang]/contact              ƒ → ●
├ /[lang]/honors               ƒ → ●
├ /[lang]/projects             ƒ → ●
├ /[lang]/projects/[slug]      ƒ → ●
├ /[lang]/resume               ƒ → ●
├ /api/chat、/api/visitor      ƒ → ƒ  （动态接口保持不变）
└ /robots.txt、/sitemap.xml    ○ → ○
```

- `.next/server/app` 下的静态 HTML：**1 个 → 23 个**（`zh.html`、`en.html` 及各自 9 个页面 + `index.html`、`_not-found.html`、`_global-error.html`）。
- `.next/prerender-manifest.json` 收录 **26 条路由**，其中包含全部 20 条公开页面路由（`/zh`、`/en` 及各自 about / blog / contact / honors / projects / 3 个项目详情 / resume），满足「prerender-manifest 包含全部公开页面路由」的验收标准。
- 运行时响应头实测：`/zh/about` → `Cache-Control: s-maxage=31536000`、`x-nextjs-cache: HIT`，即命中预渲染产物、可由 CDN 直接缓存（改造前为按请求渲染）。
- 动态接口无回归：`POST /api/chat` 正常返回（规则引擎作答），`/api/visitor` 在未配置 KV 时正常返回 `{available:false}`。
- 404 行为无回归：`/zh/xxx` 与 `/en/xxx` 仍返回本地化 404 页面（`LocalizedNotFound` 按路径首段判定语言）。

---

## 五、P1-2 可访问性规范修复

### 5.1 Skip Link 与主内容锚点（`app/[lang]/layout.tsx`）

- 新增「跳转至主内容 / Skip to main content」链接，位于 `<body>` 内最前、导航之前；默认 `sr-only`，键盘聚焦时 `focus:fixed` 显示在视口左上角，复用 `var(--accent)` / `var(--accent-foreground)` 令牌与既有圆角、字号体系。
- `<main id="main-content" tabIndex={-1}>`，锚点跳转后焦点真正落在主内容区域；`focus:outline-none` 避免整块区域出现描边。
- 中英文各按 `locale` 输出对应文案。

### 5.2 图片灯箱焦点管理（`src/components/ImageGallery.tsx`）

- 新增 `dialogRef`（灯箱容器）与 `triggerRef`（触发缩略图按钮）；
- 打开或切换图片：焦点自动移入对话框（容器 `tabIndex={-1}`）；
- `Tab` / `Shift+Tab` **焦点环**：在灯箱内的可聚焦元素（关闭、上一张、下一张）之间循环，不逃到页面背景；
- `Esc` 关闭、`←` / `→` 切换图片（原有逻辑保留）；
- 关闭后焦点**归还给触发它的那张缩略图按钮**；body 滚动锁定与恢复逻辑不变。

### 5.3 真机键盘验证（Chrome DevTools Protocol，Node 内置 WebSocket 驱动，未引入依赖）

```
skipLinkExists              = true
skipLinkIsFirstFocusable    = true      ← 文档中第一个可聚焦元素
skipLinkText                = "跳转至主内容"
mainTabIndex                = "-1"
activeElementAfterSkip      = "main-content"
dialogOpened                = true
dialogTabIndex              = "-1"
focusInsideDialog           = true      ← 打开即入框
bodyOverflowLocked          = true
counterBefore               = "1 / 4"
counterAfterArrowRight      = "2 / 4"   ← ←/→ 切换有效
focusableCountInDialog      = 3
focusAfterTabFromLast       = "first-focusable"   ← 焦点环闭合
dialogClosed                = true
focusReturnedToTrigger      = true      ← 焦点归还触发按钮
activeElementAfterClose     = "放大查看：图1 视频识别实时检测界面"
bodyOverflowRestored        = true
```

18 项断言全部通过，对应验收标准「纯键盘操作可完整完成导航、看图、关闭全流程」；鼠标交互路径未改动。

---

## 六、P1-3 简历 PDF 与网站内容全量同步

### 6.1 生成方式（不引入依赖）

用本机已安装的 Chrome 无头模式打印 `/[lang]/resume` 页面（页面自带 A4 `@media print` 样式：隐藏导航、页脚、AI 助理，按 A4 12mm 边距分页）。因为取材就是网页本身，PDF 与站点数据**同源**，不存在手工维护导致的偏差。

| 文件 | 语言 | 页数 / 纸张 | 体积 |
|---|---|---|---|
| `public/resume.pdf` | 中文 | 3 页 A4（594.96 × 841.92 pt） | 302,390 B |
| `public/resume-en.pdf` | 英文 | 4 页 A4 | 105,033 B |

### 6.2 内容同步核对（从 PDF 提取文字实测）

已包含本轮全部最新变更：

- **荣誉**：11 项全部在册——`校级一等奖学金`、`三好学生`、`优秀学生干部`、`创新优秀学员`、`五四红旗标兵`、`军事训练先进个人`、`青年马克思主义者培养工程学习班`结业证书、国家奖学金、国家励志奖学金、四川省优秀大学毕业生等；
- **教育**：`GPA 3.6/4.0`、`3.9/4.0` 保留，**无「排名」字样**；
- **项目**：最新「结果」表述（`本项目构建了…单鱼视频运行时系统`）、精简后的量化数据（`27%` 命中）、技术标签（Python / PyTorch / RFID…）；
- **个人信息**：公开邮箱、电话（`tel:`）、个人网站、GitHub 与网站一致。

隐私审计（两份 PDF 均通过）：

| 检查项 | 结果 |
|---|---|
| 未授权手机号 | 无 |
| 未授权邮箱 | 无 |
| 已授权手机号 / 邮箱是否在册 | 均在 |
| `政治面貌` / `籍贯` / `年龄` / `生日` | 均**不出现**（旧版手绘 PDF 曾含这些字段，新版更严格） |

### 6.3 代码同步

- `src/components/ResumeDownloadButton.tsx`：按 `locale` 选择下载文件（中文页 → `/resume.pdf`，英文页 → `/resume-en.pdf`），`download` 文件名同步为 `杨冲-个人简历.pdf` / `Chong_Yang_Resume.pdf`；按钮样式、变体与无障碍名称沿用原实现。
- `scripts/verify-public-resume.mjs`：下载入口契约改为「必须同时指向中英两份本地 PDF 且带 `download`」；PDF 审计扩展为**两份都审**，各自断言对应的候选人姓名（中文 `杨冲` / 英文 `Yang Chong`）与已授权手机号、邮箱。
- `scripts/verify-public-content.mjs`：PDF 隐私审计由单文件扩展为 `resume.pdf` + `resume-en.pdf` 循环，两份都做「格式头 + 文字长度 + 未授权手机号/邮箱」检查——消除此前只审计中文 PDF 的覆盖缺口。

---

## 七、P1-4 README 全量更新

重写为 10 个章节，与项目实际状态对齐：

1. 项目定位与渲染形态（SSG 说明）；2. 技术栈**版本表**（Next 16.1.6 / React 19.2.3 / TS 5 / Tailwind 4 / next-themes / lucide / MDX / KaTeX / 可选 KV 与 DeepSeek）；3. **项目结构**（逐目录职责，含 `proxy.ts`、`data/profile`、`scripts`）；4. 当前路由表（含渲染模式列）+ 静态化约束说明；5. **内容资产表**（3 项目 / 2 论文 / 1 专利 / **11 荣誉** / 2 竞赛 / 5 证书 / 27 技能 / 4 联系方式）+ 双语简历 PDF 的生成与重生成命令；6. 本地开发与**全部校验命令**；7. **环境变量表**（含未配置时的行为）；8. 双层 AI 助理架构；9. Profile 事实原则与隐私授权例外；10. 无障碍与响应式；11. 部署（平台矩阵 + 发布前流程 + 换域名两处改动）。

已删除的过期/矛盾描述：~~「没有安装或要求外部 AI 服务」~~、~~「研究领域总览标签筛选」~~、~~「awards.ts 4 项荣誉」~~、~~「博客模块（有内容）」~~、~~「只提供浏览器打印、不提供 PDF 下载」~~（与下载入口自相矛盾）、~~「项目详情页媒体路径待放置」~~等。

---

## 八、修改文件清单

| 文件 | 改动 |
|---|---|
| `app/sitemap.ts` | 收敛为 9 条/语言真实公开路由；博客仅在存在已发布文章时收录 |
| `app/layout.tsx` | 移除 `headers()` 动态依赖，改为静态 metadata + `lang={defaultLocale}` |
| `app/[lang]/layout.tsx` | 新增 Skip Link 与 `<main id="main-content" tabIndex={-1}>` |
| `app/[lang]/projects/page.tsx` | 删除 GitHub / 在线演示条件渲染与死导入，操作区只留「查看详情」 |
| `app/[lang]/projects/[slug]/page.tsx` | 删除 `ProjectLinks` 组件与调用，清理死导入 |
| `src/components/LocalizedNotFound.tsx` | 改为客户端组件，语言从 `usePathname()` 判定，移除 `headers()` |
| `src/components/ImageGallery.tsx` | 灯箱焦点进入 / 焦点环 / 焦点归还 |
| `src/components/ResumeDownloadButton.tsx` | 按 locale 指向中英双语 PDF |
| `scripts/verify-deploy-readiness.mjs` | sitemap 契约对齐真实路由 + 下线路由反向断言 |
| `scripts/verify-public-resume.mjs` | 下载入口契约 + 两份 PDF 审计（含姓名） |
| `scripts/verify-public-content.mjs` | PDF 隐私审计覆盖两份文件 |
| `public/resume.pdf` | 由 `/[lang]/resume` 重新生成（中文，3 页 A4） |
| `public/resume-en.pdf` | 新增（英文，4 页 A4） |
| `README.md` | 全量重写 |
| `public/images/projects/project-1/resources/` | 删除（22 个文件） |

---

## 九、性能与体积优化效果数据

| 指标 | 改造前 | 改造后 | 变化 |
|---|---|---|---|
| `public/` 体积 | 17,984,370 B | 9,298,709 B | **-8,685,661 B（-48.3%）** |
| 其中冗余素材目录 | 8,750,264 B | 0 | **-8,750,264 B（-48.7%）** |
| 零引用静态文件 | 22 个 | 0 个 | 全量扫描确认 |
| 静态预渲染 HTML | 1 个 | 23 个 | **+22** |
| 预渲染清单路由 | 4 条（仅 robots/sitemap/favicon/_global-error） | 26 条（含 20 条公开页面） | 公开页面 0 → 20 |
| 页面缓存头 | 按请求渲染（无共享缓存） | `s-maxage=31536000` + `x-nextjs-cache: HIT` | 可 CDN 直出 |
| 简历 PDF | 331 KB（中文，含政治面貌/籍贯/年龄） | 302 KB 中文 + 105 KB 英文 | 双语 + 隐私收紧 |

首屏效果：公开页面现在是构建期生成的静态 HTML，命中预渲染缓存后不再需要 Node 执行数据层与 React 渲染，TTFB 与服务器开销同步下降，且可被 CDN/边缘缓存长期缓存。

---

## 十、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `Public content verification passed (69 public text files, 25 local assets, resume.pdf audited).` |
| `npm run verify:profile` | ✅ `Profile verification passed (3 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases).` |
| `npm run verify:chat` | ✅ `Chat contract verification passed (26 quick prompts, 3 public projects).` |
| `npm run verify:resume` | ✅ `Public resume verification passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries).` |
| `npm run lint` | ✅ 无报错、无警告 |
| `npx tsc --noEmit` | ✅ 类型零错误 |
| `npm run build` | ✅ 编译成功，**全部页面路由 ● SSG / ○ Static**，API 路由保持 ƒ |
| `npm run verify`（全链路） | ✅ 以上 7 步串联全部通过 |
| `npm run verify:deploy` | ⚠️ sitemap 契约错误已消除；仅剩 2 项环境性失败（见 §12），非代码问题 |

---

## 十一、本地预览验证路径与检查要点

```
npm run dev     # http://localhost:3000
```

| 路径 | 检查要点 |
|---|---|
| `/zh`、`/en` | 首个 Tab 键出现「跳转至主内容 / Skip to main content」浮层，回车后焦点落到主内容 |
| `/zh/projects`、`/en/projects` | 项目卡片**无** GitHub / 在线演示按钮；操作区仅「查看详情 / View details」右对齐，卡片排版匀称 |
| `/zh/projects/fish-reid-open-world` | 头部无外链按钮；图集点击打开灯箱后：`Tab` 只在灯箱内循环、`←`/`→` 切图、`Esc` 关闭并把焦点还给缩略图 |
| `/zh/resume`、`/en/resume` | 下载按钮分别指向 `/resume.pdf`、`/resume-en.pdf`；页面内容与 PDF 一致 |
| `/zh/blog` | 无已发布文章；`/sitemap.xml` 中不出现 blog 路由（发布第一篇草稿后自动恢复收录） |
| `/zh/research` | 301 → `/zh/projects`，且不在 sitemap 中 |
| `/sitemap.xml`、`/robots.txt` | 18 条公开路由，均为 `https://ctrlctrlx.top/...`，无死链 |
| 构建产物 | `npm run build` 后检查 `.next/server/app` 下存在 `zh.html`、`en.html` 及各自页面 HTML |

---

## 十二、偏差、未完成项与建议

1. **`verify:deploy` 仍报 2 项失败，均为环境性、非代码问题**（本轮指定的 sitemap 契约错误已修复）：
   - `local-environment-file-present: .env.local`：该文件仅存在于本机且已被 `.gitignore` 忽略，内含你的 `DEEPSEEK_API_KEY`。我没有删除它（删掉会让本地助理退回纯规则模式）。发布前在验收机上移除或改名即可通过。
   - `npm-version-mismatch`：本机 npm 11.17.0，项目声明 `npm@10.9.2`。建议用 `corepack` 或 `npm i -g npm@10.9.2` 对齐，而不是改 `packageManager`（声明值用于保证可复现构建）。
   - 另有 notice `resume-pdf-text-not-audited:no-pdf-text-extractor`：这是本会话沙箱禁止脚本派生子进程所致；我直接用 `pdftotext` 完成了两份 PDF 的文字审计（结果见 §6.2）。请在普通终端复跑一次 `npm run verify:all` 以留存脚本级审计记录。
2. **PDF 里没有驻场经历**：`/[lang]/resume` 页面只有教育 / 项目 / 技能 / 荣誉 / 专利五个板块（你此前确认过简历不加「实践经历」板块），而驻场表述位于关于页与 `identity.bio`，因此不会出现在 PDF 中。若希望 PDF 体现「文昌冯家湾高频驻场约 6 个月」，需要在简历页新增实践经历板块——这属于内容结构调整，本轮未擅自做。
3. **英文 PDF 为 4 页、中文 3 页**：英文文案更长所致；如需压缩到 3 页，可精简技能或荣誉条目，或调整打印字号（会触及 `app/globals.css` 的打印样式）。
4. **`docs/deployment-readiness.md` 未更新**（P1-4 只点了 README）：该文档仍有 2 处过期表述——「Career Agent 当前不调用外部 AI」「共 28 条静态路由」（实际为 20 条公开页面路由 / 23 个 HTML）。需要的话我可以同步。
5. **`public/docs/` 三个项目 PDF 的公开范围仍未决策**：其中 `spec-rfid-inject-standard.pdf` 含麻醉与注射操作细节，与仓库 `AGENTS.md` 的隐私条款冲突，且三个文件仍不在文本审计范围内（我在分析报告中已单独提示，本轮任务未包含此项）。
6. **GitHub / Demo 入口已按指令移除**：如果后续拿到可公开的代码仓库或在线演示地址，数据层的 `githubUrl` / `liveDemoUrl` / `isInteractive` 字段仍在，恢复渲染约 15 行代码。
7. **`html lang` 的静态取值说明**：根布局不再读取请求头，静态 HTML 的 `<html lang>` 固定为 `zh`，英文页在 hydration 时由 `DocumentLocale` 校正为 `en`。如需「静态 HTML 即携带正确 lang」，可选方案是给各页面 metadata 补 `alternates.languages`（hreflang）或在 `<head>` 注入极小的阻塞脚本——两者都不影响 SSG，但本轮未纳入指定范围。
8. **视觉验证的说明**：无头截图首次出现「项目标题发灰」的现象，经 CDP 读取计算样式确认 `--foreground = #ededed`、标题计算色 `rgb(237,237,237)`，属无头截图的渲染时序假象；补 `--virtual-time-budget` 后截图正常。真实浏览器不受影响。
