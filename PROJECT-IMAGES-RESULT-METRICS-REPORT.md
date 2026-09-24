# 项目界面图片接入 + STAR 结果精简 + 量化数据删减 改造报告

任务范围：① 东星斑 ReID 项目界面图片接入项目展示模块；② STAR「结果」段落精简为两段；③ 核心量化数据模块按指定条目删减。

- 设计令牌与组件：图片展示 100% 复用现有 `ImageGallery`（卡片圆角 `rounded-2xl`、`--card` / `--card-border`、hover 主题色描边 + 阴影、点击灯箱 1×～4× 缩放、`loading="lazy"`、`next/image` 响应式 srcset），未新增任何样式
- 双语：所有图注、alt、结果段落、指标均为 `BilingualText`，通过 `locale` 切换，无硬编码单语言文本
- 数据保真：保留指标数值与原值逐位一致，未做任何换算或改写

---

## 一、修改文件清单与每处改动说明

| 文件 | 改动 |
|---|---|
| `src/data/profile/projects.ts` | ① `images` 由 1 条扩为 4 条（3 张界面图 + 算法框架图移位）；② `result` 替换为精简两段；③ `metrics` 删除指定 2 条，保留其余并补充边界说明 |
| `src/data/profile/about.ts` | 「严谨科研素养」描述同步清理被删指标，改用保留口径的量化证据 |
| `src/data/profile/publications.ts` | `sourceNote` 去掉被删指标引用，改为口径差异说明（不点名数值） |
| `README.md` | 说明文档中的项目①指标引用同步更新 |
| `public/images/projects/open-world-reid/`（新增目录） | 3 张界面图按规范命名落位 |

> 说明：`src/data/profile/honors.ts`、`src/data/profile/projectImages.ts` 一类的独立图片数据文件不存在，项目展示图统一维护在 `projects.ts` 的 `images` 字段。

### 1.1 图片接入（`images` 数组，按展示顺序）

| 顺序 | 图注（zh / en） | 资源路径 | id |
|---|---|---|---|
| 图1 | 视频识别实时检测界面 / `Fig.1 Real-time Video Recognition Interface` | `/images/projects/open-world-reid/open-world-reid-video-inference.jpg` | `p1-ui-1-video-inference` |
| 图2 | 鱼个体档案管理列表 / `Fig.2 Fish Individual Registry List` | `/images/projects/open-world-reid/open-world-reid-fish-registry.jpg` | `p1-ui-2-fish-registry` |
| 图3 | 新个体注册审核界面 / `Fig.3 New Individual Enrollment Interface` | `/images/projects/open-world-reid/open-world-reid-enrollment.jpg` | `p1-ui-3-enrollment` |
| 图4 | 算法整体框架图 / `Fig.4 Overall algorithm framework` | `/images/projects/project-1/fig-1-framework.jpg` | `p1-fig-4-framework` |

- 按你选择的方案 ③：界面图占图1/图2/图3，算法框架图移到最后为图4（图注编号、`alt` 同步更新，文件未改动）。
- `alt` 精准描述界面内容（可访问性 + 语义识别）：
  - 图1：「Web 视频识别界面实时检测画面：东星斑被绿色检测框标注为 ID 3，置信度 1.0」
  - 图2：「鱼个体档案管理列表界面：已登记 80 条个体记录，列出 Fish ID、名称别名、来源、登记状态、Prototype 状态与更新时间」
  - 图3：「新个体注册审核界面：待审 Candidate 列表含状态、样本数与正常纳入进度，并提示下一个可用 Dynamic ID」

### 1.2 STAR「结果」段落（精简为两段）

中文（按指令原文）：

