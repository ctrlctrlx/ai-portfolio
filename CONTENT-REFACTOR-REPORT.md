# 求职向内容重构与排版优化报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：联系电话、研究方向重构、教育 GPA、关于我去重、政治面貌入党时间、全局间距、细节统一
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 30/30）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 联系页 / 简历页显示电话 | ✅ 均显示 `18716985140`，联系页为 `tel:` 可拨号链接 + 电话图标 |
| 首页 / 关于页不显示电话 | ✅ 两页 HTML 均不含该号码 |
| 研究方向 3 个卡片 | ✅ 3 张卡片、3 个不同线性图标（fish / radio / tags）、3 条关联项目链接可跳转 |
| 教育经历 GPA + 排名 | ✅ 首页、关于页、简历页三处均显示，中文全角括号 / 英文半角括号 |
| 首页「关于我」重复小标题 | ✅ 已移除；可见 DOM 中 `bio` 0 次、`summary` 1 次 |
| 关于页去重与结构 | ✅ bio 仅 1 次；顺序为 个人简介 → 研究方向 → 教育经历 → 实践经历 → 三大核心优势 → 政治面貌 |
| 政治面貌入党时间 | ✅ 首页 + 关于页显示 `中共党员（2021.12）`；简历路由不含政治面貌（隐私门禁） |
| 首页模块间距 | ✅ 7rem→5rem（−28.6%）／8rem→5.5rem（−31.25%） |
| 简历页模块间距 | ✅ 2.5rem→1.75rem（−30%）；打印 7mm→5mm（−28.6%） |
| 英文页新增内容 | ✅ 8 条 `/en` 路由可见文本汉字 0、中文标点 0 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ 30/30 静态页生成成功 |

---

## 1. 五项需确认事项的处理结果

开工前发现 5 处任务描述与仓库既有隐私门禁／既有数据冲突，均已确认后按下述方案执行：

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 任务 5.2 要求简历页也显示政治面貌 | **A：不改简历页**。`AGENTS.md` 明文「政治面貌不得进入在线简历路由」，`verify:public-resume.mjs` 亦硬性拦截该字面量。仅在首页 + 关于页展示 |
| 2 | 任务 1.1 指定 `src/data/profile/contact.ts` | **A：写入现有 `identity.ts`**。该文件不存在；手机号字面值当前只被 `scripts/lib-approved-contacts.mjs` 允许出现在 `identity.ts` 与 `resume.pdf`。新建模块需放宽授权名单，故复用 `ContactPoint` 结构（新增 `kind: "phone"`），**隐私授权文件零改动** |
| 3 | 任务 4.2 关于页结构含「研究方向」 | **A：新增研究方向板块**，读取 `research.areas` 的 3 个方向；教育经历/实践经历置于研究方向之后、能力特点之前 |
| 4 | 任务 3 英文串用 `M.Eng.` / `B.Eng.` | **A：保留全称**（`Master of Engineering` / `Bachelor of Engineering`），GPA 用已有 `gpa` 字段追加，避免改写既有学位文案 |
| 5 | 任务 1.2/7.1 要求改为「图标 + 文本」列表 | **A：保持现有卡片网格**，电话作为第三张同款卡片加入，四张卡片类名逐字相同 |

> 说明：任务书中提到的 `var(--card-bg)` 令牌在本仓库不存在（实际为 `var(--card)`），全部新增样式均使用现有令牌，未引入任何自定义颜色。

---

## 2. 修改文件清单与每处改动说明

### 2.1 任务一：新增联系电话

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | `ContactKind` 增加 `"phone"`（`"email" \| "phone" \| "website" \| "github"`） |
| `src/data/profile/identity.ts` | `contacts` 新增 `public-phone` 条目：`kind: "phone"`、`label { zh: "电话", en: "Phone" }`、`value: "18716985140"`、`icon: "Phone"`、`visibility: "public"`、`verificationStatus: "verified"` |
| `src/data/profile/public.ts` | `getContactHref()` 增加电话分支 → `tel:<号码>`（原只有 email → `mailto:`） |
| `src/components/Contact.tsx` | 新增 `showPhone = false` 开关；`showPhone` 为真时在邮箱、微信之后追加电话卡片（同款类名 + `Phone` 图标 + 无障碍标签「拨打电话 / Call」） |
| `app/[lang]/contact/page.tsx` | 传入 `showPhone`；页面 description 由「求职邮箱与微信」改为「求职邮箱、微信与电话」 |
| `app/[lang]/resume/page.tsx` | 联系方式区按 `kind` 分支：邮箱 `mailto:` + Mail 图标、电话 `tel:` + Phone 图标（不加 `target=_blank`）、其余外链仍为 ExternalLink + 新窗口 |

