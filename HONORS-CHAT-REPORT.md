# 图片命名 · 项目标签 · 荣誉修正 · 机器人修复 · 联系方式布局 报告

- 仓库：`E:\PRD\my-ai-portfolio`（Next.js 16 App Router + TS + 双语 zh/en）
- 分支：`refactor/streamline-profile-content`
- 范围：图3 命名、RFID 项目标签、荣誉全量修正与分级、 chatbot 全量修复、政治面貌与籍贯调整、页脚标签、联系卡片横向布局、全局细节
- 状态：**全部通过**（`npm run verify` content / profile / chat / resume / lint / typecheck / build 全绿；生产构建 30/30）
- 本次未创建任何 git commit / tag / branch / push

---

## 0. 结论摘要

| 验收项 | 实测结果 |
| --- | --- |
| 图3 标题与 alt | ✅ `图3 天线外壳CAD结构设计图` / `Fig. 3 CAD Structural Design of Antenna Housing`，zh/en 的 caption 与 alt 四项全部命中，旧文案 `3D结构设计图` 残留 0 |
| RFID 项目技术标签 | ✅ 含 `AutoCAD`，项目列表卡片、zh/en 详情页均渲染 |
| 荣誉修正 | ✅ 6 项评奖+竞赛日期全部按修正后口径落库（2026.09 / 2025.05 / 2023.06 / 2022.12 / 2022.05 / 2021.12） |
| 荣誉分级 | ✅ 荣誉页分组为 国家级 → 省部级 → 校级 + 证书与专利 + 学术论文；首页预览标签实测为「国家级 / 国家级 / 省部级」 |
| 三处荣誉口径一致 | ✅ 教育经历、荣誉页、简历页、首页预览同源，实测日期 6 项全中 |
| 机器人：`[object Object]` | ✅ 已修复（项目时间实测输出 `2025.03–至今`、`2025.06–2026.09`、`2025.12–2026.08`） |
| 机器人：CAD 技能 | ✅ 技能回答按分组要点式输出，`AutoCAD 结构设计`、`机械结构设计`、`C/C++` 均在列 |
| 机器人：研究方向 | ✅ 输出通用术语 4 项（计算机视觉 / 个体重识别（ReID）/ 视觉语言模型 / 嵌入式智能感知系统） |
| 机器人：荣誉问答 | ✅ 新增按级别分组的荣誉回答（zh/en 各自动分组） |
| 机器人：自我介绍 | ✅ 五段式：身份定位（含籍贯重庆）→ 教育背景（两校）→ 研究方向 → 核心能力 → 联系方式引导 |
| 首页信息行 | ✅ `籍贯：重庆 · 现居：海南海口 · 中共党员（2021.12）` / `Hometown: Chongqing · Based in Haikou, Hainan · Member of the CPC (Dec. 2021)` |
| 关于页简介 | ✅ 含籍贯重庆与两所毕业院校；简介板块内 `中共党员` 计数 0 |
| 页脚邮箱标签 | ✅ `邮箱：yangc202706@163.com` / `Email: yangc202706@163.com`，与微信、电话格式一致 |
| 联系卡片横向布局 | ✅ `flex items-center gap-3 rounded-2xl border p-4`（左图标 + 右两行文字，垂直居中，内边距收紧） |
| 英文页中文泄漏 | ✅ 8 条 `/en` 路由可见文本汉字 0、中文标点 0；英文对话回答亦无全角标点 |
| `npm run verify` | ✅ 全链路通过 |
| 生产构建 | ✅ 30/30 静态页生成成功 |

---

## 1. 三项需确认事项的处理结果

| # | 事项 | 采用方案 |
| --- | --- | --- |
| 1 | 任务 3 级别标注 | **按你的修正执行**：国家奖学金、国家励志奖学金均为**国家级**（教育部颁发）；四川省优秀大学毕业生、蓝桥杯、大唐杯为**省部级**；一等奖学金为**校级**。实用新型专利按我的建议**不参与奖励分级**（见 §6.4） |
| 2 | 任务 3.2 荣誉页分组 | **A：改为按级别分组**——国家级 → 省部级 → 校级（组内时间倒序），证书与专利、学术论文各自成组 |
| 3 | 任务 4.2.3 / 5.1 籍贯 | **A：授权公开籍贯（重庆）**——在 `scripts/lib-approved-contacts.mjs` 新增可审计授权常量，据此改写 `verify-profile-data.mjs` 的「籍贯已移除」守卫，并同步 AGENTS.md / README / docs |

---

## 2. 修改文件清单与每处改动说明

