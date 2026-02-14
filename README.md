# Story Games

모바일 우선 분기형 스토리 게임 컬렉션.

## 🎯 목표

선택지에 따라 엔딩이 달라지는 인터랙티브 스토리 게임 제작.

## 🎮 게임 목록

### 프로토타입
- **숲의 선택** - 첫 번째 프로토타입 (3~5 씬, 2~3 엔딩)

## 🛠️ 기술 스택

- Vanilla JavaScript (No frameworks)
- Mobile-first design
- Touch-optimized
- GitHub Pages

## 📦 구조

```
story-games/
├── games/
│   └── forest-choice/      # 프로토타입: 숲의 선택
│       ├── index.html
│       ├── game.js
│       ├── story.json      # 스토리 데이터
│       └── style.css
├── common/                 # 공통 모듈
│   ├── story-engine.js    # 스토리 분기 엔진
│   ├── save-system.js     # 세이브/로드
│   └── ui-components.js   # UI 컴포넌트
├── assets/                # 공통 에셋
│   ├── sounds/
│   └── images/
└── index.html            # 메인 페이지 (게임 목록)
```

## 🚀 시작하기

```bash
# 로컬 서버 실행
python3 -m http.server 8000
# 또는
npx serve
```

## 📱 모바일 우선

- 세로 화면 최적화
- 터치 제스처 지원
- 반응형 디자인
- 부드러운 애니메이션

## 🎨 디자인

- Glassmorphism (반투명 유리 효과)
- 다크 모드 우선
- 이모지 활용
- 부드러운 전환 효과

---

**작업 시작**: 2026-02-14
