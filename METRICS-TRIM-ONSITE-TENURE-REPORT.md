# 项目量化数据精简 + 个人简介驻场经历表述升级 改造报告

任务范围：① 项目①「核心量化数据」删除跨数据集泛化整句；② 个人简介驻场经历表述升级并全位置同步。

- 设计令牌与结构：未新增任何样式或数据结构，仅改文本字符串
- 双语：所有改动均为 `BilingualText` / 双语字段，按 `locale` 切换，无硬编码单语言文本
- 数据保真：保留指标数值与新表述均按指定原文落库，未做换算或改写

---

## 一、修改文件清单与每处改动说明

### 1.1 任务一：核心量化数据模块精简

| 文件 | 改动 |
|---|---|
| `src/data/profile/projects.ts` | `metrics` 数组删除末条「跨数据集泛化性能仍有提升空间，底层个体表征优化、开放集判别能力增强是后续迭代重点」/ 对应英文；同步删除说明该边界说明的注释行 |

**删除前（5 条）→ 删除后（4 条）**

| 指标 | 状态 |
|---|---|
| 部署级 FAR 6.91% | ✅ 保留（原值） |
| 特征维度压缩 5× | ✅ 保留（原值） |
| dev70 已知个体错误率 20.10% → 14.65%（相对优化 27%） | ✅ 保留（原值） |
| dev70 未知鱼误接收率 25.90% → 20.75%（相对优化 20%） | ✅ 保留（原值） |
| 跨数据集泛化性能仍有提升空间…… | ❌ 整句删除（中英同步） |

除该句外无任何增减；指标 chip 的 `text-sm font-semibold` + `var(--accent)` / `var(--tag-bg)` / `var(--tag-border)` 加粗突出样式完全未动。

### 1.2 任务二：驻场经历表述升级

指定句在数据层出现 **2 处**（任务文案只点名了「关于页正文」一处，另一处是 `identity.bio`，它同时是首页/关于页的 meta description，也是机器人自我介绍的取词来源，因此一并替换以满足「全位置同步」）：

| 文件 | 位置 | 作用范围 |
|---|---|---|
| `src/data/profile/about.ts` | `bioSections` 量化正文段 | 关于页个人简介正文、机器人自我介绍「核心成果」段 |
| `src/data/profile/identity.ts` | `identity.bio` | 首页 / 关于页 meta description、机器人自我介绍取词源 |

替换对照：

| | 文案 |
|---|---|
| 原（zh） | 驻场文昌冯家湾 3 个月完成系统交付与标准化体系输出。 |
| 新（zh） | 在文昌冯家湾基地高频驻场约6个月（每周3-4天）完成个体识别装置交付与标准化体系输出。 |
| 原（en） | spent 3 months on site at Fengjiawan, Wenchang to deliver the system and the standardized operating framework. |
| 新（en） | spent about six months on high-frequency on-site work at the Fengjiawan base in Wenchang (3–4 days per week) delivering the individual-identification device and the standardized operating framework. |

术语统一：「个体识别装置」→ `individual-identification device`，与项目②图注既有表述 `individual-identification acquisition device`（个体识别采集装置）同一词根，全站口径一致。

### 1.3 同步覆盖矩阵（实测结果）

| 位置 | 任务一（删泛化句） | 任务二（驻场表述） |
|---|---|---|
| 项目详情页 `/[lang]/projects/fish-reid-open-world` | ✅ 中英均无 `泛化` / `Cross-dataset generalization` | — |
| 项目列表卡片指标行 | ✅ 已消失（指标行由 152 字缩至 109 字） | — |
| 首页项目预览卡片 | ✅（首屏指标不含该句） | ✅ meta description 已更新 |
| 关于页 `/[lang]/about` | — | ✅ 正文为新表述 |
| 简历页 `/[lang]/resume` | — | ⚠️ 该页本就不含驻场/交付表述（见 §4.2） |
| 求职信息助理 | ✅ 项目问答无「泛化」「后续迭代」 | ✅ 自我介绍为新表述 |
| meta description | ✅ | ✅ 新表述 / 旧表述为 `False` |
| 英文页 7 条路由 | ✅ 无中文泄漏（han=0、punct=0） | ✅ 英文新表述就位 |

---

## 二、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `Public content verification passed (69 public text files, 24 local assets, resume.pdf audited).` |
| `npm run verify:profile` | ✅ `Profile verification passed (3 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases).` |
| `npm run verify:chat` | ✅ `Chat contract verification passed (26 quick prompts, 3 public projects).` |
| `npm run verify:resume` | ✅ `Public resume verification passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries).` |
| `npm run lint` | ✅ 无报错、无警告 |
| `npx tsc --noEmit` | ✅ 类型零错误 |
| `npm run build` | ✅ 编译成功，**28/28** 静态页面生成 |
| `npm run verify`（全链路） | ✅ 以上 7 步串联全部通过 |