### 2.1 任务一：实践留影图3 名称修正

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/projects.ts` | 项目②（RFID 与多目视觉双模态东星斑识别数据采集装置）第 3 张图片 `p2-device-3-cad` 的 `caption` / `alt` 更新为 `图3 天线外壳CAD结构设计图`、`Fig. 3 CAD Structural Design of Antenna Housing` 及对应 alt |

> **目标图定位（实证）**：任务书写的是「实践留影图3」，但**天线外壳 CAD 图**位于项目②详情页「项目展示」的第 3 张（`public/images/projects/project-2/device-3-cad.jpg`，我打开图片确认内容正是一张天线外壳 CAD 三维结构图）。关于页「实践留影」的第 3 张（`practice-03.jpg`）经上一轮核对是「东星斑 RFID 推荐植入位点示意图」，若改成 CAD 标题会再次造成文不对图，故未改动。原 caption 为「图3 天线外壳**3D**结构设计图」，本次按你的措辞修正为 **CAD**。

### 2.2 任务二：RFID 项目技术标签新增 AutoCAD

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/projects.ts` | 项目②`techTags` 追加 `{ zh: "AutoCAD", en: "AutoCAD" }`，拼写与技能栈的「AutoCAD 结构设计 / AutoCAD structure design」完全一致，中英通用 |

### 2.3 任务三：荣誉获奖信息全量修正

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | 新增 `AwardLevel = "national" \| "provincial" \| "university"`；`Award` 新增必填 `level`；`year` 注释明确为 `YYYY.MM` |
| `src/data/profile/awards.ts` | 重写 4 条评奖（时间倒序）：校级一等奖学金（2026.09，university）/ 2023届四川省优秀大学毕业生（2023.06，provincial）/ 国家奖学金（2022.12，national）/ 国家励志奖学金（2021.12，national）。新增导出 `awardLevelLabels`（国家级/省部级/校级）与 `awardLevelOrder`，供荣誉页与机器人共用同一份级别文案 |
| `src/data/profile/competitions.ts` | 2 条竞赛更新：第十二届大唐杯（**2025.05**，provincial，标题补全「产教融合 5G+ 创新应用赛 团队三等奖」）/ 第十三届蓝桥杯（2022.05，provincial，标题补全「全国软件和信息技术专业人才大赛 … 大学组 个人三等奖」） |
| `src/data/profile/education.ts` | 海南大学荣誉列表补充大唐杯（2025.05）；四川工业科技学院列表按修正后内容重写为 4 条（省优秀大学毕业生 2023.06 / 国家奖学金 2022.12 / 蓝桥杯 2022.05 / 国家励志奖学金 2021.12） |
| `src/components/Honors.tsx` | 分类逻辑由「荣誉奖项 / 竞赛获奖」改为按级别分组的「国家级 / 省部级 / 校级」（组内时间倒序），并新增级别图标映射（`Award` / `Medal` / `GraduationCap`）；证书与专利、学术论文保持原分组；首页预览同步显示级别标签 |
| `src/data/profile/index.ts` | 导出 `awardLevelLabels`、`awardLevelOrder` |

> 评奖 4 条、竞赛 2 条、专利 1 条的数量与既有校验完全一致（`verify:profile`、`verify:resume` 的计数断言未被触碰）。

### 2.4 任务四：求职信息助理全量修复

| 文件 | 改动 |
| --- | --- |
| `src/lib/career-agent.mjs` | ① 新增 `projectPeriod()`：`endDate` 为双语结构（进行中为「至今 / Present」），按 locale 取值再序列化，**修复 `[object Object]`**（`buildProjects` / `buildProject` 两处 + `coreSkill` 也改为按 locale 取值）<br>② `buildSkills` 改为按「分类 → 分组」两级要点式输出，CAD 类技能与其它技能一样完整列出<br>③ `buildResearch` 改用 `about.researchDirections` 的通用研究方向术语，不再罗列课题名<br>④ `buildAwards` 合并评奖与竞赛，按级别分组、组内时间倒序要点式输出<br>⑤ 荣誉意图匹配关键词扩充（荣誉/奖项/获奖/奖励/奖学金/竞赛 + awards/honors/scholarship/competition），英文只用复数形式以避免「Did he win the Turing Award?」被误判为查询本人荣誉<br>⑥ `buildIntroduction` 重构为五段式：身份定位（含籍贯）→ 教育背景 → 研究方向 → 核心能力 → 联系方式引导<br>⑦ 英文回答的分隔符与括号改为半角，全角标点清零 |
| `app/api/chat/route.ts` | 语料新增 `about`（籍贯与通用研究方向）、`competitions`、`awardLevelLabels`、`awardLevelOrder` |
| `scripts/verify-chat-contract.mjs` | 语料同步补齐上述字段；新增 4 条荣誉意图快捷问题（共 22 条）；新增契约断言：项目回答不得含 `[object Object]`、技能回答必须含 AutoCAD/机械结构设计/C/C++、研究方向回答必须含 4 项通用术语、自我介绍必须含籍贯与两所院校、荣誉回答必须含三级标题（中英各一组） |

