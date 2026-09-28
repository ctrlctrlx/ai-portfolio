# 关于我结构整合 + 论文 DOI 显性化 批次报告

项目：`E:\PRD\my-ai-portfolio`
结果：3 项任务全部完成，`npm run verify` 全链路通过（30/30 页面静态生成）；6 个页面实测**水合错误 0、控制台错误 0**，英文页可见文本中文字符 0。

---

## 0. 各任务完成情况汇总

| 任务 | 状态 | 关键实测证据 |
|---|---|---|
| 1 关于我：简介正文换成 6 能力卡片、删除独立核心能力板块 | ✅ | 标签行保留=true；6/6 模块齐全；独立「核心能力」板块=false；简介正文段落已不在页面；教育/实践板块完好；中英一致 |
| 2 荣誉资质论文 DOI 换成具体编号 | ✅ | 荣誉页 2 条 `DOI: 10.1117/12.3073439` / `DOI: 10.1109/PRMVAI70103.2026.11605618`；旧「DOI 检索/Link」残留 0 |
| 3 项目页学术成果 DOI 同步 | ✅ | 项目页同样 2 条完整编号、与荣誉页完全一致（同一数据源） |
| 4 配套优化与校验 | ✅ | 新增 DOI 格式校验（自检确认非法值被拦截）；深色模式对比度 7.79:1、浅色 5.17:1（均超 WCAG AA）；响应式 4 档无溢出 |

---

## 一、任务 1：关于我页面结构整合

### 1.1 改动内容

| 文件 | 改动 |
|---|---|
| `src/components/About.tsx` | ① 「个人简介」板块改为：标题 → **顶部身份标签行**（`bioSections[0]`，整行加粗）→ **6 个能力模块卡片**（桌面 3 列 2 行 / 平板 2 列 3 行 / 移动端单列）；② **删除页面底部独立的「核心能力」板块**（标题、网格、容器整段移除，避免与简介区重复）；③ 新增 `tagSection` 变量并从组件注释中说明「简介正文不再在本页渲染」 |
| `src/data/profile/about.ts` | 仅在 `bioSections` 的文档注释中补充展示约定（正文段落保留在数据层的原因），数据内容未改 |
| `README.md` | 路由表「关于我」一行改为「简介标签行 + 6 个能力模块卡片（3×2）+ 教育经历 + 实践经历 + 实践配图」 |

### 1.2 实测（中英双语）

| 检查项 | 中文页 | 英文页 |
|---|---|---|
| 顶部标签行（学历 \| 政治面貌 \| 奖学金） | ✅ 保留 | ✅ |
| 6 个能力模块标题 | 6/6 | 6/6 |
| 卡片网格 `md:grid-cols-2 lg:grid-cols-3` | ✅ 1 处 | ✅ |
| 独立「核心能力 / Core Capabilities」板块 | ❌ 已不存在 | ❌ |
| 简介正文段落（如「习惯用可复现实验…」） | ❌ 已不在页面 | ❌ |
| 教育经历 / 实践经历板块 | ✅ 位置内容不变 | ✅ |
| 横向溢出（320 / 390 / 768 / 1280 px） | 全部 ≤ 0 | — |
| 页面卡片总数 | 11（6 能力卡片 + 2 教育 + 3 实践条目） | 同 |

间距校准：`About` 外层仍是 `space-y-14` 的区块间距体系，删掉一个板块后由 flex 流自动收拢；简介区内部为「标题 → 标签行 `mt-5` → 卡片网格 `mt-6`」，教育经历紧随其后，无空洞或拥挤。桌面端实测页面高度 3492px（此前为「大段正文 + 独立能力板块」两段叠加）。

> **关于简介正文**：`bioSections[1..]` 不再在关于页渲染，但**保留在数据层**——它是求职问答「自我介绍」的取词来源，`career-agent.mjs` 的 `buildIntroduction` 与 `verify:chat` 的「自我介绍必须包含 Compact256 量化结果」断言都依赖它。删除数据会导致问答口径断裂，因此只在展示层收敛。如需彻底删除，请一并确认问答侧的新口径。

---

## 二、任务 2 / 3：论文 DOI 显示为具体编号

| 文件 | 改动 |
|---|---|
| `src/components/AcademicOutput.tsx` | DOI 入口文案由「DOI 检索 / DOI Link」改为 **`DOI: <完整编号>`**（如 `DOI: 10.1117/12.3073439`）；位置仍在日期之后、同一行；样式保持品牌蓝 + `hover:text-[var(--accent-hover)]` 加深 + `hover:underline`；仍为 `target="_blank"` + `rel="noopener noreferrer"` 新标签页打开；无障碍名称同步改为「DOI：在发布方网站查看论文《…》」 |
| `src/components/Honors.tsx` | **荣誉资质页「学术论文」板块新增 DOI 入口**：论文条目的 DOI 由 `publications.ts` 按标题同源解析（证书集合只作分类引用，不重复存储 DOI），渲染为与项目页同格式的品牌蓝 `DOI: <编号>`，位置在颁发机构/时间行的右侧（与附件文字链同一组，flex-wrap 不溢出） |

