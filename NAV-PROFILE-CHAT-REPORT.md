# 导航整合 · 量化简介 · 首屏优化 · 简历精简 · 卡片强化 · 机器人调整 报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：导航体系整合与研究内容并入项目经历、个人简介量化升级、首页首屏优化、简历页外链清理、项目卡片按钮强化、机器人问答调整、全局细节
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 **28/28**）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 导航无「研究」入口 | ✅ 顶栏与页脚均无 `/research`；首页无 `/research` 链接 |
| 导航顺序 | ✅ 首页 → 关于我 → 项目经历 → 荣誉资质 → 在线简历 → 联系我（中英一致） |
| `/research` 重定向 | ✅ `/zh/research` → **301** `Location: /zh/projects`；`/en/research` 同 |
| 项目经历页研究领域总览 | ✅ 4 个方向标签（computer-vision / reid / vision-language / embedded-sensing） |
| 方向标签筛选 | ✅ 未筛选 3 张卡片；计算机视觉 2、ReID 1、视觉语言模型 1、嵌入式智能感知系统 2；激活标签再点回全部 |
| 学术成果与专利迁入 | ✅ 摘要、核心创新点、量化指标、DOI、关联项目、专利卡全部保留（zh/en） |
| 项目详情页导航高亮 | ✅ `aria-current="page"` 落在「项目经历」 |
| 项目详情页返回入口 | ✅ 「返回项目列表」按钮本就位于标题上方（任务 1.4 已满足，未改动） |
| 关于页量化简介 | ✅ 开篇标签行加粗；含 Compact256 / 5 倍降维 / 精度损失<2% / 3 路 25fps / USB3.2；无独立「研究方向」模块 |
| 首页首屏 | ✅ 按钮为 下载简历 PDF（实心主色）+ 查看项目 + 关于我 + 联系我；无「在线简历」「了解研究」 |
| 首页研究方向标签行 | ✅ 紧接「求职方向」下方，4 个方向，与项目页同一样式 |
| 简历页外链清理 | ✅ `<address>` 仅剩邮箱 + 电话（+ 微信），无 GitHub / 个人网站外链与图标 |
| 项目卡片按钮 | ✅ 首页预览与项目页的「查看详情」均为实心主色按钮 + 箭头图标 |
| 机器人 | ✅ 教育/论文问答已下线改为页面引导；新增文档下载引导；研究方向为通用术语；自我介绍为量化版 |
| 英文页中文泄漏 | ✅ 8 条 `/en` 路由可见文本汉字 0、中文标点 0 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ **28/28** 静态页生成成功（见 §5 关于 30→28 的说明） |

---

## 1. 四项需确认事项的处理结果

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 重定向后研究页内容去向 | **A：迁入项目经历页**——新增 `AcademicOutput` 组件承载「学术成果」与「专利与工程创新」，论文摘要/指标/DOI/关联项目零丢失 |
| 2 | 方向标签的筛选映射 | **A：为 3 个项目标注方向**——① → 计算机视觉 + ReID + 视觉语言模型；② → 计算机视觉 + 嵌入式智能感知系统；③ → 嵌入式智能感知系统。四个标签均能命中项目，无项目被完全隐藏 |
| 3 | 首页首屏按钮 | **A：保留「查看项目」与求职助理**——移除「在线简历」与「了解研究」，下载简历 PDF 升为唯一实心主按钮 |
| 4 | 新增量化数据 | **A：原样写入并在报告中标注**——`精度损失<2%` 与 `驻场 3 个月` 按你给的文案落库（见 §7.3） |

---

## 2. 修改文件清单与每处改动说明

### 2.1 任务一：导航体系整合