> 本项目构建了面向开放世界鱼类个体识别的单鱼视频运行时系统，围绕轨迹级身份生命周期管理，通过Fast Warm-up、确认后身份保持、动态置信度更新等五大核心机制，解决了轨迹断裂、帧质量波动、身份冲突等场景下的稳定识别问题。
>
> 系统V3.1.1已达到单鱼阶段工程冻结标准，可输出稳定、可审计的身份结果，为后续多鱼场景中的主动身份管理、多轨迹冲突处理提供可复用技术基线。

英文（术语与全站统一，结构逐段对应）：

> This project delivers a single-fish video runtime system for open-world fish individual re-identification. Centred on track-level identity lifecycle management, five core mechanisms — including Fast Warm-up, post-confirmation identity retention, and dynamic confidence updating — solve stable recognition under track breaks, frame-quality fluctuation, and identity conflicts.
>
> System V3.1.1 meets the single-fish engineering freeze standard: it outputs stable, auditable identity results and provides a reusable technical baseline for active identity management and multi-track conflict handling in future multi-fish scenarios.

已删除的冗余内容：冻结检测器/跟踪器/开放集阈值体系的架构铺陈、Fast Warm-up 之外的机制细节（保守 Release、跨轨迹身份继承）、`heldout22` 数据集名与 Gallery 质量等学术讨论、以及原第三段量化收益（已收敛到量化模块）。

### 1.3 核心量化数据模块

按你的确认口径执行（**以你最新的书面答复为准**）：删除「闭集 Rank-1 76.3%」与「AUROC 0.7108」，其余指标保留。

| 指标 | 处理 | 现值 |
|---|---|---|
| 闭集 Rank-1 76.3% | ❌ 删除 | — |
| AUROC 0.7108 | ❌ 删除 | — |
| 部署级 FAR 6.91% | ✅ 保留 | 6.91%（原值） |
| 特征维度压缩 5× | ✅ 保留 | 5×（原值） |
| dev70 已知个体错误率 | ✅ 保留 | 20.10% → 14.65%（相对优化 27%） |
| dev70 未知鱼误接收率 | ✅ 保留 | 25.90% → 20.75%（相对优化 20%） |
| 跨数据集泛化边界说明 | ➕ 新增（任务 3.2 指定） | 「跨数据集泛化性能仍有提升空间，底层个体表征优化、开放集判别能力增强是后续迭代重点」 |

- 指标样式复用详情页既有 chip（`text-sm font-semibold` + `var(--accent)` + `var(--tag-bg)` / `var(--tag-border)`），加粗突出样式保持不变；
- 删除项在数据层、注释、关于页简介、论文脚注、README 中均已无残留（详见 §4 校验）。

---

## 二、图片资源部署说明

### 2.1 落位与命名

你已完成 PNG → JPG 转换与规范命名，我做的处理只有一步：**按任务 1.1 指定的存放路径 `public/images/projects/open-world-reid/` 移动文件**（原来放在 `public/images/projects/project-1/`，字节完全未改动）。如需保留在 `project-1/` 目录，改回只需移动文件 + 改 3 处路径。

| 文件 | 尺寸 | 体积 | 说明 |
|---|---|---|---|
| `open-world-reid-video-inference.jpg` | 1347×627（2.15:1） | 232 KB | 视频识别实时检测界面 |
| `open-world-reid-fish-registry.jpg` | 1209×681（1.78:1） | 222 KB | 鱼个体档案管理列表 |
| `open-world-reid-enrollment.jpg` | 1221×516（2.37:1） | 164 KB | 新个体注册审核界面 |

均低于站内既有项目图片体积（既有单图 33 KB～666 KB），并由 `next/image` 在运行时转 AVIF/WebP + 按 `sizes` 输出响应式 srcset，实际传输体积更小。

### 2.2 交互与适配（复用现有组件，零改动）

- 懒加载：4 张图均带 `loading="lazy"`（实测页面 4/4）；
- 点击放大：4 个「放大查看」按钮，灯箱支持关闭、左右切换、Esc/←/→ 与 1×～4× 缩放（滚轮/双指捏合）；
- 响应式网格：移动端单列、`sm` 两列、`lg` 三列，卡片固定 4:3 画面比例 + `object-cover`，不溢出、不变形；
- 中英文共用同一份图片资源（`src` 与语言无关），仅图注/alt 按 `locale` 切换。

