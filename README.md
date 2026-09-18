# winterholic-design-system

winterholic 의 디자인 시스템 모음. 시스템 하나가 디렉터리 하나다.

| 디렉터리 | 용도 | 상태 |
|---|---|---|
| [`winterholic-base/`](winterholic-base/) | 기본. 개인 프로젝트 대부분이 쓰는 시스템 | v1.1.4 |

새 시스템을 파생하는 법: [`winterholic-base/docs/13-governance.md`](winterholic-base/docs/13-governance.md) §6.

각 시스템은 `tokens/src`(단일 소스) → `node tokens/build.mjs` → `dist/`(CSS 변수·Tailwind 프리셋·JS·SCSS·Figma) 구조를 공유한다. 소비 프로젝트는 `dist/` 만 가져간다.
