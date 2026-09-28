# 荣誉资质附件体系 + 简历链路固化 + 基础数据修正 批次报告

项目：`E:\PRD\my-ai-portfolio`
范围：7 项任务（附件类型与数据扩展、UI 附件展示、简历下载固化、论文/教育保持原样、荣誉时间修正、全链路校验更新、文档同步）。
结果：`npm run verify` 全链路通过（content / profile / chat / resume / lint / typecheck / build），30/30 页面静态生成；附件机制已用临时夹具做端到端实测后完全还原。

---

## 0. 完成总览

| 任务 | 状态 | 关键证据 |
|---|---|---|
| 1 类型定义与三类数据扩展 | ✅ | `Attachment` 接口 + 15 个条目 `attachments: []`（11 奖项 / 3 证书 / 1 专利）+ 3 个分类目录就位 |
| 2 UI 附件展示（复用灯箱） | ✅ | 新增 `AttachmentList`；荣誉页图片走 `ImageGallery` 灯箱、文件走原生下载；首页预览为数量入口；项目页专利卡片同步 |
| 3 简历下载链路固化 | ✅（上轮已完成，本轮复核） | 中英文页均指向唯一官方 PDF；旧两份 404；隐私审计通过 |
| 4 论文与教育模块保持原样 | ✅ | 论文条目无 `attachments` 字段、DOI 链接 2 条保留；`education.ts` 未改动 |
| 5 四川省优秀大学毕业生时间 | ✅ | 中英文均显示 `2023.06`，全站时间格式统一为 `YYYY.MM` |
| 6 校验脚本更新 | ✅ | 4 类附件校验规则 + 附件文件命名扫描 + 敏感证书判定改为按文件名 |
| 7 残留清理与文档同步 | ✅ | README 新增附件章节；部署文档补齐附件发布要求；无自动生成 PDF 的旧说明残留 |

---

## 一、修改文件清单与每处改动说明

### 任务 1：类型与数据扩展

| 文件 | 改动 |
|---|---|
| `src/data/profile/types.ts` | 新增 `AttachmentType = "image" \| "file"` 与 `Attachment` 接口（`name` / `nameEn` / `type` / `path` / `format` / `formatEn`，按需求以扁平双语字段表达，已在接口注释中标注与 `BilingualText` 的差异）；`Award`、`Credential`、`Patent` 三个接口各新增可选 `attachments?: Attachment[]` |
| `src/data/profile/awards.ts` | 11 个奖项条目各新增 `attachments: []` |
| `src/data/profile/credentials.ts` | 3 个非论文条目（NCRE / CET-4 / 专利）各新增 `attachments: []`；两个 `kind: "paper"` 条目**不加该字段**（任务 4） |
| `src/data/profile/patents.ts` | 专利条目新增 `attachments: []` |
| `public/attachments/{awards,credentials,patents}/` | 新建三级目录，各放一个 `.gitkeep` 占位（空目录不被 git 跟踪） |

> `competitions.ts` 复用 `Award` 类型，因此结构上同样支持附件，但未在本轮指定的文件清单内，保持原样（未声明即为 `undefined`，展示层不渲染）。

### 任务 2：UI 附件展示

| 文件 | 改动 |
|---|---|
| `src/components/AttachmentList.tsx`（新增） | 附件区组件：`variant="full"` 渲染「证明材料」标题 + 图片附件（复用 `ImageGallery`：缩略图网格 + 灯箱全屏预览、`←/→` 切换、`Esc` 关闭、焦点管理）+ 文件附件（原生 `<a download>`，沿用全站次级按钮边框/主题色 hover，并显示 `format` 标签）；`variant="compact"` 只输出「N 个证明材料」；**附件为空时返回 `null`，不渲染任何元素** |
| `src/components/Honors.tsx` | `HonorsItem`/`toItems` 透传 `attachments`；荣誉独立页三类卡片内渲染完整附件区；首页预览渲染 compact 入口 |
| `src/components/PatentCard.tsx` | 卡片底部渲染同款附件区 → 项目页「学术成果与专利」区块与在线简历页的专利卡片自动同步 |
| `src/components/ImageGallery.tsx` | 新增**可选** `sizes` prop（默认值与原来完全一致，向后兼容），供卡片内嵌图集按真实容器宽度取图 |

新增的 `sizes` 是实测发现的画质问题：附件缩略图嵌在荣誉卡片里，若沿用默认的 `33vw` 估算会取到过小的图。传入卡片量级后，71px 的缩略图会取 `w=256`（2× 清晰度）。

### 任务 3：简历下载链路固化（复核）

