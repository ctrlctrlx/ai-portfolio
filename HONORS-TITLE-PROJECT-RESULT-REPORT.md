# 荣誉名称修正与项目成果工程化叙述 改造报告

任务范围：① 荣誉资质名称修正并全网同步；② 项目①成果表述工程化优化（结果段落 + 核心量化数据 + 卡片摘要 + 英文同步）。

- 数据源：`src/data/profile/`（public + verified 集合），单一数据源，页面 / 简历 / 问答共用
- 设计令牌：全部复用现有 `var(--foreground)` / `var(--muted)` / `var(--accent)` / `var(--tag-*)` 与既有 Tailwind 工具类，未新增任何颜色、字号、间距
- 双语：所有改动均为 `BilingualText` 双语结构，无硬编码单语言文本
- 量化数据：原有数值**全部保留**，新增数值与所给文本逐位一致

---

## 一、修改文件清单与改动说明

### 1.1 任务一：荣誉名称修正

| 文件 | 改动 |
|---|---|
| `src/data/profile/awards.ts` | ① `scust-three-good-student-2021` 标题 `2020-2021学年三好学生` → **`三好学生`**，英文 `Three-Good Student, 2020–2021 Academic Year` → **`Three Good Student`**；颁发单位（四川工业科技学院）与时间（2021.11）保持不变<br>② `scust-first-class-scholarship-2021` 标题 `一等奖学金` → **`校级一等奖学金`**，英文 `First-Class Scholarship` → **`First-Class Scholarship (University-level)`**；颁发单位与时间（2021.11）保持不变 |

数据结构、`level: "university"` 分级、`awardLevelOrder` 时间倒序与两级校验规则完全不变；荣誉条数仍为 11（`verify:profile` / `verify:resume` 的条数守卫无需调整）。

**全网同步范围**（均读取同一 `publicAwards`，无需逐页改文案）：

| 出口 | 实测结果 |
|---|---|
| 荣誉页 `/[lang]/honors` 校级奖励分组 | `2026.09 校级一等奖学金` → `2022.11 优秀学生干部` → `2022.07 创新优秀学员` → `2021.11 三好学生` → `2021.11 校级一等奖学金` → `2021.05 五四红旗标兵` → `2021.03 军事训练先进个人` → `2020.12 结业证书`；三级子标题与排版不变 |
| 简历页 `/[lang]/resume` | 荣誉板块同步为新名称，旧名称零残留；打印样式未改 |
| 求职信息助理 | 荣誉问答同步输出 `2021.11 三好学生` / `2021.11 校级一等奖学金`，旧名称零残留 |

### 1.2 任务二：项目①成果表述工程化

| 文件 | 改动 |
|---|---|
| `src/data/profile/projects.ts` | ① `result` 替换为四段式工程化叙述（空行分段，`**…**` 为加粗标记）<br>② `metrics` 追加 2 条 dev70 核心量化收益，**原有 4 条指标原样保留**<br>③ `subtitle` 追加核心亮点句「身份错误率优化27%，达成单鱼阶段工程冻结标准」 |
| `src/components/RichText.tsx`（新增） | 轻量富文本渲染：按空行分段、按 `**…**` 加粗（复用 `font-semibold` + 继承文字色）；并导出 `firstParagraph` / `toPlainText` 两个纯文本口径工具 |
| `app/[lang]/projects/[slug]/page.tsx` | STAR 四个字段改用 `RichText` 渲染，「结果」卡片呈现四段式层级与加粗指标；卡片内其他样式不变 |
| `app/[lang]/projects/page.tsx` | 列表卡片「结果」只渲染首段概述（保证卡片高度与既有版式一致），其余三字段不变 |
| `app/[lang]/resume/page.tsx` | 简历项目条目「结果」改为首段纯文本（打印排版长度可控，且自动剥离 `**` 标记） |
| `src/lib/career-agent.mjs` | 新增 `projectResultText()`：问答层剥离 `**` 标记、还原段落；单项目问答给完整叙述，多项目列表与简历式摘要只取首段；RAG 上下文同步使用纯文本口径 |

### 1.3 量化数据保真对照