### 2.3 ⚠️ 需要你确认：`public/` 下多出一个未被引用的 `resources/` 目录

`public/images/projects/project-1/resources/background_clothing_conf/icon/` 下有 **22 个图片文件（8.75 MB，占 public 总体积的 48.7%）**，文件名形如 `04cba6e19400869e5e1bde3a9be9c429.png` / `*.jpg-lx2`，内容为婚纱人像、布达拉宫、海滩、穿钢铁侠服装的儿童、赛车手、富士山、宇航员猫等 AI 生成素材，与本项目无关，且**没有任何代码或数据引用**。它们目前会被一起发布到线上（`/images/projects/project-1/resources/...` 可直接访问）。

建议移出 `public/`（我不清楚这是否是你的实验素材，所以未擅自删除）：

```powershell
New-Item -ItemType Directory -Force -Path 'E:\PRD\my-ai-portfolio\_unpublished' | Out-Null
Move-Item -LiteralPath 'public\images\projects\project-1\resources' -Destination '_unpublished\project-1-resources'
```

---

## 三、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `Public content verification passed (69 public text files, 24 local assets, resume.pdf audited).`（引用资产由 21 → 24，新增 3 张界面图） |
| `npm run verify:profile` | ✅ `Profile verification passed (3 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases).` |
| `npm run verify:chat` | ✅ `Chat contract verification passed (26 quick prompts, 3 public projects).` |
| `npm run verify:resume` | ✅ `Public resume verification passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries).` |
| `npm run lint` | ✅ 无报错、无警告 |
| `npx tsc --noEmit` | ✅ 类型零错误 |
| `npm run build` | ✅ 编译成功，**28/28** 静态页面生成 |
| `npm run verify`（全链路） | ✅ 以上 7 步串联全部通过 |

成品实测（`next start -p 3329`）：

- 项目详情页图集顺序实测 = `video-inference → fish-registry → enrollment → framework`，图注 图1/图2/图3/图4 顺序正确，4 张图全部 `200`，`next/image` 优化接口 `200`；
- 结果段落实测：新两段文案完整，`heldout22`、`保守 Release`、`跨轨迹身份继承`、`相对优化幅度达 20%` 等已删内容全部为 `False`；
- 量化模块实测：`部署级 FAR 6.91%` / `特征维度压缩 5×` / dev70 两条 / 边界说明均在位，`闭集 Rank-1 76.3%` 与 `AUROC 0.7108` 全站为 `False`（含 `about.ts`、`publications.ts`、README）；
- 英文页：7 个 `/en` 路由正文中文字符 `0`、中文标点 `0`，`**` 标记 `0`；
- 列表卡片：结果区只显示首段（第二段不出现），卡片摘要仍含「身份错误率优化27%」；
- 简历页：结果行同步为首段纯文本，被删指标零残留；
- 问答：单项目回答完整输出新两段，无被删数值；自我介绍无被删数值。

---

## 四、本地预览验证路径与检查要点

```
npm run dev
```

