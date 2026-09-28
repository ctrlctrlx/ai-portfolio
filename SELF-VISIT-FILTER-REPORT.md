# Vercel Analytics 自访过滤（`?self=1` + localStorage）报告

项目：`E:\PRD\my-ai-portfolio`
结果：3 项任务全部完成，`npm run verify` 全链路通过（30/30 页面，仍全部为 ● SSG）；自访过滤做了**端到端实测**：标记后 0 条上报、2 条被过滤，普通访客与取消标记后均正常上报，全程水合错误 0、控制台错误 0。

---

## 0. 完成情况汇总

| 任务 | 状态 | 关键实测证据 |
|---|---|---|
| 1 实现 beforeSend 自访过滤 | ✅ | `?self=1`：**发送 0 条 / 过滤 2 条**、localStorage 写入 `va_self_exclude=1`；不带参数刷新仍 0 条；`?self=0` 后恢复上报 |
| 2 补充使用说明与文档 | ✅ | README「5.1 自访过滤使用方法（站长本人）」小节：通用方法、过滤范围、多设备、取消方法、不依赖 IP、隐私模式行为 |
| 3 全链路校验与功能验证 | ✅ | content / profile / chat / resume / lint / typecheck / build 全绿；7 步端到端场景验证通过；下载功能与文件名不变；9 项场景水合错误 0 |

---

## 一、任务 1：beforeSend 自访过滤实现

### 1.1 一处必要的技术调整（与原计划的差异）

任务要求「在 `app/[lang]/layout.tsx` 中为 `<Analytics />` 新增 `beforeSend` 回调属性」。**这一步无法直接照做**：`beforeSend` 是函数，而 App Router 的 `app/[lang]/layout.tsx` 是**服务端组件**，函数 prop 不能跨 RSC 边界传给客户端组件（会被序列化限制拦下）。

因此按官方推荐做法，把统计入口抽成一个**客户端组件**，行为与「在根布局直接写 `<Analytics beforeSend={...} />`」完全等价：

| 文件 | 改动 |
|---|---|
| `src/components/SiteAnalytics.tsx`（新增，`"use client"`） | 承载 `beforeSend` 过滤逻辑，内部渲染 `<Analytics beforeSend={beforeSend} />`（仍用 `@vercel/analytics/next` 适配器，保留 `/next` 的动态路由归一化能力） |
| `app/[lang]/layout.tsx` | 由 `<Analytics />` 改为 `<SiteAnalytics />`，位置仍在 body 内容最底部（`<ChatBox />` 之后）；注释说明为何走客户端组件 |

除该回调外，未改动任何业务组件、页面内容、样式与交互。

### 1.2 过滤逻辑（纯客户端）

```ts
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (typeof window === "undefined") return event;      // ① SSR / 预渲染直接放行

  const selfParam = readSelfParam();                     // ② 读 URL 的 self 参数

  try {
    if (selfParam === "1") window.localStorage.setItem(SELF_EXCLUDE_KEY, "1");   // ③ 写入持久标记
    else if (selfParam === "0") window.localStorage.removeItem(SELF_EXCLUDE_KEY); // 取消标记

    if (selfParam === "1") return null;                                          // 本次即过滤
    if (window.localStorage.getItem(SELF_EXCLUDE_KEY) === "1") return null;       // ④ 已标记设备
  } catch {
    if (selfParam === "1") return null;                  // ⑥ 隐私模式兜底
  }

  return event;                                          // 未标记 → 原样上报
}
```

- **覆盖范围**：`beforeSend` 是 SDK 对**每个事件**统一调用的钩子，因此页面浏览（PV/UV）、`resume_download`、以及今后新增的任意事件都会经过它，一次配置全站生效；
- **键名 / 参数**：localStorage 键 `va_self_exclude`，URL 参数 `self`（`1` 标记 / `0` 取消）；
- **类型安全**：回调签名 `(event: BeforeSendEvent) => BeforeSendEvent | null`，类型来自 `@vercel/analytics/next` 的导出，`tsc --noEmit` 零错误、ESLint 无告警；
- **兼容性**：`localStorage` 读写整体包在 `try/catch` 中（隐私模式 / 禁用存储时抛异常不会冒泡）；URL 解析也做了兜底，解析失败按「无参数」处理；
- **时机正确性**：核对了 SDK 内部实现——`inject()` 先 `initQueue()`、紧接着注册 `beforeSend`，**之后**才插入脚本（`dist/index.mjs` 的 `inject()`），所以脚本排空事件队列时回调已经就位，**首个 pageview 也会被过滤**，不存在漏报。
- **中英一致**：过滤逻辑挂在 `[lang]` 布局上，`/zh/*` 与 `/en/*` 共用同一实现（英文页实测同样过滤）。