| 指标 | 原值 | 现值 | 说明 |
|---|---|---|---|
| 闭集 Rank-1 | 76.3% | 76.3% | 原样保留（`metrics`） |
| 部署级 FAR | 6.91% | 6.91% | 原样保留（`metrics`） |
| AUROC | 0.7108 | 0.7108 | 原样保留（`metrics`） |
| 特征维度压缩 | 5× | 5× | 原样保留（`metrics`） |
| dev70 已知个体错误率 | — | 20.10% → 14.65% | 新增（本次指令提供） |
| dev70 相对优化幅度 | — | 27% | 新增；`(20.10−14.65)/20.10 = 27.1%`，与原值自洽 |
| dev70 未知鱼误接收率 | — | 25.90% → 20.75% | 新增（本次指令提供） |
| dev70 相对优化幅度 | — | 20% | 新增；`(25.90−20.75)/25.90 = 19.9%`，与原值自洽 |

> 说明：本次把「核心量化数据」模块按指令更新为含 dev70 两组新指标，但**未删除**原有 4 条已验证指标——按「所有量化数据严格保留原值」的约束，删除会造成已核验数据在站内丢失（`about.ts`、README 仍引用 76.3% / 6.91% / 0.7108）。目前模块为 6 条：上排闭集/部署级口径，下排 dev70 冻结后口径，标签已明确区分评测集，不会互相覆盖。首页卡片首项指标仍为 `闭集 Rank-1 76.3%`，首屏口径未变。

---

## 二、项目表述优化效果说明

### 2.1 详情页「结果」四段式结构

`/[lang]/projects/fish-reid-open-world` 的「结果」卡片现为：

1. **工程机制**——单鱼视频运行时系统、冻结检测器 / 跟踪器 / QACM / 开放集阈值体系、轨迹级身份生命周期管理；
2. **机制清单**——Fast Warm-up、确认后身份保持、动态置信度更新、保守 Release、跨轨迹身份继承五大机制与复杂场景下的稳定性、可审计性；
3. **量化收益**——dev70 已知个体错误率 20.10% → 14.65%（**27%**）、未知鱼误接收率 25.90% → 20.75%（**20%**）；
4. **边界与后续**——heldout22 跨数据集泛化仍有空间，表征 / Gallery / 开放集判别为迭代重点；
5. **工程价值**——V3.1.1 达成单鱼阶段工程冻结标准，可作为多鱼场景的技术基线。

实测渲染：页面可见文本 **3 处加粗**（`核心量化收益` 标签 + `相对优化幅度达 27%` + `相对优化幅度达 20%`），可见文本中 `**` 标记数为 **0**；段落数 5（首段与其余 4 段间距 `mt-2`）。

### 2.2 卡片摘要

项目经历页与首页项目预览卡片的摘要均追加「身份错误率优化27%，达成单鱼阶段工程冻结标准」（英文 `identity error rate improved by 27%, meeting the single-fish engineering freeze standard`），卡片外层结构、间距、徽章、按钮与指标位均未改动：

- 列表卡片结果区只取首段（实测第二段未出现在列表页），卡片高度与改造前基本一致；
- 首页卡片追加摘要后仍为首屏 3 项指标中的 1 项，「查看详情」入口位置不变。

### 2.3 英文同步

英文「结果」逐段对应中文，术语统一：frozen detector、track-level identity lifecycle management、Fast Warm-up、post-confirmation identity retention、dynamic confidence updating、conservative Release、cross-track identity inheritance、open-set discrimination、engineering freeze standard。英文页同样 **3 处加粗 / 0 处 `**` 残留 / 0 个中文字符**。

### 2.4 问答与简历口径

- 单项目问答：完整四段式纯文本（无 `**`），含 20.10% / 14.65% / 27% / 25.90% / 20.75% / 20%；
- 多项目问答：每项目仅首段概述，保持可扫读；
- 简历页：首段纯文本，无标记残留，打印长度可控；
- DeepSeek 兜底上下文中同样不含 Markdown 标记（避免模型照抄 `**` 输出）。

---

## 三、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `Public content verification passed (69 public text files, 21 local assets, resume.pdf audited).` |
| `npm run verify:profile` | ✅ `Profile verification passed (3 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases).` |
| `npm run verify:chat` | ✅ `Chat contract verification passed (26 quick prompts, 3 public projects).` |
| `npm run verify:resume` | ✅ `Public resume verification passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries).` |
| `npm run lint` | ✅ 无报错、无警告 |
| `npx tsc --noEmit` | ✅ 类型零错误 |
| `npm run build` | ✅ 编译成功，**28/28** 静态页面全部生成 |
| `npm run verify`（全链路） | ✅ 以上 7 步串联执行全部通过 |