隐私范围：首页 `<Contact locale={locale} />`、关于页 `<Contact locale={locale} />` 均未传 `showPhone`，实测两页 HTML 不含该号码。

### 2.2 任务二：研究方向重构

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/research.ts` | 由 3 个（其中 2 个重合）重组为 3 个互不重合方向：<br>① `fish-open-set` / 鱼类个体识别与开放集视觉理解 → `fish-reid-open-world`<br>② `rfid-multiview-acquisition` / RFID与多目视觉双模态采集装置 → `rfid-multiview-acquisition`<br>③ `aquaculture-marking-standardization` / 水产养殖标记方法与标准化体系 → `grouper-tagging-standard` |
| `src/components/ResearchAreas.tsx` | **新增共用组件**：研究方向卡片网格 + 按 id 映射的线性图标 + 可选的关联项目链接区块（研究页与关于页共用，避免重复实现） |
| `app/[lang]/research/page.tsx` | 卡片网格替换为 `<ResearchAreas locale={locale} showRelatedProjects />`；页面标题「当前方向」与网格列数保持不变 |

原「嵌入式智能感知系统与多模态数据采集」同时挂在两个项目上导致内容重合，拆分后每个方向与一个落地项目一一对应；原两个 ReID / CLIP 方向本指向同一项目，合并后消除重合。

### 2.3 任务三：教育经历 GPA 与排名

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | `EducationEntry.gpa` 由 `string` 改为 `BilingualText`（中英括号形式不同） |
| `src/data/profile/education.ts` | 海南大学 `gpa: { zh: "3.6/4.0（4/19）", en: "3.6/4.0 (4/19)" }`；四川工业科技学院 `gpa: { zh: "3.9/4.0（1/200）", en: "3.9/4.0 (1/200)" }`；学校、时间、学院、荣誉、研究方向字段未动 |
| `src/components/Education.tsx` | 专业行追加 ` · GPA …`，GPA 部分单独用 `var(--muted)` 次级色、同字号 |
| `app/[lang]/resume/page.tsx` | 同一处理（该行本身即 `var(--muted)`，GPA 随行） |

首页 hero 首屏那一行紧凑学历简介（`学位 · 专业 · 学校 · 时间`）保持原样，未追加 GPA——避免首屏定位行过长；首页「教育经历」板块已完整展示 GPA。

### 2.4 任务四：「关于我」去重合并

| 文件 | 改动 |
| --- | --- |
| `src/components/About.tsx` | ① 删除与模块标题重复的「关于我」小标题（首页精简版与内页完整版各一处）；② 移除依附小标题的 `mt-2`；③ 政治面貌从「个人简介」板块内移出，独立成板块并置于页面末尾；④ 新增「研究方向」板块（`ResearchAreas columns={3}`，3 张紧凑卡片）；⑤ 教育经历注释更新为「紧随研究方向」 |
| `app/[lang]/about/page.tsx` | 删除页头重复渲染的 `publicIdentity.bio` 段落（与 About 组件内简介完全一致）；description 同步改写为「个人定位、研究方向、教育与实践经历、三大核心优势与政治面貌」 |

去重实测（`/zh`、`/en`）：关于页可见 DOM 中完整 bio **1 次**、精简 summary **0 次**；首页可见 DOM 中完整 bio **0 次**、精简 summary **1 次**。首页可见文本中的「关于我」仅剩导航栏、页脚导航、首屏按钮三处**导航入口**，重复的板块小标题已消除。

### 2.5 任务五：政治面貌补充入党时间

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/about.ts` | `politicalStatus` → `{ zh: "中共党员（2021.12）", en: "Member of the CPC (Dec. 2021)" }` |

