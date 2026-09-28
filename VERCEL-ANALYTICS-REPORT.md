# Vercel Analytics 接入 + 简历下载事件追踪 报告

项目：`E:\PRD\my-ai-portfolio`
结果：3 项任务全部完成，`npm run verify` 全链路通过（30/30 页面静态生成，全部页面仍为 ● SSG）；5 个入口实测**水合错误 0、控制台错误 0、前端零统计元素**，自定义事件参数逐项正确，下载链路实测完整走通。

---

## 0. 完成情况汇总

| 任务 | 状态 | 关键实测证据 |
|---|---|---|
| 1 接入 Vercel Analytics | ✅ | 依赖 `@vercel/analytics@^2.0.1` 安装成功；`<Analytics />` 注入在 body 内容最底部；hydration 后注入 `/_vercel/insights/script.js`；静态 HTML 无任何统计引用（0 处）；可见统计元素 0 |
| 2 简历下载自定义事件 | ✅ | 4 个入口点击均触发 `resume_download`，参数 `{language, page}` 实测为 `zh/en` × `home/about/resume/contact`；下载实测 `downloadWillBegin → completed (346,541 B)`，文件名不变 |
| 3 验证说明与最佳实践 | ✅ | 本地请求验证方式、Vercel 后台查看路径、自访过滤的可行做法（含纠偏）、隐私合规说明已写入 README 新增章节 |

---

## 一、任务 1：接入 Vercel 原生 Analytics

### 1.1 改动内容

| 文件 | 改动 |
|---|---|
| `package.json` / `package-lock.json` | 新增生产依赖 `"@vercel/analytics": "^2.0.1"`（当前稳定版；未升级任何其它包） |
| `app/[lang]/layout.tsx` | `import { Analytics } from "@vercel/analytics/next";`，组件放在 `[lang]` 布局 fragment 的**最后一位**（`<ChatBox />` 之后），即 body 内容最底部；附注释说明其行为与 SSG 兼容性 |

### 1.2 SSG 与水合安全性（接入前先验证再落地）

`@vercel/analytics` v2.0.1 的 Next 适配器内部**已经自带 `<Suspense fallback={null}>` 包裹**（`dist/next/index.mjs`：`Analytics2 = props => <Suspense fallback={null}><AnalyticsComponent {...props} /></Suspense>`），因此它内部使用的 `useSearchParams()` 不会打断静态预渲染、也不会造成水合差异。

实测确认：
- `npm run build` 无 Suspense / useSearchParams 警告，路由表与接入前**完全一致**（全部页面 ● SSG，API 路由 ƒ，30/30 页面）；
- 5 个入口（`/zh`、`/en`、`/zh/resume`、`/zh/contact`、`/zh/about`）浏览器实测 **水合错误 0、控制台错误 0**；
- 静态 HTML（如 `.next/server/app/zh.html`、`zh/resume.html`）中 `insights` 引用 **0 处** —— 组件渲染 `null`，脚本在 hydration 之后才注入，因此**不增加首屏 HTML 体积与请求数**。

### 1.3 前端零感知

| 检查项 | 实测 |
|---|---|
| 可见统计文案（analytics / 统计 等） | 无 |
| `[data-va]` 等统计节点 | 0 个 |
| 页面布局/样式变化 | 无（组件渲染 `null`） |
| 客户端 chunk 开销 | 含该 SDK 的 chunk 31,840 B 原始 / 11,796 B gzip（与其它客户端组件共享，hydration 后加载） |

### 1.4 自动统计维度（Vercel 后台可见）

页面访问量 PV / 独立访客 UV、各页面访问排行、访问来源与外部引荐、设备类型与浏览器、国家/地区分布、页面性能指标；中英文路由（`/zh/*` 与 `/en/*`）作为不同路径分别统计，全部页面自动覆盖，无需逐页配置。

---

## 二、任务 2：简历下载自定义事件 `resume_download`

| 文件 | 改动 |
|---|---|
| `src/components/ResumeDownloadButton.tsx` | ① 改为客户端组件（`"use client"`）；② 引入 `track`（`@vercel/analytics`）与 `usePathname`；③ 新增纯函数 `getDownloadPage(pathname)`，把当前路径映射为 `home` / `about` / `resume` / `contact`（其它路径归为 `other`）；④ 在 `<a>` 上新增 `onClick`：`track("resume_download", { language: locale, page: getDownloadPage(pathname) })`；下载的 `href`、`download` 文件名、样式、无障碍名称与 hover 行为**全部未改** |

- **入口零改动**：全站 4 处入口（首页 `/[lang]`、关于我 `/[lang]/about`、联系我 `/[lang]/contact`、在线简历 `/[lang]/resume`）共用同一组件，页面归属由路径自动推导，调用方不需要传参。
- **不干扰下载**：`track()` 只把事件推入内存队列（`window.vaq`），不 `preventDefault`、不阻塞、无网络等待。

### 2.1 实测结果

| 入口 | 事件载荷 | 下载 | 水合/控制台 |
|---|---|---|---|
| `/zh` | `["event",{"name":"resume_download","data":{"language":"zh","page":"home"}}]` | ✅ | 0 / 0 |
| `/en` | `…{"language":"en","page":"home"}` | ✅ | 0 / 0 |
| `/zh/resume` | `…{"language":"zh","page":"resume"}` | ✅ | 0 / 0 |
| `/zh/contact` | `…{"language":"zh","page":"contact"}` | ✅ | 0 / 0 |
| `/zh/about` | `…{"language":"zh","page":"about"}` | ✅ | 0 / 0 |

