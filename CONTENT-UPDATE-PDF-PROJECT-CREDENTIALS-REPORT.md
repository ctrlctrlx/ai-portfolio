# 内容更新批次报告（简历 PDF + 新增项目 + 证书/专利/荣誉修正 + 全链路同步）

项目：`E:\PRD\my-ai-portfolio`
范围：5 项内容更新 + 全链路配套同步（校验脚本、sitemap、README/AGENTS/docs、旧逻辑清理）。
结果：`npm run verify` 全链路通过（content / profile / chat / resume / lint / typecheck / build 全绿），30/30 页面静态生成，所有内容改动仅在数据层完成。

---

## 0. 完成总览

| 任务 | 状态 | 关键证据 |
|---|---|---|
| 1 简历下载替换为指定中文 PDF，移除自动生成英文 PDF | ✅ | 中英文页均指向 `/%E6%9D%A8...pdf`（= `public/杨冲个人简历.pdf`），文件 200 / 346,541 B；`/resume.pdf`、`/resume-en.pdf` 均 404 |
| 2 新增「基于 Next.js 的个人技术作品集网站」项目 | ✅ | 列表第 1 位、首页 4 张卡（2×2 均衡）、详情页 3 图 + 灯箱、sitemap +2 条、30/30 页面 |
| 3 四级证书补充时间 2022.06 | ✅ | 荣誉页证书条目显示 `· 2022.06` |
| 4 专利授权时间改为 2022.03 | ✅ | 专利卡片 `授权于 2022.03`；证书与专利列表 `· 2022.03` |
| 5 四川省优秀毕业生表述优化 | ✅ | 「四川省优秀大学毕业生」+ 时间单独标注 `2023`，`2023届` 已无残留 |
| 6 校验与配套同步 | ✅ | 新增项目数量守卫、PDF 审计范围切换、sitemap 自动收录、旧逻辑清理完成 |

---

## 一、修改文件清单与每处改动说明

### 任务 1：简历 PDF 切换

| 文件 | 改动 |
|---|---|
| `src/components/ResumeDownloadButton.tsx` | href 统一为 `/杨冲个人简历.pdf`（百分号编码形式，见下）；另存名按语言取值：中文 `杨冲-个人简历.pdf`、英文 `Yang Chong Resume.pdf`；删除按 locale 选 PDF 的旧逻辑与注释 |
| `public/resume.pdf`、`public/resume-en.pdf` | **删除**（两份自动生成 PDF，git 中记录为 deletion） |
| `scripts/lib-approved-contacts.mjs` | 手机号白名单从 `public/resume.pdf` 改为 `public/杨冲个人简历.pdf`，并更新授权说明注释 |
| `scripts/verify-public-content.mjs` | PDF 审计范围改为唯一官方文件；静态资源存在性检查支持**百分号编码路径**（先 `decodeURIComponent` 再查文件） |
| `scripts/verify-public-resume.mjs` | 下载入口契约改为「必须包含编码后的官方 PDF 路径 + `download` 属性」，并断言解码结果等于官方文件名；PDF 审计由两份合并为一份 |
| `scripts/verify-deploy-readiness.mjs` | 简历 PDF 路径改为新文件；静态资源存在性检查同样支持百分号编码路径 |
| `src/data/profile/identity.ts`、`app/[lang]/resume/page.tsx` | 注释中的文件名同步；`identity.ts` 注释刻意不写字面姓名，以维持「公开姓名在数据层只出现一次」的校验（见 §5.6） |
| `AGENTS.md`、`docs/deployment-readiness.md`、`README.md` | 简历文件路径、审计说明、下载入口说明全部同步；README 的 PDF 章节重写 |

**为什么 href 用百分号编码**：文件在磁盘上保留你要求的中文名 `杨冲个人简历.pdf`，但 `href="/杨冲个人简历.pdf"` 会让**英文页 HTML 出现 6 个汉字**（`杨冲个人简历`），与「英文页无中文残留」冲突。改为 `/%E6%9D%A8%E5%86%B2%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86.pdf` 后两者兼得：实测编码路径同样返回 `200`（346,541 B），英文页汉字数回到 **0**。

### 任务 2：新增项目（数据层单点维护，全站自动同步）

