# Git 컨벤션

## 브랜치

| 브랜치      | 역할                                          | 머지 대상                         |
| ----------- | --------------------------------------------- | --------------------------------- |
| `main`      | 운영(prd) 배포 기준. 직접 커밋 금지           | -                                 |
| `develop`   | 개발 통합·개발 서버 배포 기준. 직접 커밋 금지 | `main` (릴리스 PR)                |
| 작업 브랜치 | `develop`에서 분기                            | `develop` (PR)                    |
| `hotfix/*`  | 운영 긴급 수정. `main`에서 분기               | `main` 머지 후 `develop`에도 반영 |

```
feature/* ─PR→ develop ─릴리스 PR→ main
hotfix/*  ─PR→ main → develop 반영
```

- 이름: `<type>/<기능-설명>` (kebab-case, 영문)

| type       | 용도                        | 예시                                             |
| ---------- | --------------------------- | ------------------------------------------------ |
| `feature`  | 새 기능, 화면               | `feature/kakao-login`, `feature/survey-register` |
| `fix`      | 버그 수정                   | `fix/nickname-duplicate-check`                   |
| `refactor` | 동작 변화 없는 구조 개선    | `refactor/survey-card`                           |
| `chore`    | 설정, 의존성, 빌드          | `chore/eslint-config`                            |
| `docs`     | 문서                        | `docs/domain-help-time`                          |
| `hotfix`   | 운영 긴급 수정              | `hotfix/login-redirect`                          |
| `design`   | 디자이너가 직접 올리는 변경 | `design/tokens`                                  |

- 화면 단위 작업이면 화면 ID를 붙여도 된다: `feature/s-32-survey-register`

### 브랜치 보호 규칙 (GitHub Rulesets)

`main`, `develop` 공통

- 브랜치 삭제 금지
- PR로만 병합 (직접 push 금지)
- force push 금지

> Organization이 GitHub Free 요금제인 동안은 private 레포에서 규칙이 **설정만 되고 강제되지 않는다.** GitHub Team으로 업그레이드하면 바로 적용된다. 그 전까지는 위 규칙을 팀 약속으로 지킨다.

## 커밋 메시지

```
<type>: <요약>

<본문 (선택): 무엇을, 왜>
```

| type       | 용도                                 |
| ---------- | ------------------------------------ |
| `feat`     | 새 기능                              |
| `fix`      | 버그 수정                            |
| `refactor` | 동작 변화 없는 코드 개선             |
| `style`    | 포맷, 세미콜론 등 동작과 무관한 변경 |
| `docs`     | 문서                                 |
| `test`     | 테스트 추가·수정                     |
| `chore`    | 설정, 의존성, 빌드, 기타             |

- 요약은 한국어로, 50자 이내, 마침표 없이 쓴다.
- 커밋 하나에는 하나의 기능·목적만 담는다.
- 예시
  - `feat: 카카오 로그인 연동`
  - `fix: 닉네임 중복 확인 시 대소문자 구분 오류 수정`
  - `refactor: 설문 카드 컴포넌트 분리`
  - `chore: Orval 설정 추가`

- 커밋 메시지는 husky `commit-msg` hook에서 commitlint로 검사한다. 허용되지 않은 type이나 형식이면 커밋이 중단된다.
- 커밋 범위 표기(scope)는 선택이다: `feat(explore): 시간 필터 추가`

## 버전과 릴리스

SemVer Git 태그와 release-please로 관리한다. 절차와 규칙은 [release.md](./release.md) 참고.

## 커밋 전 검사

husky pre-commit에서 lint-staged(자동 수정) → `bun run check`를 실행하고, 실패하면 커밋이 중단된다.
