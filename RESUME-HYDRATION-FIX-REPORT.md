# 简历页"持续加载"问题修复说明

项目：`E:\PRD\my-ai-portfolio`
结论：**问题已修复，但根因不在简历页**——真正的缺陷是全局 `Navbar` 主题切换按钮的服务端/客户端渲染不一致，导致**全站每一页**都抛出 React Hydration Mismatch（#418）。修复后 `/zh/resume`、`/en/resume` 及全站页面水合错误归零、秒开无骨架屏残留。

---

## 一、问题根因定位

### 1.1 先纠正一个前提：简历页并没有渲染失败

用 Chrome DevTools 协议实测生产构建（`next start`）：

| 页面 | 首次出现内容耗时 | 板块完整性 | 骨架屏残留 |
|---|---|---|---|
| `/zh/resume` | 307 ms | 教育 / 项目 / 技能 / 荣誉 / 专利 全部在 | 无 |
| `/en/resume` | 62 ms | 同上 | 无 |
| `/zh` | 263 ms | — | 无 |
| `/en/honors` | 44 ms | — | 无 |

静态产物同样正常：`.next/server/app/zh/resume.html`（51,866 字符）与 `en/resume.html`（59,450 字符）中都已包含完整简历内容，HTML 里没有 loading 骨架。**所以"页面持续加载/无法渲染"不是简历页的渲染或数据问题。**

### 1.2 真正的缺陷：全站水合失配（含简历页）

同一次实测中，**每一个页面**都抛出了未捕获异常：

```
Error: Minified React error #418   ← Hydration failed because the server rendered HTML didn't match the client
```

切到 `next dev` 拿到非压缩版本后，React 直接给出了差异位置：

```
<LangLayout>
  <Navbar lang="zh" name="杨冲" hasAbout={true} hasHonors={true}>
    ...
      <button type="button" onClick={function onClick} ...>   ← 主题切换按钮
        <Sun size={16} aria-hidden="true">
          <svg ...>
+           className="lucide lucide-sun"
-           className="lucide lucide-moon"
+           <circle cx="12" cy="12" r="4">
-           <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472...">
```

**根因**：`src/components/Navbar.tsx` 用 `resolvedTheme` 决定渲染哪个图标——

```tsx
const isDark = resolvedTheme === "dark";   // 服务端：resolvedTheme 恒为 undefined → isDark === false
...
{isDark ? <Sun /> : <Moon />}              // 服务端输出 Moon，客户端水合后输出 Sun
```

next-themes 的主题值存在 `localStorage`/系统偏好里，服务端渲染时拿不到，因此服务端永远输出月亮、客户端解析出 dark 后输出太阳 → 属性与子节点都不同 → 水合失配。

### 1.3 为什么表现为"持续加载 / 白屏"

1. React 检测到失配后会**丢弃服务端 HTML 并整棵树在客户端重渲染**（React 19 的默认恢复策略），首屏因此多一次完整渲染，视觉上是一次闪动/短暂空白。
2. 在 `next dev` 下，`/zh/resume` 首次编译实测约 **3 秒**，这段时间该路由段的 `app/[lang]/loading.tsx` 骨架屏（`role="status"` + "Loading"）一直在显示——叠加第 1 点，很容易被感知为"一直转圈加载不出来"。
3. 静态页改回 SSG 后，浏览器缓存与 `.next` 产物更新期间也可能出现"旧 HTML + 新 JS"，加重上述现象。

### 1.4 这是既有缺陷，不是上一轮 SSG 改动引入的

`git diff src/components/Navbar.tsx` 显示主题按钮那几行（`resolvedTheme` / `isDark` / `Sun` / `Moon`）**与上一个提交完全一致**；SSG 之前该页按请求渲染时，服务端同样解析不出 `resolvedTheme`，失配一样存在。上一轮把页面改为静态后，HTML 对所有访问者完全一致，这个失配才更容易被稳定复现/察觉。

---

## 二、为什么没有照搬"给简历页加 `'use client'`"

你的任务一要求给 `app/[lang]/resume/page.tsx` 顶部加 `'use client'`。我没有照做，原因如下（都已实测核对）：

