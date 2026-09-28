# 附件文字链重构 + 项目排序 + 指标删除 + 技能新增 批次报告

项目：`E:\PRD\my-ai-portfolio`
结果：5 项任务全部落地，`npm run verify` 全链路通过（30/30 页面静态生成），9 个页面实测**水合错误 0、控制台错误 0**。

---

## 0. 各任务完成情况汇总

| 任务 | 状态 | 关键实测证据 |
|---|---|---|
| 1 附件改文字链 + DOI 显性化 | ✅ | 荣誉页 15 条「查看证明」+ 1 条「下载证书」；**附件缩略图 0 个**；文字链与颁发机构行**同一行**（`sameRowAsIssuer=true`）；首页证明入口 0；论文卡片新增「DOI 检索 / DOI Link」 |
| 2 项目排序 | ✅ | 列表页与首页顺序均为：ReID 研究 → RFID 采集装置 → 本站作品集 → 标记标准化 |
| 3 删除指定指标 | ✅ | `/zh|en/projects`、`/zh|en` 四个页面 `94.83`/`87.75`/`454`/`检测概率`/`Rank-1`/`AUROC` 命中全部为 **False** |
| 4 技能新增两项 | ✅ | 首页与英文页显示 `MySQL / 关系型数据库`、`Web 前端`，并出现新分组「开发工具 / 数据存储」「工程开发」；简历页同步显示两项 |
| 5 全链路校验 | ✅ | content / profile / chat / resume / lint / typecheck / build 全绿 |

---

## 一、任务 1：附件重构为文字链 + DOI 显性化

### 1.1 改动内容

| 文件 | 改动 |
|---|---|
| `src/components/ImageGallery.tsx` | 新增 `variant?: "grid" \| "link"` 与 `linkLabel`：`variant="link"` 时不渲染缩略图网格，只渲染一个行内文字链触发器，**灯箱本体（`role="dialog"`、←/→ 切换、Esc 关闭、焦点环、焦点归还）完全复用同一套逻辑** |
| `src/components/AttachmentList.tsx` | 重写为行内文字链：图片类显示「查看证明 / View Proof」（触发灯箱）、文件类显示「下载证书 / Download Certificate」（原生 `<a download>`）；样式为次级文字色 + hover 下划线；补齐 `aria-label`（含附件名与格式）；**移除缩略图与 compact 变体**；无附件返回 `null` |
| `src/components/Honors.tsx` | 荣誉页：颁发机构行与附件文字链改为**同一行的两端对齐容器**（附件在右），附件不再独占一行；首页预览按需求**不再渲染任何附件入口** |
| `src/components/PatentCard.tsx` | 专利卡片附件改为文字链并右对齐（项目页与在线简历页同步生效） |
| `src/components/AcademicOutput.tsx` | 论文卡片标题下方新增独立 DOI 行：中文「DOI 检索」、英文「DOI Link」，新标签页打开，样式与附件文字链统一（次级色 + hover 下划线）并右对齐；会议行内的 DOI 明文保留，便于直接看到 DOI 号 |

### 1.2 实测（中英双语，生产构建）

| 检查项 | 中文页 | 英文页 |
|---|---|---|
| 「查看证明 / View Proof」条目数 | 15 | 15 |
| 「下载证书 / Download Certificate」 | 1（专利 PDF） | 1 |
| 页面内附件缩略图 | 0 | 0 |
| 文字链与颁发机构同一行 | ✅ | ✅ |
| 点击文字链 → 灯箱 | 打开、图片为对应条目的证明（`award-06-national-scholarship-2022.jpg`）、焦点入框 | 同左 |
| Esc 关闭 + 焦点归还 | ✅ | ✅ |
| `aria-label` 示例 | `查看证明：放大查看获奖证明` | `View Proof: enlarge Award Proof` |
| 首页证明入口 | 0 | 0 |
| 论文 DOI 入口 | 2 篇 × 2 处（新 DOI 行 + 会议行明文） | 同左 |
| 控制台错误 | 0 | 0 |

纵向空间：附件不再渲染缩略图、文字链与颁发机构同行，因此**每条附件不再新增任何纵向高度**（实测文字链与机构行顶边差值 < 6px，判定为同一行）；荣誉页当前总高 2265px（中文）。

---

## 二、任务 2：项目排序

