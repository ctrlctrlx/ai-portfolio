# Yang Chong — Evidence-based Portfolio

杨冲的中英双语求职作品集。页面、metadata 与求职信息助理统一使用 `src/data/profile/` 中允许公开且已经核验的结构化资料；未经确认、非公开或待核验条目不会进入页面或 AI 回答。

## 技术栈

- Next.js 16 App Router、React 19、严格 TypeScript
- Tailwind CSS 4、`next-themes`
- MDX、KaTeX
- 可选 Vercel KV 访客计数与聊天请求频率控制

没有安装或要求外部 AI 服务。Career Agent 使用确定性规则，只从 public + verified Profile 数据生成回答。

## 本地开发

需要 Node.js 22.15.0 或更高版本，以及 npm 10.9.2。依赖已存在时无需重新安装。

```bash
npm run dev
```

开发服务器默认位于 `http://localhost:3000`。本地地址只用于开发，不会写入 canonical 或 sitemap。

## 验证

```bash
npm run verify:content
npm run verify:profile
npm run verify:chat
npm run verify:resume
npm run lint
npm run typecheck
npm run build
npm run verify
npm run verify:deploy
npm run verify:all
```

- `verify:content`：检查公开姓名、禁用内容、草稿、简历入口和静态资产。
- `verify:profile`：检查证据状态、双语字段、slug、隐私模式和事实边界。
- `verify:chat`：检查请求契约、快捷问题、项目问答、注入拒绝和缺失资料回答。
- `verify:resume`：检查在线公开简历路由、Profile 数据边界、隐私字段与打印入口。
- `verify:deploy`：检查运行时版本、脚本、production build 产物、环境文件、公开隐私模式、静态资产和站点 URL 配置。
- `verify:all`：按发布前顺序运行内容、Profile、Chat、lint、TypeScript、build 和 readiness 检查。

## 当前路由

- `/`：按请求语言进入本地化首页
- `/zh`、`/en`：中英文首页（求职意向、一句话简介、关于我、实践经历、荣誉与资质、技能栈、代表项目、教育、联系我）
- `/[lang]/about`：关于我（个人简介、政治面貌、实践经历、三大核心优势）
- `/[lang]/honors`：荣誉与资质（荣誉奖项 / 竞赛获奖 / 证书与专利 / 学术论文）
- `/[lang]/contact`：联系我（公开求职邮箱、微信、籍贯）
- `/[lang]/projects`：公开项目列表（含角色徽章、量化指标、技术标签、STAR 与面试重点）
- `/[lang]/projects/[slug]`：公开项目详情
- `/[lang]/research`：公开研究方向、学术成果（论文）与专利
- `/[lang]/resume`：双语在线公开简历（在线浏览版）
- `/resume.pdf`：正式版简历 PDF（本地上传，全站统一的下载入口）
- `/[lang]/blog`、`/[lang]/blog/[slug]`：非草稿技术文章；当前文章均为草稿，导航栏入口已隐藏
- `/api/chat`：仅基于公开 Profile 的确定性求职问答
- `/api/visitor`：可选访客计数；未配置时返回不可用
- `/robots.txt`、`/sitemap.xml`：使用确认域名生成公开路由，包含关于我、荣誉与资质、联系我、在线简历与研究页

## 项目详情页媒体与文档（路径已预留）

项目详情页 `/[lang]/projects/[slug]` 含「项目展示」图片区与「相关文档下载」区，
但**只有详情页有**，首页预览卡片与项目列表页均不展示，保持首页精简。

路径登记在 `src/data/profile/projectMedia.ts`，实体文件由本人放入 `public/` 对应目录：

| 用途 | 存放目录 |
| --- | --- |
| 项目1 图片 | `public/images/projects/project-1/` |
| 项目2 图片 | `public/images/projects/project-2/` |
| 项目3 图片 | `public/images/projects/project-3/` |
| 「关于我」实践经历配图 | `public/images/about/` |
| 全部文档 | `public/docs/` |

- 这些预留路径已在 `scripts/lib-pending-assets.mjs` 登记为「待放置资产」：
  文件放入前 `npm run verify` 只输出 notice，不判失败；放入后 notice 自动消失。
- 图片缺失时详情页会显示占位块并标出预期路径，便于核对文件名是否一致。
- 新增预留目录时必须同步登记到 `scripts/lib-pending-assets.mjs`。

## 简历下载

- 网页版 `/[lang]/resume` 只用于在线浏览。
- 所有下载入口统一指向 `public/resume.pdf`（本地放置的正式版文件），由
  `src/components/ResumeDownloadButton.tsx` 渲染，不再提供浏览器打印 / 另存为 PDF 入口。
