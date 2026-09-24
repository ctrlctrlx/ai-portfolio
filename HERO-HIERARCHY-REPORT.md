# 首屏信息层级重构 · 文案升级 · 视觉突出 报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：首屏学历行重构与视觉突出、政治面貌上移、核心标语替换
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 **28/28**）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 学历行顺序 | ✅ `海南大学 \| 新一代电子信息技术 \| 工学硕士 \| GPA 3.6/4.0 \| 2024.09 – 2027.06`（学校→专业→学位→GPA→时间） |
| 学历行分隔符 | ✅ 统一竖线「\|」，前后带空格；组内分隔符为「空格 + \| + 不换行空格」，竖线不会单独滞留行尾 |
| 学历行视觉突出 | ✅ `text-base font-semibold` + `color:var(--foreground)`（原为 `text-sm var(--muted)`） |
| 学历行数据同源 | ✅ 全部取自 `education.ts`（`institution` / `major` / `degree` / `gpa` / `startDate` / `endDate`），无硬编码 |
| 政治面貌位置 | ✅ 独立成行，位于「求职方向」**上一行**；与学历行同级视觉权重（`text-base font-semibold` + 正文主色） |
| 籍贯行 | ✅ 精简为 `籍贯：重庆 · 现居：海南海口`，**不含**政治面貌 |
| 核心标语 | ✅ 中文新句已生效；术语 `CLIP-ReID` / `5 倍压缩` / `开放集识别` 与关于页、项目页一致 |
| 英文学历行 | ✅ `Hainan University \| New Generation Electronic Information Technology \| M.Eng. \| GPA 3.6/4.0 \| 2024.09 – 2027.06` |
| 首屏 DOM 顺序 | ✅ 方向行 → 姓名 → 学历行 → 政治面貌行 → 求职方向行 → 方向标签组 → 核心标语 → 籍贯行 → 按钮组（中英均严格递增） |
| 英文页 | ✅ 6 条 `/en` 路由可见文本汉字 0、中文标点 0 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ 28/28 静态页生成成功 |

---

## 1. 两处需确认事项的处理结果

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 任务 2.1 顺序里的「研究方向标签」指哪个 | **A：指首屏顶部的方向行（tagline）**——它本来就在姓名上方；本次只把「政治面貌」抽成独立行并上移到「求职方向」之前，4 个方向标签组保持在「求职方向」下方（上一轮你指定的位置）。改动最小且满足全部验收项 |
| 2 | 任务 1.4 英文用「M.Eng.」vs 数据里的「Master of Engineering」 | **A：改数据为 `M.Eng.` / `B.Eng.`**——这样首屏英文行与你给的样例逐字一致，且全部由 `education.degree` 渲染（无硬编码）；同时与关于页简介标签行的「M.Eng. Candidate…」口径统一 |

---

## 2. 修改文件清单与每处改动说明

| 文件 | 改动 |
| --- | --- |
| `app/[lang]/page.tsx` | ① **学历行重构**：内容改为 `institution \| major \| degree \| GPA gpa \| startDate – endDate`（全部取自 `currentEducation`，GPA 缺失时该段自动省略）；样式由 `mt-4 text-sm` + `var(--muted)` 改为 `mt-4 text-base font-semibold leading-7` + `var(--foreground)`；结构改为「组一（学校\|专业）+ 组间分隔符（仅 lg+ 显示）+ 组二（学位\|GPA\|起止）」，组内分隔符用 `\u00A0` 紧跟后一段文字<br>② **新增政治面貌行**：`<p className="mt-2 text-base font-semibold leading-7" style={{color:"var(--foreground)"}}>` 渲染 `publicAbout.politicalStatus[locale]`，位置在学历行之后、「求职方向」之前<br>③ **籍贯行精简**：`locationParts` 移除政治面貌片段，仅保留「籍贯 / 现居」 |
| `src/data/profile/education.ts` | `degree.en`：`Master of Engineering` → `M.Eng.`；`Bachelor of Engineering` → `B.Eng.`（中文 `工学硕士` / `工学学士` 不变） |
| `src/data/profile/about.ts` | `headline` 替换为新版核心标语（中英），术语与项目页/关于页统一：`CLIP-ReID` / `5 倍压缩`（en `5× … feature compression`）/ `开放集识别`（en `open-set recognition`）/ `Web 原型系统`（en `web prototype`） |

> 未改动：首屏 tagline、姓名 `h1`、求职方向行、方向标签组、按钮组、图片卡片，以及教育经历模块（`Education.tsx`）、简历页、荣誉页、机器人规则。

