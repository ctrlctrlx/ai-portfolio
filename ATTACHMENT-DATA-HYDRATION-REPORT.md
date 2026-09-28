# 附件数据批量配置 + 水合错误排查 批次报告

项目：`E:\PRD\my-ai-portfolio`
结果：13 个奖项 / 2 个证书 / 1 个专利的附件全部配置完成且一一对应；`npm run verify` 全链路通过；**荣誉页水合错误在当前代码下无法复现（dev + 生产、中英双语、附件全部渲染的场景下均为 0）**，并已定位到本仓库历史上唯一真实的水合失配来源（上一轮已从根本原因修复）。

---

## 0. 完成总览

| 任务 | 状态 | 关键证据 |
|---|---|---|
| 1 数据层批量配置附件（13 奖项 + 2 证书 + 1 专利） | ✅ | 16 个附件文件全部 200、路径与条目一一对应（DOM 顺序逐条核对通过） |
| 2 定位并修复荣誉页水合错误 | ✅（无可复现的失配，已排除全部候选原因） | 6 个页面 × 中英双语：水合错误 0；`tabIndex` 字符串写法经实测**类型不通过**，已保留数值形式并附说明 |
| 3 全链路校验与功能验证 | ✅ | `npm run verify` 全绿；30/30 页面；灯箱 / 下载 / 双语 / 响应式全部实测通过 |

---

## 一、任务 1：数据层附件配置完成情况

### 1.1 奖项条目（13 项）

| # | 条目 | 附件路径 |
|---|---|---|
| 1 | 国家奖学金 | `awards/award-06-national-scholarship-2022.jpg` |
| 2 | 国家励志奖学金 | `awards/award-04-national-endeavor-scholarship-2021.jpg` |
| 3 | 第十二届大唐杯三等奖 | `awards/award-09-datang-cup-third.jpg` |
| 4 | 四川省优秀大学毕业生 | `awards/award-07-sichuan-outstanding-graduate-2023.jpg` |
| 5 | 第十三届蓝桥杯三等奖 | `awards/award-10-lanqiao-cup-sichuan.jpg` |
| 6 | 校级一等奖学金（2026.09） | `awards/award-11-hainan-u-first-scholarship.jpg` |
| 7 | 优秀学生干部 | `awards/award-05-outstanding-cadre-2022.jpg` |
| 8 | 创新优秀学员 | `awards/award-08-innovation-excellent-2022.jpg` |
| 9 | 三好学生 | `awards/award-02-merit-student-2021.jpg` |
| 10 | 校级一等奖学金（2021.11） | `awards/award-03-first-scholarship-2021.jpg` |
| 11 | 五四红旗标兵 | `awards/award-13-youth-league-pacemaker.jpg` |
| 12 | 军事训练先进个人 | `awards/award-12-military-training-excellent.jpg` |
| 13 | 青马班结业证书 | `awards/award-01-youth-marxism-program.jpg`（名称用「结业证明 / Completion Proof」） |

统一字段：`name="获奖证明"`、`nameEn="Award Proof"`、`type="image"`、`format="JPG 格式"`、`formatEn="JPG Format"`（第 13 条按你的指定改为「结业证明 / Completion Proof」）。

### 1.2 证书条目（2 项）

| 条目 | 附件 | 名称 |
|---|---|---|
| 全国计算机等级考试二级（C 语言程序设计） | `credentials/cred-01-computer-level2-c.jpg` | 证书扫描件 / Certificate Scan |
| 大学英语四级（CET-4） | `credentials/cred-02-cet4-score.jpg` | 成绩证明 / Score Report |

### 1.3 专利条目（1 项）

`patents.ts`：`patents/doc-01-utility-attendance-system.pdf`，`type="file"`，名称 `专利证书 / Patent Certificate`，格式 `PDF 格式 / PDF Format`。

### 1.4 三处必要的偏差说明

1. **3 个文件的实际格式是 JPG，不是 PNG**：`award-11-hainan-u-first-scholarship`、`cred-01-computer-level2-c`、`cred-02-cet4-score` 在磁盘上都是 `.jpg`（磁盘上不存在同名 `.png`）。我按**真实扩展名与格式**登记为 `JPG 格式 / JPG Format`，否则存在性校验与「扩展名 ↔ 类型」校验都会失败。如你确实要 PNG 版本，请放入同名 `.png` 文件，我再改成 PNG。
2. **两个竞赛条目不在 `awards.ts`**：大唐杯与蓝桥杯维护在 `src/data/profile/competitions.ts`（与 `awards.ts` 分开维护、共用 `Award` 类型）。为了「13 项全部配置完成」，这两条的附件写在了 `competitions.ts`——这是唯一超出你列出的三个文件的改动。
3. **专利 PDF 同时登记到 `credentials.ts` 的专利条目上**：荣誉资质页的「证书与专利」分类渲染的是 `credentials` 里的专利引用条目（不是 `PatentCard`），只改 `patents.ts` 的话该页看不到下载入口。两条登记指向同一个 PDF 文件，保证荣誉页 / 项目页 / 简历页三处一致。