展示位置：首页「个人简介」板块内（`dl` 行内）、关于页末尾独立板块（单行）。简历路由不含该字段。

### 2.6 任务六：全局模块间距优化

| 文件 | 改动 | 幅度 |
| --- | --- | --- |
| `app/[lang]/page.tsx` | 主内容容器 `space-y-28 sm:space-y-32` → `space-y-20 sm:space-y-22` | 移动端 7rem→5rem（**−28.6%**）；≥640px 8rem→5.5rem（**−31.25%**） |
| `app/[lang]/resume/page.tsx` | 5 个 `resume-section mt-10` → `mt-7` | 2.5rem→1.75rem（**−30%**） |
| `app/globals.css` | 打印样式 `.resume-section { margin-top: 7mm }` → `5mm` | **−28.6%**，用于控制导出 PDF 篇幅 |

导航栏、页脚间距未做任何改动。`sm:space-y-22` 已确认由 Tailwind v4 动态生成（`calc(var(--spacing) * 22)` = 5.5rem）。

### 2.7 任务七 / 校验与文档

| 文件 | 改动 |
| --- | --- |
| `app/[lang]/projects/[slug]/page.tsx` | 技术标签 `px-3` → `px-2.5`，与项目列表页、技能组件、论文标签统一为 `rounded-full border px-2.5 py-1 text-xs` |
| `scripts/verify-profile-data.mjs` | 新增 `education.gpa` 双语校验（缺失英文即报 `missing-bilingual-field`），规则**收严**而非放宽 |
| `docs/deployment-readiness.md` | 同步更新简历发布要求：`/resume` 与 `/contact` 含已授权公开的邮箱与手机号；首页与关于页不展示手机号；政治面貌仅出现在首页与关于页 |

---

## 3. 核心优化点效果说明

1. **联系方式可拨号**：电话以 `tel:` 链接输出，移动端点击直接拨号；桌面端与其他卡片共用同一类名与间距，三/四张卡片在 2 列网格中对齐一致（实测卡片 class 字符串逐字相同）。
2. **研究方向零重合**：3 个方向各自绑定 1 个独立项目（fish-reid-open-world / rfid-multiview-acquisition / grouper-tagging-standard），不再出现两个方向指向同一项目、或一个方向挂两个项目的情况。
3. **方向可视化辨识**：鱼形（Fish）、射频（Radio）、标签（Tags）三个线性图标分别对应识别算法、RFID 采集装置、标记标准化三类工作，沿用全站 `--tag-bg` 底 + `--accent` 图标色的既有图标块写法。
4. **学历竞争力前置**：GPA 与专业排名直接出现在专业行，其中硕士 4/19、本科 1/200 的排名信息对 HR 的筛选价值高于单纯 GPA，且用次级色不抢学校名称视觉权重。
5. **首屏信息密度提升**：首页去掉重复小标题后，「个人简介」板块直接接精简定位文案；模块间距压缩约 30% 后，首屏到「代表项目」的滚动距离明显缩短。
6. **关于页结构清晰**：个人简介 → 研究方向 → 教育经历 → 实践经历 → 三大核心优势 → 政治面貌，六段各一个 `h2`，且不再与首页正文重复。
7. **打印篇幅收紧**：屏幕与打印两套间距同步压缩，`.resume-section` 打印外边距 7mm→5mm，配合原有的 `break-inside: avoid` 控制导出 PDF 页数。

---

## 4. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（66 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / **3 research areas** / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（18 quick prompts, 3 public projects） |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ 30/30 静态页面生成成功 |

额外执行 `npm run verify:deploy`：**因环境原因失败**（`npm-version-mismatch`）——本机 npm 为 `11.17.0`，而 `package.json` 声明 `packageManager: npm@10.9.2`。该文件本次未改动，属**既有环境差异**，与本次改动无关；`npm run verify` 不包含该步骤。

页面实测（本地生产服务器逐路由抓取）：

| 路由 | 可见文本汉字 | 可见文本中文标点 | 说明 |
| --- | --- | --- | --- |
| `/en`、`/en/about`、`/en/contact`、`/en/research`、`/en/resume`、`/en/projects`、`/en/projects/fish-reid-open-world`、`/en/honors` | **0** | **0** | DOM 源码中仅剩根布局双语 `<noscript>` 兜底（10 汉字 + 1 句号） |

