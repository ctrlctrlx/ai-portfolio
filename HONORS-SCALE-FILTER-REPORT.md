# 荣誉扩充 + 项目页筛选模块移除 改造报告

任务范围：① 荣誉数据扩充至 11 项并三分级展示；② 项目页移除「研究领域总览 / 方向标签筛选」模块。

- 数据源：`src/data/profile/`（public + verified 集合）
- 设计令牌：全部复用现有 `--card` / `--card-border` / `--accent` / `--accent-foreground` / `--muted` / `--foreground` / `--tag-bg` / `--tag-text` / `--tag-border`，未新增任何颜色或字号
- 双语：所有新增文案均同时提供 `zh` / `en`
- 数据层：仅新增荣誉条目；`researchDirections` 等既有字段全部保留

---

## 一、任务一：荣誉扩充与三级子标题

### 1.1 新增 7 项校级荣誉

统一格式「奖项名称 · 颁发单位 · 时间」，时间倒序，级别均为 `University-level`（`level: "university"`），颁发单位均为四川工业科技学院。

| # | 奖项名称 | 颁发单位 | 时间 |
|---|---|---|---|
| 1 | 校级一等奖学金 | 海南大学 | 2026.09 |
| 2 | 优秀学生干部 | 四川工业科技学院 | 2022.11 |
| 3 | 创新优秀学员 | 四川工业科技学院 | 2022.07 |
| 4 | 2020-2021学年三好学生 | 四川工业科技学院 | 2021.11 |
| 5 | 一等奖学金 | 四川工业科技学院 | 2021.11 |
| 6 | 五四红旗标兵 | 四川工业科技学院 | 2021.05 |
| 7 | 军事训练先进个人 | 四川工业科技学院 | 2021.03 |
| 8 | “青年马克思主义者培养工程学习班”结业证书 | 四川工业科技学院 | 2020.12 |

> 说明：`校级一等奖学金`（海南大学，硕士阶段）为新增的 1 项，其余 7 项为四川工业科技学院本科阶段校级荣誉/结业证书。第 8 项按用户指令归入「校级奖励」分组，尽管其性质为结业证书。

### 1.2 三级子标题

`awardLevelLabels` 统一为：

| level | zh | en |
|---|---|---|
| `national` | 国家级奖励 | National Awards |
| `provincial` | 省部级奖励 | Provincial Awards |
| `university` | 校级奖励 | University-level Awards |

展示顺序由 `awardLevelOrder = ["national","provincial","university"]` 固定。荣誉页另有「证书与专利」「学术论文」两类，共 5 个卡片。

### 1.3 组间距与排序稳定性

- 组间距：`src/components/Honors.tsx` 分级卡片容器 `gap-5` → `gap-6`，分组卡片在 `lg` 三列/移动端单列下间距一致加大，提升扫读区分度。
- 排序：组内时间倒序（`YYYY.MM` 字典序即时序）。修复了同年月比较返回非 0 造成的顺序抖动——`Honors.tsx` 与 `src/lib/career-agent.mjs` 的比较器在同年月时显式 `return 0`，保持数据层既定顺序（稳定排序）。

### 1.4 同步范围

| 出口 | 说明 |
|---|---|
| 荣誉页 `/[lang]/honors` | 11 项评奖 + 2 项竞赛，按三级分组展示；`证书与专利`、`学术论文` 独立成类 |
| 首页预览 | 首页 `Honors` 为 `variant="preview"`，分类优先级取前 3 条；总数文案自动由 4 变为 13 |
| 在线简历 `/[lang]/resume` | 「荣誉奖项」板块条数自动同步为 11 |
| AI 助理 | 规则引擎荣誉问答按三级分组输出全部 11 项，中英双语 |

### 1.5 校验脚本同步

两处硬性条数守卫由 4 → 11（守卫的作用是捕获非预期的条数漂移，本次为有意变更）：

