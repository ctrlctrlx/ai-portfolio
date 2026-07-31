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
- `verify:deploy`：检查运行时版本、脚本、production build 产物、环境文件、公开隐私模式、静态资产和站点 URL 配置。
- `verify:all`：按发布前顺序运行内容、Profile、Chat、lint、TypeScript、build 和 readiness 检查。

## 当前路由

- `/`：按请求语言进入本地化首页
- `/zh`、`/en`：中英文首页
- `/[lang]/projects`：公开项目列表
- `/[lang]/projects/[slug]`：公开项目详情
- `/[lang]/research`：存在公开研究方向时可用
- `/[lang]/blog`、`/[lang]/blog/[slug]`：非草稿技术文章
- `/api/chat`：仅基于公开 Profile 的确定性求职问答
- `/api/visitor`：可选访客计数；未配置时返回不可用
- `/robots.txt`、`/sitemap.xml`：sitemap 仅在配置正式站点 URL 后生成条目

## Profile 事实原则

- 公开个人事实只能维护在 `src/data/profile/`。
- UI、metadata、兼容层和 Career Agent 必须使用 public + verified 过滤集合。
- `pending`、`private`、`hidden` 不得进入公开集合。
- 不得猜测或补写论文、专利、奖项、项目角色、设备、指标、链接或状态。
- 论文和专利数组可以为空；空集合不会渲染标题、导航或占位条目。
- 不得公开电话号码、私人邮箱、生日、学号、住址、证件、密钥或原始私有研究数据。

`src/data/resumeData.ts` 与 `src/data/publicProfile.ts` 仅是旧代码兼容适配器，不维护独立事实；新代码不得依赖它们。

## 环境变量

复制变量名时以 `.env.example` 为准，不要提交任何 `.env` 文件：

- `NEXT_PUBLIC_SITE_URL`：可选的正式站点 origin，必须是无路径、无凭据的公开 HTTPS URL。
- `KV_REST_API_URL`：可选 Vercel KV 地址。
- `KV_REST_API_TOKEN`：可选 Vercel KV 令牌。

未配置 `NEXT_PUBLIC_SITE_URL` 时，本地开发和工程验证可正常进行，但不会生成 canonical、绝对 Open Graph URL 或 sitemap 条目。非法 URL 会使 build/readiness 失败。

## Vercel 预览部署（人工操作）

本仓库不会自动连接或调用 Vercel。维护者准备预览时应：

1. 在代码审查后人工 push 目标分支。
2. 在 Vercel 中导入仓库并保持项目的 Node/npm 版本。
3. 按需在 Vercel 项目设置中配置 KV；不要把值写进仓库。
4. 预览 URL 确认后，将其作为 `NEXT_PUBLIC_SITE_URL` 配置，再运行完整验证。
5. 检查中英文页面、项目详情、研究页、Career Agent、404、robots 和 sitemap。

push、预览部署和正式发布必须由维护者人工执行。

## 正式发布前检查

- `npm run verify:all` 和 Browser 验收全部通过。
- 配置并验证正式 HTTPS origin。
- 仅在提供经脱敏审核、路径有效的 PDF 后启用简历按钮。
- 仅在确认允许公开后加入邮箱或其他联系方式。
- 论文与专利必须具有可确认的状态和公开字段后才能加入数据层。
- 确认 `.env`、证书、私人资料和原始研究数据未被跟踪。
- 由维护者人工完成 push 和部署；本项目不包含自动 push/deploy 脚本。

详细状态见 [`docs/deployment-readiness.md`](docs/deployment-readiness.md)。