- 两处共用同一份 `publications.ts` 数据，格式、样式、跳转逻辑完全一致；
- 实测：荣誉页与项目页**各出现 2 条完整 DOI 编号**（`10.1117/12.3073439`、`10.1109/PRMVAI70103.2026.11605618`），与数据层 `doi` 字段逐字一致；「DOI 检索 / DOI Link」在中英四个页面残留 **0**；`doi.org` 链接数各 2、均为新标签页打开。

> 说明：荣誉资质页此前**没有**任何 DOI 入口（该页的论文条目只显示标题、颁发方与年月），所以这里是「新增同格式入口」而不是「替换文字」；这样两页的论文信息才真正统一。首页与简历页不展示 DOI（首页预览只取分类优先级前 3 条，论文不在其中），残留检查为 0。

---

## 三、任务 4：配套优化与全链路校验

| 项目 | 内容 |
|---|---|
| DOI 格式校验（`scripts/verify-profile-data.mjs`） | 新增规则：每篇论文的 `doi` 必须存在且匹配 `^10\.\d{4,9}\/[A-Za-z0-9._;()/:+-]+$`（`missing-publication-doi` / `invalid-publication-doi`），确保拼出的 `https://doi.org/<doi>` 一定是有效检索链接 |
| 校验规则自检 | 把一篇论文的 DOI 临时改成 `not-a-doi` → 校验**正确报错** `invalid-publication-doi: blockchain-spectrum-sensing-poas:not-a-doi`；随后已还原并复验通过 |
| 深色模式适配 | DOI 链接使用 `var(--accent)`：深色 `#60a5fa`、浅色 `#2563eb`，随主题自动切换。浏览器实测对比度 **深色 7.79:1、浅色 5.17:1**（WCAG AA 正文要求 4.5:1，深色达到 AAA 7:1），无需额外样式 |
| 全站同步核查 | 首页 / 关于我 / 荣誉页 / 项目页 / 简历页逐页核对：附件文字链、时间格式、DOI、能力卡片、教育与实践内容均与数据层一致，英文页可见文本中文字符 0 |

---

## 四、修改文件清单

| 文件 | 改动 |
|---|---|
| `src/components/About.tsx` | 简介板块改为「标签行 + 6 能力卡片」；删除底部独立「核心能力」板块；`tagSection` 变量与注释 |
| `src/components/AcademicOutput.tsx` | DOI 文案改为 `DOI: <编号>`；无障碍名称同步 |
| `src/components/Honors.tsx` | 论文条目新增同格式 DOI 入口（从 `publications.ts` 按标题解析） |
| `src/data/profile/about.ts` | `bioSections` 注释补充展示约定（数据未改） |
| `scripts/verify-profile-data.mjs` | 新增 DOI 存在性与格式校验 |
| `README.md` | 路由表关于页/项目页描述同步 |

---

## 五、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (71 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 编译成功，30/30 页面，公开页面全部 ● SSG |
| `npm run verify`（全链路） | ✅ 全绿 |
| 浏览器回归 | ✅ `/zh`、`/zh/about`、`/en/about`、`/zh/honors`、`/zh/projects`、`/zh/resume` 水合错误 0、控制台错误 0 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

---

## 六、本地预览验证步骤与检查要点

```
npm run build && npx next start -p 3417
```

| 路径 | 检查要点 |
|---|---|
| `/[lang]/about` | 「个人简介」下方先是身份标签行，紧接着 6 张能力卡片（桌面 3 列 2 行、缩到平板 2 列 3 行、手机单列）；页面底部**没有**独立的「核心能力」板块；教育经历、实践经历紧随简介区，间距自然；6 段文案与给定内容逐字一致 |
| `/[lang]/honors` | 「学术论文」两条各显示 `DOI: 10.1117/12.3073439`、`DOI: 10.1109/PRMVAI70103.2026.11605618`（品牌蓝、hover 加深并下划线、点击新标签页打开）；不再出现「DOI 检索」字样 |
| `/[lang]/projects` | 底部「学术成果」两张论文卡的日期后紧跟同格式 DOI 编号，与荣誉页完全一致 |
| 深色/浅色切换 | DOI 编号在两套主题下都清晰可辨（实测对比度 7.79:1 / 5.17:1） |
| `/[lang]`、`/[lang]/resume` | 无 DOI 入口（首页预览不含论文），其余内容与本轮前一致 |
| 控制台 | 无 `Hydration failed`、无 #418、无 404 |

---

## 七、待确认与风险

1. **关于页简介正文仍保留在数据层**（不在页面渲染），用于求职问答的「自我介绍」口径一致；如需彻底删除数据，请确认问答侧的新文案（`career-agent.mjs` + `verify:chat` 断言需同步调整）。
2. **荣誉页的 DOI 属新增入口**（该页此前没有 DOI），如需荣誉页保持「纯清单」不显示 DOI，我可以撤掉这一处（保留项目页的编号格式）。
3. **上一轮遗留的两处事实冲突仍未处理**（关于我模块 5 的「大唐杯全国三等奖」与数据层的「省部级/团队三等奖」不一致；「国家奖学金全国获奖比例约 0.2‰」无第二来源）——按「内容不增删不改」原样保留，等你确认。
4. `public/attachments/**/resources/` 的 44 个无关文件（16.7 MB）仍建议清理；清理命令见前一份报告。
