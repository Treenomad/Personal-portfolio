#!/usr/bin/env bash
# ============================================================
# deploy.sh — yu personal-portfolio 一键部署脚本
# 将项目推送到 GitHub Pages
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/Treenomad/Personal-portfolio.git"
BRANCH="main"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 开始部署个人作品集网站..."
echo ""

# 检查是否在项目根目录
if [ ! -f "$SCRIPT_DIR/index.html" ]; then
  echo "❌ 错误：请在项目根目录执行此脚本（需要找到 index.html）"
  exit 1
fi

cd "$SCRIPT_DIR"

# 初始化 git（如果尚未初始化）
if [ ! -d ".git" ]; then
  echo "📦 初始化 Git 仓库..."
  git init
  git checkout -b "$BRANCH"
else
  echo "✅ Git 仓库已存在"
  git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH"
fi

# 检查远程仓库
if ! git remote get-url origin &>/dev/null; then
  echo "🔗 添加远程仓库..."
  git remote add origin "$REPO_URL"
else
  echo "✅ 远程仓库已配置"
fi

# 添加所有文件并提交
echo "📝 提交文件..."
git add -A
if git diff --cached --quiet; then
  echo "ℹ️  没有新变更需要提交"
else
  git commit -m "VB-002 SPRINT-001: MVP 静态页面初始版本

- 完整的单页作品集（Hero / 关于 / 技能 / 项目 / 联系）
- 响应式 CSS 适配 PC/平板/手机
- 深色主题 + 滚动动画
- 移动端汉堡菜单"

  # 推送到 GitHub
  echo "📤 推送到 GitHub..."
  git push -u origin "$BRANCH" || {
    echo ""
    echo "⚠️  自动推送失败。请手动运行："
    echo "   git push -u origin $BRANCH"
    echo ""
    echo "   或使用令牌认证："
    echo "   git push https://YOUR_TOKEN@github.com/Treenomad/Personal-portfolio.git $BRANCH"
    exit 1
  }
fi

echo ""
echo "✅ 部署完成！"
echo "🌐 访问地址: https://treenomad.github.io/Personal-portfolio/"
echo ""
echo "💡 提示: GitHub Pages 部署需要 1-2 分钟生效"
echo "   如果看到 404，请稍等片刻后刷新"