| 文件 | 改动 |
|---|---|
| `src/data/profile/projects.ts` | 新增 `personal-portfolio-website` 条目：`situation/task/action/result` 四段 STAR（由你提供的项目描述与核心成果改写）、4 条 `highlights`（核心成果原文）、3 条 `metrics`（首屏 +60% / 上线周期 2 分钟 / 全域 SSG + CDN）、8 个 `techTags`、6 条 `coreSkill`、3 张 `images`、`documents: []`、`featured: true`、`2026.08 – 2026.09`、角色「独立开发者 / 全栈开发」 |
| `public/images/projects/personal-portfolio-website/` | 新增 3 张**真实截图**（用无头 Chrome 抓取本站 1440×980 页面后转 JPG q86）：`-home.jpg` 164 KB、`-projects.jpg` 241 KB、`-resume.jpg` 135 KB，命名与 `open-world-reid` 目录规范一致；中英文共用同一份图片资源 |
| `app/[lang]/page.tsx` | `HOME_PROJECT_SLUGS` 由 2 个扩为 4 个（新项目置首），注释同步；网格 `md:grid-cols-2` 未改 → 4 张卡自动成为 2×2 均衡布局 |
| `scripts/verify-profile-data.mjs` | 新增 `incorrect-public-project-count`（=4）守卫 |

自动同步到的位置（均无需改 UI）：
- 项目列表页：4 张项目卡，新项目排第 1（`featured` + `startDate` 倒序）；
- 项目详情页：`/[lang]/projects/personal-portfolio-website` 中英双语自动生成（STAR 四段 / 核心量化数据 / 3 图灯箱画廊 / 技术标签 / 无文档区块）；
- 首页「代表项目」：4 张卡 2×2；
- 首页首屏统计行：`N 个落地项目` 自动由 3 → **4**；
- sitemap：由 18 → **20 条 URL**（新增中英各 1 条详情页）；
- 求职信息助理：项目问答自动输出 4 个项目，新项目在首位。

### 任务 3：大学英语四级时间

`src/data/profile/credentials.ts` 的 `cet-4` 条目补充 `year: "2022.06"`（该字段是该集合既有的时间字段，`Honors` 组件会自动渲染为 `颁发方 · 2022.06`）。

### 任务 4：专利授权时间

| 文件 | 改动 |
|---|---|
| `src/data/profile/patents.ts` | `grantDate` 由 `2022-07-12` 改为 `2022-03-01`（展示为 `2022.03`） |
| `src/data/profile/credentials.ts` | 证书与专利分类中的专利条目 `year` 由 `2022` 改为 `2022.03`，时间精度与专利卡片一致 |
| `src/components/PatentCard.tsx` | 授权时间格式由 `授权于 2022年3月` / `Granted in March 2022` 改为全站统一的 `YYYY.MM`：`授权于 2022.03` / `Granted 2022.03` |
| `scripts/verify-profile-data.mjs` | `incorrect-patent-grant-date` 断言同步为新值；证书专利条目与 `patents.ts` 的一致性校验改为**按年份前缀比较**（允许 `YYYY` 或 `YYYY.MM`） |

### 任务 5：四川省优秀毕业生表述

| 文件 | 改动 |
|---|---|
| `src/data/profile/awards.ts` | 中文 `四川省优秀大学毕业生`、英文 `Sichuan Province Outstanding Graduate`；`year` 由 `2023.06` 改为 `2023`（年度评选只标注年份，与奖项名称分离） |
| `src/data/profile/education.ts` | 本科荣誉行同步为 `四川省优秀大学毕业生（2023）` / `Sichuan Province Outstanding Graduate (2023)` |
| `src/data/profile/about.ts` | 「综合素质」段同步为「获评四川省优秀大学毕业生」 |
| `scripts/verify-profile-data.mjs` | 荣誉时间格式守卫由 `^\d{4}\.\d{2}$` 放宽为 `^\d{4}(\.\d{2})?$`（允许年度类荣誉只写 `YYYY`，字典序仍等于时间倒序），与证书集合的规则对齐 |

### 任务 6：校验与配套同步

- 新增 `incorrect-public-project-count`；PDF 审计范围与下载入口契约切换到唯一官方文件；静态资源检查支持编码路径；
- sitemap 无需改动：新项目详情页由 `publicProjects` 自动收录（实测 20 条 URL，含新页面，无死链）；
- 数据一致性：所有内容改动只在 `src/data/profile/` 完成，UI 层零硬编码（新增项目、证书时间、专利时间、荣誉名称都由组件读取数据层）；
- 旧逻辑清理：全仓检索已无 `resume-en` / `/resume.pdf` 残留（仅剩英文另存名 `Yang Chong Resume.pdf` 与 README 中的说明文字，属预期）；README 的「自动生成 PDF / 重新生成命令」章节与 `docs/deployment-readiness.md` 中「Career Agent 当前不调用外部 AI」等过期描述一并清理。

