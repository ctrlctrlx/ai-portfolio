# 联系方式全站覆盖 · 政治面貌融入简介 · 首页精简与简介重构报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：全站联系方式统一新增电话（含页脚）、政治面貌融入简介、首页删除个人简介 + 首屏亮点短句、关于页三段式简介重构
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 30/30）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 关于页 / 页脚 / 联系页 / 简历页 /（首页）联系方式三项齐全 | ✅ 5 处均为「邮箱 + 微信 + 电话」，8 条中英路由逐页核验通过 |
| 电话 `tel:` 协议可拨号 | ✅ 每页 2 个 `tel:18716985140`（联系板块 + 页脚） |
| 关于页无独立政治面貌模块 | ✅ 页面内 `>政治面貌</h2>` 计数为 0 |
| 政治面貌融入简介末尾 | ✅ 中文 `…项目落地节奏。中共党员（2021.12）。`；英文 `…delivery pace. Member of the CPC (Dec. 2021).` |
| 关于页简介三段式 + 开篇加粗 | ✅ 3 个段落、7 个片段、3 处加粗（开篇定位句 + 2 处关键成果） |
| 首页无个人简介模块 | ✅ `>个人简介</h2>` 计数 0，`id="about-heading"` 不存在 |
| 首页首屏核心亮点短句 | ✅ `软硬协同工程型硕士 \| 2篇EI会议论文 \| 3个落地项目` / `Engineering Master with Software-Hardware Skills \| 2 EI Papers \| 3 Field Projects` |
| 首屏按钮下方紧接亮点句 | ✅ DOM 顺序：按钮区 `</div>` → 亮点 `<p>` → 教育经历板块 |
| 失效锚点 | ✅ 原 `href="#about-heading"` 已改为 `/${locale}/about`，首页无残留锚点 |
| 简历页政治面貌 | ✅ 按 A 方案**未新增**（隐私门禁保持，`verify` 全绿） |
| 英文页中文泄漏 | ✅ 7 条 `/en` 路由可见文本汉字 0、中文标点 0 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ 30/30 静态页生成成功 |

---

## 1. 三项需确认事项的处理结果

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 任务 2.2 要求简历页保留独立政治面貌条目 | **A：简历页不加**。`AGENTS.md` 明文「政治面貌不得进入在线简历路由」，`verify:public-resume.mjs` 对「政治面貌」字面量硬拦截。实测简历页仍无该条目 |
| 2 | 任务 3.1 要求首页「教育经历 → 技能 → 项目预览」直接衔接 | **A：保留荣誉与资质板块**。首页顺序为 首屏 → 教育经历 → 荣誉与资质 → 技能栈 → 代表项目 → 联系我，仅删除个人简介 |
| 3 | 任务 3.2 新版三段式简介的数据归属 | **A：`about.ts` 结构化 `bioSections` + `identity.bio` 同步同一文案**。页面、meta description、AI 助理自我介绍三处文案一致 |

---

## 2. 修改文件清单与每处改动说明

### 2.1 数据层

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | 新增 `BioSegment`（`text: BilingualText` + 可选 `strong`）与 `BioSection`（`id` + `segments`）接口；`AboutProfile` 新增 `bioSections: BioSection[]` |
| `src/data/profile/about.ts` | 新增 `bioSections` 三段式简介：① `positioning` 核心定位（整段 `strong`）② `research-and-capability` 研究方向与软硬协同能力（2 处关键成果 `strong`）③ `working-style` 行事风格与风险预判。政治面貌未写入此处，仍由 `politicalStatus` 字段单独持有 |
| `src/data/profile/identity.ts` | `bio` 更新为与 `bioSections` 一致的纯文本（中文直接拼接、英文以空格拼接），供 meta description 与 `career-agent.mjs` 的自我介绍复用 |

> 隐私边界：政治面貌字面量仍**只存在于 `about.ts`**，未进入 `identity.ts`，因此页面 meta description 与 AI 助理自我介绍都不包含它。

### 2.2 渲染层

