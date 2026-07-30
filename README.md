# Yang Chong — Evidence-based Portfolio

杨冲的中英双语求职作品集，面向计算机视觉算法与边缘部署岗位。页面、元数据与 AI 助理统一使用 `src/data/` 中经核验的公开资料，重点呈现已有教育经历、项目、技能和工程实践。

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- Tailwind CSS 4
- MDX、KaTeX
- `next-themes`
- 可选的 Vercel KV 访客计数和 DeepSeek API

## 本地开发

需要 Node.js 22.15.0 或更高版本，以及 npm 10.9.2。

```bash
npm ci
npm run dev
```

开发服务器默认位于 `http://localhost:3000`。

## 验证

```bash
npm run verify:content
npm run lint
npm run typecheck
npm run build
npm run verify
```

`verify:content` 使用 Node.js 内置模块检查公开姓名、禁用内容、草稿、简历入口和本地静态资产。`verify` 按顺序运行公开内容、lint、TypeScript 和 production build 检查。

## 当前路由

- `/`：根据请求语言进入本地化首页
- `/zh`、`/en`：中英文首页
- `/[lang]/projects`：项目列表
- `/[lang]/projects/[slug]`：项目详情
- `/[lang]/blog`：公开博客列表
- `/[lang]/blog/[slug]`：公开博客文章
- `/api/chat`：AI 助理接口；无密钥时仅返回经核验资料生成的静态答案
- `/api/visitor`：可选访客计数接口；未配置时明确返回不可用

## 环境变量

仅在需要对应能力时配置：

- `DEEPSEEK_API_KEY`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

不要提交 `.env` 文件或输出变量值。

## 公开事实与隐私原则

- 个人事实只允许来自 `src/data/` 中已经核验的公开资料。
- 不得猜测或补写论文、专利、奖项、项目角色、设备、指标、链接或状态。
- 不得公开电话号码、私人邮箱、生日、学号、住址、证件、密钥或原始私有研究数据。
- 草稿文章不会进入公开列表或公开 slug 集合。
- 证据不足时应明确说明信息不足，不得生成看似合理的个人成果。

提交前必须运行完整验证。推送和部署必须由维护者人工审查后执行；仓库不提供自动暂存、改分支、推送或部署脚本。