- `src/data/profile/projects.ts`：仅移动数组元素顺序 —— 从「作品集 → ReID → RFID → 标记标准化」调整为 **ReID 研究 → RFID 采集装置 → 个人作品集网站 → 标记标准化**，未改动任何字段内容。
- **必要配套改动**：`sortProjects()` 原本是「精选优先 + 开始时间倒序」，会自动把最新项目排到最前，导致「只调数组顺序」无法生效。已改为**按数组顺序返回**（数组即人工策展顺序，注释已写明原因），这样以后调顺序只需移动数组元素，不必去改 `startDate` 这类事实字段。该函数被项目列表页、首页、在线简历与求职问答共用，因此四处顺序一致。
- `app/[lang]/page.tsx`：`HOME_PROJECT_SLUGS` 同步为新顺序（首页 4 张卡顺序与列表页一致）。
- 实测：列表页与首页的卡片标题顺序完全一致，且与要求逐条吻合；项目内容、标签、图片、附件、slug、详情页均未变化。sitemap 与路由由数据自动生成，无需改动。

---

## 三、任务 3：删除指定指标表述

### 3.1 定位结果（与任务描述有出入，需要你知道）

你要求改 `src/data/profile/projects.ts` 并定位「第一个项目」的成果描述，但这两行实际位于 **`src/data/profile/publications.ts`**（即项目页底部「学术成果」板块的数据源，由 `AcademicOutput` 渲染）：

| 你列的表述 | 实际位置 | 归属 |
|---|---|---|
| 检测概率 0.5 → 0.9、节点收益差提升 454 单位 | `publications.ts` 第 58/59 行（摘要）+ 第 66/67 行（指标 chips） | **区块链频谱感知论文**（ICDIP 2025），并非第一个项目 |
| 闭集 Rank-1 94.83%、开放集 AUROC 87.75% | `publications.ts` 第 101/102 行（摘要）+ 第 109/110 行（指标 chips） | 鱼类 ReID 论文（PRMVAI 2026） |

### 3.2 实际改动

- 两篇论文的**摘要末尾对应句子**中英同步删除（区块链论文删「检测概率由 0.5 提升至 0.9，节点收益差提升 454 单位。」；ReID 论文删「闭集 Rank-1 达 94.83%，开放集 AUROC 达 87.75%。」），其余描述保持完整、语句自然收尾；
- 两篇论文的 `metrics` 置为空数组 `[]`（原 4 条指标 chips 全部移除）；
- ReID 论文的 `sourceNote` 中引用「论文版本指标」的表述一并清理，避免指向已删除的数据；
- **校验规则同步放宽**：`verify-profile-data.mjs` 原要求「每篇论文至少 1 条量化指标」，现改为「`metrics` 可省略或为空数组；一旦提供条目则必须中英双语完整」，并在注释中说明原因；
- README 的「Profile 事实原则」中关于论文指标的说明同步更新（避免文档与实际不符）。

保留项：创新点、摘要正文、技术标签、DOI 链接、关联项目与专利信息均未变动。

---

## 四、任务 4：技能栈新增两项

| 新增技能 | 归入分组 | 中/英 |
|---|---|---|
| MySQL | 「开发工具 / 数据存储」（新建子组） | `MySQL / 关系型数据库` / `MySQL / Relational Database` |
| Web 前端 | 「工程开发」（新建子组） | `Web 前端` / `Web Frontend` |

- **说明**：技能数据中原本**不存在**「开发工具 / 数据存储」与「工程开发」两个分组（真实分组是：语言与编程能力、深度学习与视觉、系统与部署、硬件与结构工具、网络架构、任务方向）。按你的分组命名，在「框架与工具」大类下**新建了这两个子组**并追加在既有分组之后，既有分组与条目顺序、内容未变。
- `groups` 与扁平 `items` 两处都写入（各 2 条，共 4 处），id 集合一致，由 `verify:profile` 校验通过；技能条目总数由 27 增至 **29**，文件头注释同步更新。
- 实测：首页（紧凑三列）与英文首页显示新分组与新条目；在线简历页（扁平 items）显示 `MySQL` 与 `Web 前端`。

---

## 五、修改文件清单

| 文件 | 改动 |
|---|---|
| `src/components/ImageGallery.tsx` | 新增 `variant="link"` 文字链触发器（复用灯箱） |
| `src/components/AttachmentList.tsx` | 重写为文字链（查看证明 / 下载证书），移除缩略图与 compact |
| `src/components/Honors.tsx` | 附件与机构行同行右对齐；首页预览不再渲染附件 |
| `src/components/PatentCard.tsx` | 附件文字链右对齐 |
| `src/components/AcademicOutput.tsx` | 论文卡片新增「DOI 检索 / DOI Link」行 |
| `src/data/profile/projects.ts` | 项目数组顺序调整（任务 2）；`sortProjects` 改为按数组顺序 |
| `app/[lang]/page.tsx` | 首页项目 slug 顺序同步 |
| `src/data/profile/publications.ts` | 删除两行指标表述（摘要 + metrics + sourceNote） |
| `src/data/profile/skills.ts` | 新增 MySQL、Web 前端（新分组 + 扁平条目） |
| `scripts/verify-profile-data.mjs` | 论文指标规则改为「可选/可为空」 |
| `README.md` | 论文指标说明与现状对齐 |