成品实测（`next start -p 3328`）：荣誉页中英文名称与排序正确；简历页旧名称零残留；项目详情页中英文内容与加粗正确、无标记残留；列表卡片与首页摘要正确；`/en` 六个路由（含项目详情）正文中文字符 **0**、中文标点 **0**（唯一中文来自刻意双语化的 `<noscript>`）。

---

## 四、本地预览验证路径与检查要点

```
npm run dev
```

| 路径 | 检查要点 |
|---|---|
| `http://localhost:3000/zh/honors` | 校级奖励分组内为「三好学生」「校级一等奖学金」；三级子标题与排版不变 |
| `http://localhost:3000/en/honors` | `Three Good Student`、`First-Class Scholarship (University-level)` |
| `http://localhost:3000/zh/projects/fish-reid-open-world` | 「结果」四段式；「核心量化收益」标签与 27% / 20% 加粗；「核心量化数据」含原有 4 条 + dev70 2 条 |
| `http://localhost:3000/en/projects/fish-reid-open-world` | 英文四段对应、加粗一致、无中文 |
| `http://localhost:3000/zh/projects` · `/en/projects` | 卡片摘要含 27% 亮点；结果区仅为首段概述，卡片高度与改造前相当 |
| `http://localhost:3000/zh` · `/en` | 首页项目卡片摘要同步；首屏指标仍为闭集 Rank-1 76.3% |
| `http://localhost:3000/zh/resume` · `/en/resume` | 荣誉新名称；项目结果单段纯文本，无 `**` |
| 页面右下角 AI 助理 | 「有哪些荣誉资质？」名称已同步；「请介绍基于视觉语言先验的开放世界东星斑个体重识别研究」返回完整工程化叙述且无 `**` |

响应式：本次未引入任何固定宽度、绝对定位或新字号；新增文本均为可换行的行内文本，移动端（≈390px）与桌面端仅在既有断点内换行，无横向溢出风险；长文案已通过「列表/简历取首段」控制在原有行数量级。

---

## 五、偏差与建议

1. **`src/data/profile/honors.ts` 不存在**（任务文案两次指向该文件）。荣誉实际分布在 `awards.ts`（11 条评奖）、`competitions.ts`、`credentials.ts`、`patents.ts`，本次按真实数据源落位，未新建 `honors.ts`。
2. **「核心量化数据」模块为追加而非替换**：保留原有 4 条已核验指标、追加 dev70 两条（原因见 §1.3）。如只需展示 dev70 两条，删除 `src/data/profile/projects.ts` 中 `metrics` 前 4 行即可。
3. **英文后缀大小写未统一**：按指令，四川工业科技学院条目英文为 `First-Class Scholarship (University-level)`（带连字符），而海南大学条目既有英文为 `First-Class Scholarship (University Level)`（无连字符，见 `src/data/profile/awards.ts` 与 `education.ts`）。二者现同处「校级奖励」分组，仅差一个连字符。若需彻底统一，建议把海南大学条目与 `education.ts` 中的该表述一并改为 `(University-level)`——本次未改，以免超出指定改动范围。
4. **校级分组出现两条同名中文条目**：`校级一等奖学金`（海南大学 2026.09）与 `校级一等奖学金`（四川工业科技学院 2021.11），靠颁发单位与时间区分，符合指令中的命名层级统一要求；建议问答回答在同类同名条目后补充颁发单位以便消歧（当前荣誉问答仅输出时间 + 名称）。
5. **列表卡片与简历的「结果」只展示首段**：完整四段式叙述仅在项目详情页与单项目问答展开。这是为满足「卡片布局/字数不变」与打印排版长度可控而做的取舍，回滚只需把 `app/[lang]/projects/page.tsx`、`app/[lang]/resume/page.tsx` 中的 `firstParagraph(...)` 去掉。
6. **项目状态与冻结口径措辞来自本次指令**：`V3.1.1 已满足单鱼阶段工程冻结标准`、`heldout22 跨数据集` 等表述为指令原文，站内此前无对应记录；如与论文/实验记录口径不同请告知，我会按「如实标注」原则调整。
7. **`public/resume.pdf` 未重新生成**：PDF 内项目结果与荣誉名称仍为旧文案（例如仍为 `一等奖学金`），站点页面已更新；需要 PDF 同步时请提供新的 PDF 资产。
8. **发现 3 个未跟踪的截图资产**：`public/images/projects/project-1/ScreenShot_2026-09-23_*.png`（非本次改动产生）。项目①数据层目前仅引用 `fig-1-framework.jpg`，这 3 张图未被任何数据引用；如需展示请告知要放置的位置。
