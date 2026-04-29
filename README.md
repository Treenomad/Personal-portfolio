# yu个人作品集网站

> **VB-002** — 工业自动化解决方案专家个人品牌展示站，通过 GitHub Pages 免费托管。

## 🌐 访问地址

- **主站**: [https://2689872077.github.io/personal-portfolio/](https://2689872077.github.io/personal-portfolio/)
- **仓库**: [https://github.com/2689872077/personal-portfolio](https://github.com/2689872077/personal-portfolio)

## 📁 项目结构

```
VB002-personal-portfolio/
├── index.html              # 主页面（单页应用）
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
- **托管**: GitHub Pages
- **部署**: 一键 bash 脚本 `deploy.sh`

## 📋 功能模块

| 模块 | 内容 |
| --- | --- |
| **导航栏** | 固定顶部、毛玻璃效果、滚动高亮、移动端汉堡菜单 |
| **Hero** | 个人 Slogan、CTA 按钮、统计数据 |
| **关于** | 个人简介、核心领域卡片（DCS/SIS, ISO 9001, 8D/SPC/FMEA, 国际化） |
| **技能矩阵** | 4 大类技能条形图（质量管理、工业自动化、工具开发、软技能） |
| **项目案例** | 3 个精选项目卡片（8D 质量工具、ISO 知识库、成长自动化系统） |
| **联系方式** | 邮箱、GitHub、所在地、当前职位 |
| **页脚** | 版权信息、座右铭 |

## 🚀 部署

```bash
# 方法1：一键部署
./deploy.sh

# 方法2：手动推送
git remote add origin https://github.com/2689872077/personal-portfolio.git
git push -u origin main
```

## 📝 迭代记录

| Sprint | 日期 | 内容 |
| --- | --- | --- |
| SPRINT-001 | 2026-04-28 | MVP 静态页面搭建：5 大模块、响应式适配、滚动动画 |

## 📄 License

MIT © 2026 yu