成品实测（`next start -p 3330`）要点：

- 详情页中英文均无 `跨数据集泛化` / `Cross-dataset generalization` / `priorities for the next iteration`；4 条保留指标全部在位且数值与原文逐位一致；
- 线上 7 个 `/en` 路由正文中文字符 `0`、中文标点 `0`；
- 助理单项目问答：无「泛化」「后续迭代」；自我介绍含「高频驻场约6个月」「每周3-4天」「个体识别装置」，旧表述为 `False`；
- 全站（`app/`、`src/`、`content/`、`public/`）已无旧驻场句与泛化句（仅历史报告 `.md` 保留当时记录，见 §4.4）。

---

## 三、本地预览验证路径与检查要点

```
npm run dev
```

| 路径 | 检查要点 |
|---|---|
| `http://localhost:3000/zh/projects/fish-reid-open-world` | 「核心量化数据」仅 4 条，无泛化/后续迭代描述；加粗高亮样式与改造前一致 |
| `http://localhost:3000/en/projects/fish-reid-open-world` | 对应英文 4 条，无 `Cross-dataset generalization` |
| `http://localhost:3000/zh/projects` · `/en/projects` | 项目①卡片指标行不再出现泛化描述 |
| `http://localhost:3000/zh/about` | 简介末尾为「在文昌冯家湾基地高频驻场约6个月（每周3-4天）完成个体识别装置交付与标准化体系输出。」 |
| `http://localhost:3000/en/about` | `about six months on high-frequency on-site work at the Fengjiawan base in Wenchang (3–4 days per week)` |
| `http://localhost:3000/zh` · `/en` | 页面源码 meta description 为新表述 |
| 页面右下角 AI 助理 | 问项目①：无后续迭代描述；问「请做一下自我介绍」：含 6 个月 / 每周 3-4 天 / 个体识别装置 |

响应式：本次仅替换字符串，未改动任何布局类、容器宽度或字号，各断点表现与改造前一致。

---

## 四、偏差与待确认项

1. **驻场句实际有 2 处，已同步替换**：除任务点名的「关于页简介正文」（`about.ts`）外，`identity.ts` 的 `identity.bio` 也含旧句，且它是首页/关于页 meta description 与机器人自我介绍的来源。按「全位置同步覆盖」一并替换；如果你只希望改关于页正文，回退该处即可。
2. **简历页无对应位置可同步**：`/[lang]/resume` 只有教育、项目经历、核心技能、荣誉奖项、专利五个板块，项目板块直接读取 `projects.ts`，而项目①/②的描述中本就不含驻场时间与交付物表述（实测 `驻场`、`冯家湾`、`个体识别装置` 均为 `False`）。如需在简历项目经历里加一行「现场交付」描述（含 6 个月 / 每周 3-4 天 / 个体识别装置交付），告诉我即可新增。
3. **求职信息助理不输出量化指标**：规则引擎的项目问答只拼接「结果段落 + 核心技术」，从不读取 `metrics`；被删的泛化句此前的出口是 `result`，已在上一轮随结果段落精简移出，因此本轮助理侧只需确认「无残留」（实测已无）。如你希望助理项目问答直接输出 dev70 核心量化收益，需要新增输出行为（约 3 行代码）——这与本轮「仅删除指定句子、无其他增减」的约束冲突，故未擅自添加，等你确认。
4. **历史报告仍保留旧记录**：`NAV-PROFILE-CHAT-REPORT.md`（记录当时的「驻场 3 个月」）与 `PROJECT-IMAGES-RESULT-METRICS-REPORT.md`（记录当时新增的泛化说明）等前几轮交付报告中仍写有旧表述，属于当时的事实记录、非站点内容；如需一并清理请告知。
5. **`public/resume.pdf` 未重新生成**：PDF 为二进制资产、本次未触碰，若其中也写了驻场时长或泛化说明，会与站点新表述不一致，需要同步时请提供新的 PDF。
6. **验收清单「仅保留 dev70 优化指标」的理解**：我按 1.1 的「保留内容」+ 你上一轮「其他指标保留」的答复执行，模块现实测为 4 条（FAR 6.91% / 5× / dev70 已知 / dev70 未知）。若你的意思是模块只留 dev70 两条，删除 `projects.ts` 中 FAR 与 5× 两行即可（一行一条），我可以立刻改。
7. **时间口径自洽性核对**：实践经历条目周期为「2025.12 – 至今」，站点 `lastUpdated` 为 2026.09，区间约 9.5 个月，「高频驻场约 6 个月（每周 3-4 天）」与之一致，不构成冲突。