| 文件 | 改动 |
| --- | --- |
| `src/components/About.tsx` | ① 简介改为渲染 `bioSections`：三段 `<p>`、片段级加粗（`fontWeight: 600` + `var(--foreground)`）、段间距 `space-y-4`；② 政治面貌追加到末段末尾（中文 `中共党员（2021.12）。` 无空格、英文前置一个空格）；③ **删除页面末尾原独立「政治面貌」板块**；④ 不再渲染 `headline` 单独段落（新 P1 即核心定位句）；⑤ 更新组件文档注释 |
| `src/components/Contact.tsx` | 三张卡片时网格改为 `mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3`（桌面三等宽，窄屏两列/单列）；两张卡片时保持原 `sm:grid-cols-2` |
| `src/components/Footer.tsx` | 新增 `phone: string \| null` prop；联系方式区在邮箱、微信之后新增电话条目，`tel:` 链接、`break-all` 防溢出、复用 `var(--muted)` |
| `src/data/site/footer.ts` | `FooterDictionary` 新增 `phoneLabel`（`电话` / `Phone`），`getFooterDictionary` 按 locale 输出 |
| `app/[lang]/layout.tsx` | `getPublicContact("phone")` 解析后作为 `phone` 传入 `Footer` |
| `app/[lang]/page.tsx` | ① 删除 `<About locale={locale} summaryOnly />` 与 `About` 引用（首页个人简介板块整体移除）；② 首屏「关于我」按钮由 `href="#about-heading"` 改为 `<Link href={\`/${locale}/about\`}>`（锚点目标已不存在，避免失效链接）；③ 按钮区下方新增核心亮点短句；④ 亮度计数由 `publicPublications`（`publicationType === "ei-conference"`）与 `getSortedPublicProjects()` 派生，**不在组件内硬编码个人事实**；⑤ 首页联系我板块开启 `showPhone` |
| `app/[lang]/about/page.tsx` | 底部联系模块开启 `showPhone`（关于页联系模块三项齐全） |

### 2.3 校验与文档

| 文件 | 改动 |
| --- | --- |
| `scripts/verify-profile-data.mjs` | 新增 `about.bioSections` 校验：非空数组、每段至少一个片段、片段文本双语齐全（规则**收严**） |
| `docs/deployment-readiness.md` | 联系方式发布口径更新为「全站统一邮箱 + 微信 + 电话，含页脚」；政治面貌只出现在 `/[lang]/about` 简介末尾 |

---

## 3. 核心优化点效果说明

1. **联系方式全站标准化**：`Contact` 组件同时服务首页、关于页、联系页；页脚独立渲染同一份数据。5 个位置（关于页、页脚、联系页、简历页、首页联系模块）统一为「邮箱 + 微信 + 电话」，顺序一致、卡片类名逐字相同、电话统一 `tel:` 协议。
2. **页脚电话与既有条目并列**：页脚原邮箱/微信为纯文本条目、无图标，因此电话同样以纯文本 `tel:` 链接呈现（`Phone: 18716985140` / `电话：18716985140`），不改动页脚既有视觉风格；线性电话图标用在卡片式模块（关于页/联系页/首页）中，与 Mail / MessageCircle 图标同款写法。
3. **关于页三等宽卡片**：三项时桌面 3 等宽、平板 2 列、手机单列，窄屏不拥挤；值文本沿用既有 `break-all`，长邮箱不会撑破卡片。
4. **政治面貌自然收尾**：不再单独占一个板块，而是作为身份补充说明附在简介末段句尾；中文紧贴句号无空格，英文保留一个空格，排版自然。
5. **三段式简介 + 关键词加粗**：开篇核心定位句整段加粗，第二段「主导过 CLIP-ReID 特征压缩与开放集识别方案」「主导过 RFID 与多目视觉同步采集装置的整机搭建」两处关键成果加粗，扫读时 3 秒可抓取身份与能力主线。
6. **首屏信息密度提升**：删除个人简介板块后，首屏承担定位表达并新增一行硬核亮点短句（2 篇 EI 会议论文 / 3 个落地项目，数量由数据派生），其下直接进入教育经历。
7. **无失效链接**：个人简介板块的锚点被移除后，首屏「关于我」按钮改跳关于页，首页不再存在指向不存在锚点的链接。

---

## 4. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（66 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（18 quick prompts, 3 public projects）——AI 助理回答仍不含手机号 |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ 30/30 静态页面生成成功 |

页面实测（本地生产服务器逐路由抓取，端口 3313，测毕已关闭）：

| 路由 | 邮箱 | 微信 | 电话 | 可见文本汉字 | 可见文本中文标点 |
| --- | --- | --- | --- | --- | --- |
| `/zh`、`/zh/about`、`/zh/contact`、`/zh/resume` | ✅ | ✅ | ✅ 2×`tel:` | — | — |
| `/en`、`/en/about`、`/en/contact`、`/en/resume` | ✅ | ✅ | ✅ 2×`tel:` | **0** | **0** |
| `/en/research`、`/en/projects`、`/en/honors` | ✅ | ✅ | ✅ | **0** | **0** |

