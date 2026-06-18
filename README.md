# yu个人作品集网站

> **VBC-004** — 工业数字化与 AI 工具实践者个人品牌展示站，整合职场回复器 PWA，并部署到 arayucofe.com.cn。

## 🌐 访问地址

- **主站**: [https://arayucofe.com.cn/](https://arayucofe.com.cn/)
- **职场回复器 PWA**: [https://arayucofe.com.cn/workplace-reply-pwa/](https://arayucofe.com.cn/workplace-reply-pwa/)
- **仓库**: [https://github.com/Treenomad/Personal-portfolio](https://github.com/Treenomad/Personal-portfolio)

## 📁 项目结构

```
VBC003-personal-portfolio/
├── index.html              # 主页面（单页应用）
├── resume.html             # 简历页
├── workplace-reply-pwa/    # AI 职场回复器 PWA 与 Node 后端
├── deploy.sh               # 一键部署脚本
├── README.md               # 本文件
└── assets/
    ├── css/
    │   └── style.css       # 响应式样式
    └── js/
        └── main.js         # 交互脚本
```

## 🏗 技术栈

- **前端**: 纯 HTML5 + CSS3 + Vanilla JS（零依赖、零构建工具）
- **字体**: Google Fonts (Inter + Noto Sans SC)
- **托管**: arayucofe.com.cn 服务器 + nginx
- **部署**: 一键 bash 脚本 `deploy.sh`

## 📋 功能模块

| 模块 | 内容 |
| --- | --- |
| **导航栏** | 固定顶部、毛玻璃效果、滚动高亮、移动端汉堡菜单 |
| **Hero** | 个人 Slogan、CTA 按钮、统计数据 |
| **关于** | 脱敏个人简介、核心领域卡片（工业系统、ISO 9001, 8D/SPC/FMEA, AI 工具实践） |
| **技能矩阵** | 4 大类技能条形图（质量管理、工业自动化、AI 工具开发、软技能） |
| **项目案例** | 2 个精选项目卡片（8D 质量工具、职场回复器 PWA） |
| **职场回复器** | MiniMax 智能生成、本地模板兜底、PWA 离线访问、发送评分 |
| **联系方式** | 邮箱、GitHub、所在地、当前方向 |
| **页脚** | 版权信息、座右铭 |

## 🚀 部署

```bash
# 一键部署到 arayucofe.com.cn 服务器
./deploy.sh
```

## 📝 迭代记录

| Sprint | 日期 | 内容 |
| --- | --- | --- |
| SPRINT-003 | 2026-06-18 | 公开页面脱敏：移除具体公司与岗位绑定，强化工业数字化、质量系统与 AI coding 工具能力表达 |
| SPRINT-002 | 2026-06-06 | 合并个人主站与职场回复器 PWA，部署到 arayucofe.com.cn |
| SPRINT-001 | 2026-04-28 | MVP 静态页面搭建：5 大模块、响应式适配、滚动动画 |

## 📄 License

MIT © 2026 yu