- `scripts/verify-profile-data.mjs`：`incorrect-public-award-count`
- `scripts/verify-public-resume.mjs`：`resume-award-count-mismatch`

---

## 二、任务二：项目页筛选模块移除

### 2.1 删除内容

`app/[lang]/projects/page.tsx` 顶部整块模块被移除：

- 「研究领域总览」标题
- 模块说明文字（含「点击方向标签可筛选」类提示）
- 4 个研究方向筛选标签
- 筛选状态、点击处理函数、`searchParams` 入参、按方向过滤逻辑

同时删除该页内已无引用的导入：`ResearchDirectionTags`、`publicAbout`、`ResearchDirectionTags` 相关的类型与工具。页面签名回归 `{ params }: { params: Promise<{ lang: string }> }`，项目列表恢复为 `const projects = getSortedPublicProjects();`。

顺带移除现已冗余的「落地项目」二级标题（原为筛选区与卡片之间的小标题）。

### 2.2 保留内容（可回滚）

- 数据层 `Project.researchDirections: ResearchDirectionId[]` 全部保留（3 个项目分别标注 `computer-vision`、`reid`、`vision-language`、`embedded-sensing`）
- 数据层 `Project.techTags: BilingualText[]` 保留，卡片底部技术标签照常渲染
- `src/data/profile/about.ts` 的 `researchDirections` 结构化数据保留，首页仍在用
- `src/components/ResearchDirectionTags.tsx` 保留并改写为纯展示组件（去掉 `Link`、`basePath`、`activeId`、点击/选中态），首页继续复用

### 2.3 留白压缩

页头容器 `mb-10` → `mb-6`，`h1`「项目经历 / Projects」+ 一句说明后直接进入 3 张项目卡片；页面整体 `py-12`、卡片间距 `space-y-8` 不变。

### 2.4 残留清理

`src/components/ResearchDirectionTags.tsx` 内已无筛选交互代码；全站不再有任何 `?area=` 查询参数链接或筛选状态残留。

---

## 三、变更文件清单

| 文件 | 变更 |
|---|---|
| `src/data/profile/awards.ts` | 新增 8 条校级荣誉（含结业证书）共 11 条；`awardLevelLabels` 改为三级文案；补充维护注释 |
| `src/data/profile/competitions.ts` | 竞赛级别沿用既有分级字段（2 条，省部级/校级分区展示） |
| `src/components/Honors.tsx` | 分级卡片 `gap-5` → `gap-6`；组内排序比较器同年月返回 0（稳定排序）；注释更新 |
| `app/[lang]/projects/page.tsx` | 删除筛选模块与冗余标题；`mb-10` → `mb-6`；精简导入与签名 |
| `src/components/ResearchDirectionTags.tsx` | 改写为纯展示标签（去交互、去链接） |
| `src/lib/career-agent.mjs` | 荣誉回答排序比较器同年月返回 0，与页面顺序一致 |
| `src/lib/career-agent.d.mts` | 语料类型随 `awardLevelLabels` / `awardLevelOrder` 对齐 |
| `scripts/verify-profile-data.mjs` | 荣誉条数守卫 4 → 11 |
| `scripts/verify-public-resume.mjs` | 简历荣誉条数守卫 4 → 11 |

未改动：`public/resume.pdf`（二进制资产，措辞可能滞后于站点）、其他页面与组件、任何颜色/令牌定义。

---

## 四、效果说明

