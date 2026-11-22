<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 폼앗이 (formasi) FE

Users answer surveys to earn "help time" and spend it to collect responses for their own surveys. Mobile web first.

## Before you start

- Read `docs/README.md` for where documents live.
- Check `docs/domain/` for business rules before implementing or changing domain logic. If a rule is missing or conflicts with the request, ask instead of guessing.
- Check `docs/plan/` for the current implementation plan, and `docs/spec/tech-stack.md` for the stack and folder structure.
- Screen IDs (`S-xx` screens, `M-xx` modals/sheets, `C-xx` common components, `A-xx` admin) follow the Figma wireframe. Use them when naming and referencing UI.

## Commands

- Package manager and script runner: `bun` (runtime is Node). Do not use npm, pnpm, or yarn.
- `bun run dev` / `bun run build`
- `bun run check`: Biome format check + ESLint + typecheck. Run it before reporting completion.
- `bun run format`: Biome format + import sorting
- `bun run api:gen`: regenerate the API client with Orval. Never edit `src/api/generated/` by hand.
- `bunx shadcn add <component>`: add shadcn components into `src/components/ui/`

## Project structure

- `src/app/`: routes only. Keep pages thin and compose from `features/`.
- `src/features/<feature>/`: screen-level UI, hooks, and logic per feature (`onboarding`, `explore`, `my-survey`, `my-page`, `notification`, `admin`).
  - Inside a feature, reuse the `src/` folder names: the root holds the top-level component, zod schema, options, and messages; then `components/` (including step components), `hooks/`, `lib/` (pure domain rules and helpers), and `mocks/` (temporary API stand-ins until Orval hooks exist).
  - Do not add `model/`, `api/`, or `steps/` folders, and do not use a `Screen` suffix in names.
- `src/components/ui/`: shadcn primitives. Only adjust tokens and variants; no business logic.
- `src/components/common/`: service-wide UI compositions (AppHeader, TabBar, BottomSheet, FormField).
- `src/components/domain/`: domain UI shared across features (HelpTimeBar `C-01`, SurveyCard `C-02`). Keep it flat: a component group gets one folder with its files side by side, without the `components/`·`hooks/`·`lib/` split used in features.
- `src/api/`: Orval output and `fetcher.ts`.
- `src/lib/`, `src/hooks/`, `src/providers/`: shared utilities, hooks, and providers.
- Design tokens live in `src/app/globals.css` (`@theme`). Never hardcode colors or spacing values.

## Repository instructions

- Prefer declarative code.
- If JSX inside a `return` grows beyond easy local readability, extract it into clearly named sections or components.
- Follow SOLID principles by default for shared logic, domain logic, state handling, and reusable modules.
- If a SOLID-compliant design is not practical, explain the tradeoff, why the exception is necessary, and get approval before proceeding.

## Implementation quality

- Apply these principles while implementing, not only during review: keep each function, component, and module focused on one responsibility, and separate roles where they change for different reasons.
- Keep domain validation, API/session coordination, and UI rendering responsibilities clear. Avoid splitting code into abstractions that do not clarify those responsibilities.
- Name functions and conditions after the domain action or decision they express. Extract complex or repeated conditions into meaningful local variables or helpers instead of nesting logic in ternaries or immediately invoked functions.
- Avoid non-null assertions (`!`). Narrow validated local values with guards and handle missing or invalid responses explicitly.
- Before reporting completion, check the changed flow for responsibility boundaries, ambiguous names, nested logic, and unsafe assertions, and run `bun run check` plus directly related tests.

## Naming

- Use names that reveal domain meaning immediately (e.g. `helpTimeBalance`, `responseSlot`, `targetRespondentCount`).
- Avoid generic names such as `onChange`, `data`, `item`, and `value` when a more specific name is possible.
- Event handlers must describe the domain action they perform (e.g. `handleStartSurvey`, `handleSubmitCompletionProof`).
- Keep backend values as the source of truth and use frontend mapping only for display labels.
- Do not mirror server field names into local variable names when a more explicit UI- or domain-specific name is clearer.

## Shared code

- Reuse existing shared hooks, utilities, constants, and common components when they fit the task.
- Keep shared user-facing messages (toasts, errors) in one place and reuse them instead of duplicating strings.
- Use `ROUTES` from `src/lib/routes.ts` for every `href`, `router.push`, and `router.replace`. Never hardcode route paths; add new screens to `ROUTES` first.
- Before modifying shared or widely reused code, report the affected scope, expected side effects, and potential risks, then get approval before proceeding.
- Treat `src/components/ui`, `src/components/common`, `src/components/domain`, `src/lib`, `src/hooks`, `src/providers`, `src/api/fetcher.ts`, and `src/app/globals.css` as shared code.