| 文件 | 改动 |
| --- | --- |
| `next.config.ts` | 新增 `redirects()`：`/:lang(zh\|en)/research` → `/:lang/projects`，`statusCode: 301`（永久重定向） |
| `app/[lang]/research/page.tsx` | **删除**（内容迁入 `AcademicOutput`，路由由 301 承接） |
| `app/sitemap.ts` | 移除 `/research` 条目与其未再使用的导入 |
| `src/components/Navbar.tsx` | `getNavLinks()` 删除「研究」项、`hasResearch` 参数与 prop；顺序为 首页 → 关于我 → 项目经历 → 荣誉资质 → 在线简历 → 联系我 |
| `app/[lang]/layout.tsx` | 不再计算/传递 `hasResearch`；清理 `publicPatents`、`publicResearchAreas` 导入 |
| `src/data/site/footer.ts` | 页脚站内导航删除 `/research` 条目 |
| `src/components/AcademicOutput.tsx` | **新增**：原研究页的「学术成果」+「专利与工程创新」两段（含摘要/核心创新点/量化指标/DOI/关联项目/标签），供项目经历页复用 |
| `src/components/ResearchDirectionTags.tsx` | **新增**：通用研究方向标签组；传 `basePath` 时渲染为筛选链接（`?area=<id>`，激活态再点回到全部），不传时为纯展示标签 |
| `app/[lang]/projects/page.tsx` | ① 新增「研究领域总览」区块（4 个方向标签 + 筛选说明）；② 读取 `searchParams.area` 过滤项目并在标题标注当前方向；③ 新增「落地项目」小标题形成递进结构；④ 底部渲染 `<AcademicOutput />`；⑤ 卡片「查看详情」升级为主按钮 |
| `src/components/About.tsx` | 移除「研究方向」板块（与项目经历页重复）及 `ResearchAreas` 引用 |

> 说明：任务 1.4 要求的「返回项目列表」按钮**早已存在**（位于详情页标题上方，左箭头 + 文字），本次核对未改动。站内没有独立的「面包屑」组件，二级页面的层级由标题 + 返回入口表达；「项目经历 → 项目详情」在详情页以 `h1` + 返回按钮体现。

### 2.2 任务二：个人简介量化升级

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | 新增 `ResearchDirectionId` 与 `ResearchDirection { id, label }`；`AboutProfile.researchDirections` 改为结构化数组；`Project` 新增 `researchDirections: ResearchDirectionId[]` |
| `src/data/profile/about.ts` | ① `researchDirections` 改为带 id 的 4 项；② `bioSections` 重构为「开篇标签行（整行加粗：海南大学…工学硕士在读 \| 中共党员 \| 国家奖学金获得者）+ 量化正文（5 倍降维 / 精度损失<2% / 3 路 25fps / USB3.2 局部加粗）+ 行事风格」 |
| `src/data/profile/identity.ts` | `bio` 同步为量化版纯文本（供页面 meta description）；按隐私条款**不含**政治面貌表述 |
| `src/components/About.tsx` | 简介按 `bioSections` 渲染（段落 + 局部加粗）；不再渲染 `politicalStatus` 追加 |
| `src/data/profile/projects.ts` | 三个项目分别标注 `researchDirections` |
| `app/api/chat/route.ts`、`src/lib/career-agent.mjs` | 机器人自我介绍与简介同源（见 §2.6） |

### 2.3 任务三：首页首屏优化

| 文件 | 改动 |
| --- | --- |
| `app/[lang]/page.tsx` | ① 移除「在线简历」与「了解研究」按钮；② `ResumeDownloadButton` 显式 `variant="primary"`；③「查看项目」「关于我」「联系我」保持描边次级样式；④ «求职方向»下方新增 `<ResearchDirectionTags />` 标签行；⑤ 预览卡「查看详情」升级为主按钮；⑥ 清理 `BookOpen`、`FileText`、`publicResearchAreas` 导入 |

### 2.4 任务四：在线简历页优化

| 文件 | 改动 |
| --- | --- |
| `app/[lang]/resume/page.tsx` | 头部联系方式只保留邮箱与电话（按 `kind` 过滤），移除个人网站与 GitHub 外链及其 `ExternalLink` 图标；微信条目不变。打印时不再出现无效蓝色下划线 |

### 2.5 任务五：项目卡片交互强化

| 文件 | 改动 |
| --- | --- |
| `app/[lang]/projects/page.tsx` | 「查看详情」由 `text-xs` 文字链接改为实心主色按钮：`min-h-10 rounded-lg px-4 py-2 text-sm font-medium` + `background: var(--accent)` + 右侧 `ArrowRight` |
| `app/[lang]/page.tsx` | 首页预览卡同样升级（外层 `mt-auto pt-6` 保持卡片底部对齐） |