---

## 3. 首屏信息层级优化效果说明

### 3.1 顺序对照

| | 调整前 | 调整后 |
| --- | --- | --- |
| 1 | 方向行（tagline） | 方向行（tagline） |
| 2 | 姓名 | 姓名 |
| 3 | 学历行（小字·次级色） | **学历行（加粗·正文主色）** |
| 4 | 求职方向行 | **政治面貌行（加粗·正文主色）** |
| 5 | 研究方向标签组 | 求职方向行 |
| 6 | 核心标语 | 研究方向标签组 |
| 7 | 籍贯 · 现居 · 政治面貌行 | **核心标语（新文案）** |
| 8 | 操作按钮组 | 籍贯 · 现居行（已移除政治面貌） |
| 9 | — | 操作按钮组 |

### 3.2 视觉权重层级

| 元素 | 字号 | 字重 | 颜色 | 层级 |
| --- | --- | --- | --- | --- |
| 姓名 `h1` | `text-4xl sm:text-5xl` | `font-bold` | `var(--foreground)` | 一级 |
| **学历行** | `text-base` | `font-semibold` | `var(--foreground)` | **二级（本次提升）** |
| **政治面貌行** | `text-base` | `font-semibold` | `var(--foreground)` | **二级（与学历行同级）** |
| 核心标语 | `text-base` | `font-medium` | `var(--foreground)` | 三级 |
| 方向行 | `text-sm` | `font-medium` | `var(--accent)` | 辅助 |
| 求职方向 / 籍贯行 | `text-sm` / `text-xs` | 常规 | `var(--muted)` | 辅助 |

### 3.3 响应式实现

- 学历行由两个 `inline-block` 组构成：窄屏（`<lg`）两组各占一行 —— 第一行「学校 | 专业」、第二行「学位 | GPA | 起止时间」；桌面端（`lg+`）合并为单行。
- 组内分隔符写作「空格 + 竖线 + 不换行空格」（` |\u00A0`），竖线始终与后一段文字绑定，**不会单独滞留在行尾**；组间分隔符用 `hidden lg:inline` 包裹，窄屏折行时不产生多余的孤立竖线。
- 中文字历行在桌面端实测为单行；英文学历行较长，在 `lg` 宽度下可能自然折为两行，此时竖线随第二组落到下一行行首（仍满足「不滞留行尾」）。

---

## 4. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（68 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（26 quick prompts, 3 public projects） |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ 28/28 静态页面生成成功 |

页面实测（本地生产服务器端口 3326，测毕已关闭）：

| 检查项 | 实测 |
| --- | --- |
| 首屏 DOM 顺序（zh / en） | tagline(318) → h1(427) → 学历行(638) → 政治面貌行(965) → 求职方向(1064) → 标签组(1196) → 核心标语(1967) → 籍贯行(2131) → 按钮组(2657)；**严格递增 ✅**（en 同构） |
| 学历行标记（zh） | `<p class="mt-4 text-base font-semibold leading-7" style="color:var(--foreground)"><span class="block lg:inline">海南大学 \| 新一代电子信息技术</span><span class="hidden lg:inline"> \| </span><span class="block lg:inline">工学硕士 \| GPA 3.6/4.0 \| 2024.09 – 2027.06</span></p>` |
| 学历行标记（en） | `… <span class="block lg:inline">Hainan University \| New Generation Electronic Information Technology</span><span class="hidden lg:inline"> \| </span><span class="block lg:inline">M.Eng. \| GPA 3.6/4.0 \| 2024.09 – 2027.06</span>` |
| 政治面貌行 | `中共党员（2021.12）` / `Member of the CPC (Dec. 2021)`，`text-base font-semibold` + 正文主色 |
| 籍贯行 | `籍贯：重庆 · 现居：海南海口`；不含政治面貌 ✅ |
| 核心标语 | `算法与硬件双线并进的工程型硕士，专注视觉算法工程化：主导 CLIP-ReID 特征 5 倍压缩与开放集识别方案，并集成至 Web 原型系统。` |
| `M.Eng.` / `B.Eng.` 传播 | `/en`、`/en/about`、`/en/resume` 均命中；`Master of Engineering` / `Bachelor of Engineering` 残留 **0** |
| 机器人教育回答 | `• M.Eng.: Hainan University · New Generation Electronic Information Technology` / `• B.Eng.: Sichuan University of Science and Technology · Electronic Information Engineering` |
| 教育模块 GPA | 仍为 `<span style="color:var(--muted)"> · GPA 3.6/4.0`（本轮未改动该模块） |
| `/en` 可见文本 | 6 条路由汉字 0、中文标点 0 |

