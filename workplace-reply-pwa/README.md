# 高情商职场回复器

一个面向 iOS Safari 和桌面浏览器的轻量 PWA，用于生成职场沟通回复、复制、收藏和离线访问。当前版本优先调用本产品自己的 `/api/generate` 接口；当服务端 AI 不可用时，会自动回退到本地模板，保证离线可用。

## 功能

- 按场景、对象、语气、敏感度生成 3 个职场回复版本。
- 支持飞书/IM、邮件、微信和会议口头表达渠道。
- 支持简短、适中、详细三种回复长度。
- 支持复制、复制全部、收藏和从收藏回填。
- 支持对生成结果一键“收短 / 更温和 / 更坚定 / 转邮件”，减少手动二次编辑。
- 支持服务端 AI 生成与本地模板兜底，并在界面上显示当前生成来源。
- 支持本机效率看板，记录生成、复制、收藏、改写和高频场景。
- 支持深浅色切换和 PWA 离线访问。

## 本地运行

```bash
npm start
```

然后打开：

```text
http://localhost:5173/
```

旧的本地路径也兼容：

```text
http://localhost:5173/workplace-reply-pwa/
```

## iOS 使用

本地预览时，让 iPhone 和 Mac 连接同一个 Wi-Fi，然后在 Safari 打开 Mac 的局域网地址。

正式使用时建议部署到 HTTPS 平台，例如 Vercel、Cloudflare Pages 或 Netlify。部署后在 iPhone Safari 中打开链接，点击分享按钮，选择“添加到主屏幕”。

## AI 配置

- 服务端只会从 `MINIMAX_API_KEY` 环境变量，或 `MINIMAX_API_KEY_FILE` 指向的本地文件读取密钥。
- 服务端支持 `MINIMAX_BASE_URL` 手动指定区域端点；未指定时会先尝试 `https://api.minimax.io/v1`，在鉴权不匹配时自动回退到官方中国大陆端点 `https://api.minimaxi.com/v1`。
- 前端不会接触 API key；浏览器只请求本产品自己的 `/api/generate`。
- 如果密钥缺失、格式不支持、上游调用失败或模型返回异常，界面会自动切回本地模板。
