# 附件文字链变色 + 论文日期/DOI + Hero 调整 + 关于我 6 能力模块 + 时间格式统一 批次报告

项目：`E:\PRD\my-ai-portfolio`
结果：5 项任务全部完成，`npm run verify` 全链路通过（30/30 页面静态生成），9 个页面实测**水合错误 0、控制台错误 0**，英文页中文字符 0。

---

## 0. 各任务完成情况汇总

| 任务 | 状态 | 关键实测证据 |
|---|---|---|
| 1 附件文字链改品牌蓝 | ✅ | 荣誉页 23 处 `--accent` 链接 + 16 处 hover 加深；「查看证明」15 条、「下载证书」1 条；首页附件入口 0 |
| 2 论文日期补月份 + DOI 移到日期后 | ✅ | 中文 `2025.04 / 2026.05`，英文 `Apr. 2025 / May 2026`；每篇论文 1 条「DOI 检索 / DOI Link」紧随日期；新建校验规则拦截「只有年份」 |
| 3 首页删副标题句 + 求职方向改研究方向 | ✅ | 可见文本中旧句与「求职方向」均为 false；「研究方向：计算机视觉、个体重识别（ReID）、视觉语言模型、嵌入式智能感知系统」中英双语就位；简历页同步 |
| 4 关于我 6 个能力模块卡片 | ✅ | 中英各 6/6 模块标题齐全；标题为「核心能力 / Core Capabilities」；网格 `md:grid-cols-2 lg:grid-cols-3`；旧「三大核心优势」可见文本为 false |
| 5 全局时间格式统一 | ✅ | 英文页 12–20 个 `Mon. YYYY` 日期、**数字日期 0 个**；中文页保持纯 `YYYY.MM`；校验脚本新增论文月份强制规则 |

---

## 一、任务 1：附件文字链品牌蓝

| 文件 | 改动 |
|---|---|
| `src/components/AttachmentList.tsx` | 「下载证书 / Download Certificate」由次级色改为 `var(--accent)`，并加 `hover:text-[var(--accent-hover)]`（hover 加深一级）+ 保留 `hover:underline` |
| `src/components/ImageGallery.tsx` | `variant="link"` 的「查看证明 / View Proof」同样改为 `var(--accent)` + hover 加深 + 下划线 |

- 品牌蓝即全站主按钮/主链接使用的 `--accent`（浅色 `#2563eb` / 深色 `#60a5fa`），深色与浅色主题自动适配，对比度与主链接一致；
- 点击行为未变：图片类仍走 `ImageGallery` 灯箱（`role="dialog"`、←/→、Esc、焦点归还），文件类仍走原生 `<a download>`；
- 专利卡片（项目页 + 简历页）复用同一组件，因此三处同步为品牌蓝；首页预览仍**隐藏全部附件入口**（实测首页证明文案 0 处）。

---

## 二、任务 2：论文日期补月份 + DOI 移到日期之后

| 文件 | 改动 |
|---|---|
| `src/data/profile/publications.ts` | `month` 字段本已精确到月（`2025.04` / `2026.05`），本次核对无缺失；`year` 字段保持数字不变 |
| `src/data/profile/credentials.ts` | 「荣誉与资质」里的两条论文引用条目 `year` 由 `2025` / `2026` 补全为 **`2025.04` / `2026.05`**，与 `publications.month` 同源 |
| `src/components/AcademicOutput.tsx` | 信息行重构为「日期 → DOI 链接 → 会议 → 作者」：日期在前，DOI 紧随其后**同一行**；DOI 文案保持「DOI 检索 / DOI Link」，改为品牌蓝 + hover 加深 + 下划线，新标签页打开；**移除**上一版独立右对齐的 DOI 行与会议行内的 `DOI: 10.x` 链接（避免同一卡片出现多个 DOI 入口） |
| `app/[lang]/page.tsx` | 首页项目卡上的「一作 EI 会议论文 ——」由年份改为带月份的展示值 |
| `scripts/verify-profile-data.mjs` | 新增 `invalid-paper-credential-year-format`：**论文类证书引用条目必须精确到月**（YYYY.MM），从规则上避免再次出现只有年份的展示；`publication.month` 原有的 `YYYY.MM` 强制校验保留 |

