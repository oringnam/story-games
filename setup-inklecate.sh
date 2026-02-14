#!/bin/bash

# inklecate 설치 스크립트 (macOS)

set -e

INKLECATE_VERSION="1.2.0"
DOWNLOAD_URL="https://github.com/inkle/ink/releases/download/v.${INKLECATE_VERSION}/inklecate_mac.zip"
TMP_DIR="/tmp/inklecate-setup"
TOOLS_DIR="./tools"

echo "🔧 Setting up inklecate..."

# 임시 디렉토리 생성
mkdir -p "$TMP_DIR"
mkdir -p "$TOOLS_DIR"

# 다운로드
echo "📥 Downloading inklecate v${INKLECATE_VERSION}..."
curl -L "$DOWNLOAD_URL" -o "$TMP_DIR/inklecate.zip"

# 압축 해제
echo "📦 Extracting..."
unzip -o "$TMP_DIR/inklecate.zip" -d "$TMP_DIR"

# 실행 파일 복사
if [ -f "$TMP_DIR/inklecate" ]; then
    cp "$TMP_DIR/inklecate" "$TOOLS_DIR/inklecate"
    chmod +x "$TOOLS_DIR/inklecate"
    echo "✅ inklecate installed successfully!"
    
    # 버전 확인
    echo ""
    echo "📋 Version info:"
    "$TOOLS_DIR/inklecate" --version || echo "inklecate ready to use"
else
    echo "❌ Failed to find inklecate binary"
    exit 1
fi

# 정리
rm -rf "$TMP_DIR"

echo ""
echo "✅ Setup complete!"
echo "Usage: ./compile.sh <game-name>"