---

## 二、任务 2：文档补充

`README.md` 「五、访问统计（Vercel Analytics）」章节：

- 顶部说明改为指向 `src/components/SiteAnalytics.tsx`；
- 新增 **「5.1 自访过滤使用方法（站长本人）」**，含操作表：`?self=1` 标记 / 不带参数继续过滤 / `?self=0` 取消 / 清 localStorage 取消；并说明**过滤范围**、**多设备独立标记**、**清除站点数据后需重新标记**、**不依赖 IP（换网络不影响）**、**普通访客零影响与隐私模式兜底**、以及**实现位置与 RSC 限制的原因**。

> 说明：文档示例统一写成 `https://<你的域名>/zh?self=1` 这种可验证形式，并注明「短链同理，只要最终 URL 带该参数即可」——任务里给的短链示例（`shturl.cc/...`）属于你的跳转链接，是否保留该跳转由你决定，README 不再绑定具体短链。

---

## 三、任务 3：全链路校验与功能验证

### 3.1 端到端过滤验证（本地实测）

本地 `/_vercel/insights/script.js` 由 Vercel 边缘提供、本地必然 404，因此我通过 CDP 拦截该请求，注入一个**按官方脚本契约工作**的桩（排空 `window.vaq` → 对每个事件调用注册的 `beforeSend` → 仅发送返回非 `null` 的事件），从而真正检验整条链路而不是只测回调：

| 步骤 | 场景 | 上报事件 | 被过滤 | localStorage | 水合/控制台 |
|---|---|---|---|---|---|
| 1 | 清空标记后普通访问 `/zh` + 点下载 | **2**（pageview `/[lang]` + `resume_download{language:zh,page:home}`） | 0 | `null` | 0 / 0 |
| 2 | `?self=1` 访问 + 点下载 | **0** | **2** | `1` | 0 / 0 |
| 3 | 不带参数刷新 `/zh` + 点下载 | **0** | **2** | `1` | 0 / 0 |
| 4 | 英文页 `/en/resume?utm_source=test` + 点下载 | **0** | **2** | `1` | 0 / 0 |
| 5 | `?self=0` 访问 | **1**（pageview） | 0 | `null` | 0 / 0 |
| 6 | 取消后刷新 `/zh` + 点下载 | **2** | 0 | `null` | 0 / 0 |
| 7 | 隐私模式（`localStorage` 抛异常）+ `?self=1` | **0** | **1** | 读取异常 | 0 脚本错误 |

- 步骤 1/6 证明**普通访客统计完整不受影响**；步骤 2/3/4 证明**标记后所有事件（含自定义事件）全被过滤且持久生效**；步骤 5 证明取消有效；步骤 7 证明隐私模式不报错且本次仍被过滤。
- 桩脚本每次页面加载都被正常调用（7 次），说明统计组件本身仍按原有方式工作。

### 3.2 其它验证

| 项目 | 结果 |
|---|---|
| 简历下载 | 文件名与下载逻辑未改（本轮未触碰 `ResumeDownloadButton`）；上一轮实测 `downloadWillBegin → completed (346,541 B)` 仍有效，过滤只在 `beforeSend` 内丢弃事件，不干预点击默认行为 |
| SSG 状态 | `npm run build` 路由表与接入前一致：全部页面 ● SSG（`/api/*` 为 ƒ），30/30 页面，**无 Suspense / useSearchParams 警告** |
| 静态 HTML | `.next/server/app/zh.html` 中 `insights` 引用 **0 处**（脚本仍在 hydration 后注入，不增加首屏体积与请求） |
| 前端零展示 | 可见统计元素 0、`[data-va]` 节点 0、无任何提示 |
| 类型与风格 | `npx tsc --noEmit` 零错误；`npm run lint` 无告警 |