上轮已完成，本轮逐项复核通过：`ResumeDownloadButton` 中英文页统一 `href="/杨冲个人简历.pdf"`（以百分号编码形式输出，保证英文页零汉字），另存名 `杨冲-个人简历.pdf` / `Yang Chong Resume.pdf`；`public/resume.pdf`、`public/resume-en.pdf` 已删除且返回 404；`verify:resume` 已改为单份定制 PDF 的存在性 + 文字审计 + 隐私边界；`lib-approved-contacts.mjs` 白名单指向新文件；全站无第二下载入口、无浏览器打印入口、无自动生成 PDF 的脚本引用。

### 任务 4：论文与教育保持原样

- 论文：`credentials.ts` 的两个 `kind: "paper"` 条目未新增字段；`publications.ts` 未改动；项目页实测仍有 2 条 DOI 链接、0 个本地附件下载入口。
- 教育：`education.ts` 与教育板块组件本轮**零改动**（无附件字段、无下载入口）。

### 任务 5：荣誉时间修正

`awards.ts` 的四川省优秀大学毕业生 `year` 由 `"2023"` 改回 `"2023.06"`；`verify-profile-data.mjs` 的荣誉时间守卫**同步收紧回** `^\d{4}\.\d{2}$`，与「全站时间格式统一为 YYYY.MM」一致（此前为兼容年度写法临时放宽，现已不再需要）。

### 任务 6：校验脚本更新

| 文件 | 改动 |
|---|---|
| `scripts/verify-profile-data.mjs` | 新增 `validateAttachments()` 并在奖项/竞赛、证书、专利三处调用：**结构**（必填字段齐全、`type` 枚举合法）、**路径**（必须位于 `/attachments/{awards\|credentials\|patents}/`）、**命名**（文件名仅 ASCII 字母数字点下划线连字符，禁止中文与空格）、**扩展名与类型匹配**（image→jpg/jpeg/png/webp，file→pdf）、**存在性**（`public/` 下文件必须真实存在）；新增 `paper-credential-has-attachments`（论文条目禁止挂附件）；奖项/证书/专利数量守卫保持 11 / 5 / 1（资产数量本轮未变） |
| `scripts/verify-public-content.mjs` | 敏感证书素材判定由「完整路径」改为「**文件名**」——这样 `public/attachments/patents/` 这类分类目录可以使用，而文件名里仍出现 `patent`/`certificate`/`证书`/`专利` 的原始证书素材继续被拦截；新增 `public/attachments/**` 实体文件的**命名合规扫描**（ASCII、无中文、无空格），图片类不做文字校验 |
| `scripts/verify-public-resume.mjs` | 无改动（上轮已完成单份定制 PDF 的存在性 + 文字审计 + 隐私边界） |

### 任务 7：文档同步

- `README.md`：荣誉资质路由描述补充附件能力；新增「荣誉资质附件」小节（字段结构、目录约定、渲染位置、命名规范、敏感文件提醒、论文/教育不挂附件）。
- `docs/deployment-readiness.md`：功能清单补充附件能力；发布前人工检查项新增附件脱敏与命名要求。

---

## 二、内容资产更新统计

| 项目 | 之前 | 现在 |
|---|---|---|
| `Attachment` 类型 | — | 新增（`src/data/profile/types.ts`） |
| 可挂附件的条目类型 | 0 | 3（`Award` / `Credential` / `Patent`） |
| 已初始化 `attachments: []` 的条目 | 0 | 15（11 奖项 + 3 证书 + 1 专利） |
| 附件分类目录 | 0 | 3（awards / credentials / patents，含 `.gitkeep`） |
| 附件实体文件 | 0 | 0（等你放入材料后登记） |
| 新增组件 | — | `AttachmentList.tsx` |
| 四川省优秀大学毕业生时间 | `2023` | `2023.06` |
| 页面 / sitemap / 静态 HTML | 30 / 20 / 25 | 不变（本轮无新增路由） |

---

## 三、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (70 public text files, 28 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无报错、无警告 / 类型零错误 |
| `npm run build` | ✅ 编译成功，30/30 页面生成，公开页面全部 ● SSG |
| `npm run verify`（全链路） | ✅ 全绿 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮改动无关 |

**附件机制的端到端实测**（临时夹具，验证后已完全还原）：

