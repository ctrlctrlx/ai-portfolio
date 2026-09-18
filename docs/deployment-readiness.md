# Deployment Readiness

本文档记录工程的部署准备状态，不代表网站已经发布。

## 已完成的工程能力

- 统一的 Profile 事实数据层与 public + verified 过滤
- 中英文首页、项目页、项目详情、研究页、荣誉与资质页和在线公开简历
- 两篇 EI 会议论文的完整学术成果展示，与项目①互相关联
- `public/resume.pdf` 正式版简历下载，PDF 文字纳入隐私审计
- 一项已核验实用新型专利展示
- 仅基于公开 Profile 的确定性 Career Agent
- 内容、Profile、Chat 和部署准备专项验证脚本
- 基于确认域名的 canonical、Open Graph URL、robots 与 sitemap 条目
- `.env.example` 与安全的站点 URL 校验
- 已授权公开的手机号 / 政治面貌集中在 `scripts/lib-approved-contacts.mjs` 声明

## 最终验收记录

- [x] Production build（本地 `npm run build` 通过，共 28 条静态路由）
- [x] Content verification
- [x] Profile verification
- [x] Chat contract verification
- [ ] Browser route and interaction testing（需维护者在浏览器中人工验收）
- [ ] 1440、1024、768、390、320 px responsive testing（需人工验收）
- [ ] Console、Network、Runtime、DOM 与基础可访问性检查（需人工验收）

这些项目会在本地最终验收完成后更新；未勾选项目不得被视为已完成。

## 正式发布前仍需人工完成

- 审核双语在线公开简历的排版与内容
- 审核 `public/resume.pdf` 正式版简历的排版、页数与事实一致性
- 补充两篇 EI 会议论文的会议全称（当前 `venue` 为【待补充会议全称】占位）
- 在装有 `pdftotext` 的机器上运行 `npm run verify:all`，确认 PDF 文字审计生效
- 可选 Vercel KV 配置（仅用于访客计数与聊天频率控制）

Career Agent 当前不调用外部 AI，因此不需要 AI API Key。若未来引入外部模型，必须重新完成公开语料边界、安全回退和 Browser 网络验收。

## SITE_URL 行为

- 未配置：使用已确认的 `https://ctrlctrlx.top` 生成 canonical、Open Graph URL、robots 和 sitemap。
- 配置合法公开 HTTPS origin：生成对应页面的 canonical、绝对 Open Graph URL 和公开静态路由 sitemap。
- 配置非法、localhost、带凭据、带路径、查询或片段的 URL：验证失败。

## 简历发布要求

- `/[lang]/resume` 是在线浏览版，只读取 public + verified Profile 数据，包含电话与政治面貌以外的公开事实。
- 全站下载入口统一指向 `public/resume.pdf`（本人提供的正式版文件）；已移除浏览器打印 / 另存为 PDF 入口。
- `public/resume.pdf` 的文字由 `verify:content`、`verify:resume`、`verify:deploy` 提取并审计，只允许出现已批准的邮箱与手机号。
- 已授权公开的联系方式（手机号、政治面貌）集中声明在 `scripts/lib-approved-contacts.mjs`；除此之外不得公开电话、生日、学号、住址、证件二维码、在投论文或其他私人资料。

## 发布边界

- 不提交 `.env` 或平台密钥。
- 不在仓库中维护自动 push 或 deploy 脚本。
- push、Vercel 连接、预览部署和正式发布均由维护者人工执行。
- 当前任务仅完成 readiness，不执行 push 或部署。
