# yu个人作品集网站

> **VBC-005** — 工业数字化、AI 工具与 AI x 心理写作个人品牌展示站，整合职场回复器 PWA，并部署到 arayucofe.com.cn。

## 🌐 访问地址

- **主站**: [https://arayucofe.com.cn/](https://arayucofe.com.cn/)
- **职场回复器 PWA**: [https://arayucofe.com.cn/workplace-reply-pwa/](https://arayucofe.com.cn/workplace-reply-pwa/)
- **仓库**: [https://github.com/Treenomad/Personal-portfolio](https://github.com/Treenomad/Personal-portfolio)

## 📁 项目结构

```
VBC003-personal-portfolio/
├── index.html              # 主页面（单页应用）
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
| **Hero** | 个人 Slogan、写作方向 CTA、项目入口、统计数据 |
| **关于** | 脱敏个人简介、核心领域卡片（工业系统、ISO 9001, 8D/SPC/FMEA, AI x 心理写作） |
| **技能矩阵** | 4 大类技能条形图（质量管理、工业自动化、AI 工具开发、软技能） |
| **公开写作** | AI x 心理主题定位、内容边界、日志到文章的生产流程 |
| **项目案例** | 2 个精选项目卡片（8D 质量工具、职场回复器 PWA） |
| **职场回复器** | MiniMax 智能生成、本地模板兜底、PWA 离线访问、发送评分 |
| **联系方式** | 邮箱、GitHub、所在地、当前方向 |
| **页脚** | 版权信息、座右铭 |

> 面向具体公司的定制 HTML 不进入主站导航，也不提交到公开仓库；后续仅在明确指示时，以独立子域或私有随机路径发布。

## 🚀 部署

```bash
# 一键部署到 arayucofe.com.cn 服务器
./deploy.sh
```

## 📝 迭代记录

| Sprint | 日期 | 内容 |
| --- | --- | --- |
| SPRINT-005 | 2026-07-07 | 移除公开简历页与主页简历入口，主站回归个人品牌展示；定制投递页后续按公司单独发布 |
| SPRINT-004 | 2026-07-06 | 同步个人网站定位：新增 AI x 心理写作版块，更新首屏、SEO、项目描述与 README |
| SPRINT-003 | 2026-06-18 | 公开页面脱敏：移除具体公司与岗位绑定，强化工业数字化、质量系统与 AI coding 工具能力表达 |
| SPRINT-002 | 2026-06-06 | 合并个人主站与职场回复器 PWA，部署到 arayucofe.com.cn |
| SPRINT-001 | 2026-04-28 | MVP 静态页面搭建：5 大模块、响应式适配、滚动动画 |

## 📄 License

MIT © 2026 yu