1. **该文件是 `async` 服务端组件**：`export default async function ResumePage({ params })` + `const { lang } = await params`，还导出了 `generateMetadata`。`'use client'` 组件**不允许是 async 函数**，也不允许 `await params`；直接加会导致编译失败，必须先把整页改写成客户端取数（`use()` + 客户端 fetch），这既不符合"不改动简历数据结构与内容"，也会破坏该页的 SSG（违背"不破坏 SSG 全局配置"）。
2. **简历页没有任何需要隔离到客户端的逻辑**：全文件检索 `useState` / `useEffect` / `useRef` / `window.` / `document.` / `matchMedia` / `localStorage` / `addEventListener` **命中数为 0**，只有两处 `async function`（服务端组件声明）。它的子组件 `ResumeDownloadButton` / `PatentCard` / `RichText` 同样是零状态、零浏览器 API。任务 1.1~1.3 描述的"视口高度计算、打印样式适配、滚动监听、DOM 尺寸测量"在该页面**不存在**，没有需要下沉的副作用。
3. **失配点不在这里**：React 给出的差异在共享布局的 `Navbar` 上，只改简历页无法消除报错——它在**每一页**都会发生。

因此我把修复落在真正的根因上，改动更小、且不动简历页一行。

---

## 三、修改文件清单与改动说明

| 文件 | 改动 |
|---|---|
| `src/components/Navbar.tsx` | 主题图标改为**纯 CSS 判定**：两个图标常驻 DOM，用既有的 `dark` 变体（`@custom-variant dark (&:where(.dark, .dark *))`）决定显示哪一个——`<Moon className="dark:hidden" />` + `<Sun className="hidden dark:block" />`；删掉 `isDark` 变量（改为在点击时用 `resolvedTheme` 计算目标主题）；注释说明为何不能用主题值参与渲染分支 |
| `src/components/ResumeDownloadButton.tsx` | 英文页下载文件名按你的规范改为 `download="Yang Chong Resume.pdf"`（中文页保持 `download="杨冲-个人简历.pdf"`） |
| `app/[lang]/resume/page.tsx` | **未改动**（内容与结构 100% 保持） |

修复后的服务端 HTML（两个图标都在，样式类决定显隐）：

```html
<button type="button" ... aria-label="切换深色或浅色主题" title="切换主题">
  <svg class="lucide lucide-moon dark:hidden" aria-hidden="true">…</svg>
  <svg class="lucide lucide-sun hidden dark:block" aria-hidden="true">…</svg>
</button>
```

服务端与客户端现在输出完全一致，因此不再有可比较的差异；图标明暗切换仍由 CSS 即时生效（无需等 JS）。

### 关于任务二（PDF 下载逻辑简化）

经核查，**该项本就已满足**，无需改造：

- `ResumeDownloadButton` 就是一个原生 `<a href download>`（`app/[lang]/resume/page.tsx` 只用它渲染按钮），**没有**任何 PDF 预加载、动态生成、`fetch`、状态变量或副作用（实测：`useState`/`useEffect`/`fetch(`/`window.` 命中数为 0）。
- 页面中也没有其它 PDF 相关导入或异步处理。
- 仅按你给的规范对齐了英文文件名（见上表）；按钮样式与实现方式未变。

---

## 四、验证结果

### 4.1 渲染与水合（Chrome DevTools 协议实测生产构建）

| 页面 | 首次出内容 | 水合错误（修复前 → 后） | 其它控制台错误 | 骨架屏残留 | 板块完整性 |
|---|---|---|---|---|---|
| `/zh/resume` | 307 ms | **1 → 0** | 0 | 无 | 教育/项目/技能/荣誉/专利 全在 |
| `/en/resume` | 62 ms | **1 → 0** | 0 | 无 | 同上 |
| `/zh` | 263 ms | **1 → 0** | 0 | 无 | — |
| `/en/honors` | 44 ms | **1 → 0** | 0 | 无 | — |
| `/zh/projects/fish-reid-open-world` | 66 ms | **1 → 0** | 0 | 无 | — |

- 路由切换实测：从 `/zh` 点击导航「在线简历」→ 219 ms 内渲染完成，`role="status"` 骨架屏**未残留**，水合错误 0，`/zh/resume` 的「教育经历」等在位。
- `html lang` 正确：`/zh/*` → `zh`，`/en/*` → `en`。
- 无 `Hydration failed`、无资源 404、无未捕获异常。

### 4.2 主题切换（回归验证）

点击主题按钮：`html.class` `dark → light → dark` 来回正常；可见图标同步切换（深色下显示太阳 `display:block`、月亮 `display:none`；浅色下相反），即 CSS 判定与 `setTheme` 目标主题一致，无失焦、无闪错图标。

### 4.3 PDF 下载

| 页面 | 链接 | 另存文件名 | 文件响应 |
|---|---|---|---|
| `/zh/resume` | `/resume.pdf` | `杨冲-个人简历.pdf` | 200 · 302,390 B |
| `/en/resume` | `/resume-en.pdf` | `Yang Chong Resume.pdf` | 200 · 105,033 B |

