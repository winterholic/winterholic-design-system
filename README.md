# winterholic-design-system

winterholic 의 디자인 시스템 모음. 시스템 하나가 디렉터리 하나다.

| 디렉터리 | 용도 | 상태 |
|---|---|---|
| [`winterholic-base/`](winterholic-base/) | 기본. 개인 프로젝트 대부분이 쓰는 시스템 | v1.1.6 |
| [`stock-gosu/`](stock-gosu/) | 투자 대시보드 stock-gosu. 기존 FDS 를 옮기고 다크·대비·차트 색·금융 토큰을 보완 | v1.2.2 |
| [`memoir/`](memoir/) | 개인 메모·보안 관리 memoir. 기획서·design-guide·tailwind 통합, No-Line 종이 층, 다크 추가 | v1.3.0 |
| [`yeohaenggajya/`](yeohaenggajya/) | 여행가쟈(가챠 여행지 추천). 원본 `tokens.css` 값을 바꾸지 않고 옮긴 기록·참조본. 한지·단청·등급·연출 무대 | v1.0.0 |
| [`notting/`](notting/) | 개발자용 문서 워크스페이스 notting. Verdigris 주색, periwinkle = AI·근거 전용, 왕복 보고서·Context Pack·이슈·ADR 도메인 토큰, `prose.css` 문서 본문 | v1.0.0 |

새 시스템을 파생하는 법: [`winterholic-base/docs/13-governance.md`](winterholic-base/docs/13-governance.md) §6.

각 시스템은 `tokens/src`(단일 소스) → `node tokens/build.mjs` → `dist/`(CSS 변수·Tailwind 프리셋·JS·SCSS·Figma) 구조를 공유한다. 소비 프로젝트는 `dist/` 만 가져간다.