### 1.5 一致性核对（渲染结果实测）

- 荣誉页中英双语：**15 张图片附件**（13 奖项/竞赛 + 2 证书）+ **1 个文件附件**（专利 PDF），条目顺序与附件出现顺序**逐条对应**（DOM 顺序比对通过，论文条目无附件）；
- 首页荣誉预览：`1 个证明材料` / `1 supporting file`（大唐杯那条进入预览），首页不加载任何附件图；
- 项目页与在线简历页：专利卡片显示「专利证书 PDF 格式」下载入口；
- 16 个附件源文件 HTTP 全部 200；`next/image` 首次冷优化耗时 4–177 ms，浏览器实际拿到 5–19 KB 的缩略图。

---

## 二、任务 2：水合错误的定位结论

### 2.1 实测结论：当前代码下没有可复现的水合失配

| 场景 | 结果 |
|---|---|
| dev 模式 `/zh/honors`（附件未渲染时） | 水合错误 **0** |
| dev 模式 `/zh/honors` + `/en/honors`（附件全部渲染） | 水合错误 **0** |
| 生产构建 `/zh/honors`、`/en/honors`、`/zh`、`/zh/projects`、`/zh/resume`、`/en/projects` | 水合错误 **0**（6/6） |
| 荣誉页附件灯箱交互（中英双语） | 控制台错误 **0** |

我在生产构建下逐个页面、两种语言都做了 CDP 控制台采集（`Runtime.exceptionThrown` + `console.error` + `Log.entryAdded`），没有任何 `Hydration failed` / React #418 / #423 / #425。

### 2.2 本仓库历史上唯一真实的水合失配（上一轮已从根因修复）

真因不在荣誉页，而在共享布局的主题切换按钮：`Navbar.tsx` 用 `resolvedTheme` 决定渲染月亮还是太阳图标，而服务端解析不出主题（恒为 `undefined`），于是**每一页**都失配（React 报 #418，差异显示 `lucide-moon` vs `lucide-sun`）。上一轮已改为「两个图标常驻 DOM + `dark:` 变体纯 CSS 控制显隐」，服务端与客户端输出完全一致——本轮 6 个页面的复测正是对这次修复的回归验证。

如果你现在仍能在某台机器/某个浏览器上看到该错误，最可能的两类原因是：① 浏览器缓存了修复前的 JS chunk（建议无痕窗口强制刷新一次）；② 本地改动未重新构建。**请把控制台的完整报错（含 `+`/`-` 差异行与组件栈）发我**，我可以直接定位到具体节点。

### 2.3 关于你建议的三项修复：逐条核对

| 建议 | 结论 |
|---|---|
| `<main tabIndex="-1">` 字符串形式 | ❌ **不可行**：React 的 `HTMLAttributes.tabIndex` 类型是 `number`，写成字符串会直接 `TS2322` 编译失败（我实测验过）。数值写法 `{ -1 }` 与字符串写法序列化到 HTML 后都是 `tabindex="-1"`，不存在「数值 vs 字符串」的序列化差异。已保留数值形式，并在注释里写明原因 |
| `<html> → <body> → <main>` 嵌套合法性 | ✅ 合法：根布局输出 `<html><body>`，语言段布局输出 `<a 跳转链接><nav><main id="main-content">…</main><footer>` 与 AI 助理，全部是 `<body>` 下的兄弟节点，无非法嵌套、无缺失闭合 |
| `className="focus:outline-none"` 为纯静态字符串 | ✅ 确认：无模板拼接、不依赖 `window`/`document` |
| 为 `<main>` 加 `suppressHydrationWarning` 兜底 | ⏸ **暂未添加**：既然没有可复现的失配，添加它只会把未来真实的结构性不匹配静默掩盖（与项目「不隐藏影响正确性的告警」的约定冲突）。若你确认在无痕模式下仍能看到报错，我可以按你的要求加上这一行（1 行改动） |
| 组件层排查（`typeof window !== 'undefined'` / `Date.now()` / `Math.random()` / 图片 alt） | ✅ 全部检查：荣誉页、奖项卡片、`AttachmentList` 中**没有**条件渲染分支与动态表达式；`AttachmentList` 的图片附件 `alt` 与图注均取自附件名称（中英对应），无缺失 |

---

## 三、修改文件清单与每处改动说明