## Domain structure

- Keep domain-specific logic under the relevant `src/features/<feature>` folder instead of creating new top-level groups too early.
- Promote code to `src/components/domain` or `src/lib` only when two or more features actually use it.
- Help-time balances, slot validity, target matching, and daily caps are decided by the server. The frontend displays them and must not re-implement the decision logic.

## Declarative Programming

- Prefer expressing WHAT over HOW.
- Avoid sequential logic that mutates state step by step.
- Break logic into named transformations that reflect domain meaning.
- Model UI/async state using discriminated unions instead of multiple booleans.
- Prevent impossible states at the type level.
- Derive state instead of syncing it via effects.

## TypeScript style

- Encapsulate related state and behavior in factory functions that return a cohesive object or `as const` tuple, instead of scattering related helpers or reaching for classes.
- Prefer `type` aliases for object shapes, and model a set of related actions or events as a single discriminated union rather than several loose types.
- Wrap primitive domain identifiers in named type aliases (e.g. `type SurveyId = number`) instead of repeating bare `string`/`number`.
- Use inline type-only imports (`import { type Foo } from '...'`) for symbols that are used only as types.
- Keep reducers and transformations pure: block-scope each `switch` case, return early for no-op cases, and update state immutably with spreads instead of mutation.
- Use `as const` for literal tuples and key lists, and `satisfies` to validate object shapes without widening their types.
- Give generic type parameters descriptive names that reveal their role (e.g. `EventHandlers`, `Key extends keyof Events`) rather than single letters.
- Guard browser-only APIs behind environment checks so shared code stays SSR-safe.

## Forms and data fetching

- Use React Hook Form + zod for forms. Define the zod schema next to the form and derive types with `z.infer`.
- Use Orval-generated TanStack Query hooks for server state. Do not copy server state into Zustand or local state.
- Use Zustand only for client state that must outlive a component tree (e.g. the multi-step survey registration draft).

## Comments

- Write comments that explain intent, tradeoffs, or non-obvious constraints, not what the code literally does.
- Use JSDoc (`@description`, `@param`, `@returns`, `@example`) for shared or non-obvious public APIs, and state the reason when disabling a lint rule.

## React and Next.js rules

- Default to Server Components. Add `'use client'` only at the smallest component that needs interactivity or browser APIs.
- Derive computable state during render instead of storing it in state or syncing it with effects.
- Use effects only for external system synchronization.
- Put interaction-triggered logic in event handlers, not in effects.
- Avoid unnecessary `useMemo` or `useCallback`, especially for simple primitive expressions.
- Do not define components inside other components.
- Prefer parallel async execution for independent work and avoid request waterfalls.
- Pass only the minimum required data across server/client boundaries.

## Review guidelines

- Prioritize regressions, missing tests, risky behavior changes, and user-facing error handling gaps over style-only feedback.
- Use comment prefixes with the following severity levels:
  - `P1`: Must fix. Use for regressions, vulnerabilities, broken behavior, data loss risk, auth/security issues, or other change-request level problems.
  - `P2`: Strongly recommended. Use for meaningful maintainability, correctness, or test coverage concerns that should be actively considered.
  - `P3`: Minor suggestion. Use for optional cleanup, small refinements, or alternative approaches.
- Flag naming that hides domain intent, especially generic names such as `onChange`, `data`, `item`, or ambiguous `value` variables.
- Flag state synchronization issues, unnecessary effects, duplicated source-of-truth state, and backend/frontend value drift.
- Flag changes to shared code (see "Shared code") as high-risk review items.
- For React and Next.js changes, check server/client boundaries, hydration risks, unnecessary rerenders, request waterfalls, and bundle size risks.
- When a change bypasses SOLID-oriented design for shared logic or reusable modules, require a clear justification and explicit approval.

## Pull requests

- Follow `docs/spec/git-convention.md`: branch from `develop` and open PRs into `develop` (`main` is production; never commit to `main` or `develop` directly). Branches `<type>/<kebab-description>` (`feature`, `fix`, `refactor`, `chore`, `docs`, `hotfix`), commits `<type>: <Korean summary>` (`feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`). commitlint enforces this at commit-msg. Versions and tags are managed by release-please (see `docs/spec/release.md`); never bump `package.json` version or create tags manually.
- Hosted on GitHub. The husky pre-commit hook auto-fixes staged files (lint-staged), then runs `bun run check`; a failing check blocks the commit.
- When work changes shared or high-impact code, describe the affected scope and expected side effects in the PR description.
- Reference related screen IDs and `docs/` files in the PR description.
- If a rule is review-only and cannot be enforced automatically, still surface it in the PR summary or review notes.
