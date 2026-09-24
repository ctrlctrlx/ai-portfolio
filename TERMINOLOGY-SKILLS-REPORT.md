# 术语精准化 · 技能栈完善 · 布局优化 · 教育补充 · 图片更新报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：术语精准替换、技能新增 C/C++ 与排序、首页技能三列布局、教育补充校级一等奖学金、实践留影图3 标题与 alt、灯箱缩放
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 30/30）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 术语：中文页「鱼类」残留 | ✅ 全站 `/zh` 各页**归零** |
| 术语：项目①②标题、背景、行动 | ✅ 已收敛为东星斑 / Crimson Snapper |
| 术语：研究方向卡片① | ✅ `东星斑个体识别与开放集视觉理解` / `Crimson Snapper Individual Recognition & Open-Set Visual Understanding` |
| 术语：论文关联描述 | ✅ 已同步项目新名（不再指向旧项目标题） |
| 术语：论文标题 | ✅ **保持原样**（真实论文标题，见 §6.1） |
| 术语：英文旧名混用 | ✅ 既有 **5 处**旧英文鱼种名（`Leopard Coral Grouper` ×3、`industrial grouper` ×2）已全部统一为 `Crimson Snapper`，`Leopard` / 用户可见 `grouper` 残留 **0** |
| 技能：C/C++ | ✅ 已新增，编程语言组顺序 `Python > C/C++ > VBA > 51/STM32 > 多线程编程` |
| 技能：总条目数 | ✅ 27 条（编程语言 5 + 框架与工具 15 + 研究方向 7） |
| 技能：首页三列等宽 | ✅ `mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3` |
| 技能：留白压缩 | ✅ 卡片 `p-5 → p-3.75`（**−25%**），分组行距 `mt-4/space-y-4 → mt-3/space-y-3`，标签间距 `gap-2 → gap-1.5` |
| 教育：校级一等奖学金 | ✅ 首页 / 关于页 / 简历页三处同步显示 |
| 图片：图3 标题与 alt | ✅ 中英 caption + alt 四项全部更新 |
| 图片：点击放大 | ✅ 既有灯箱保留；新增滚轮（桌面）与双指捏合（移动）缩放 1×～4× |
| 英文页中文泄漏 | ✅ 8 条 `/en` 路由可见文本汉字 0、中文标点 0 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ 30/30 静态页生成成功 |

---

## 1. 两项需确认事项的处理结果

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 任务 1.1「项目名称统一替换为『东星斑个体识别研究』」 | **A：按「指向本人课题」收敛**。只把指向本人研究对象的泛称「鱼类 / fish」改为「东星斑 / Crimson Snapper」，**保留各项目原有的技术定位词**（未把三个项目改成同名）；论文标题与摘要不动；同时把既有的 **5 处**旧英文鱼种名（`Leopard Coral Grouper` ×3、`industrial grouper` ×2）统一为 `Crimson Snapper` 消除新旧混用 |
| 2 | 任务 6「图片点击放大」+「其余页面暂不开启」 | **A：保留现有灯箱 + 新增缩放**。灯箱（点击开全屏、关闭按钮、点击空白关闭、Esc、左右切换）本已存在并同时服务两个页面，本次只新增滚轮/双指缩放，不移除任何既有交互 |

---

## 2. 术语替换规则（本次实际执行的判定标准）

为避免机械全局替换造成语义损坏，采用如下可复核的判定标准：

| 类别 | 处理 | 依据 |
| --- | --- | --- |
| 指代本人研究对象的泛称：鱼类个体、鱼类数据集、鱼类识别研究、鱼类个体识别装置 | **替换**为东星斑 / Crimson Snapper | 属「具体研究场景」 |
| 通用技术术语：个体重识别（ReID）、Open-Set Recognition、Fish Re-ID 等 | **保留** | 属「通用技术场景」，保证技术表述专业性 |
| 真实论文标题与摘要：`…Robust Open-Set Fish Re-Identification` | **保留** | 论文标题是既成事实，改动属篡改论文信息（AGENTS.md 禁止） |
| 通用生物学/结构名词：fish passage（过鱼通道）、100+ fish（百余尾）、fish size（鱼体规格）、adult fish（成鱼）、per-fish handling（单尾操作） | **保留** | 计数与规格的通称，非物种名 |