### 2.5 任务五：政治面貌位置调整与籍贯新增

| 文件 | 改动 |
| --- | --- |
| `src/data/profile/types.ts` | `AboutProfile` 新增 `nativePlace: BilingualText` 与 `researchDirections: BilingualText[]` |
| `src/data/profile/about.ts` | 新增 `nativePlace: { zh: "重庆", en: "Chongqing" }`；新增 `researchDirections` 4 项；简介第二段开头补「籍贯重庆，本科毕业于四川工业科技学院，现为海南大学…工学硕士在读」 |
| `src/data/profile/identity.ts` | `location` 由「海南，中国」改为「海南海口 / Haikou, Hainan」（现居）；`bio` 同步补入籍贯与院校 |
| `src/components/About.tsx` | 简介末段**移除政治面貌追加**；`summaryOnly` 分支的政治面貌 `dl` 一并移除 |
| `app/[lang]/page.tsx` | 首屏信息行改为 `籍贯 · 现居 · 政治面貌`（同一行、同一 `MapPin` 图标、`text-xs` + `var(--muted)`，用 `·` 分隔，缺数据自动省略片段） |

### 2.6 任务六：页脚邮箱标签补全

| 文件 | 改动 |
| --- | --- |
| `src/data/site/footer.ts` | `FooterDictionary` 新增 `emailLabel`（邮箱 / Email） |
| `src/components/Footer.tsx` | 邮箱条目前加 `邮箱：` / `Email: `，与 `微信：`、`电话：` 的类名、字号、颜色、间隔符完全一致 |

### 2.7 任务七：联系方式卡片横向重构

| 文件 | 改动 |
| --- | --- |
| `src/components/Contact.tsx` | 卡片由 `flex flex-col p-5`（图标在上）改为 `flex items-center gap-3 p-4`（左图标 + 右侧「标题 + 内容」两行，整块垂直居中）；数值保留 `button break-all`、`min-w-0 flex-1` 防溢出；圆角、边框、背景令牌不变。联系页、关于页、首页三处共用同一组件，样式自动统一 |

### 2.8 任务八：全局细节与校验收严

| 文件 | 改动 |
| --- | --- |
| `scripts/lib-approved-contacts.mjs` | 新增 `APPROVED_NATIVE_PLACE = { zh: "重庆", en: "Chongqing" }`，作为籍贯公开的**唯一可审计授权声明** |
| `scripts/verify-profile-data.mjs` | ① 用「授权值校验」替换原先的籍贯 blanket ban：`about.nativePlace` 必须存在且等于授权值，否则报 `unapproved-native-place`；仍拦截 `contact-hometown` 联系条目<br>② 新增公开手机号断言 `incorrect-public-phone`（联系方式标签完整性：邮箱与手机号各必须存在且带双语标签）<br>③ 新增荣誉级别合法性校验 `invalid-honor-level` 与日期格式校验 `invalid-honor-date-format`（必须 `YYYY.MM`）<br>④ 新增 `about.researchDirections` 双语完整性校验 |
| `AGENTS.md` | 「Explicitly authorised exceptions」由两项扩为三项，新增籍贯（重庆）授权说明与撤销方式 |
| `README.md` | 路由说明更新：首页信息行、关于页结构、荣誉页分级、联系页三项联系方式 |
| `docs/deployment-readiness.md` | 授权公开范围补充籍贯 |

---

## 3. 核心优化点效果说明