---

## 5. 本地预览验证路径与检查要点

```bash
npm run dev          # 默认 http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| `/zh/contact`、`/en/contact` | 邮箱 / 微信 / 电话三张卡片同款样式、左对齐；电话为可拨号链接；英文页显示 `Phone` |
| `/zh/resume`、`/en/resume` | 头部联系方式行含电话（电话图标）；教育经历两所学校均显示 `GPA 3.6/4.0（4/19）` 与 `GPA 3.9/4.0（1/200）`；各板块间距较之前更紧凑 |
| `/zh/research`、`/en/research` | 「当前方向」下 3 张卡片、各带图标；每张卡片底部「相关公开项目」链接可跳转到对应项目详情 |
| `/zh`、`/en` | 首屏无重复「关于我」板块小标题；「个人简介」下为精简定位；「教育经历」板块含 GPA；模块间距更紧凑；**页面不出现手机号** |
| `/zh/about`、`/en/about` | 顺序：个人简介 → 研究方向（3 卡片）→ 教育经历 → 实践经历 → 三大核心优势 → 政治面貌；简介只出现一次；**页面不出现手机号** |
| 三处政治面貌 | 首页、关于页显示「中共党员（2021.12）」/「Member of the CPC (Dec. 2021)」；简历页不显示（预期） |
| 全站 | 首页/关于页每张卡片 hover 阴影、深色/浅色主题、390px 窄屏无横向滚动 |

打印校验：`/[lang]/resume` 页面 Ctrl+P 预览，确认模块外边距收紧、无内容被截断、无 `break-inside` 断页问题。

---

## 6. 残留事项（需你留意）

1. **`public/resume.pdf` 内容与网页存在差异，且该文件本次被替换过**。
   该文件在本次会话期间被改写（mtime `2026/9/19 13:45:04`，326890 → 328518 字节）——**并非本次改动所致**：我未对该二进制资产做任何写入，所有 PDF 相关脚本与我执行的 `pdftotext` 均为只读。新版 PDF 已包含上一轮的求职意向新措辞（`计算机视觉算法工程师` / `嵌入式 AI/边缘部署工程师`）与 GPA，因此判断为你本人在准备投递时更新了该文件，请确认。

   与网页的两处不一致（如需完全对齐需你重新导出 PDF）：

   | 项目 | 网页 | 当前 PDF |
   | --- | --- | --- |
   | 排名 | `GPA 3.6/4.0（4/19）`、`GPA 3.9/4.0（1/200）` | `(GPA3.6/4.0)`、`(GPA3.9/4.0)`，**无排名** |
   | 入党时间 | `中共党员（2021.12）` | `中共党员`，**无时间** |

   PDF 隐私审计已通过：仅含已批准手机号与邮箱，且姓名、手机号、邮箱三项必需信息均命中。

2. **研究页仍为 2 列网格**：3 张卡片在 `md` 断点下第三张会单独换行（按任务 2.2「布局保持不变」保留原列数）。若希望三卡一行，把 `ResearchAreas` 调用改为 `columns={3}` 即可（关于页已用 3 列）。

3. **指标标签与技术标签样式仍不同**（按任务 7.3 审计结论）：技术标签统一为 `rounded-full border px-2.5 py-1 text-xs`；指标标签因承载「加粗强调」语义而保留差异——研究页 `rounded-full px-3 py-1 text-sm font-semibold`、项目详情页 `rounded-xl px-4 py-3 text-sm font-semibold`。改动它们会明显改变既有版面，故未动，如需统一请指定目标样式。

4. **`verify:deploy` 的 npm 版本不匹配**为既有环境问题（见 §4），不影响 `npm run verify` 通过，但 `verify:all` 在修好版本前会失败。

5. **工作区包含多轮未提交改动**：本次未创建 commit。提交前请确认以下多批改动都要保留——重复上一轮的 13 个文件、上一轮已有的 12 个文件改动，以及本轮全部改动（含新增 `src/components/ResearchAreas.tsx`）。
