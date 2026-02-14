#!/bin/bash

# 배포 스크립트
# 스토리 컴파일 + Git push

set -e

GAME_NAME=$1
COMMIT_MSG="${2:-Update $GAME_NAME story}"

if [ -z "$GAME_NAME" ]; then
    echo "❌ Usage: ./deploy.sh <game-name> [commit-message]"
    echo "Example: ./deploy.sh lost-cat \"Add new ending\""
    exit 1
fi

# 컴파일
echo "📝 Step 1/3: Compiling story..."
./compile.sh "$GAME_NAME"

# Git 커밋
echo "📦 Step 2/3: Committing changes..."
git add -A
git commit -m "$COMMIT_MSG" || echo "⚠️  No changes to commit"

# Git 푸시
echo "🚀 Step 3/3: Pushing to GitHub..."
git push

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live URL: https://oringnam.github.io/story-games/"
echo "📱 Test on mobile: https://oringnam.github.io/story-games/games/$GAME_NAME/"