| 路径 | 检查要点 |
|---|---|
| `http://localhost:3000/zh/projects/fish-reid-open-world` | 「项目展示」4 张图按 视频识别→鱼档案→注册→框架图 排列；图注 图1/图2/图3/图4；点击任意图打开灯箱可缩放查看完整界面；「结果」为两段精简叙述；「核心量化数据」5 条（无 Rank-1 / AUROC） |
| `http://localhost:3000/en/projects/fish-reid-open-world` | 对应英文图注 `Fig.1/Fig.2/Fig.3/Fig.4`、英文两段结果、英文指标，无中文残留 |
| `http://localhost:3000/zh/projects` · `/en/projects` | 项目①卡片摘要含 27% 亮点；结果区仅首段；卡片指标行较长（见 §5.3） |
| `http://localhost:3000/zh` · `/en` | 首页项目卡片首屏指标现为「部署级 FAR 6.91%」（原首项 Rank-1 已删除） |
| `http://localhost:3000/zh/about` | 「严谨科研素养」已改用 dev70 与 FAR 口径，无 76.3% / 0.7108 |
| 页面右下角 AI 助理 | 问「请介绍基于视觉语言先验的开放世界东星斑个体重识别研究」返回新两段；问荣誉/自我介绍无被删数值 |
| 响应式 | 移动端（≈390px）单列、平板两列、桌面三列；卡片 4:3 画面无溢出、无变形 |

---

## 五、偏差与待确认项

1. **图片存放目录已按 1.1 规范调整**：你转换好的 3 张 JPG 原本位于 `public/images/projects/project-1/`，我按任务 1.1 的指定路径移到了 `public/images/projects/open-world-reid/`（文件内容与命名未改动）。若你希望保持在 `project-1/`，告诉我即可改回。
2. **`public/` 下的 `resources/` 目录（22 个文件 / 8.75 MB / 占 public 48.7%）**：与本项目无关且未被引用，但会随站点发布，建议按 §2.3 的命令移出 `public/`（我未擅自处理）。
3. **卡片 4:3 裁切（`object-cover`）**：这是全站图集既有样式，界面截图较宽，在卡片缩略图中会左右裁切——实测可见宽度比例：视频识别 ≈62%、鱼档案 ≈75%、注册审核 ≈56%（注册界面的「样本/正常纳入/创建/详情」列在缩略图中会被裁掉）。灯箱内为 `object-contain`，可查看完整界面并可放大到 4×。若希望缩略图也完整显示界面，可把 3 张图统一补边到 4:3（不裁切、不变形），需要的话我来做。
4. **「核心量化数据」模块保留了 FAR 6.91%、5× 与 dev70 两条**：按你「其他指标保留」的答复执行，因此与你 3.2 中给出的「只剩 1 条 + 边界说明」不完全一致；同时按 3.2 把边界说明写进了模块（否则结果段落精简后，站内将不再出现该性能边界说明）。如要严格收敛为 3.2 的两行，删除 `projects.ts` 中 FAR / 5× 两行即可（dev70 未知鱼误接收率是否也删请一并告知）。
5. **模块标题未改名**：模块 `<h2>` 仍为「核心量化数据 / Key Quantitative Results」，未按 3.2 的「核心量化收益」改名——三个任务只涉及删减，故未动页面文案；需要改名请告知。
6. **首页首屏指标变化**：`ProjectPreviewCard` 取 `metrics[0]`，首项由已删除的 Rank-1 变为「部署级 FAR 6.91%」。若希望首屏露出「dev70 已知个体错误率 … 相对优化 27%」，把该条调到 `metrics` 首位即可。
7. **列表卡片指标行变长**：项目①卡片现在会把 5 条指标用「 · 」连成一行（152 字符，约 3 行），其中边界说明是一整句。如需让卡片保持紧凑，可把边界说明从 `metrics` 移到详情页的独立说明位。
8. **`RichText` 的 `**加粗**` 能力目前无数据使用**：结果段落精简后已无加粗标记，组件仍保留该能力（详情页/列表/简历仍依赖它的分段与首段提取）。需要我删掉加粗分支可以一并处理。
9. **`public/resume.pdf` 未重新生成**：PDF 内项目结果与指标仍是旧文案（含已删指标），站点页面已更新。
10. **历史报告仍保留旧记录**：`HONORS-TITLE-PROJECT-RESULT-REPORT.md`、`NAV-PROFILE-CHAT-REPORT.md` 等前几轮交付报告中仍写有 76.3% / 0.7108（作为当时的事实记录，非站点内容）；如需一并清理请告知。
