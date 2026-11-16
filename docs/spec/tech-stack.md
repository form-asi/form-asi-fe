# 폼앗이 FE 기술 스택

> 확정일: 2026-11-16 · 작성: FE

## 1. 스택 요약

| 영역               | 선택                                        | 버전             |
| ------------------ | ------------------------------------------- | ---------------- |
| 프레임워크         | Next.js (App Router)                        | 16.4             |
| UI 런타임          | React                                       | 19.3             |
| 언어               | TypeScript                                  | 6.0.x (고정)     |
| 스타일             | Tailwind CSS                                | 4.3              |
| UI 컴포넌트        | shadcn/ui + cva                             | CLI 4.23         |
| 아이콘             | lucide-react                                | 1.73             |
| 서버 상태          | TanStack Query                              | 5.107            |
| API 코드 생성      | Orval (OpenAPI → 훅·타입)                   | 8.48             |
| 폼                 | React Hook Form + zod + @hookform/resolvers | 7.92 / 4.6 / 7.0 |
| 클라이언트 상태    | Zustand (필요한 곳만)                       | 5.1              |
| 날짜               | dayjs                                       | 1.11             |
| 린트               | ESLint (Flat Config)                        | 10.15            |
| 포맷 · import 정렬 | Biome (linter 비활성)                       | 2.6              |
| Git hook           | husky + lint-staged                         | 9.1 / 17.6       |
| E2E 테스트         | Playwright (핵심 흐름만)                    | 1.65             |
| 패키지 매니저      | Bun (설치·스크립트만, 런타임은 Node)        | 1.2+             |
| 웹 푸시            | Service Worker (Sprint 3에 결정)            | -                |

## 2. 주요 결정과 이유

### 스타일: Tailwind + shadcn/ui

- **emotion 제외:** 런타임 CSS-in-JS라 App Router의 서버 컴포넌트와 맞지 않음 (`'use client'` 강제, 별도 설정 필요)
- **Panda CSS 검토 후 제외:** 빌드 타임 방식이라 RSC 호환은 좋지만, 짝이 되는 Park UI의 컴포넌트와 생태계가 작아 공용 컴포넌트를 직접 만드는 비용이 큼
- **Tailwind + shadcn 선택 이유**
  - 모바일 필수 컴포넌트를 기본 제공: Drawer(바텀시트), Sonner(토스트), Dialog, Form(RHF + zod 연동)
  - 컴포넌트 코드를 프로젝트에 복사하는 방식이라 디자인 확정 후 자유롭게 수정 가능
  - Figma MCP와 AI 코드 생성이 Tailwind 기준이라 그대로 활용 가능
  - variant는 `cva`로 체계적으로 관리

### 린트와 포맷: ESLint + Biome 하이브리드

- **ESLint:** 코드 검사 전담. Next.js, TanStack Query 등 생태계 플러그인 활용
- **Biome:** 포맷과 import 정렬 전담. Prettier보다 빠르고 설정이 단순함
- 겹치는 기능은 한쪽에서 끔 (Biome linter off, ESLint 포맷 규칙 미사용)
- Tailwind 클래스 정렬은 `eslint-plugin-better-tailwindcss`가 담당 (Biome에서는 `prettier-plugin-tailwindcss`를 쓸 수 없음)

### TypeScript 6.0 고정

- TS 최신은 7.0이지만 `typescript-eslint`가 `<6.1`만 지원
- typescript-eslint가 TS 7을 지원하면 업그레이드

## 3. ESLint 구성

| 플러그인                         | 용도                                |
| -------------------------------- | ----------------------------------- |
| eslint-config-next               | Next.js 권장 규칙 + Core Web Vitals |
| typescript-eslint                | TypeScript 규칙                     |
| eslint-plugin-react-hooks        | Hooks 규칙                          |
| @tanstack/eslint-plugin-query    | Query 사용 규칙                     |
| eslint-plugin-better-tailwindcss | 클래스 정렬, 없는 클래스 감지       |

**자동 실행 시점**

- 파일 저장 (VS Code): Biome 포맷 + ESLint 자동 수정
- 커밋 전 (husky): lint-staged로 바뀐 파일 자동 수정(`biome check --write` + `eslint --fix`) → `bun run check`(Biome 검사 + ESLint + 타입 검사). 실패하면 커밋 중단

## 4. 폴더 구조

```
src/
├─ app/            # 라우트 (App Router)
├─ components/
│  ├─ ui/          # shadcn 원본. 토큰과 variant만 수정
│  ├─ common/      # 서비스 공용: AppHeader, TabBar, BottomSheet, ChipGroup, FormField
│  └─ domain/      # Figma C-xx 컴포넌트: HelpTimeBar(C-01), SurveyCard(C-02)
├─ features/       # 화면 단위: onboarding, explore, my-survey, mypage, notification
├─ api/            # Orval 생성 코드, fetch 설정
├─ hooks/          # 공용 훅
├─ lib/            # 유틸(cn), dayjs 설정
└─ providers/      # QueryProvider 등
# 디자인 토큰: src/app/globals.css (@theme)
```

## 5. 공용 컴포넌트 규칙

1. 색상과 간격은 토큰으로만 사용한다. hex 값을 코드에 직접 쓰지 않는다.
2. 두 화면 이상에서 쓰는 UI는 `common` 또는 `domain`으로 옮긴다.
3. `ui/`의 shadcn 컴포넌트에는 비즈니스 로직을 넣지 않는다.
4. 컴포넌트 이름은 Figma 화면 ID(S-xx, M-xx, C-xx)와 맞춰 디자인과 코드를 쉽게 찾게 한다.

## 6. 백엔드 협업 전제

- 백엔드가 OpenAPI(Swagger) 명세를 제공하면 Orval로 API 훅과 타입을 생성한다.
- 명세가 나오기 전에는 Orval의 mock(MSW) 생성 기능이나 임시 타입으로 먼저 작업한다.