### 3.3 全量校验结果汇总

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (72 public text files, 44 local assets, 杨冲个人简历.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (4 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 4 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` / `npx tsc --noEmit` | ✅ 无告警 / 类型零错误 |
| `npm run build` | ✅ 30/30 页面，全部 ● SSG，无警告 |
| `npm run verify`（全链路） | ✅ 全绿 |
| `npm run verify:deploy` | ⚠️ 仅剩 2 项环境性失败（`.env.local`、npm 版本），与本轮无关 |

---

## 四、修改文件清单

| 文件 | 改动 |
|---|---|
| `src/components/SiteAnalytics.tsx` | **新增**（`"use client"`）：`beforeSend` 自访过滤 + `<Analytics beforeSend={...} />` |
| `app/[lang]/layout.tsx` | 统计入口由 `<Analytics />` 改为 `<SiteAnalytics />`；注释更新（位置不变，仍在 body 内容最底部） |
| `README.md` | 访问统计章节更新 + 新增「5.1 自访过滤使用方法（站长本人）」 |

未改动：任何页面内容与样式、业务组件（含 `ResumeDownloadButton`）、路由结构、数据层、校验脚本、依赖清单（**本轮未新增任何依赖**）。

`git status`（本轮相关部分）：

```
 M README.md
 M app/[lang]/layout.tsx
?? src/components/SiteAnalytics.tsx
```

（其余 `M` / `??` 条目为前几轮已完成的改动与历史报告文件，本轮未再触碰；工作区未做任何提交。）

---

## 五、本地验证步骤与预期结果

```bash
npm run build
npx next start -p 3419
```

| 步骤 | 操作 | 预期 |
|---|---|---|
| 1 | 打开 `http://127.0.0.1:3419/zh`，控制台执行 `window.vaq` | 可看到 `["pageview", …]` 排队；DevTools Network 有 `/_vercel/insights/script.js`（本地 404 属预期） |
| 2 | 控制台执行 `window.localStorage.removeItem("va_self_exclude")`，刷新 | 仍是正常统计状态 |
| 3 | 访问 `http://127.0.0.1:3419/zh?self=1` | `localStorage.getItem("va_self_exclude") === "1"`；此后事件会被 `beforeSend` 丢弃 |
| 4 | 直接刷新 `http://127.0.0.1:3419/zh`（不带参数） | 仍在过滤状态（`?self=1` 只需访问一次） |
| 5 | 访问 `/en/resume?self=1` 或先前的标记状态 + 点击下载 | 事件同样被过滤，下载功能正常（文件名不变） |
| 6 | 访问 `http://127.0.0.1:3419/zh?self=0` | 标记被清除；`localStorage.getItem("va_self_exclude") === null` |
| 7 | 刷新任意页面 | 恢复正常统计（事件重新入队） |
| 8 | 整站目视 + 控制台 | 无统计元素、无 `Hydration failed`、无 JS 报错 |

> 提示：本地由于 `/_vercel/insights/script.js` 返回 404，脚本不会真正把队列发出去，`window.vaq` 会持续累积——这属本地环境的正常现象；判断过滤是否生效，可读取 `localStorage` 标记，或在生产环境（Vercel）用 Analytics 面板核对。

---

## 六、线上使用操作说明

1. **标记站长设备（每台设备各做一次）**
   - 电脑：浏览器打开 `https://<你的域名>/zh?self=1`（或任意页面加该参数）→ 看到页面正常打开即完成标记；
   - 手机 / 平板：同法在各自浏览器里访问一次；短链跳转亦可，只要最终 URL 带 `?self=1`。
2. **之后正常浏览**：直接输域名、点收藏、扫码都行，该浏览器的事件不会再进入统计（PV/UV、下载事件、今后新增事件全部过滤）。
3. **取消过滤**：访问 `https://<你的域名>/?self=0`，或在该浏览器清除站点数据（localStorage 键 `va_self_exclude`）。
4. **换设备/换浏览器/清除站点数据后**：需要重新用 `?self=1` 标记一次。
5. **核对效果**：Vercel 控制台 → 项目 → **Analytics** → `Overview` 看 PV/UV 是否不再包含你自己；`Events` 里 `resume_download` 的次数应只来自访客。
6. **注意**：不依赖 IP，因此换网络（公司/家庭/4G）不影响过滤；普通访客不受任何影响。

---

## 七、风险与说明

1. **与任务描述的差异**：`beforeSend` 无法写在服务端布局里，已按官方做法抽为客户端组件 `SiteAnalytics`（行为等价、位置不变）。若你更希望「布局里只有一行 `<Analytics />`」，可改为把过滤逻辑放在 `beforeSend` 之外的等效方案，但都需要一个客户端边界。
2. **本地 404 属预期**：`/_vercel/insights/script.js` 仅存在于 Vercel 边缘；本地不会真正上报，验证以 localStorage 标记 + 端到端桩测试为准（本轮已完成）。
3. **`?self=1` 会进入浏览器历史与分享链接**：如果把这个链接发给别人，对方的浏览器也会被标记为「站长设备」而不再计入统计——建议只在自己的设备上打开，或在分享前用 `?self=0` 清除。
4. **SDK 升级注意**：过滤逻辑依赖 `beforeSend` 契约（v2.0.1 已核对源码与 effect 顺序）。若将来升级 `@vercel/analytics`，建议重跑本轮的 7 步端到端验证。