下载链路（CDP 下载事件实测）：`downloadWillBegin: 杨冲-个人简历.pdf (/%E6%9D%A8…pdf)` → `downloadProgress: inProgress … completed (346,541 B)`；另存文件名仍为 `杨冲-个人简历.pdf`（英文页 `Yang Chong Resume.pdf`）。

---

## 三、任务 3：验证说明、后台查看路径与最佳实践

（已写入 `README.md` 新增章节「五、访问统计（Vercel Analytics）」，并同步到技术栈表格）

### 3.1 本地验证方式

```bash
npm run build && npx next start -p 3418
# 打开 http://127.0.0.1:3418/zh/resume ，DevTools → Network 过滤 insights
```

- 页面加载后可见客户端注入的 `GET /_vercel/insights/script.js`；
- 控制台执行 `window.vaq` 可看到排队中的事件（页面浏览 + `resume_download`）；
- **本地该请求会返回 404**：`/_vercel/insights/*` 由 Vercel 边缘提供，本地 `next start` 没有该端点；这是**预期行为**，不影响页面与统计（部署到 Vercel 后自动生效）。

### 3.2 Vercel 后台查看路径

Vercel 控制台 → 选择本项目 → 顶部 **Analytics**：

| 面板 | 能看到什么 |
|---|---|
| Overview | 总访问量趋势、Top Pages（首页 / 关于我 / 项目经历 / 荣誉资质 / 在线简历 / 联系我 各模块访问排行）、Top Referrers（直接访问 vs 外链）、设备与浏览器、国家/地区 |
| Events（自定义事件） | `resume_download` 触发次数，以及按 `language`（zh / en）与 `page`（home / about / resume / contact）的分布，用于评估各入口转化 |
| Speed Insights（如启用） | 真实用户的首屏性能指标（LCP / INP / CLS） |

### 3.3 过滤自身访问（对原方案的一处纠偏）

任务里提到的「通过 Vercel Analytics 的 IP 过滤规则」并**不成立**：Vercel Analytics 面板提供的是按路径、来源、国家、设备等维度的**数据筛选**，不提供按 IP 排除访客的功能。可行做法（已写入 README）：

1. 调试尽量在本地 `next dev` 进行（本地行为不计入线上数据）；
2. 使用广告/统计拦截扩展，或用 Vercel 官方 Analytics 浏览器扩展屏蔽本站；
3. 如需程序化排除，可在 `<Analytics beforeSend={...} />` 中按自定义标记（例如 URL 带 `?admin=1` 或 `localStorage` 标记）丢弃事件——当前未启用，需要时我可以加上（约 5 行）。

### 3.4 隐私合规

所有指标均为**匿名聚合**数据，不使用 Cookie 跟踪个人身份、不采集姓名/邮箱/手机号等个人信息；站点原有的隐私纪律（`verify:content` / `verify:profile` 的隐私扫描）不受影响，统计代码不引入任何新的隐私面。

---

## 四、修改文件清单

| 文件 | 改动 |
|---|---|
| `package.json`、`package-lock.json` | 新增依赖 `@vercel/analytics@^2.0.1` |
| `app/[lang]/layout.tsx` | 引入并在 body 内容最底部渲染 `<Analytics />` |
| `src/components/ResumeDownloadButton.tsx` | 客户端化 + `track("resume_download", { language, page })`；页面归属按路径推导 |
| `README.md` | 新增「五、访问统计（Vercel Analytics）」章节；技术栈表补统计一项；后续章节重新编号 |

未改动：任何页面内容与样式、路由结构、`next.config.ts`、校验脚本、数据层。

---

## 五、全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (71 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 编译成功，30/30 页面，**全部页面仍为 ● SSG**，无 Suspense / useSearchParams 警告 |
| `npm run verify`（全链路） | ✅ 全绿 |
| 浏览器回归（5 个入口） | ✅ 水合错误 0、控制台错误 0、可见统计元素 0 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

---

## 六、本地预览验证步骤

```bash
npm install          # 拉取新增依赖（package-lock 已更新）
npm run build
npx next start -p 3418
```

| 步骤 | 预期 |
|---|---|
| 打开 `/zh/resume`，DevTools → Network 过滤 `insights` | 出现 `GET /_vercel/insights/script.js`（本地 404 属预期） |
| 控制台执行 `window.vaq` | 可看到排队的 pageview 事件 |
| 点击页面上的「下载简历 PDF」 | 正常下载 `杨冲-个人简历.pdf`（与之前完全一致，无延迟、无失败）；`window.vaq` 中出现 `resume_download` 且 `page=resume` |
| 分别在 `/zh`、`/en`、`/zh/contact`、`/zh/about` 点击下载按钮 | 事件 `language` 与 `page` 随之变化（zh/en × home/contact/about） |
| 目视整页 | 无任何统计元素、无提示、无样式变化 |
| 控制台 | 无 `Hydration failed`、无 JS 报错 |

---

## 七、部署后的注意事项

1. **必须部署在 Vercel**（或自行配置等价端点）才能收集数据：`/_vercel/insights/script.js` 与事件上报端点由 Vercel 边缘提供；自建 Node / Netlify 等平台会 404（不影响站点，但不会有统计）。
2. 在 Vercel 项目中确认 **Analytics 已启用**（Project → Analytics → Enable）；自定义事件无需额外注册，触发后会自动出现在 Events 面板。
3. 若之后需要站点自访过滤，建议用 `beforeSend` + 标记方案（README 已记录），而不是依赖不存在的 IP 过滤。
