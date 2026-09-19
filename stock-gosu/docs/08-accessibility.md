# 08 · 접근성 (stock-gosu)

목표 WCAG 2.2 AA. 토큰과 컴포넌트 규격에 이미 심어 두었으니 시스템대로 쓰면 대부분 통과한다. 아래는 코드에서 직접 챙겨야 하는 것과, 금융 화면 특유의 함정이다.

## 1. 대비 (빌드가 106쌍 검사, `dist/contrast-report.json`)
| 대상 | 기준 | 시스템에서 |
|---|---|---|
| 흰 카드 위 본문 | 4.5 | `text.primary`(16.6) `secondary`(7.1) `tertiary`(4.6) `placeholder`(4.6) |
| 캔버스(#F2F4F6) 위 글자 | 4.5 | **`primary`·`secondary` 만.** tertiary·상태색·등락색은 흰 카드 안에서 |
| 큰 글자(24px 이상 또는 18.66px bold) | 3 | 등락 큰 숫자 `finance.*.solid`(3.7), display 등 |
| 등락 작은 글자(13~15px) | 4.5 | `finance.*.text`(600, 4.66) |
| 등락 배지 안 글자 | 4.5 | `finance.*.on-bg`(700) |
| primary 버튼 | 3 (라벨 15/600) | `action.primary` 3.71. AA 엄격은 `primary-strict` 4.66 |
| 아이콘·테두리·포커스 링 | 3 | `status.*.icon`, `border.input-strict`, `focus-ring` |
| 비활성 | 예외 | `text.disabled` |
| 차트 시리즈 vs 배경 | 3 (비텍스트) | series 1~8 흰 배경 3 이상. 다크는 밝은 세트 |

주의
- `border.strong`(인풋 테두리 #D1D6DB)은 1.46:1 이다. 인풋은 라벨·배경·높이로 구분되므로 두었고, 엄격 화면은 `border.input-strict`.
- 그라데이션 위 글자는 가장 밝은 지점 기준(04 §4).
- 이미지 위 글자는 `gradient.scrim-bottom` 필수.
- `action.primary`(#3182F6 + 흰 글자 3.71)는 텍스트 AA 미달을 알고 유지한 결정(13 §7). 계정·결제·공공 기준 화면은 `primary-strict`.

## 2. 색 이외의 신호 (금융에서 가장 중요)
- **등락**: 색 + 부호(`+`/`−` U+2212) 필수. 배지·큰 숫자엔 화살표 `▲▼` 추가. 색각 이상 사용자는 빨강·파랑을 구분 못 할 수 있다.
- 캔들: 상승·하락 색 + 툴팁 시·고·저·종. 설정에 "속 빈 캔들(하락)" 옵션 권장.
- 차트 시리즈: 범례 + 선 끝 직접 라벨. 색만으로 식별시키지 않는다(기존 chartTheme 규칙 유지).
- 히트맵: 셀 안 숫자.
- 상태 배지: 아이콘 또는 문구. 도트만 금지.
- 링크: 색 + 밑줄(본문 안은 항상, 리스트는 hover).
- 필수 필드 `*` 에 `aria-label="필수"`.

## 3. 포커스
- `typography.css` 가 `:focus-visible` 에 2px 링 + 2px offset 전역. **`outline: none` 금지.** 모양을 바꾸려면 `:focus-visible` 에서 토큰으로 다시 그린다.
- 인풋은 안쪽 soft 링(`box-shadow: 0 0 0 3px focus-ring-soft`) + 테두리 색.
- 포커스 순서 = 시각 순서. `tabindex` 양수 금지.
- 모달·시트·드로어: 포커스 트랩, 닫히면 열었던 요소로 복귀.
- 드롭다운·메뉴·검색 결과: ↑↓ Home End Enter Esc 타이핑 점프. `role` + `aria-activedescendant`.
- 세그먼트·탭: `role="tablist"`, ←→ 이동, Home/End.
- 커스텀 컴포넌트에서 `div onClick` 금지 → `<button>` 또는 `role="button" tabindex="0"` + Enter/Space.
- 종목 행(링크)·표 행: Tab 도달, Enter 이동. 행 안 ★·⋯ 버튼은 별도 탭 스톱.
- 스킵 링크 "본문으로 건너뛰기"(포커스 시만 보임).
- 차트: 키보드로 데이터 포인트 탐색이 어려우면 표 대안(§5).

## 4. 터치·클릭 영역
- 최소 44×44(`size.touch-target-min`). 버튼 md 44, 종목 행 68, 탭바 항목 56, 세그먼트 항목 36 은 트랙 상하 패딩으로 44 확보.
- 표 xs 버튼 28 은 셀 패딩으로 44 확보. 관심 ★ 28 도 같음.
- 인접 타깃 사이 8 이상. 하단 탭 5개는 375 에서 각 75.
- 스와이프 제스처(관심 삭제·시트 닫기)는 항상 버튼 대안.

## 5. 시맨틱 HTML·스크린리더
| 요소 | 규칙 |
|---|---|
| 제목 | `<h1>` 페이지당 1개, 단계 건너뛰지 않기. 모양은 클래스 |
| 버튼 vs 링크 | 동작 `<button>`, 이동 `<a href>`. 새 탭 아이콘 + `rel="noopener"` |
| 폼 | 모든 인풋 `<label for>`, 그룹 `<fieldset><legend>`, 오류 `aria-invalid` + `aria-describedby` |
| 아이콘 버튼 | `aria-label` 필수. 장식 아이콘 `aria-hidden` |
| 가격·등락 | `<span aria-label="상승 1.68퍼센트">▲ 1.68%</span>`. 화살표 문자만 두면 "검은 위쪽 삼각형"으로 읽힌다 |
| 실시간 갱신 | 셀에 `aria-live` 금지(틱마다 읽으면 못 쓴다). 갱신 시각 한 곳만 `aria-live="polite"` |
| 차트 | `<figure>` + `<figcaption>` 요약("삼성전자 1개월 주가, 5.2% 상승") + 시각적으로 숨긴 `<table>` |
| 표 | `<th scope>`, `<caption>`, 정렬 `aria-sort` |
| 하단 탭바 | `<nav aria-label="주 메뉴">`, 활성 `aria-current="page"` |
| 세그먼트 | `role="tablist"` / `tab` / `aria-selected` |
| 시장 태그 | 텍스트 그대로(정보) |
| 종목 로고 | `alt=""`(이름이 옆에) |
| 숫자 축약 | "412조 5,000억" 그대로 읽힘. "1.2M" 영문 축약 금지 |
| 토스트 | `role="status"` / 오류 `role="alert"` |
| 모달·시트 | `role="dialog" aria-modal="true" aria-labelledby` |
| 랜드마크 | `<header> <nav> <main> <aside> <footer>` 각 1개, nav 는 `aria-label` 로 구분 |
| 이미지 | 내용 `alt` 서술, 장식 `alt=""` |

## 6. 모션·시간
- reduced-motion 은 토큰이 처리. 직접 `@keyframes` 는 미디어 쿼리 추가(05 §6).
- 자동 갱신 화면(순위·실시간)은 일시정지 버튼.
- 토스트 정보 3초, 오류 6초, 액션 있으면 닫힘 없음.
- 2FA·세션 만료 카운트다운은 연장 안내.

## 7. 반응형·확대
- 200% 확대에서 가로 스크롤 없음(표는 컨테이너 스크롤 허용). `rem` 단위, `max-width`, 고정 높이 컨테이너 금지.
- 375px 콘텐츠 손실 없음.
- 인풋 모바일 16px(iOS 확대 방지). `user-scalable=no` 금지.
- 하단 탭바가 콘텐츠를 가리지 않게 본문 하단 패딩 56 + 16.

## 8. 다크·고대비
- 다크 시맨틱도 같은 기준으로 빌드 검사.
- `prefers-contrast: more` 토큰은 아직 없다. 필요해지면 `border.strong` 을 `input-strict` 로, `text.tertiary` 를 `secondary` 로 올리는 오버라이드 블록을 `tokens.css` 에 추가(13 §2).

## 9. 출시 전 체크
- [ ] 등락 표기에 부호/화살표 동반, 그레이스케일로 봐도 방향 구분
- [ ] 캔버스 위에 tertiary·상태색·등락색 글자 없음
- [ ] Tab 만으로 헤더 → 세그먼트 → 종목 행 → 행 안 버튼 → 시트 순회, 포커스 링 항상 보임
- [ ] 스크린리더로 가격·등락이 방향 포함해 읽힘, 갱신 시각만 live
- [ ] 차트마다 요약 문장 + 표 대안
- [ ] 200% 확대, 375px
- [ ] 모든 이미지 alt, 아이콘 버튼 aria-label
- [ ] axe DevTools 심각·중대 0
- [ ] reduced-motion 에서 플래시 없이 정보 유지, 자동 갱신 일시정지 가능