**残留语境全量核对**（自动扫描）：

- `/zh` 全部页面：`鱼类` 出现 **0 次**。
- `/en` 剩余 `fish` 仅两类：① 上述通用名词（过鱼通道 / 百余尾 / 鱼体规格 / 成鱼 / 单尾操作）；② 论文原名 `Fish Re-Identification` 与其领域标签 `Fish Re-ID`。**无物种式新旧混用**。

---

## 3. 修改文件清单与每处改动说明

### 3.1 任务一：术语精准替换

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/projects.ts` | ① 项目①标题：`基于视觉语言先验的开放世界鱼类个体重识别研究` → `…开放世界东星斑个体重识别研究`；英文 `Open-World Fish …` → `Open-World Crimson Snapper Individual Re-Identification via Vision-Language Priors`<br>② 项目① situation：`长期追踪鱼类个体` → `长期追踪东星斑个体`（英文 `individual crimson snapper`）<br>③ 项目① action：`鱼类个体数据集` → `东星斑个体数据集`（英文 `a crimson snapper individual dataset`）<br>④ 项目②标题：`RFID 与多目视觉双模态鱼类识别数据采集装置` → `…双模态东星斑识别数据采集装置`；英文 `… Crimson Snapper Data Acquisition Device`<br>⑤ 项目② situation：`双模态鱼类识别研究` → `双模态东星斑识别研究`<br>⑥ 项目③标题英文 `Leopard Coral Grouper` → `Crimson Snapper`<br>⑦ 项目③ situation 英文 `leopard coral grouper` → `crimson snapper` |
| `src/data/profile/research.ts` | 方向①标题：`鱼类个体识别与开放集视觉理解` → `东星斑个体识别与开放集视觉理解`；英文 `Fish Individual Recognition …` → `Crimson Snapper Individual Recognition & Open-Set Visual Understanding`；同步更新文件头注释中引用的项目名 |
| `src/data/profile/about.ts` | ① `strengths` 第二条：`自建 92 个身份、万余张图像的鱼类数据集` → `东星斑数据集`；英文 `a fish dataset of 92 identities` → `a crimson snapper dataset of 92 identities`<br>② 实践经历条目英文：`Industrial Leopard Coral Grouper Smart Aquaculture Management Project` → `Industrial Crimson Snapper Smart Aquaculture Management Project`<br>③ 实践留影图1 caption 英文：`…industrial grouper aquaculture facility` → `…industrial crimson snapper aquaculture facility`；同文件 alt 同步 |
| `src/data/profile/publications.ts` | `coreContribution` 第二条的项目交叉引用同步为新项目名：`并与「基于视觉语言先验的开放世界东星斑个体重识别研究」项目形成成果落地闭环`；英文 `open-world crimson snapper individual re-identification research project` |
| `src/data/profile/projectMedia.ts` | ① 项目②文档标题：`…鱼类个体识别数据采集装置` → `…东星斑个体识别数据采集装置`；英文 `Fish Individual Identification Data Acquisition Device …` → `Crimson Snapper Individual Identification Data Acquisition Device …`<br>② 项目③两份文档标题英文 `… for Leopard Coral Grouper` / `… in Leopard Coral Grouper` → `… for Crimson Snapper` / `… in Crimson Snapper`<br>③ 同步两条注释 |

### 3.2 任务二：技能栈新增 C/C++ 与排序

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/skills.ts` | ① 「编程语言」分组新增 `skill("c-cpp", "C/C++", "C/C++")`，置于 Python 之后<br>② 组内按核心度重排：语言组 `Python > C/C++ > VBA 批量数据处理 > 51 / STM32 单片机 > 多线程编程`；视觉工具组 `PyTorch > OpenCV > ONNX 模型转换 > FFmpeg`；硬件组把 `装置整机搭建` 提到 `机械结构设计` 之前；任务组 `个体重识别（ReID） > 开放集识别 > 特征压缩 > 图像分类`<br>③ 扁平 `items` 与分组顺序保持镜像（校验脚本要求两者 id 集合一致）<br>④ 文件头注释更新为 27 条并写明排序依据 |

