#!/bin/bash

# Ink 스토리 컴파일 스크립트
# Usage: ./compile.sh <game-name>

set -e

GAME_NAME=$1

if [ -z "$GAME_NAME" ]; then
    echo "❌ Usage: ./compile.sh <game-name>"
    echo "Example: ./compile.sh lost-cat"
    exit 1
fi

GAME_DIR="games/$GAME_NAME"
INK_FILE="$GAME_DIR/story.ink"
JSON_FILE="$GAME_DIR/story.json"
INKLECATE="./tools/inklecate"

# 게임 디렉토리 확인
if [ ! -d "$GAME_DIR" ]; then
    echo "❌ Game directory not found: $GAME_DIR"
    exit 1
fi

# .ink 파일 확인
if [ ! -f "$INK_FILE" ]; then
    echo "❌ Ink file not found: $INK_FILE"
    exit 1
fi

# inklecate 확인
if [ ! -f "$INKLECATE" ]; then
    echo "❌ inklecate not found!"
    echo "Run: ./setup-inklecate.sh"
    exit 1
fi

# 컴파일
echo "🔨 Compiling $GAME_NAME..."
$INKLECATE -o "$JSON_FILE" "$INK_FILE"

if [ $? -eq 0 ]; then
    echo "✅ $GAME_NAME compiled successfully!"
    echo "📄 Output: $JSON_FILE"
    
    # 파일 크기 표시
    FILE_SIZE=$(du -h "$JSON_FILE" | cut -f1)
    echo "📦 Size: $FILE_SIZE"
else
    echo "❌ Compilation failed!"
    exit 1
fi