### 4.4 响应式（CDP 设备模拟，16 组组合）

320 / 390 / 768 / 1280 px × 4 个页面（中英简历页、首页、项目详情页）实测 **横向溢出全部 ≤ 0**（`scrollWidth ≤ innerWidth`，无溢出元素），移动端导航按钮存在（`nav=true`）。

> 说明：先前一张 390px 无头截图看起来"内容被右侧裁切"，经设备模拟量化确认是 `--window-size` 截图裁切造成的假象（页面实际按更宽视口布局后被截断），页面本身无溢出。

### 4.5 全量校验

| 命令 | 结果 |
|---|---|
| `npm run verify:content` | ✅ `passed (69 public text files, 25 local assets, resume.pdf audited)` |
| `npm run verify:profile` | ✅ `passed (3 projects, 3 research areas, 2 publications, 1 patents, 11 awards, 2 competitions, 5 credentials, 2 practice phases)` |
| `npm run verify:chat` | ✅ `passed (26 quick prompts, 3 public projects)` |
| `npm run verify:resume` | ✅ `passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)` |
| `npm run lint` | ✅ 无报错、无警告 |
| `npx tsc --noEmit` | ✅ 类型零错误 |
| `npm run build` | ✅ 编译成功；**全部页面路由仍为 ● SSG**（28/28 生成），API 路由保持 ƒ 动态 |
| SSG 未被破坏 | ✅ `/zh/resume` 响应头 `Cache-Control: s-maxage=31536000`、`x-nextjs-cache: HIT` |
| `npm run verify:all` | ⚠️ 仅剩 2 项**环境性**失败：`local-environment-file-present: .env.local`、`npm-version-mismatch`（与本轮改动无关，见第六节） |

**附带收益**：本轮沙箱放开了子进程限制后，PDF 文字审计**真正执行**（不再退化为字节扫描），`verify:content` / `verify:resume` 对 `resume.pdf` 与 `resume-en.pdf` 的中文名/英文名、已授权手机号与邮箱断言全部通过。

---

## 五、本地预览检查要点

```
npm run build && npx next start -p 3401
```

| 检查项 | 期望 |
|---|---|
| `/zh/resume`、`/en/resume` | 秒开；页面无持续加载、无白屏；五个板块（教育 / 项目 / 技能 / 荣誉 / 专利）完整 |
| 浏览器控制台 | 无 `Hydration failed`、无 `#418`、无 404、无未捕获异常 |
| 点击导航「在线简历」 | 客户端跳转不残留骨架屏 |
| 右上角主题按钮 | 明暗切换正常，图标与当前主题一致（深色显示太阳、浅色显示月亮） |
| 下载按钮 | 中文页下载 `杨冲-个人简历.pdf`，英文页下载 `Yang Chong Resume.pdf`，文件可正常打开（A4 3 页 / 4 页） |
| 移动端（320 / 390 px） | 无横向滚动条、无内容裁切 |
| 构建产物 | `.next/server/app/zh/resume.html`、`en/resume.html` 存在，页面仍为 SSG |

---

## 六、备注与后续

1. **`npm run verify:all` 的 2 项环境性失败**与本轮改动无关：`local-environment-file-present: .env.local`（该文件是你本机的密钥文件，已被 `.gitignore` 忽略，我未删除）、`npm-version-mismatch`（本机 npm 11.17.0 vs 项目声明 npm@10.9.2）。清理本地 `.env.local` 并用 corepack 对齐 npm 版本后即可全绿。
2. **`next dev` 首次访问某个路由必然较慢**（本轮实测 `/zh/resume` 首编译 ~3 s），期间显示的骨架屏来自 `app/[lang]/loading.tsx`，属预期行为；如需在开发时也不显示骨架，可临时注释该文件，但它对生产构建无影响。
3. **同类隐患排查完毕**：全站检索 `Math.random` / `Date.now` / `new Date(` / `toLocaleDateString` / `typeof window` / `useSyncExternalStore`，除已修复的 Navbar 外，仅剩服务端组件内的 `PatentCard` 日期格式化、`src/data/site/footer.ts` 的版权年份（服务端计算后作为 props 传入，客户端不参与比较）与 `/api/chat` 的服务端限流逻辑，均不参与水合比较，无水合风险。
4. 若你希望"静态 HTML 的 `<html lang>` 在英文页也直接输出 `en`"（当前由客户端在 hydration 时校正），可在各页 metadata 补 `alternates.languages`（hreflang）或在 `<head>` 注入极小阻塞脚本；两者都不影响 SSG，需要的话我可以补。