---

## 二、内容资产更新统计

| 集合 | 之前 | 现在 | 说明 |
|---|---|---|---|
| 项目经历 | 3 | **4** | 新增本站作品集项目（2026.08 – 2026.09，排第 1 位） |
| 公开项目截图 | — | 3 | `personal-portfolio-website` 目录新增 |
| 荣誉奖项 | 11 | 11 | 「2023届四川省优秀大学毕业生」→「四川省优秀大学毕业生」，时间改 `2023` |
| 证书与专利 | 5 | 5 | 四级补 `2022.06`；专利时间改 `2022.03` |
| 专利 | 1 | 1 | 授权时间 `2022-03-01` |
| 简历 PDF | 2 份（自动生成） | **1 份**（本人提供） | `public/杨冲个人简历.pdf` |
| sitemap URL | 18 | **20** | +2 新项目详情页 |
| 静态预渲染页面 | 28 | **30** | +2（中英各一） |

---

## 三、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (69 public text files, 28 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无报错、无警告 / 类型零错误 |
| `npm run build` | ✅ 编译成功，**30/30** 页面生成，全部页面仍为 ● SSG（API 路由保持 ƒ） |
| `npm run verify`（全链路） | ✅ content → profile → chat → resume → lint → typecheck → build 全绿 |
| `npm run verify:all` | ⚠️ 仅剩 2 项环境性失败：`local-environment-file-present: .env.local`、`npm-version-mismatch`（与本轮改动无关） |

成品实测（`next start`，逐项对照验收清单）：

| 验收项 | 实测结果 |
|---|---|
| 简历下载 | `/zh/resume`、`/en/resume` 的按钮 `href=/%E6%9D%A8...pdf`，`download` 分别为 `杨冲-个人简历.pdf` / `Yang Chong Resume.pdf`；文件 200（346,541 B）；`/resume.pdf`、`/resume-en.pdf` 均 404；PDF 文字审计无未授权手机号/邮箱，且含姓名与已授权联系方式 |
| 项目列表 | 4 张卡，顺序：作品集网站 → 标记标准化 → RFID 装置 → 鱼类 ReID；每卡 1 个「查看详情」 |
| 项目详情 | 标题、图注 `图1/图2/图3`、3 条 alt、3 个灯箱按钮、3 张懒加载图、3 条量化指标齐备；英文页 `Fig.1/2/3` 对应 |
| 图片加载 | 3 张截图全部 200 |
| 首页预览 | 4 张卡 2×2，作品集项目置首并带「独立开发者 / 全栈开发」角色徽章 |
| 证书时间 | 荣誉页含 `大学英语四级（CET-4）` 与 `2022.06` |
| 专利时间 | 荣誉页含 `2022.03`；项目页专利卡片显示 `授权于 2022.03` |
| 荣誉表述 | 含 `四川省优秀大学毕业生`，`2023届` 命中数为 0；助理回答为 `2023 四川省优秀大学毕业生` |
| 双语校验 | 7 个 `/en` 路由正文汉字 **0**、中文标点 **0** |
| 图片灯箱 | 新项目详情页：3 个触发器，打开第 3 张计数器 `3 / 3`、焦点入框、`Esc` 关闭、焦点归还（CDP 实测） |
| 响应式 | 4 个页面 × 320/390/768/1280 px 共 16 组实测横向溢出全部 ≤ 0 |
| 静态渲染 | 25 个静态 HTML、prerender-manifest 28 条路由；sitemap 含新页面 |

---

## 四、本地预览验证路径与检查要点

```
npm run dev
```