| 检查项 | 实测结果 |
|---|---|
| 校验能拦住违规附件 | 故意登记「中文文件名 + 文件不存在」的附件 → 精确报出 `invalid-attachment-filename`（中文名）与 `missing-attachment-file`（路径不存在）；同批合法附件零报错 |
| 荣誉页附件区 | 渲染「证明材料」标题、1 个图片缩略图灯箱按钮（`aria-label="放大查看：国家奖学金证书"`）、1 个文件下载链接 `href="/attachments/..." download="..."`、格式标签 `PDF 格式` |
| 图片附件灯箱 | 点击后 `role="dialog"` 打开、`aria-label="证明材料预览"`、图片经 `next/image` 优化加载（证明复用 `ImageGallery`）、焦点移入、`Esc` 关闭、焦点归还触发按钮 |
| 缩略图取图尺寸 | 展示 71×53 px → 实际取 `w=256`（2× 清晰度），`sizes` 生效 |
| 首页预览 | 中文 `1 个证明材料`、英文 `1 supporting file`，且首页无灯箱按钮（精简入口不影响首屏） |
| 项目页专利卡片 | 显示「专利证书（脱敏）」+ 文件下载链接 |
| 英文页 | 附件名/格式按语言切换，7 个 `/en` 路由汉字数 0 |
| 还原后 | 所有平台不再出现附件区（附件为空不渲染：实测 5 个页面 `证明材料`/`Supporting files`/`/attachments/` 命中均为 0） |

其他验收实测：四川省优秀大学毕业生中英文均显示 `· 2023.06`；荣誉页 14 组时间格式全部为 `YYYY.MM`（无年度写法）；项目页 DOI 链接 2 条、本地附件下载 0；`public/attachments/` 三个目录仅剩 `.gitkeep`。

---

## 四、本地预览验证路径与检查要点

```
npm run dev
```

| 路径 | 检查要点 |
|---|---|
| `/[lang]/honors` | 当前所有条目附件为空 → 卡片无任何附件元素；四川省优秀大学毕业生显示 `· 2023.06`；证书区 `CET-4 · 2022.06`、专利 `· 2022.03` |
| `/[lang]`（首页） | 荣誉预览 3 张卡无附件入口（当前为空）；有附件时显示 `N 个证明材料` / `N supporting files` |
| `/[lang]/projects` | 「学术成果与专利」区专利卡片无附件入口（当前为空）；论文 DOI 链接可跳转，无本地下载 |
| `/[lang]/resume` | 顶部下载按钮 → `杨冲个人简历.pdf`，另存名按语言；专利卡片无附件入口 |
| `/[lang]/about` | 教育模块与修改前完全一致，无新增元素 |
| 放入材料后自测 | 把文件放进 `public/attachments/{awards,credentials,patents}/`（ASCII 文件名、不含 `patent`/`certificate`/`证书`/`专利`），在 `awards.ts`/`credentials.ts`/`patents.ts` 对应条目填写 `attachments`，跑 `npm run verify:profile` 通过即说明路径与命名合规，然后在荣誉页/首页/项目页检查灯箱与下载 |

---

## 五、偏差、风险与待确认

1. **附件当前全部为空，功能处于「已就绪未启用」状态**：任务 1.2 要求初始化为 `[]`，因此站上不会出现任何附件入口。为验证任务 2 的验收标准（灯箱、下载、双语、首页精简入口、项目页同步），我用**临时夹具**做了端到端实测（复制两个已公开的真实资源到 `public/attachments/` 并临时登记），验证后已把数据与文件**全部还原**——最终状态为零附件、目录仅含 `.gitkeep`。
2. **附件文件名不能含 `patent` / `certificate` / `证书` / `专利`**：`verify:content` 原有的「敏感证书素材」检查保留，只是从「完整路径」改为「文件名」判定，这样分类目录 `attachments/patents/` 可用，但把证书素材直接命名成 `patent-certificate.jpg` 仍会被拦截。这是仓库既有隐私红线的延续（禁止公开未脱敏证书/二维码素材）；如果你希望这类命名也放行，需要调整该规则，我没有擅自放宽。
3. **附件数据结构采用你指定的扁平双语字段**（`name` / `nameEn`、`format` / `formatEn`），与数据层其它地方的 `BilingualText { zh, en }` 不同。已按需求实现并在类型注释中标明；若希望统一为 `BilingualText`，改动量是「类型 + 1 个组件 + 校验脚本」三处。
4. **荣誉卡片内的附件缩略图偏小（约 71 px）**：这是复用全站图集三列网格的结果，点击后可在灯箱内全屏查看与缩放。若希望证书缩略图更大，可给 `ImageGallery` 再加一个可选 `columns` prop（卡片内用 1~2 列），需要时我可以补。
5. **竞赛条目（`competitions.ts`）结构上支持附件但未初始化 `[]`**：它复用了 `Award` 类型，不在本轮指定文件清单内，因此保持原样（未声明即不渲染）。如需与奖项条目完全一致，一条命令即可补齐。
6. **`npm run verify:deploy` 仍剩 2 项环境性失败**：`local-environment-file-present: .env.local`（你本机的密钥文件，已被 gitignore）与 `npm-version-mismatch`（本机 npm 11.17.0 vs 声明 10.9.2）。清理与对齐后即可全绿。
7. **`AGENTS.md` 本轮未改**：其中的简历 PDF 路径、手机号授权白名单已在上轮同步到 `public/杨冲个人简历.pdf`，本轮无新增隐私面。
