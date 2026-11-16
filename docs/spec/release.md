# 버전 관리와 릴리스

## 버전 규칙

- SemVer `vMAJOR.MINOR.PATCH` 형식의 Git 태그로 관리한다.
- 출시 전은 `0.x`, 출시(2026-12-31) 시점에 `v1.0.0`을 만든다.
- 버전은 커밋 type으로 자동 계산된다. 그래서 커밋 메시지 규칙([git-convention.md](./git-convention.md))을 반드시 지킨다.

| 커밋                                         | 출시 전 (`0.x`)           | 출시 후 (`1.x` 이상) |
| -------------------------------------------- | ------------------------- | -------------------- |
| `fix`                                        | patch (`0.1.0` → `0.1.1`) | patch                |
| `feat`                                       | minor (`0.1.0` → `0.2.0`) | minor                |
| `feat!` / `BREAKING CHANGE`                  | minor                     | major                |
| `refactor`, `docs`, `style`, `test`, `chore` | 변경 없음                 | 변경 없음            |

## 릴리스 흐름

release-please(GitHub Action)가 버전, CHANGELOG, 태그, GitHub Release를 자동으로 만든다.

```
feature/* ─squash PR→ develop ─merge PR→ main ─→ Release PR 자동 생성 ─머지→ vX.Y.Z 태그 + GitHub Release
```

1. 작업 브랜치를 `develop`에 squash 머지한다. **PR 제목이 커밋 메시지가 되므로 PR 제목도 `feat: ...` 형식으로 쓴다.**
2. 배포할 때 `develop` → `main` PR을 merge commit으로 머지한다. (squash하면 개별 `feat`/`fix` 기록이 사라져 CHANGELOG가 비게 된다.)
3. release-please가 `main`에 Release PR(`chore(main): release X.Y.Z`)을 연다. 이 PR에는 다음이 들어 있다.
   - `package.json`의 `version` 갱신
   - `.release-please-manifest.json` 갱신
   - `CHANGELOG.md` 추가 (`feat`, `fix`, `refactor`만 노출)
4. Release PR 내용을 확인하고 머지하면 `vX.Y.Z` 태그와 GitHub Release가 생성된다.
5. 운영 배포는 이 태그를 기준으로 한다. (배포 파이프라인은 인프라 확정 후 연결)

- 다음 배포까지 `main`에 커밋이 더 쌓이면 release-please가 기존 Release PR을 자동으로 갱신한다.
- 릴리스 후 `main`의 버전 변경 커밋을 `develop`에 반영한다: `develop` 브랜치에서 `git merge main`

## 긴급 수정 (hotfix)

1. `main`에서 `hotfix/<설명>` 브랜치를 만든다.
2. `fix: ...` 커밋 후 `main`으로 PR을 머지한다.
3. Release PR이 patch 버전으로 생성되면 머지해서 배포한다.
4. `main`을 `develop`에 반영한다.

## 하지 말 것

- 태그를 직접 만들거나 지우지 않는다.
- `package.json`의 `version`, `CHANGELOG.md`, `.release-please-manifest.json`을 직접 고치지 않는다.
- `develop` → `main` PR을 squash로 머지하지 않는다.

## 관련 파일과 설정

| 항목                | 위치                                                         |
| ------------------- | ------------------------------------------------------------ |
| 워크플로            | `.github/workflows/release-please.yml` (`main` push 시 실행) |
| release-please 설정 | `release-please-config.json`                                 |
| 현재 버전           | `.release-please-manifest.json`                              |
| 커밋 메시지 검사    | `commitlint.config.ts`, `.husky/commit-msg`                  |

**GitHub 설정 (필수)**

- Organization과 레포의 Settings → Actions → General → Workflow permissions에서 "Allow GitHub Actions to create and approve pull requests"를 허용해야 Release PR이 생성된다.

**제약**

- 기본 `GITHUB_TOKEN`으로 만든 Release PR에서는 다른 워크플로(CI 등)가 실행되지 않는다. Release PR에도 CI가 필요해지면 PAT나 GitHub App 토큰으로 바꾼다.
- 머지 방식(develop은 squash, main은 merge commit)은 브랜치 규칙으로 강제하지 않으므로 팀 약속으로 지킨다.