### 2.6 任务六：求职信息助理调整

| 文件 | 改动 |
| --- | --- |
| `src/lib/career-agent.mjs` | ① **删除** `buildEducation` / `buildPublications` 与 `EMPTY_PUBLICATIONS`，对应意图改为页面引导（`buildEducationGuide` → 关于我/在线简历；`buildPublicationsGuide` → 项目经历页的学术成果/专利区）；② 新增 `buildDocuments`：简历 PDF 三处入口 + 在线简历页页头 + 项目文档位置；③ `buildIntroduction` 改为「身份定位（取自 `about.bioSections[0]` 标签行）→ 核心成果（`bioSections[1..]`）→ 研究方向 → 核心能力 → 联系方式」，与关于页简介**同源**；④ `buildResearch` 改用 `direction.label`；⑤ `buildResume` 如实说明 PDF 可下载 |
| `app/api/chat/route.ts` | 语料移除 `education` / `research` / `publications`；保留 `about`（含 `bioSections`、`nativePlace`、`researchDirections`）、`projects`（含 `documents` 供下载引导）等 |
| `src/lib/career-agent.d.mts` | `CareerCorpus` 同步（移除 education/research/publications，新增 about/competitions/级别文案） |
| `scripts/verify-chat-contract.mjs` | 语料同步；新增断言：教育/论文提问必须引导到页面且**不得复述论文题录**、文档下载引导必须含简历 PDF 与入口页、简介必须与 `bioSections[0]` 同源且含 Compact256；简历回答断言改为「如实说明 PDF 可下载」 |

### 2.7 任务七 · 校验与文档

| 文件 | 改动 |
| --- | --- |
| `scripts/verify-profile-data.mjs` | ① `researchDirections` 校验升级：id 合法性、去重、四项齐全、`label` 双语；② 新增 `Project.researchDirections` 校验（非空 + 合法 id），供方向筛选依赖 |
| `README.md` | 路由表更新（`/research` 标注 301、项目页描述更新）；sitemap 与发布检查项去掉「研究页」 |
| `docs/deployment-readiness.md` | 能力清单更新为「项目经历页（含研究领域总览筛选与学术成果/专利）」 |

---

## 3. 核心优化点效果说明

1. **导航体系收敛为 6 项一级入口**，顺序与你的要求逐字一致；研究内容不再单独占一个栏目，而是并入项目经历，形成「研究领域总览 → 落地项目明细 → 学术成果/专利」的完整叙事。
2. **重定向零死链**：`/zh/research`、`/en/research` 均返回 **301** 且 Location 指向对应语言的项目页；sitemap 不再输出该路径，避免「sitemap 指向重定向」的 SEO 反模式。
3. **方向筛选无需 JavaScript**：标签是普通链接（`?area=<id>`），无 JS 也可用、可分享、可被爬虫抓取；同时保持项目页为服务端组件，避免把双语项目数据打进客户端 bundle（延续此前 /en 零中文泄漏的约束）。
4. **内容零丢失**：论文摘要、核心创新点、量化指标、DOI、关联项目、专利信息全部随 `AcademicOutput` 迁入项目经历页底部。
5. **简介量化**：开篇标签行一眼给出学历/身份/最高奖项；正文用「5 倍降维、精度损失<2%、3 路 25fps、USB3.2」四个可扫读数据支撑「软硬协同」定位。
6. **全渠道同源**：关于页简介、机器人自我介绍、meta description 三处口径一致——机器人直接读取 `about.bioSections`，不再另写一份文案。
7. **首屏操作层级清晰**：唯一实心主按钮为「下载简历 PDF」，其余为描边次级按钮，视觉权重不再互相争抢；研究方向标签行让 HR 在 3 秒内匹配领域。
8. **简历页更适合打印**：去掉两个外链后，`<address>` 只剩邮箱与电话，A4 打印无无效下划线。
9. **卡片转化引导增强**：实心主色 + 箭头 + 更大的内边距与字号，两处项目卡片视觉一致。

---

## 4. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（67 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（22 quick prompts, 3 public projects） |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ **28/28** 静态页面生成成功；路由清单中已无 `/[lang]/research` |