### 3.3 任务三：首页技能栈三列布局

| 文件 | 改动 |
| --- | --- |
| `src/components/Skills.tsx` | ① 网格按 variant 分流：`compact`（首页）→ `mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3`；`full`（内页模式）→ 原 `mt-6 grid gap-4 lg:grid-cols-2`<br>② 卡片内边距 `p-5` → `p-3.75`（0.9375rem，**恰好 −25%**，已确认 Tailwind 生成 `padding:calc(var(--spacing)*3.75)`）<br>③ 分组容器 `mt-4 space-y-4` → `mt-3 space-y-3`；分组标题到标签云 `mt-2` → `mt-1.5`；标签间距 `gap-2` → `gap-1.5`<br>④ 卡片圆角（`rounded-2xl`）、边框、背景令牌未改动 |

### 3.4 任务四：教育经历补充奖学金

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/education.ts` | 海南大学 `highlights` 追加一条：`校级一等奖学金（2026.09）` / `First-Class Scholarship (University Level, Sep. 2026)`，与「信息与通信工程学院」「研究方向」同级同列表；四川工业科技学院条目未改动 |

### 3.5 任务五：实践留影图3 标题与 alt

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/about.ts` | `practiceImages` 第 3 项的 `caption` 与 `alt` 更新为 `图3 东星斑RFID推荐植入位点示意图` / `Fig. 3 Schematic Diagram of Recommended RFID Implantation Sites for Crimson Snapper` 与对应无编号的 alt 文本 |

> 定位依据：**实际查看图片内容确认**。`public/images/about/practice-03.jpg` 的图面标题即为「东星斑 RFID 推荐植入位点示意图」，原 caption「RFID芯片注射标准化操作流程执行现场」与图面不符，属真实错配，本次修正后 caption/alt 与实际图面一致。项目③详情页的第 3 张（`exp-3-disinfect.jpg`，碘伏伤口消毒实拍）经查看为另一张照片，其 caption 正确，未做改动。

### 3.6 任务六：灯箱缩放

| 文件 | 改动 |
| --- | --- |
| `src/components/ImageGallery.tsx` | ① 新增 `zoom` 状态与 `pinchRef`，范围 1×～4×（`MIN_ZOOM` / `MAX_ZOOM` + `clampZoom`）<br>② 桌面端 `onWheel` 按 `deltaY` 调整倍数（灯箱打开时 body 滚动已锁定，故无需且无法 `preventDefault`——React 的 `onWheel` 是 passive 监听，已在注释中说明）<br>③ 移动端 `onTouchStart/Move/End` 按双指间距比例缩放（`touchDistance` 用 `Math.hypot`）<br>④ 图片框加 `touchAction: "none"`，由组件自行处理捏合，避免浏览器接管手势<br>⑤ 灯箱图片加 `transform: scale(zoom)` + `transformOrigin: center`，过渡用 `transition-transform duration-150 motion-reduce:transition-none`<br>⑥ 缩放复位放在事件处理内（打开 / 上一张 / 下一张 / 关闭），**不在 effect 中同步 setState**（lint 规则 `react-hooks/set-state-in-effect` 会报错，已规避）<br>⑦ 缩放裁剪在既有 `overflow-hidden` 图片框内，不会撑大弹窗布局；遮罩透明度、圆角、关闭按钮样式完全沿用原灯箱 |

---

## 4. 核心优化点效果说明