1. **图注与图面一致**：图3 标题由「3D 结构设计图」精确为「CAD 结构设计图」（该图确为 CAD 三维图），中英 caption 与 alt 四项同步，读屏与搜索引擎可正确理解。
2. **荣誉信息一次修正、四处同源**：评奖 4 条与竞赛 2 条集中在 `awards.ts` / `competitions.ts`，教育经历与简历页内嵌列表按同一口径更新，机器人与荣誉页共用 `awardLevelLabels`，全站零差异。
3. **分级展示层级清晰**：荣誉页由「按类型」改为「按级别」，国家级 → 省部级 → 校级顺序固定，组内时间倒序（`YYYY.MM` 字典序即时间序），每组配独立线性图标；证书与论文仍各自成组，不强行塞进奖励级别。
4. **机器人四类回答全部结构化**：项目/技能/荣誉为要点式列表，自我介绍为五段式标题块；项目时间恢复正常输出，技能回答按「分类 → 分组」两级展开，CAD 类技能不再被淹没。
5. **研究方向回到通用术语**：机器人不再用项目名回答「研究方向」，改用与个人简介完全一致的 4 项通用研究方向，避免把课题名当作研究方向。
6. **首屏信息密度提升**：籍贯、现居、政治面貌压缩进原有地点行（不新增独立行），三个事实一屏可见。
7. **联系方式全站统一**：页脚三行（邮箱/微信/电话）标签格式一致；联系卡片改为横向布局后内边距由 `p-5` 收紧到 `p-4`，三列等宽下空间利用率明显提升。
8. **校验收严**：新增籍贯授权校验、公开手机号断言、荣誉级别与日期格式校验、通用研究方向双语校验、7 条机器人回答契约断言；意图匹配由「裸 award」收紧为复数形式，恢复了「他人奖项」提问应回退到资料不足答复的行为。

---

## 4. 全量校验结果汇总

命令：`npm run verify`

| 步骤 | 结果 |
| --- | --- |
| `verify:content` | ✅ passed（66 个公开文本文件、21 个本地静态资源、`resume.pdf` 完成文本审计） |
| `verify:profile` | ✅ passed（3 projects / 3 research areas / 2 publications / 1 patent / 4 awards / 2 competitions / 5 credentials / 2 practice phases） |
| `verify:chat` | ✅ passed（**22** quick prompts, 3 public projects）——含新增 7 类回答契约断言 |
| `verify:resume` | ✅ passed（双语路由、本地 PDF 下载、PDF 隐私审计、隐私边界） |
| `eslint` | ✅ 无输出（0 error / 0 warning） |
| `tsc --noEmit` | ✅ 零错误 |
| `next build` | ✅ 30/30 静态页面生成成功 |

页面与接口实测（本地生产服务器端口 3318，测毕已关闭）：

| 检查项 | 实测值 |
| --- | --- |
| 图3 caption / alt | zh/en 四项全部命中；`3D结构设计图` 残留 0 |
| 项目技术标签 AutoCAD | 列表卡片 ✅ / zh 详情 ✅ / en 详情 ✅ |
| 荣誉页分组标题 | zh：国家级、省部级、校级、证书与专利、学术论文；en：National、Provincial、University-level、Certificates & Patents、Academic Papers |
| 首页荣誉预览标签 | 国家级 / 国家级 / 省部级 |
| 简历页日期口径 | 2026.09 / 2025.05 / 2023.06 / 2022.12 / 2022.05 / 2021.12 六项全中；en 侧 Jun. 2023 / Dec. 2022 / May 2025 命中 |
| 首页信息行 | `籍贯：重庆 · 现居：海南海口 · 中共党员（2021.12）` / `Hometown: Chongqing · Based in Haikou, Hainan · Member of the CPC (Dec. 2021)` |
| 关于页简介 | 含籍贯重庆与四川工业科技学院；简介板块内 `中共党员` = 0（全页 2 次均为既有「三大核心优势」文案） |
| 简历页 `中共党员` | 0（隐私边界保持） |
| 页脚三行 | 邮箱：/微信：/电话： 与 Email:/WeChat:/Phone: |
| 联系卡片类名 | `flex items-center gap-3 rounded-2xl border p-4 …` |
| 聊天 API（POST /api/chat） | 6 类问题逐一实测，均无 `[object Object]`；英文回答无全角标点 |
| `/en` 可见文本汉字 / 中文标点 | 8 条路由均为 **0 / 0** |

---

## 5. 本地预览验证路径与检查要点

```bash
npm run dev          # http://localhost:3000
```