页面与接口实测（本地生产服务器端口 3319，测毕已关闭）：

| 检查项 | 实测值 |
| --- | --- |
| `/zh/research`、`/en/research` | **301** → `/zh/projects`、`/en/projects` |
| 顶栏导航项 | 杨冲 \| 首页 \| 关于我 \| 项目经历 \| 荣誉资质 \| 在线简历 \| 联系我（en：Yang Chong \| Home \| About \| Projects \| Honors \| Resume \| Contact） |
| 详情页导航高亮 | `aria-current="page"` = 项目经历 |
| 方向筛选卡片数 | 全部 3 / 计算机视觉 2 / ReID 1 / 视觉语言模型 1 / 嵌入式智能感知系统 2 |
| 激活标签回退链接 | `href="/zh/projects"`（再点恢复全部） |
| 首页首屏按钮 | 下载简历 PDF \| 查看项目 \| 关于我 \| 联系我（下载为实心主色；无在线简历/了解研究） |
| 首页研究方向标签 | 计算机视觉 \| 个体重识别（ReID）\| 视觉语言模型 \| 嵌入式智能感知系统 |
| 卡片「查看详情」 | 首页 2 个 + 项目页 3 个均为实心主色 + ArrowRight |
| 简历页 `<address>` | 2 个链接（邮箱 + 电话），无 github/个人网站 |
| 关于页简介 | 标签行加粗 ✅；Compact256 / 5 倍降维 / 精度损失<2% / 3 路 25fps / USB3.2 ✅；无 `about-research-heading` |
| 机器人（7 类提问实测） | 教育→关于我引导；论文→项目经历学术成果引导；文档→下载入口清单；研究方向→4 项通用术语；自我介绍→五段量化版；英文提问均为英文回答且无全角标点 |
| `/en` 可见文本汉字 / 中文标点 | 8 条路由（含 `?area=reid` 筛选态）均为 **0 / 0** |

---

## 5. 关于「30/30 → 28/28」的说明

任务书验收项写的是「生产构建 30/30 静态页面全部生成成功」。本任务要求**删除 `/[lang]/research` 路由**（改为 301 重定向），该路由在 `zh` / `en` 两个语言下各占 1 个预渲染任务，因此构建的静态页总数由 30 变为 **28**，构建本身**成功且无任何报错**。

- 校验方式：`✓ Generating static pages using 19 workers (28/28)`，路由清单中已无 `[lang]/research`。
- 结论：28/28 是删除 2 条路由后的**预期结果**，不是构建失败。若你希望数字回到 30，需要保留（而非重定向）该路由——这与任务 1.3 冲突，故未做。

---

## 6. 本地预览验证路径与检查要点