1. **术语既精准又不损坏区分度**：项目①/②标题保留「视觉语言先验 / 开放世界 / 重识别」「RFID / 多目视觉 / 双模态 / 数据采集装置」等技术定位词，只把研究对象由泛称收敛为具体鱼种；三个项目仍是三个可区分、可被 AI 助理按标题命中的独立条目。
2. **新旧英文名彻底归一**：英文侧原有 **5 处**旧鱼种名全部改为 `Crimson Snapper`——项目③标题与背景（`Leopard Coral Grouper`）、项目②文档标题（2 处：`Leopard Coral Grouper` 与 `Fish Individual Identification`）、实践经历条目 `Industrial Leopard Coral Grouper Smart Aquaculture Management Project`、实践留影图1 caption/alt 的 `industrial grouper aquaculture facility`。源码中 `Leopard` 与用户可见 `grouper` 残留均为 **0**（仅 `id` / `slug` / `sourceId` 等稳定标识符仍含 `grouper`，按「不破坏既有数据结构」保持不变）。
3. **通用技术术语受保护**：`个体重识别（ReID）`、`Open-Set Recognition` 等仍为通用表述，符合「技术表述专业性」要求，未被鱼种污染。
4. **C/C++ 补齐嵌入式能力画像**：作为 STM32 / 51 单片机、串口与 USB 开发的语言基础，置于 Python 之后第 2 位，与硬件经历形成呼应。
5. **首页技能信息密度提升**：三列等宽 + 卡片内边距 −25% + 分组与标签行距收紧后，27 个标签在桌面端基本可在首屏内扫完；标签 `flex-wrap` 自动换行适配更窄的列宽，未出现溢出。
6. **教育竞争力信息补齐**：校级一等奖学金与学院、研究方向同级排列，三处渲染共用同一数据源，格式与既有荣誉条目完全一致。
7. **图片语义与图面一致**：原先「文不对图」的 caption 得到修正，alt 同步后可被读屏与搜索引擎正确理解。
8. **灯箱能力增强而不破坏既有交互**：滚轮/双指缩放补齐了大图查看能力；切换图片自动复位，避免上一张的缩放状态带到下一张；缩放被裁在图片框内，弹窗尺寸与布局零变化。

---

## 5. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（66 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（18 quick prompts, 3 public projects）——项目问答按新标题匹配正常 |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ 30/30 静态页面生成成功 |

页面实测（本地生产服务器逐路由抓取，端口 3315，测毕已关闭）：

| 检查项 | 实测值 |
| --- | --- |
| 首页技能网格类 | `mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3` |
| 首页技能标签总数 | 27（`C/C++` 在内，顺序与设计一致） |
| 卡片内边距 | `p-3.75` → `padding:calc(var(--spacing)*3.75)` = 0.9375rem（−25%） |
| 奖学金三处 | 首页 ✅ / 关于页 ✅ / 简历页 ✅（英文页 ✅） |
| 图3 caption + alt | 中英 4 项全部命中 ✅ |
| 客户端 bundle | 缩放逻辑已进入客户端 chunk（`touchAction` / `hypot` / `transformOrigin`） |
| `/en` 可见文本汉字 / 中文标点 | 8 条路由均为 **0 / 0** |

---

## 6. 本地预览验证路径与检查要点