- `public/resume.pdf` 的文字会被校验脚本提取并审计，确保 PDF 内不出现未批准的邮箱或其它手机号。
- 替换简历时直接覆盖 `public/resume.pdf`，然后重跑 `npm run verify`。

## Profile 事实原则

- 公开个人事实只能维护在 `src/data/profile/`。
- UI、metadata、兼容层和 Career Agent 必须使用 public + verified 过滤集合。
- `pending`、`private`、`hidden` 不得进入公开集合。
- 不得猜测或补写论文、专利、奖项、项目角色、设备、指标、链接或状态。
- 当前公开论文集合为 2 篇 EI 会议论文，均为第一作者：
  - `publications.ts` 是论文事实的唯一来源；`credentials.ts` 中的 `kind: "paper"` 条目仅为「荣誉与资质」分类引用，由 `verify:profile` 校验两者标题一一对应。
  - 会议全称尚未确认，`venue` 保留【待补充会议全称】占位；在补全之前只能表述为「EI 会议论文」，不得声称 EI 已收录。
  - 论文指标（Rank-1 94.83% / AUROC 87.75%）与项目①的部署级指标（Rank-1 76.3% / AUROC 0.7108）口径不同，两处各自如实标注，不互相覆盖。
  - 论文作者只记录顺序与「是否本人」，本人姓名唯一来源仍是 `identity.ts`。
- 当前公开奖励与证书集合：`awards.ts` 4 项荣誉、`competitions.ts` 2 项竞赛获奖、`credentials.ts` 3 项证书与专利。
- 当前公开专利集合为 1（`patents.ts` 为事实来源，`credentials.ts` 仅作展示引用，年份必须与授权日期一致）。
- 项目经历为 3 项，按「鱼类 ReID 研究 → RFID 多目视觉采集装置 → 东星斑标记标准化」重要性排序；`techTags` 用于卡片标签，`coreSkill` 用于简历技能描述，两者分开维护。
- 技能栈四大分类的 `groups` 与扁平 `items` 必须保持一致，由 `verify:profile` 校验。
- 不得公开私人邮箱、生日、学号、住址、证件、密钥或原始私有研究数据。
- **已授权公开的例外**（唯一声明位置：`scripts/lib-approved-contacts.mjs`）：
  - 手机号仅允许出现在 `src/data/profile/identity.ts` 与 `public/resume.pdf`；其它 11 位号码一律拦截。
  - 政治面貌仅允许出现在 `src/data/profile/about.ts`，不得进入在线简历路由。
  - 撤销授权只需删除该文件中的常量，即恢复原有的全面禁止。

`src/data/resumeData.ts` 与 `src/data/publicProfile.ts` 仅是旧代码兼容适配器，不维护独立事实；新代码不得依赖它们。

## 环境变量

复制变量名时以 `.env.example` 为准，不要提交任何 `.env` 文件：

- `NEXT_PUBLIC_SITE_URL`：正式站点 origin；默认使用已确认的 `https://ctrlctrlx.top`，覆盖值必须是无路径、无凭据的公开 HTTPS URL。
- `KV_REST_API_URL`：可选 Vercel KV 地址。
- `KV_REST_API_TOKEN`：可选 Vercel KV 令牌。

未配置 `NEXT_PUBLIC_SITE_URL` 时使用已确认的正式域名生成 canonical、绝对 Open Graph URL、robots 与 sitemap。合法 HTTPS origin 可以覆盖；非法 URL 会使 build/readiness 失败。

## Vercel 预览部署（人工操作）

本仓库不会自动连接或调用 Vercel。维护者准备预览时应：

1. 在代码审查后人工 push 目标分支。
2. 在 Vercel 中导入仓库并保持项目的 Node/npm 版本。
3. 按需在 Vercel 项目设置中配置 KV；不要把值写进仓库。
4. 如需覆盖确认域名，仅使用经过审核的公开 HTTPS origin，再运行完整验证。
5. 检查中英文页面、项目详情、研究页、Career Agent、404、robots 和 sitemap。

push、预览部署和正式发布必须由维护者人工执行。

## 正式发布前检查

- `npm run verify:all` 和 Browser 验收全部通过。
- 验证确认域名 `https://ctrlctrlx.top` 或经审核的 HTTPS 覆盖值。
- 人工审核在线公开简历；当前只提供浏览器“打印 / 保存为 PDF”，不提供 PDF 下载文件。
- 公开求职邮箱只从 Profile 数据层读取。
- 在投论文继续保持非公开；专利只使用已确认字段。
- 确认 `.env`、证书、私人资料和原始研究数据未被跟踪。
- 由维护者人工完成 push 和部署；本项目不包含自动 push/deploy 脚本。

详细状态见 [`docs/deployment-readiness.md`](docs/deployment-readiness.md)。
