# arayucofe.com.cn — Industrial AI Research & Practice

freid 的双语工业 AI 研究、实践与深度写作网站。网站使用 Astro 生成静态页面，由 GitHub Pages 免费托管；文章使用 Markdown 管理。

## 最简单的文章发布方式

1. 在 `src/content/insights/` 中复制 `article-template.md`。
2. 将副本改成英文文件名，例如 `industrial-ai-system-boundaries.md`。
3. 填写标题、摘要、日期、语言、分类、标签和正文。
4. 发布时把 `draft: true` 改成 `draft: false`。
5. 将文件提交到 `main` 分支。

GitHub Actions 会自动检查、构建并部署网站，通常几分钟后文章就会出现在：

- 中文：`https://arayucofe.com.cn/insights/`
- 英文：`https://arayucofe.com.cn/en/insights/`

中文文章使用 `lang: zh`，英文文章使用 `lang: en`。Markdown 文件名会成为文章 URL 的一部分。

## 直接在 GitHub 网页发布

进入 `src/content/insights/`，选择 **Add file → Create new file**，粘贴 Markdown 内容并提交到 `main`。提交完成后，可在仓库的 **Actions** 页面查看自动发布进度。

## 在本地预览

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址，通常是 `http://localhost:4321`。

提交前可运行：

```bash
npm run check
npm run build
```

## 内容原则

- 不虚构项目结果或模型指标。
- 研究框架、工作流原型和真实实践必须明确区分。
- 涉及工作经历时优先匿名化，只展示方法、证据结构与可迁移能力。
- 逐条确认案例的公开边界，不公开客户、装置、产品型号或内部处置细节。
- 文章由本人撰写，AI 可以辅助校对和结构检查，但不替代作者判断。