实测（中英双语）：中文页出现 `2025.04`、`2026.05`；英文页出现 `Apr. 2025`、`May 2026`；每篇论文各有 1 条「DOI 检索 / DOI Link」，卡片内 `doi.org` 链接数为 2（每篇 1 条），不再有 `DOI: 10.` 明文链接。

> 说明：论文标题、作者、会议、摘要、DOI 值、tags、关联项目等字段均未改动；仅调整了信息行的版式与 DOI 入口位置。

---

## 三、任务 3：首页 Hero 精简 + 求职方向改为研究方向

| 文件 | 改动 |
|---|---|
| `app/[lang]/page.tsx` | ① **删除** Visible Hero 中的一句话定位句（`about.headline` 那段「算法与硬件双线并进的工程型硕士，专注视觉算法工程化…」中英同步移除）；② 「求职方向：`jobTargets`」整行改为「**研究方向：**`about.researchDirections` 标签」（中文用 `、` 连接、英文用 `, ` 连接）；③ 间距微调：定位句移除后，籍贯/现居行由 `mt-4` 提到 `mt-5`，与上方标签行、下方按钮行形成均匀节奏，不留空洞 |
| `app/[lang]/resume/page.tsx` | 在线简历页的「求职意向 / Target roles」同步改为「研究方向 / Research Interests」，文案与首页同源（均取 `about.researchDirections`） |

- 保留项：姓名、头像、标签行（ResearchDirectionTags）、学历行、政治面貌、操作按钮、项目与荣誉预览等全部不变；
- 数据侧：`about.researchDirections` 是全站研究方向标签的唯一来源（首页标签行、关于页、求职问答同源），因此这次替换天然全站一致；
- 实测：首页与简历页可见文本中「求职方向 / Job Objective / 求职意向 / Target roles」命中 **0**；新研究方向行中英双语就位；删除的定位句在可见文本中命中 **0**（`about.headline` 字段本身保留在数据层，目前不再有展示位置）。

> 两点需要你知道：
> 1. 首页「研究方向」文字行与其下方的**研究方向标签行内容是同一组 4 个方向**（都取自 `about.researchDirections`），会出现一次语义重复；按验收要求「标签等 Hero 元素不变」我保留了标签行，若要合并（例如只留标签行或只留文字行），改动很小。
> 2. `about.headline` 字段现已无展示位置（仅参与数据校验）。如需彻底移除，我可以一并清理数据字段与校验项。
> 3. 英文方向标签里 `ReID` 的中文是「个体重识别」、英文沿用数据层既有的 `Individual Re-identification (ReID)`（本项目研究对象是鱼类个体，非「行人重识别 Person Re-ID」），因此与你给的英文示例 `Person Re-Identification (ReID)` 有一词之差，这是为保持事实准确而做的保留；若你确认要改成 `Person Re-Identification`，我改数据层标签（会同步影响首页标签行与关于页）。

---

## 四、任务 4：关于我重构为 6 个能力模块卡片

| 文件 | 改动 |
|---|---|
| `src/data/profile/about.ts` | `strengths` 由 3 条核心优势替换为**6 个能力模块**（算法研究能力 / 工程落地能力 / 边缘AI部署经验 / 调试与问题定位 / 学习力与潜力 / 综合素质），中文正文**逐字保留你给的内容**，英文为对应翻译；顺序即展示顺序 |
| `src/components/About.tsx` | 标题由「三大核心优势 / Three Core Strengths」改为「**核心能力 / Core Capabilities**」（锚点 id 同步为 `capabilities-heading`）；网格由 `md:grid-cols-3` 改为 **`md:grid-cols-2 lg:grid-cols-3`**（桌面 3 列 2 行、平板 2 列 3 行、移动端单列）；图标映射更新为 lucide 现有图标：`Brain`（算法研究）、`Wrench`（工程落地）、`Cpu`（边缘AI部署）、`Bug`（调试定位）、`GraduationCap`（学习力）、`Users`（综合素质）；卡片样式（圆角、边框、hover 位移与阴影、图标底色）沿用原实现，未新增样式类 |
| `scripts/verify-profile-data.mjs` | 能力模块数量守卫由 3 改为 **6** |
| `app/[lang]/about/page.tsx` | 页面 meta description 中的「三大核心优势」同步改为「核心能力模块」 |

