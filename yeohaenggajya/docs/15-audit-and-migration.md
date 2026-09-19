# 15 · 원본 디자인 시스템 점검 (여행가쟈) — 이관이 아니라 기록

원본은 이미 잘 정리된 디자인 시스템을 갖고 있다(`tokens.css` 84줄 · `.claude/skills/design-system` SKILL + references 5편 · Bright Line 11). 이 저장소는 그것을 **바꾸지 않고** winterholic 형식으로 옮겼다. 아래는 옮기면서 확인한 것과, 원본이 이미 알고 있는 부채, 그리고 이 저장소가 더한 것. 2026-09-19 기준.

## 1. 원본이 이미 잘 하고 있는 것
- 토큰 단일 출처(`tokens.css`) + 컴포넌트는 `var()` 만 + 새 값은 토큰 먼저(규칙 1).
- Bright Line 11 개가 헌법이고 스킬이 시행세칙 — 우선순위(접근성 > 등급·카피 > 색)까지 정의.
- 서체 7종 역할 고정, 등급 풀네임, 해요체+가챠 어휘, 다크패턴 금지 5종.
- 레이아웃 기둥 `--w-*` 4종으로 40종 흩어진 max-width 를 정리(2026-08-15 실측).
- 한국어 줄바꿈 `:where()` 전역, 한지 스크롤바, 9-slice 필터 바 규칙 등 **사고에서 배운 규칙이 주석으로 남아 있다.**
- reduced-motion 전역 가드, Storybook a11y, jsx-a11y lint.
- 부채 트래커·에스컬레이션 표·partial success 규약.

## 2. 옮기면서 확인한 것 (원본 수정 없음)

| # | 확인 | 근거 | 이 저장소의 처리 |
|---|---|---|---|
| 1 | `--ink-3` 실제 값 #735F47 은 한지 위 **5.17:1 통과** | 스킬 `tokens.md` 는 #7c6b53(4.37) 로 적혀 있어 "미달"로 안내 | 코드 값 기준으로 기록. 원본 `tokens.md` 한 줄 정정 권장(값·대비) |
| 2 | `--ink-4` #A89479 는 2.49:1 미달, 21곳 사용 | 원본 부채 트래커 | `text.decorative` 로 격리, 글자 금지. 값은 안 바꿈(오너 결정 사항) |
| 3 | 노랑·금·jade·persimmon 글자 대비 미달(1.4~3.5) | 실측 | `text.success/warning`·`rarity.legend.text` 를 "글자 단독 금지" 로 못박음. 무대에서만 금 글자 |
| 4 | 버튼 gap 6·패딩 10/18 이 4 그리드 밖 | `button.module.css` | 컴포넌트 토큰으로 잠금(예외 명시) |
| 5 | 그림자 값이 `rgb(… / %)` 표기 | `tokens.css` | DTCG 복합 토큰으로 변환. 별칭 대조에서 표기 차이만(값 동일) |
| 6 | 다크 모드 없음 | 의도(Bright Line 2) | 시스템 다크 만들지 않음. 연출 무대를 `data-tone="dark"` 스코프로 토큰화 |
| 7 | 등급 키 `legend` vs 라벨 `Legendary` | 코드 | 키 유지, 라벨 풀네임 |
| 8 | `--r-moment` 존재(스킬 문서엔 없음) | `tokens.css` 주석 | 6번째 등급 moment 로 기록 |
| 9 | Toast 미구현, Sheet 규격 산재(PlaceSheet·FloatingFinder) | 원본 부채 | 06 §22·§25 규격 정의(구현되면 실측 갱신) |
| 10 | `body` 기본 서체가 Pretendard 인데 본문 규칙은 Batang | `base.css` vs Bright Line 7 | `.yg-body` 로 명시. 시스템 문구는 Pretendard 가 맞으므로 충돌 아님 |
| 11 | 컴포넌트 크기가 module.css 에만 있고 카탈로그 없음 | | `component.json` 30종 실측 |
| 12 | 상황별 "막혔을 때" 표가 규칙 충돌 중심 | SKILL.md | 16 상황 사전으로 시각 상황 120여 개 추가 |
| 13 | 메타 색(themeColor·manifest)이 hex 복제 | 원본 `tokens.md §13` | 14 §4 에 재기록 |
| 14 | 로고 SVG 그라데이션은 토큰 밖 | 원본 규약 | 그대로 |

## 3. 이 저장소가 더한 것 (원본에 되가져갈 수 있는 후보)
- 시맨틱 이름 층(`surface.canvas` `text.tertiary` `rarity.<r>.accent`…) — 원본은 원시 이름(`--hanji-bright`)을 직접 쓴다. 되가져갈 필요는 없다(원본 규모에선 원시 이름이 더 읽힌다).
- `component.json` 실측 카탈로그 — 원본 `references/components.md` 에 수치 표로 붙이면 유용.
- 무대 스코프 `[data-tone="dark"]` 토큰 — 원본은 `tone="dark"` 클래스로 개별 처리. 통합하면 연출 화면 색 관리가 쉬워진다.
- 대비 실측표(01 §2)와 "글자 단독 금지" 목록 — 원본 `tokens.md §3` 갱신 후보.
- 16 상황 사전.

## 4. 원본에 반영을 권하는 한 줄 (선택)
1. `references/tokens.md §3`: `--ink-3` 값을 `#735f47`(5.17:1 통과)로 정정.
2. `tokens.md §4`: jade·persimmon·gold·yellow "글자 단독 금지" 명시.
3. `components.md` 인벤토리에 크기 표(06) 링크.
이 세 줄 외에는 원본을 건드릴 이유가 없다.

## 5. 재현
```bash
# 값 대조(73개 변수)
cd C:/mydevelop/winterholic-design-system/yeohaenggajya && node -e "…README §검증 스크립트…"
# 대비
node -e "import('../winterholic-base/tokens/scripts/ramp.mjs').then(m=>console.log(m.contrast('#735f47','#f4ecda'), m.contrast('#a89479','#f4ecda')))"   # 5.17 2.49
```