| 路径 | 检查要点 |
|---|---|
| `/zh/resume`、`/en/resume` | 顶部按钮点击即下载 `杨冲个人简历.pdf`；另存名分别为 `杨冲-个人简历.pdf` / `Yang Chong Resume.pdf` |
| `/zh/projects`、`/en/projects` | 4 张项目卡，第 1 张为「基于 Next.js 的个人技术作品集网站」 |
| `/zh/projects/personal-portfolio-website` | STAR 四段 + 3 条量化指标 + 3 张截图（点击可放大、`←/→` 切换、`Esc` 关闭） |
| `/zh`、`/en` | 「代表项目」4 张卡 2×2；首屏统计行显示 4 个落地项目 |
| `/zh/honors`、`/en/honors` | 证书板块 `CET-4 · 2022.06`；专利 `· 2022.03`；`四川省优秀大学毕业生` 标注 2023 |
| `/zh/projects`（学术成果区） | 专利卡片显示 `授权于 2022.03` |
| `/sitemap.xml` | 20 条 URL，含 `/zh|en/projects/personal-portfolio-website` |
| 右下角 AI 助理 | 问「介绍一下你的项目经历」应输出 4 个项目，作品集项目在首位 |

---

## 五、偏差、风险与待确认

1. **⚠️ 专利授权时间存在事实冲突，请对照证书确认**：原数据记录授权时间为 `2022-07-12`（且 `verify:profile` 曾把它当作已核验事实硬断言），本轮按指令改为 `2022.03`。但 `applicationDate` 是 `2022-03-04`——**2022.03 与申请月份重合**，而实用新型专利从申请到授权通常需要数月（公开号 `CN 216957023 U` 的公告时间通常也不在申请当月）。我已按你的指令落库并同步断言，但若证书上的授权公告日实为 7 月，请告知，我一行即可回退（`patents.ts` + `credentials.ts` + 校验断言共 3 处）。
2. **「GitHub + Vercel 自动化部署流水线」的表述与仓库现状的张力**：仓库内没有 `.github/workflows`，`verify:deploy` 明确禁止仓库中出现 push/deploy 脚本，README 与 `docs/deployment-readiness.md` 也写明「本仓库不会自动连接或调用 Vercel」。如果你确实启用了 Vercel 的 Git 集成（commit → 自动构建发布），该表述成立；如果尚未配置，建议配置后再保留，避免面试被追问时口径不一致。
3. **「首屏加载性能提升 60%+」缺少站内测量依据**：该数字按你提供的内容落库，站内没有对应的前后对比记录。建议补一句测量口径（例如 Lighthouse 移动端 LCP/性能分前后对比），或提供实测数据以便一并写入。
4. **项目数量断言原本不存在**：`verify:profile` 此前只对奖项/竞赛/专利/证书/论文数量设守卫，项目数量只出现在输出统计里。本轮按任务要求**新增**了 `incorrect-public-project-count`（=4），属于新增保护而非修改既有值。
5. **新项目的 `researchDirections` 归类**：站内 4 个研究方向都是 CV 相关（计算机视觉 / ReID / 视觉语言模型 / 嵌入式感知），作品集网站属 Web 工程实践，我暂归为 `computer-vision`（该字段现已不再驱动任何 UI 筛选，仅受校验）。若希望更准确，可新增 `web-engineering` 方向——它会同步出现在首页与关于页的研究方向标签、以及助理回答中（属可见内容扩展，故未擅自添加）。
6. **四级证书英文显示为 `2022.06` 而非 `Jun. 2022`**：`Credential.year` 是双语共用字段，全站证书/奖项统一使用 `YYYY.MM`（例如同集合的 `2021.03`）。为保持同一列表内格式一致，英文页也显示 `2022.06`；如需英文显示 `Jun. 2022`，需要把该字段改为双语结构（会牵动 5 条证书与荣誉页渲染）。
7. **`identity.ts` 注释不再书写简历文件名**：数据层有一条「公开姓名只能出现 1 次」的守卫，注释里写 `public/杨冲个人简历.pdf` 会让「杨冲」出现 2 次而导致校验失败；因此该注释改为指向 `scripts/lib-approved-contacts.mjs` 的白名单。文件名本身仍登记在该白名单中，可审计性不变。
8. **你提供的简历 PDF 含 `政治面貌 / 籍贯 / 年龄` 三项**：站点的隐私条款要求「政治面貌不得进入在线简历路由」，上一轮自动生成的 PDF 不含这些字段；本轮的官方 PDF 由你提供，我未改动其内容（PDF 文字审计只覆盖手机号/邮箱，实测无未授权号码）。如不希望公开这三项，请提供替换版本，覆盖同名文件后跑一次 `npm run verify` 即可。
9. **`docs/deployment-readiness.md` 顺带修正一处过期表述**：「Career Agent 当前不调用外部 AI」与同文件上方的双层架构说明自相矛盾，已改为准确描述（未配置密钥时纯规则、配置后启用兜底）。
