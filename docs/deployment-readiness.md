# Deployment Readiness

本文档记录工程的部署准备状态，不代表网站已经发布。

## 已完成的工程能力

- 统一的 Profile 事实数据层与 public + verified 过滤
- 中英文首页、项目页、项目详情、研究页和在线公开简历
- 空论文安全隐藏与一项已核验实用新型专利展示
- 仅基于公开 Profile 的确定性 Career Agent
- 内容、Profile、Chat 和部署准备专项验证脚本
- 基于确认域名的 canonical、Open Graph URL、robots 与 sitemap 条目
- `.env.example` 与安全的站点 URL 校验

## 最终验收记录

- [x] Production build
- [x] Content verification
- [x] Profile verification
- [x] Chat contract verification
- [x] Browser route and interaction testing
- [x] 1440、1024、768、390、320 px responsive testing
- [x] Console、Network、Runtime、DOM 与基础可访问性检查

这些项目会在本地最终验收完成后更新；未勾选项目不得被视为已完成。

## 正式发布前仍需人工完成

- 审核双语在线公开简历的排版与内容
- 如未来提供 PDF 下载版，先完成脱敏与事实审核
- 经确认的论文完整记录（如需展示）
- 可选 Vercel KV 配置（仅用于访客计数与聊天频率控制）

Career Agent 当前不调用外部 AI，因此不需要 AI API Key。若未来引入外部模型，必须重新完成公开语料边界、安全回退和 Browser 网络验收。

## SITE_URL 行为

- 未配置：使用已确认的 `https://ctrlctrlx.top` 生成 canonical、Open Graph URL、robots 和 sitemap。
- 配置合法公开 HTTPS origin：生成对应页面的 canonical、绝对 Open Graph URL 和公开静态路由 sitemap。
- 配置非法、localhost、带凭据、带路径、查询或片段的 URL：验证失败。

## 简历发布要求

在线公开简历只读取 public + verified Profile 数据，不包含电话、生日、政治面貌、学号、住址、证件二维码、在投论文或其他私人资料。当前“打印 / 保存为 PDF”调用浏览器打印功能；仓库不包含 PDF 文件或下载按钮。

## 发布边界

- 不提交 `.env` 或平台密钥。
- 不在仓库中维护自动 push 或 deploy 脚本。
- push、Vercel 连接、预览部署和正式发布均由维护者人工执行。
- 当前任务仅完成 readiness，不执行 push 或部署。