（`app/[lang]/layout.tsx`、`verify-public-content.mjs`、`types.ts`、`awards/credentials/patents/competitions.ts`、`public/attachments/**` 为本轮之前已改动，本轮未再修改。）

---

## 六、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (70 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 30/30 页面，公开页面全部 ● SSG |
| `npm run verify`（全链路） | ✅ 全绿 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

最终浏览器回归（生产构建，CDP 采集）：9 个页面（中英荣誉页、中英首页、项目列表、项目详情、简历、中英项目页、关于页）**水合错误 0、控制台错误 0**；荣誉页 15 条证明链 + 1 条下载链；首页 0 条附件入口；项目页 4 条 DOI 链接 + 1 条专利下载。

---

## 七、本地预览验证步骤与检查要点

```
npm run build && npx next start -p 3414
```

| 路径 | 检查要点 |
|---|---|
| `/zh/honors`、`/en/honors` | 每条带附件的条目在颁发机构行右侧显示「查看证明」/「View Proof」；专利显示「下载证书」/「Download Certificate」；**无缩略图**；点击文字链打开灯箱（放大、←/→、Esc）；页面明显更紧凑 |
| `/zh`、`/en` | 荣誉预览区**无任何证明入口**；代表项目 4 张卡顺序为 ReID → RFID → 作品集 → 标记标准化 |
| `/zh/projects`、`/en/projects` | 项目卡顺序同上；「学术成果」两张论文卡标题下方右对齐显示「DOI 检索」/「DOI Link」，点击新标签页打开 doi.org；卡片内不再出现 Rank-1 94.83% / AUROC 87.75% / 454 单位 / 检测概率 chips；专利卡右对齐显示「下载证书」 |
| `/zh/projects/fish-reid-open-world` | 详情页内容、指标、图集、技术标签与本轮前一致 |
| `/zh/resume`、`/en/resume` | 技能板块显示 `MySQL`、`Web 前端`；专利卡显示「下载证书」 |
| `/zh/about` | 无技能板块（见下），教育与实践模块未变动 |
| `/zh/honors` 的首页预览 | 首页不出现任何附件相关文案 |
| 控制台 | 无 `Hydration failed`、无 #418、无 404 |

---

## 八、偏差、风险与待确认

1. **任务 3 的文件与归属与描述不符**：两行指标在 `publications.ts`（学术成果板块数据源），其中「检测概率 / 454 单位」属**区块链频谱感知论文**，不是「第一个项目（东星斑 ReID 研究）」。我按你给的两行原文精确删除了对应内容（含两篇论文的摘要句子与指标 chips）。若你只想删 ReID 那篇的指标、保留区块链论文的 454 单位等表述，告诉我即可单独恢复。
2. **论文现在没有任何量化指标**：两篇论文的 `metrics` 已清空，卡片只呈现创新点与摘要；`verify:profile` 的「论文必须有指标」守卫已相应放宽（改为可选/可为空）。如果后续希望恢复，把数据填回 `metrics` 即可，守卫无需再改。
3. **`PublicationCard.tsx` 是死代码**：全仓无引用（学术成果实际由 `AcademicOutput` 渲染），因此 DOI 行与相关样式改在 `AcademicOutput` 中。建议后续清理该组件（连同 `ResearchAreas.tsx`、`Awards.tsx`）。
4. **项目详情页没有「上一篇 / 下一篇」导航**：任务 2 的验收项提到该功能，但当前不存在（详情页只有「返回项目列表」）。如需按新顺序增加上一篇/下一篇导航，我可以补一个小组件。
5. **技能分组是新建的**：「开发工具 / 数据存储」与「工程开发」原本不存在，已按你的命名在「框架与工具」下新建。若你希望把 MySQL 并入既有的「系统与部署」、Web 前端并入别处，改动很小。
6. **「关于我技能板块」不存在**：技能只在首页（紧凑三列）与在线简历（扁平列表）渲染，关于页没有技能模块，因此该项验收只能在首页与简历页核对。
7. **`sortProjects` 语义变更**：从「精选优先 + 时间倒序」改为「按数组顺序」。这是让「调数组即调顺序」成立的必要前提；若之后有人误以为仍是自动按时间排序，可参考函数注释（已写明）。
8. **`public/attachments/**/resources/` 的 44 个无关文件仍在（16.7 MB）**：仍建议清理：
   ```powershell
   Remove-Item -Recurse -Force 'public\attachments\awards\resources','public\attachments\credentials\resources'
   ```
   证书原图合计 14 MB（最大单张 4.6 MB），需要压缩也可以做（长边 1600px / 质量 82）。
9. **`npm run verify:deploy` 仍剩 2 项环境性失败**：`local-environment-file-present: .env.local`、`npm-version-mismatch`，与本轮改动无关。