- 页面其它板块（个人简介三段式、研究方向、教育经历、实践经历、实践配图）**位置与内容全部未动**；
- 实测：中英各 6/6 模块标题齐全、正文完整；可见文本中不再出现「三大核心优势」；`md:grid-cols-2 lg:grid-cols-3` 网格类存在。

> ⚠️ 内容侧的两处事实冲突（按「内容不增删不改」要求原样保留，请你确认）：
> 1. 模块 5 写「获『大唐杯』…**全国**三等奖」，而数据层奖项为「第十二届大唐杯全国大学生新一代信息通信技术大赛…**团队**三等奖」且级别为**省部级**（`competitions.ts`）。首页荣誉、荣誉页与简历页显示的是省部级/团队三等奖，两处口径不一致。
> 2. 模块 5 的「国家奖学金（全国获奖比例约 0.2‰）」这条比例数据站内没有其它来源，属新增量化表述。

---

## 五、任务 5：全局时间格式统一

| 文件 | 改动 |
|---|---|
| `src/lib/dateFormat.ts`（新增） | 展示层统一时间格式化：`formatYearMonth`（中文 `YYYY.MM` / 英文 `Mon. YYYY`）、`formatDateRange`（区间）、`formatDateTokens`（把文本中的 `YYYY.MM` 记号本地化，用于数据层双语字符串，如实践经历 `period`） |
| `src/components/Education.tsx` | 教育起止时间改用 `formatDateRange` |
| `src/components/Honors.tsx` | 奖项 / 竞赛 / 证书 / 论文引用的时间改用 `formatYearMonth`（预览与完整两种模式各一处） |
| `src/components/PatentCard.tsx` | 授权时间改用 `formatYearMonth`（英文由 `Granted 2022.03` 变为 `Granted Mar. 2022`） |
| `src/components/AcademicOutput.tsx` | 论文发表时间改用 `formatYearMonth` |
| `src/components/About.tsx` | 实践经历 `period` 改用 `formatDateTokens` |
| `app/[lang]/page.tsx` | Hero 学历行、项目预览卡时间改用 `formatDateRange`；论文徽标改用 `formatYearMonth` |
| `app/[lang]/projects/page.tsx`、`app/[lang]/projects/[slug]/page.tsx` | 项目卡与详情页时间改用 `formatDateRange` |
| `app/[lang]/resume/page.tsx` | 教育 / 项目 / 荣誉时间分别改用 `formatDateRange`、`formatYearMonth` |
| `README.md` | 新增「时间格式约定」小节，说明数据层格式与三个展示函数的复用要求 |

**实测（可见文本统计）**

| 页面 | 中文 | 英文 |
|---|---|---|
| 首页 | 14 处 `YYYY.MM`，英文月份 0 | 14 处 `Mon. YYYY`，数字日期 **0** |
| 关于我 | 12 处 `YYYY.MM` | 12 处 `Mon. YYYY`，数字日期 **0** |
| 荣誉资质 | 16 处 `YYYY.MM` | 16 处 `Mon. YYYY`，数字日期 **0** |
| 项目经历 | 8 处 `YYYY.MM` | 8 处 `Mon. YYYY`，数字日期 **0** |
| 在线简历 | 20 处 `YYYY.MM` | 20 处 `Mon. YYYY`，数字日期 **0** |

校验侧：`verify:profile` 已强制荣誉/证书 `YYYY.MM`（或 `YYYY`）、论文 `month` 为 `YYYY.MM`、论文类证书引用条目为 `YYYY.MM`；本轮新增的规则与既有规则全部通过。

> 未覆盖的日期展示（如需一并统一请告知）：求职问答（`career-agent.mjs`）在英文回答里仍输出 `2025.03–Present` 这类数字格式——它是纯文本回答层，格式化需要单独处理；另外 `about.bioSections`、`identity.bio` 等**自由文本**中的日期未做批量替换（避免误伤正文语义）。

---

## 六、修改文件清单

