# Deployment Readiness

本文档记录工程的部署准备状态，不代表网站已经发布。

## 已完成的工程能力

- 统一的 Profile 事实数据层与 public + verified 过滤
- 中英文首页、项目页、项目详情和研究页
- 空论文、空专利的安全隐藏
- 仅基于公开 Profile 的确定性 Career Agent
- 内容、Profile、Chat 和部署准备专项验证脚本
- 条件 canonical、Open Graph URL、robots sitemap 声明和 sitemap 条目
- `.env.example` 与安全的站点 URL 校验

## 最终验收记录

- [ ] Production build
- [ ] Content verification
- [ ] Profile verification
- [ ] Chat contract verification
- [ ] Browser route and interaction testing
- [ ] 1440、1024、768、390、320 px responsive testing
- [ ] Console、Network、Runtime、DOM 与基础可访问性检查

这些项目会在本地最终验收完成后更新；未勾选项目不得被视为已完成。

## 正式发布前仍需用户提供或确认

- 正式域名或最终 Vercel HTTPS URL，用于 `NEXT_PUBLIC_SITE_URL`
- 经脱敏审核且允许公开的简历 PDF
- 允许公开的联系方式（如需展示）
- 经确认的论文完整记录（如需展示）
- 经确认、字段完整的专利记录（如需展示）
- 可选 Vercel KV 配置（仅用于访客计数与聊天频率控制）

Career Agent 当前不调用外部 AI，因此不需要 AI API Key。若未来引入外部模型，必须重新完成公开语料边界、安全回退和 Browser 网络验收。

## SITE_URL 行为

- 未配置：本地工程可运行；canonical、绝对 Open Graph URL 和 sitemap 条目保持禁用。
- 配置合法公开 HTTPS origin：生成对应页面的 canonical、绝对 Open Graph URL 和公开静态路由 sitemap。
- 配置非法、localhost、带凭据、带路径、查询或片段的 URL：验证失败。

## 简历发布要求

简历必须先完成脱敏与事实审查，不得包含电话、生日、政治面貌、学号、住址、证件二维码或其他私人资料。只有当 PDF 已放入允许公开的静态目录、链接有效且专项验证通过后，才能在 Profile 中配置下载地址。

## 发布边界

- 不提交 `.env` 或平台密钥。
- 不在仓库中维护自动 push 或 deploy 脚本。
- push、Vercel 连接、预览部署和正式发布均由维护者人工执行。
- 当前任务仅完成 readiness，不执行 push 或部署。
