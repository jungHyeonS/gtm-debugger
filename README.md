# GTM Debugger

Google Tag Manager (GTM)의 dataLayer 이벤트를 실시간으로 모니터링하고 디버깅할 수 있는 Chrome Extension입니다.

## 🎯 목적

### 주요 목적
- **사내망 환경에서의 GTM 디버깅**: 회사 내부 네트워크 같은 GTM 미리보기나 GA 디버거가 제대로 작동하지 않는 환경에서 GTM/GA 이벤트를 디버깅하기 위해 개발되었습니다.

### 해결하는 문제들
- **GTM 미리보기 제한**: 사내망이나 보안 정책으로 인해 GTM 미리보기 기능 사용 불가
- **실시간 이벤트 추적**: 개발/테스트 환경에서 dataLayer 이벤트를 실시간으로 확인
- **페이지별 이벤트 관리**: URL별로 이벤트를 그룹화하여 체계적인 디버깅



## 🚀 주요 기능

- **실시간 dataLayer 모니터링**: 웹페이지의 dataLayer 이벤트를 실시간으로 캡처
- **페이지별 이벤트 그룹핑**: URL별로 dataLayer 이벤트를 자동으로 그룹화
- **Arguments 객체 지원**: GTM의 Arguments 객체를 포함한 모든 이벤트 타입 지원
- **간편한 리셋 기능**: 한 번의 클릭으로 모든 이벤트 데이터 초기화
- **모던 UI**: Tailwind CSS를 활용한 깔끔하고 반응형 인터페이스

## 📦 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 7
- **Chrome Extension**: @crxjs/vite-plugin 2.0.3
- **Package Manager**: pnpm



## 📁 프로젝트 구조

```
gtm-debugger/
├── src/
│   ├── components/          # React 컴포넌트
│   │   └── EventList.tsx   # 이벤트 목록 컴포넌트
│   ├── background/          # Background Script
│   │   └── background.ts   # 이벤트 처리 및 저장 로직
│   ├── content-script/      # Content Script
│   │   ├── content.ts      # 페이지와 통신
│   │   └── inject.js       # dataLayer 훅 스크립트
│   ├── types/              # TypeScript 타입 정의
│   │   └── event.ts        # GTM 이벤트 타입
│   ├── utils/              # 유틸리티 함수
│   ├── App.tsx             # 메인 React 앱
│   └── main.tsx            # 앱 진입점
├── public/
│   ├── manifest.json       # Chrome Extension 매니페스트
│   └── inject.js           # dataLayer 훅 스크립트 (복사본)
├── dist/                   # 빌드 결과물
├── vite.config.ts          # Vite 설정
└── package.json
```

## 🔍 주요 기능 설명

### dataLayer 훅 (inject.js)

- `window.dataLayer.push` 메서드를 오버라이드하여 모든 이벤트 캡처
- Arguments 객체를 포함한 모든 이벤트 타입 지원
- 기존 dataLayer 이벤트도 초기 로드 시 캡처

### 이벤트 저장 (background.ts)

- Chrome Storage API를 사용하여 이벤트 데이터 영구 저장
- 페이지별로 이벤트 그룹화 (URL 기반)
- 동시성 이슈 방지를 위한 메모리 캐시 활용

### UI 컴포넌트 (App.tsx, EventList.tsx)

- 실시간 이벤트 목록 표시
- 페이지별 이벤트 그룹핑
- 원클릭 리셋 기능
- 반응형 디자인