```bash
npm run dev          # http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| 任意页面顶栏 / 页脚 | 无「研究」入口；顺序为 首页 → 关于我 → 项目经历 → 荣誉资质 → 在线简历 → 联系我 |
| `/zh/research`、`/en/research` | 浏览器地址栏应最终落到 `/[lang]/projects`；`curl -I` 可见 `301` |
| `/zh/projects`、`/en/projects` | 顶部「研究领域总览」4 个标签；点击任一标签仅显示对应项目并在标题标注方向，再点该标签恢复全部；底部「学术成果」（摘要/指标/DOI/关联项目）与「专利与工程创新」；每张卡片「查看详情」为实心主色按钮 + 箭头 |
| `/zh`、`/en` | 首屏：唯一实心主按钮为「下载简历 PDF」；无「在线简历」「了解研究」；「求职方向」下方一行研究方向标签；项目预览卡的「查看详情」为主按钮 |
| `/zh/about`、`/en/about` | 简介开篇标签行加粗；正文含 5 倍降维/精度损失<2%/3 路 25fps/USB3.2 等加粗数据；**无独立「研究方向」模块**；简介末尾无政治面貌追加 |
| `/zh/resume`、`/en/resume` | 头部仅邮箱 + 电话，无 GitHub / 个人网站；Ctrl+P 预览无蓝色下划线、联系信息对齐 |
| 右下角「询问求职助理」 | 问「教育经历」→ 引导到关于我/简历；问「论文」→ 引导到项目经历页学术成果；问「文档下载」→ 列出简历 PDF 与项目文档入口；问「研究方向」→ 4 项通用术语；问「自我介绍」→ 五段量化版 |
| 窄屏（约 390px） | 方向标签自动换行；筛选后卡片单列；首屏按钮换行不溢出；卡片主按钮不超出卡片宽度 |
| 深浅主题 | 新增按钮/标签均复用 `var(--accent)` / `var(--accent-foreground)` / `var(--tag-bg)` / `var(--tag-text)`，两套主题下正常 |
| 打印 | 简历页打印无外链下划线；首页/项目页被打印时布局不破裂 |

---

## 7. 偏差与残留事项（需你留意）

1. **`ResearchAreas.tsx` 已成为未被引用的组件**
   它原供研究页与关于页「研究方向」板块使用，两处本次都被移除/删除，目前无任何导入方。我按「不删除业务结构」的原则保留了文件（不含个人事实，仅为展示组件）；如需清理可直接删除，或告诉我一声由我删除。

2. **3 个具体研究方向卡片不再出现在任何页面**
   数据层 `research.areas`（东星斑个体识别与开放集视觉理解 / RFID与多目视觉双模态采集装置 / 水产养殖标记方法与标准化体系）**完整保留**并继续通过 `verify:profile`，但展示位置（原研究页「当前方向」与关于页「研究方向」）均已按任务要求移除；现在对外呈现的是 **4 个通用研究方向标签**。若你希望这 3 个具体方向也可见，可考虑并入项目经历页的某个区块。

3. **两处新增数据按你的确认原样写入，请复核**
   - **精度损失<2%**：站内此前没有该指标（项目①原有指标为 Rank-1 76.3% / FAR 6.91% / AUROC 0.7108 / 5× 压缩）。现已写入关于页简介、`identity.bio`（即 meta description）与机器人自我介绍。
   - **驻场文昌冯家湾 3 个月**：实践经历条目时间为「2025.12 – 至今」。我按「现场驻场 3 个月（阶段性驻场）」理解，与长期合作不矛盾；如与事实不符请指出。

4. **机器人语料确实去掉了教育经历与论文信息（含知识库）**
   按任务 6.1，`career-agent` 的语料不再包含 `education` / `publications`，对应提问改为页面引导。副作用：**自我介绍不再单独列出两所院校与起止时间**（仅标签行提到海南大学，四川工业科技学院需通过「关于我」页面查看）。这与任务 6.3「自我介绍同步为量化增强版」一致；如希望保留教育背景段，我可以把 `education` 放回语料。

5. **简历回答口径已变更（合同断言同步更新）**
   原回答为「PDF 下载版仍待人工审核，当前不提供下载」，与站内到处可下载 PDF 的事实不符。按任务 6.2 改为如实说明下载入口，`verify-chat-contract.mjs` 的对应断言同步从「必须声明不提供下载」改为「必须说明 PDF 可下载」。这是一处**有意的行为变更**，请知悉。

6. **籍贯仍在首页信息行与机器人自我介绍中，但不在关于页简介正文**
   任务 2.1 给的新简介文案未含籍贯（上一轮曾要求在简介中补充）。我按新文案落地，同时保留首页信息行的「籍贯：重庆」与机器人自我介绍中的「籍贯重庆」。如希望简介正文也恢复籍贯，请告知。

7. **项目③归入「嵌入式智能感知系统」（按你的确认）**
   该项目的实质是东星斑标记方法筛选与标准化体系，与「嵌入式智能感知」并非严格对应；这是筛选可用性优先的归类，已在此标注以便你复核。

8. **方向筛选基于 URL 参数而非前端状态**
   `?area=<id>` 会出现在地址栏、可分享、无 JS 可用，并且保持项目页为服务端渲染（避免双语数据进入客户端 bundle）。如你更希望「点击即时过滤、URL 不变」的纯前端交互，需要把项目卡片改造成客户端组件并只传按 locale 解析后的字段，请告知。

9. **工作区含多轮未提交改动**：本次未创建 commit。根目录现有 5 份未跟踪报告与 3 个未跟踪组件文件；`app/[lang]/research/page.tsx` 处于已删除（未暂存）状态。历史报告可按需删除。