| 文件 | 改动 |
|---|---|
| `src/lib/dateFormat.ts` | 新增（时间格式化统一入口） |
| `src/components/AttachmentList.tsx` | 下载链改品牌蓝 + hover 加深 |
| `src/components/ImageGallery.tsx` | 文字链触发器改品牌蓝 + hover 加深 |
| `src/components/AcademicOutput.tsx` | 论文信息行重构（日期 + DOI 同行）、DOI 品牌蓝、日期本地化、移除旧 DOI 行 |
| `src/components/About.tsx` | 6 能力模块标题/网格/图标；实践时间本地化 |
| `src/components/Honors.tsx` | 荣誉/证书时间本地化 |
| `src/components/Education.tsx` | 教育时间本地化 |
| `src/components/PatentCard.tsx` | 专利授权时间本地化 |
| `src/data/profile/about.ts` | `strengths` 3 → 6 个能力模块（含英文翻译） |
| `src/data/profile/credentials.ts` | 论文引用条目 `year` 补月份 |
| `app/[lang]/page.tsx` | Hero：删定位句、求职方向→研究方向、间距微调、日期本地化 |
| `app/[lang]/resume/page.tsx` | 求职意向→研究方向、日期本地化 |
| `app/[lang]/projects/page.tsx`、`app/[lang]/projects/[slug]/page.tsx` | 项目时间本地化 |
| `app/[lang]/about/page.tsx` | meta description 措辞同步 |
| `scripts/verify-profile-data.mjs` | 能力模块数量 6；新增论文月份强制规则 |
| `README.md` | 时间格式约定小节 |

---

## 七、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (71 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 编译成功，30/30 页面，公开页面全部 ● SSG |
| `npm run verify`（全链路） | ✅ 全绿 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

浏览器回归（生产构建，CDP 采集）：`/zh`、`/en`、`/zh/about`、`/en/about`、`/zh/honors`、`/zh/projects`、`/en/projects`、`/zh/resume`、`/en/resume` 共 9 个页面 **水合错误 0、控制台错误 0**；6 个英文页可见文本中文字符 **0**。

---

## 八、本地预览检查清单

```
npm run build && npx next start -p 3416
```

| 路径 | 检查要点 |
|---|---|
| `/[lang]/honors` | 「查看证明」「下载证书」均为品牌蓝、hover 变深并出现下划线；点击证明开灯箱、点击下载得到专利 PDF；条目时间为 `2022.12`（中）/ `Dec. 2022`（英） |
| `/[lang]/projects` | 「学术成果」两张论文卡的日期后紧跟「DOI 检索 / DOI Link」（品牌蓝、新标签页）；日期为 `2025.04`/`2026.05`（中）与 `Apr. 2025`/`May 2026`（英）；专利卡显示 `授权于 2022.03` / `Granted Mar. 2022` |
| `/[lang]` | Hero 不再显示原一句话定位；「求职方向」已换成「研究方向：计算机视觉、个体重识别（ReID）、视觉语言模型、嵌入式智能感知系统」/ `Research Interests: …`；间距均匀无空洞；荣誉预览区无任何证明入口；项目卡 4 张顺序不变 |
| `/[lang]/about` | 「核心能力」为 6 张卡片，桌面 3 列 2 行、平板 2 列 3 行、移动端单列；文本与给定 6 段完全一致；教育/实践板块位置未变；实践时间为 `Sep. 2019 – Dec. 2022`（英） |
| `/[lang]/resume` | 头部显示「研究方向」/`Research Interests`（不再是求职意向）；各处时间按语言正确格式化 |
| 控制台 | 无 `Hydration failed`、无 #418、无 404 |

---

## 九、待确认事项汇总

1. **关于我模块 5 的两处事实冲突**：大唐杯「全国三等奖」与数据层的「省部级 / 团队三等奖」不一致；「全国获奖比例约 0.2‰」站内无第二来源。
2. **研究方向英文标签**：数据层为 `Individual Re-identification (ReID)`（鱼类个体重识别），与你示例的 `Person Re-Identification (ReID)` 不同；如需完全按示例，我改数据层标签（会同步影响首页标签行、关于页与问答）。
3. **首页「研究方向」文字行与标签行内容重复**：按验收要求保留了两者，可合并。
4. **`about.headline` 已无展示位置**：数据字段仍在（参与校验），可清理。
5. **`public/attachments/**/resources/` 的 44 个无关文件（16.7 MB）仍在**，建议清理（命令见上一轮报告）。
6. **问答层日期**（英文回答里的 `2025.03–Present`）与自由文本中的日期未纳入本次统一，需要的话可继续处理。