---

## 5. 本地预览验证路径与检查要点

```bash
npm run dev          # http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| `/zh`、`/en` 首屏 | 从上到下依次为：方向行 → 姓名 → **学历行（加粗、正文主色、含 GPA）** → **政治面貌行（加粗、单独一行）** → 求职方向 → 4 个方向标签 → 核心标语 → 籍贯·现居行 → 按钮组 |
| 学历行内容 | 顺序必须是 学校 → 专业 → 学位 → GPA → 起止时间，竖线分隔；GPA 与时间随 `education.ts` 变化自动同步 |
| 政治面貌 | 位于「求职方向」正上方；籍贯行里**不再**出现「中共党员」 |
| 核心标语 | 中文含「视觉算法工程化 / CLIP-ReID / 5 倍压缩 / 开放集识别 / Web 原型系统」；英文含 `5× CLIP-ReID feature compression` / `open-set recognition` |
| 窄屏（约 390px）与平板 | 学历行应折成两行：第一行「学校 \| 专业」、第二行「学位 \| GPA \| 时间」；行尾不出现孤立竖线；无横向滚动 |
| 桌面端（≥1024px） | 学历行尽量单行展示（中文实测单行；英文较长时可能折行，竖线随第二组换行，不停留行尾） |
| 英文页 | 学历行显示 `M.Eng.`；政治面貌显示 `Member of the CPC (Dec. 2021)`；全页无中文字符 |
| 打印 / 深浅主题 | 新增行仅使用 `var(--foreground)` 与既有字重类，两套主题下对比度正常 |

---

## 6. 偏差与残留事项（需你留意）

1. **首屏学历行的 GPA 现在是正文主色 + 加粗**，这与上一轮「所有展示 GPA 的位置统一使用 `var(--muted)` 次级色」在**这一行**上相互冲突。本轮任务 1.2 明确要求「整行文字加粗…颜色使用正文主色」，因此以本轮为准；**教育经历模块与简历页的 GPA 仍为次级色**（未改动，遵守「不修改其他模块内容」）。如你希望首屏 GPA 单独恢复次级色，把该片段包一个 `<span style={{color:"var(--muted)"}}>` 即可。

2. **任务书提到的 `var(--text-primary)` / `var(--font-bold)` 令牌在本仓库不存在**
   仓库实际使用 `var(--foreground)` 作为正文主色、用 Tailwind 的 `font-semibold` / `font-bold` 控制字重。本次严格复用**现有**令牌（全局约束第 1 条的作用），未新增任何自定义颜色。

3. **英文学历行在桌面端可能折行**
   中文行约 20 个汉字 + 分隔符，`lg` 下实测单行；英文行约 115 字符，在 `lg`（左栏约 688px）下约需 900px，会自然折为两行——竖线随第二组换行，不会滞留行尾。若你要求英文也严格单行，可选方案：缩小英文行字号（与本轮「字号提升一级」冲突）／把学历行移出左侧图文分栏（会改变首屏版式）／在 `lg` 起隐藏右侧照片卡片。请告知倾向。

4. **tagline 与方向标签组均保留原位**
   按你选择的 A：首屏第一行仍是方向行（tagline，含「工学硕士在读」），4 个方向标签组仍在「求职方向」下方。因此首屏同时存在「方向行」与「方向标签组」两处研究方向表述（内容一致、形式不同）。若你希望二选一，我可以移除 tagline 或标签组。

5. **籍贯行位置未变**（仍在核心标语之后、按钮组之前）
   任务 2.1 的顺序列举未包含籍贯行，但同段又要求它「精简为籍贯：重庆 · 现居：海南海口」，故保留原位仅做内容精简。

6. **`M.Eng.` / `B.Eng.` 是数据层改动，影响面为 3 个页面的英文显示**
   首页学历行、关于页教育模块、简历页教育板块、以及机器人教育回答都会同步变为 `M.Eng.` / `B.Eng.`（这正是选择 A 的预期效果）。若你只想让首屏用缩写、其它页面保留全称，那就需要在数据层拆出两个字段，请告知。

7. **工作区含多轮未提交改动**：本次未创建 commit。根目录现有 13 个未跟踪文件（8 份报告 + 组件/模块），历史报告可按需删除。
