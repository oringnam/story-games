#!/bin/bash
# Story Games 레포 설정 스크립트

set -e  # 에러 시 중단

echo "🎮 Story Games 레포 설정 시작..."

# Git 초기화
echo "📦 Git 초기화..."
git init

# 첫 커밋
echo "💾 첫 커밋..."
git add -A
git commit -m "Initial commit: Story Games prototype with Forest Choice"

# GitHub 레포 생성 및 푸시
echo "🚀 GitHub 레포 생성..."
gh repo create story-games --public --source=. --remote=origin --push

# GitHub Pages 활성화
echo "📄 GitHub Pages 활성화..."
gh repo edit --enable-pages --pages-branch main --pages-path /

echo "✅ 완료!"
echo ""
echo "🌐 배포 URL: https://$(gh api user --jq .login).github.io/story-games/"
echo "📂 레포 URL: https://github.com/$(gh api user --jq .login)/story-games"