| 路径 | 检查要点 |
| --- | --- |
| `/zh/projects/rfid-multiview-acquisition`、`/en/...` | 「项目展示」第 3 张图注为 `图3 天线外壳CAD结构设计图` / `Fig. 3 CAD Structural Design of Antenna Housing`；技术标签含 `AutoCAD`；点击图片可放大并用滚轮/双指缩放 |
| `/zh/honors`、`/en/honors` | 分组标题依次为 国家级 → 省部级 → 校级 → 证书与专利 → 学术论文；国家级含国家奖学金（2022.12）与国家励志奖学金（2021.12）；组内时间倒序 |
| `/zh`、`/en` | 首屏地点行同时含籍贯、现居、政治面貌；荣誉预览卡片显示级别标签；联系卡片为左图标右文字横向布局 |
| `/zh/about`、`/en/about` | 简介含籍贯重庆与两所院校、**不含**中共党员；研究方向 3 卡片；底部联系卡片横向 |
| `/zh/resume`、`/en/resume` | 教育经历含两校修正后荣誉与日期；**不出现中共党员**；荣誉板块日期与荣誉页一致 |
| 页脚（任意页） | 联系方式三行为 `邮箱：`、`微信：`、`电话：`（英文 `Email:` / `WeChat:` / `Phone:`），标签格式统一 |
| 右下角「询问求职助理」 | 依次问「介绍一下你的项目经历 / 核心技能 / 研究方向 / 自我介绍 / 荣誉奖项」：时间正常显示、技能含 AutoCAD、研究方向为通用术语、自我介绍含籍贯与院校、荣誉按级别分组 |
| 窄屏（约 390px） | 联系卡片仍保持「左图标 + 右文字」横向且内容自动换行不溢出；首页信息行自动换行；荣誉分组卡片单列 |
| 深浅主题 | 新增元素均复用现有令牌，两套主题下正常 |

---

## 6. 偏差与残留事项（需你留意）

1. **任务 1 的目标对象与任务书措辞不一致**
   任务书写「实践留影图3」，但「天线外壳 CAD 结构设计图」实际位于**项目②详情页「项目展示」的第 3 张**（我打开 `device-3-cad.jpg` 确认内容为天线外壳 CAD 三维图）。关于页「实践留影」第 3 张是上一轮刚核对过的「东星斑 RFID 推荐植入位点示意图」，未改动。若你确实想把关于页那张也改成 CAD 标题，请先替换图片文件，否则会再次文不对图。

2. **英文标题大小写/格式按站内既有约定**
   任务书写的是 `Fig.3 CAD Structural Design of Antenna Housing`（`Fig.3` 无空格），站内既有约定为 `Fig. 3 …`，故落地为 `Fig. 3 CAD Structural Design of Antenna Housing`。如需严格 `Fig.3` 请告知。

3. **两处日期为较大跨度的修正，请再确认**
   - 大唐杯：原数据 `2022` → 现 `**2025.05**`（跨 3 年）
   - 国家奖学金：原 `2021` → 现 `**2022.12**`；国家励志奖学金：原 `2020` → 现 `**2021.12**`
   这些均按你本次给出的清单落库。**`public/resume.pdf` 是二进制资产、我未改动**，若其中年份与新版不一致，会出现网页与 PDF 口径不同，建议重新导出 PDF。

4. **实用新型专利未参与奖励分级（我的判断，请你确认）**
   你在分级清单里把它标为「国家级奖励」。专利是国家知识产权局的知识产权**授权**，不是奖项，且你为**第二发明人**；把它列进「国家级 → 省部级 → 校级」的奖励分组会与「奖励」语义混淆。因此本次它仍留在「证书与专利」分组（并已注明国家知识产权局、第二发明人）。**如果你坚持要放在国家级奖励组**，说一声即可调整。

5. **籍贯公开已改变隐私边界（已按 AGENTS.md 要求留痕）**
   籍贯是先前按你本人要求全站移除的字段，本次重新授权公开。已按仓库规则把授权值集中声明在 `scripts/lib-approved-contacts.mjs`，并同步改写 `verify-profile-data.mjs` 守卫、更新 AGENTS.md / README / docs，保持可审计。撤回授权只需删除该常量（守卫会重新拦截）。

6. **机器人自我介绍会输出公开求职邮箱**
   五段式的「联系方式引导」段落包含 `yangc202706@163.com`（从数据层读取，非硬编码）。该邮箱本就公开在页脚、联系页与简历页；对话中的「联系方式」类回答仍保持原有严格格式（契约测试通过）。如不希望自我介绍里直接出现邮箱，可改为不带地址的引导语。

7. **荣誉数据的「同一事实两处维护」**
   教育经历的荣誉条目与 `awards.ts` / `competitions.ts` 是两份文本（教育模块还含学院、研究方向等非荣誉条目），本次已按同一口径手写同步。后续若再改奖项，需要两处同时更新；如需彻底消除该重复，可考虑让教育模块从奖项集合派生（属结构调整，需另行确认）。

8. **`About` 组件的 `summaryOnly` 预览模式当前仍无调用方**（首页个人简介板块已在前一轮移除），本次顺带移除了其中的政治面貌 `dl`，分支代码保留备用。

9. **工作区含多轮未提交改动**：本次未创建 commit。根目录现有 5 份未跟踪文件（本轮报告 + 4 份历史报告 + `ResearchAreas.tsx`）；历史报告可按需删除。