- 荣誉页由 4 条评奖扩充为 11 条，并首次出现「国家级奖励 / 省部级奖励 / 校级奖励」三级子标题；国家级 2 项（国家奖学金、国家励志奖学金）、省部级 1 项（四川省优秀大学毕业生）+ 省级竞赛、校级 8 项。
- 组内严格时间倒序，同年月按数据层既定顺序稳定输出：校级分组实测顺序为 校级一等奖学金(2026.09) → 优秀学生干部(2022.11) → 创新优秀学员(2022.07) → 2020-2021学年三好学生(2021.11) → 一等奖学金(2021.11) → 五四红旗标兵(2021.05) → 军事训练先进个人(2021.03) → 青马班结业证书(2020.12)。
- 项目页由「标题 + 研究方向总览 + 4 个筛选标签 + 落地项目 + 卡片」简化为「项目经历 + 一句说明 + 3 张卡片 + 学术成果」，首屏信息密度提升，筛选交互成本归零。
- 首页、简历、AI 助理与荣誉页四处口径完全一致（同一份 `publicAwards` 数据源）。

---

## 五、验证结果

| 命令 | 结果 |
|---|---|
| `npx tsc --noEmit` | 通过（零错误） |
| `npm run lint` | 通过（无警告/报错） |
| `npm run verify:chat` | 通过（26 条快捷问句，3 个公开项目） |
| `npm run verify` | 通过（内容/资料/简历/聊天契约全绿） |
| `npm run build` | 成功，28/28 静态页面生成 |

成品实测（`next start -p 3327`）：

- 荣誉页三级标题顺序正确，5 个分类卡片齐全（国家/省部级/校级/证书与专利/学术论文）
- 校级分组时间序列实测 `2026.09, 2022.11, 2022.07, 2021.11, 2021.11, 2021.05, 2021.03, 2020.12`
- AI 助理中文荣誉回答：三个级别标题齐全，11 项荣誉全部命中，同年月顺序与页面一致
- AI 助理英文荣誉回答：`[National Awards] / [Provincial Awards] / [University-level Awards]` 三级齐全，英文条目完整
- 项目页零残留：`研究领域总览`、`落地项目`、`area=`、`点击方向标签`、`方向筛选`、`全部方向` 均不出现；3 张项目卡片（3 个 slug）与 `mb-6` 页头
- `/zh/research` 仍为 301 → `/zh/projects`
- 6 个 `/en` 路由正文零中文字符（唯一中文来自刻意双语化的 `<noscript>`（请开启 JavaScript 以正常浏览本站。 / Please enable JavaScript…），非本地化遗漏）

---

## 六、本地预览路径

```
npm run dev
```

- 荣誉页：`http://localhost:3000/zh/honors` · `http://localhost:3000/en/honors`
- 项目页：`http://localhost:3000/zh/projects` · `http://localhost:3000/en/projects`
- 首页（预览 + 研究方向标签）：`http://localhost:3000/zh` · `http://localhost:3000/en`
- 简历（荣誉同步）：`http://localhost:3000/zh/resume`
- 旧路径重定向：`http://localhost:3000/zh/research` → 301 → `/zh/projects`

---

## 七、偏差与风险

1. **任务文案中的 `src/data/profile/honors.ts` 不存在**。本项目荣誉分散在 `awards.ts`（11 项评奖）、`competitions.ts`（2 项竞赛）、`credentials.ts`（5 项证书/论文）、`patents.ts`（1 项）。本次按实际数据源落位，未新建 `honors.ts`。
2. **结业证书归类**：`“青年马克思主义者培养工程学习班”结业证书` 性质上是证书，但按指令归入「校级奖励」分组；若后续需要，可将其迁移到 `credentials.ts` 的「证书与专利」类。
3. **条数守卫是有意修改**：两处 4 → 11 的守卫用于捕获非预期条数漂移，本次为计划内变更，未削弱其他检查项。
4. **英文措辞相近**：`一等奖学金`（四川工业科技学院）与 `校级一等奖学金`（海南大学）英文分别为 `First-Class Scholarship` 与 `First-Class Scholarship (University Level)`，靠括号后缀区分。
5. **`src/components/ResearchAreas.tsx` 已无引用**（研究方向页已删除、About 页研究方向模块此前已移除），本次未删除以降低影响面，可随时清理。
6. **`public/resume.pdf` 未重新生成**，PDF 内荣誉条目数可能仍滞后于站点的 11 项。