```bash
npm run dev          # http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| `/zh/projects`、`/en/projects` | 项目①：`开放世界东星斑个体重识别研究` / `Open-World Crimson Snapper Individual Re-Identification…`；项目②：`…双模态东星斑识别数据采集装置` / `…Crimson Snapper Data Acquisition Device`；卡片内不再出现「鱼类 / Fish」物种泛称；技术标签仍为「个体重识别」类通用术语 |
| `/zh/research`、`/en/research` | 方向①标题为东星斑；论文卡片标题仍为 `…Robust Open-Set Fish Re-Identification`（有意保留） |
| `/zh`、`/en` 首页技能板块 | 桌面三列等宽并排、平板两列、手机单列；`编程语言` 组顺序为 `Python → C/C++ → VBA 批量数据处理 → 51 / STM32 单片机 → 多线程编程`；卡片留白明显收紧但标签不拥挤 |
| `/zh/resume`、`/en/resume` | 技能行含 `C/C++`；教育经历含校级一等奖学金 |
| `/zh/about`、`/en/about` | 教育经历含奖学金；「实践留影」第 3 张图注为 `图3 东星斑RFID推荐植入位点示意图`；读屏/检查器确认 `alt` 已更新 |
| 图库灯箱（关于页实践留影、项目详情页项目展示） | 点击图片放大；**桌面滚轮**上下缩放、**移动双指捏合**缩放（1×～4×）；上一张/下一张或关闭后缩放复位；Esc、点击空白、关闭按钮退出正常 |
| 窄屏（约 390px） | 技能卡片单列、标签换行不溢出；灯箱图片不超出视口 |
| 深浅主题 | 新增/调整元素均复用 `var(--card)` / `var(--card-border)` / `var(--muted)` / `var(--accent)`，两套主题下正常 |

---

## 7. 偏差与残留事项（需你留意）

1. **论文标题、摘要、领域标签有意未改**
   论文名 `Quality-Aware Temporal Contrastive Learning for Robust Open-Set Fish Re-Identification` 同时存在于 `publications.ts`、`credentials.ts` 与 `public/resume.pdf`。它是既成的论文标题（英文字面即为 Fish），改动属于篡改论文信息，且会与 PDF 内容冲突。因此：
   - 论文标题、英文摘要、标签 `Fish Re-ID` **保持原样**；
   - 仅「论文关联描述」（`coreContribution` 中对项目的交叉引用）随项目新名同步。
   如果你希望连论文摘要的中文表述也改为东星斑，请告知（会与英文标题字面不一致）。

2. **既有 PDF 资产仍为旧措辞，会出现网页与文件不一致**
   - `public/resume.pdf`：课题方向行仍为「基于视觉与 RFID 双模态的鱼类个体识别与开放世界重识别研究」；
   - `public/docs/report-rfid-vision-device.pdf`：封面标题预计仍为「…鱼类个体识别数据采集装置」，而网页上的文档标题已改为东星斑。
   这两个二进制文件我未改动（无源文件、且属你上传的正式材料）。如需完全对齐，请重新导出 PDF。

3. **技能总数没有硬编码断言**
   `verify:profile` 对技能栈的校验是「分组与扁平列表的 id 集合必须完全一致」+「每条双语齐全」+「证据状态合法」，**不存在写死的条数**。因此新增 C/C++ 后校验自然通过；我把 `skills.ts` 注释中的条数由 26 更新为 27。我**刻意没有**在脚本里写死 `27`——那样下一次正当新增就会导致校验失败。若你确实想要一条「总数必须等于 N」的硬断言，说一声即可加上。

4. **可选的「东星斑场景落地」标注未加**
   任务 1.1 把该标注写为「可」（可选）。考虑到首页技能已改成三列窄卡片，追加后缀会显著拉长 `个体重识别（ReID）` 这一标签并加剧换行，故未添加。需要的话可加在 `skills.ts` 的该条目标签上。

5. **C/C++ 属新增能力声明**
   该技能此前不在站内数据层，也不在 `public/resume.pdf` 中，本次依据你的任务说明写入。如与正式简历口径需要一致，请同步更新 PDF。

6. **灯箱未新增缩放提示文案**
   为避免引入新的可见元素（严格遵循「不新增自定义样式」），未添加「滚轮/双指缩放」的操作提示，缩放能力属于可发现性较弱的功能。如需提升可发现性，可以在既有 `text-xs text-white/60` 计数行旁追加一句提示。

7. **项目③详情页第 3 张图片未改**
   经查看，它是碘伏伤口消毒实拍，与任务 5 描述的「推荐植入位点示意图」不是同一张图，其 caption「图3 碘伏伤口消毒」本身正确，故未改动。任务 5.2 提到的「项目详情页实践留影模块」在本站并不存在——「实践留影」是 `/[lang]/about` 的板块名称。

8. **工作区含多轮未提交改动**：本次未创建 commit。根目录现有 4 份未跟踪文件（本轮报告与前几轮报告、`src/components/ResearchAreas.tsx`），历史报告可按需删除。