| 文件 | 改动 |
|---|---|
| `src/data/profile/awards.ts` | 11 个奖项条目各新增 1 个图片附件（字段、顺序、分类、时间、文案均未改动） |
| `src/data/profile/competitions.ts` | 大唐杯、蓝桥杯两条各新增 1 个图片附件（新增 `attachments` 字段，未改动其它字段） |
| `src/data/profile/credentials.ts` | NCRE、CET-4 两条各新增 1 个图片附件；专利引用条目新增专利 PDF 附件（与 `patents.ts` 同源） |
| `src/data/profile/patents.ts` | 新增 1 个 PDF 文件附件 |
| `app/[lang]/layout.tsx` | 仅为 `<main>` 的 `tabIndex` 补充说明注释（**属性值本身未变**，字符串写法类型不通过，已实测） |
| `src/components/AttachmentList.tsx` | 为文件下载链接补充显式 `aria-label`（名称 + 格式），避免「专利证书PDF 格式」被读屏连读 |
| （其余 UI 与校验文件） | 上一轮已完成，本轮未改动：`Honors.tsx` / `PatentCard.tsx` / `ImageGallery.tsx`（`sizes`）/ `verify-profile-data.mjs`（附件四项校验）/ `verify-public-content.mjs`（附件命名扫描） |

---

## 四、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (70 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 编译成功，30/30 页面，公开页面全部 ● SSG |
| `npm run verify`（全链路） | ✅ 全绿 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

附件相关的校验（本轮新增数据全部通过）：16 条附件路径存在性、文件名 ASCII 合规（无中文、无空格）、`type` 枚举合法、扩展名与类型匹配（`image`→jpg/png/webp、`file`→pdf）、论文条目无附件。

功能实测：荣誉页 15 个缩略图按钮（中英标签分别为 `放大查看：获奖证明` / `Enlarge: Award Proof`），点击打开灯箱（`证明材料预览` / `Supporting file preview`，图片为对应附件、`Esc` 关闭、焦点归还）；专利 PDF 下载链接 `download="doc-01-utility-attendance-system.pdf"`；320/390/768/1280 px 三页横向溢出全部为 0。

---

## 五、本地预览验证步骤与检查要点

```
npm run build && npx next start -p 3412
```

| 路径 | 检查要点 |
|---|---|
| `/zh/honors`、`/en/honors` | 13 个奖项/竞赛 + 2 个证书各显示 1 张证明缩略图；「证书与专利」里的专利显示 PDF 下载按钮；点击缩略图可放大、`Esc` 关闭；论文两条无附件 |
| `/zh`、`/en` | 荣誉预览里的条目显示「1 个证明材料」/「1 supporting file」，首页不加载附件大图 |
| `/zh/projects`、`/en/projects`、`/zh/resume` | 专利卡片显示「专利证书」下载入口，点击下载 `doc-01-utility-attendance-system.pdf` |
| 浏览器控制台 | 无 `Hydration failed`、无 #418、无资源 404 |
| 响应式 | 390 px 下附件缩略图自动换行、无横向滚动条 |

---

## 六、风险与待办

1. **⚠️ `public/attachments/**/resources/` 又出现了 44 个无关文件（16.7 MB）**：`attachments/awards/resources/background_clothing_conf/icon/` 与 `attachments/credentials/resources/...` 下是与本项目无关的 AI 素材（和之前 `images/projects/project-1/resources/` 里那批相同），**没有任何引用**，但会被一起发布。连同 16 张证书原图，`public/attachments/` 现在共 30.7 MB。建议执行：
   ```powershell
   Remove-Item -Recurse -Force 'public\attachments\awards\resources','public\attachments\credentials\resources'
   ```
   （我没有擅自删除你的文件；这些目录当前不会导致校验失败，但会显著增加部署体积。）
2. **证书原图偏大**：16 张合计 14.0 MB，最大单张 4.6 MB（蓝桥杯，2480×3508）。运行时影响很小（缩略图冷优化 4–177 ms、浏览器实际只下 5–19 KB），但仓库与部署体积偏大。如需优化，我可以用既有 PIL 流程把长边压到 1600 px、质量 82（预计单张 150–350 KB，肉眼无损），需要你确认后我再动文件。
3. **3 个附件的扩展名/格式与你的清单不一致**（实际是 JPG，见 §1.4）——如果你希望严格按 PNG 命名，请提供 PNG 文件。
4. **`verify:deploy` 仍剩 2 项环境性失败**：`local-environment-file-present: .env.local`、`npm-version-mismatch`，与本轮改动无关。
5. **水合错误**：若你仍能复现，请提供控制台完整报错文本与浏览器信息；同时建议先用无痕窗口 + 强刷排除旧的 JS chunk 缓存。