DOM 源码中仅剩根布局双语 `<noscript>` 兜底提示（10 汉字 + 1 句号），与本次改动无关。

---

## 5. 本地预览验证路径与检查要点

```bash
npm run dev          # http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| `/zh`、`/en` | 首屏：姓名头衔 → 求职方向 → 按钮组 → **核心亮点短句**（次级色、按钮正下方）；「关于我」按钮跳转到关于页；**页面已无个人简介板块**；下方依次为教育经历 → 荣誉与资质 → 技能栈 → 代表项目 → 联系我（三项齐全） |
| `/zh/about`、`/en/about` | 个人简介三段式，开篇定位句加粗，第二段两处成果加粗，末段以入党时间收尾；**无独立政治面貌板块**；研究方向 3 卡片；底部联系模块三张卡片**桌面三等宽** |
| `/zh/contact`、`/en/contact` | 邮箱 / 微信 / 电话三张卡片三等宽；点击电话可直接拨号（移动端） |
| `/zh/resume`、`/en/resume` | 头部联系方式行含电话（电话图标、`tel:`）；**不出现政治面貌**（预期） |
| 任意页面页脚 | 联系方式区依次为 邮箱、微信、电话；电话为可点击链接，英文页显示 `Phone: …` |
| 窄屏（约 390px） | 联系卡片单列、页脚电话不溢出（`break-all`）、亮点短句自然换行、无横向滚动 |
| 深浅主题 | 新增文案均使用 `var(--muted)` / `var(--foreground)` / `var(--accent)`，两套主题下对比度正常 |

---

## 6. 偏差与残留事项（需你留意）

1. **英文简介中「person re-identification」改为「individual re-identification」（唯一一处对给定文案的改动）**
   你给的英文第二段为 `Research interests cover computer vision, person re-identification (ReID), …`，我落地为 `… individual re-identification (ReID) …`。
   原因：本研究的对象是**鱼类**而非行人，且全站既有英文表述统一为 `individual re-identification (ReID)`（技能、项目、论文、研究方向等 10 余处）。沿用 `person re-identification` 会与站内术语冲突并可能让技术面试官产生误解。
   如需保留原词，告诉我即可改回（`src/data/profile/about.ts` 第三段第 2 个 section 的 `segments[0].text.en`）。

2. **首页联系模块也开启了电话（任务 1.1 未列入）**
   任务 1.1 的统领句为「所有包含「联系方式」的模块，全部标准化为邮箱 + 微信 + 电话三项」，且页脚本身已出现在每一页——电话实际已成为全站可见信息，单页隐藏已无隐私意义。因此首页「联系我」板块一并开启，以满足「无遗漏、无差异」。如需首页单独隐藏，删掉 `app/[lang]/page.tsx` 中 `showPhone` 一处即可。

3. **政治面貌的曝光面缩小**
   首页个人简介板块删除后，政治面貌**只出现在 `/[lang]/about` 的简介末尾**（此前首页也会展示）。若希望保持它在首页的可见度，可考虑放回首屏亮点区或荣誉板块，请告知。

4. **`About` 组件的 `summaryOnly` 预览模式当前无调用方**
   首页不再使用该模式，分支代码保留（组件注释已说明），`about.summary` 字段仍在校验范围内。如需彻底清理可另行安排。

5. **英文文案的既有语法瑕疵（未改动，供你决定）**
   你给定的英文第二段末句 `Verifying conclusions with reproducible experimental data and deliverable engineering practices.` 为无主语的分词短语（站内其他英文简介均为完整句）。我按原文保留，如需调整为 `I verify conclusions with …` 请告知。

6. **`public/resume.pdf` 仍是上一轮你更新过的版本**，其 GPA 未含排名、政治面貌未含入党时间，与本轮网页内容存在差异（本轮未改动该二进制资产）。

7. **`npm run verify:deploy` 仍因既有环境问题失败**（本机 npm 11.17.0 vs `package.json` 声明的 `npm@10.9.2`），与本次改动无关；`npm run verify` 不包含该步骤。

8. **工作区含多轮未提交改动**：本次未创建 commit。根目录现有 3 份未跟踪文件（`FINAL-FIX-REPORT.md`、`CONTENT-REFACTOR-REPORT.md`、`src/components/ResearchAreas.tsx`），前两份为历史报告，可按需删除。
