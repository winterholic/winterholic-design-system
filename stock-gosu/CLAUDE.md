# stock-gosu design system — AI 에이전트 규칙

`C:\stock-gosu\front` 의 UI 를 만들거나 고칠 때 따른다. 구조는 `winterholic-base/CLAUDE.md` 와 같고, 아래는 금융 화면 전용 규칙이다.

## 시작할 때
1. `docs/00-decision-guide.md` §1(등락)부터 본다.
2. 화면 유형은 `docs/12-page-patterns.md`, 컴포넌트는 `docs/06-components.md`.
3. 기존 `global.css` 클래스를 고칠 때는 `docs/15-audit-and-migration.md` 의 대응표로 토큰을 고른다.

## 반드시
- 토큰만 쓴다: `var(--sg-…)`, `.sg-*` 클래스, `dist/chart-theme.ts`. hex·임의 px 금지.
- **등락 글자(13~15px)는 `finance.<d>.text`(600), 큰 숫자·차트·화살표는 `solid`(500).** 가격 자체는 `text.primary`.
- 등락에는 부호(`+`/`−` U+2212) 또는 화살표를 반드시 붙인다. 색만 금지.
- 등락색을 상태(성공·오류)에 쓰지 않는다. 상태는 `status.*`. 오류 배너·토스트는 아이콘 + 제목 필수.
- 캔버스(회색 배경) 위에 직접 놓는 글자는 `text.primary`·`secondary` 만. 캡션·상태색은 흰 카드 안.
- 숫자: 쉼표, "원" 붙여쓰기, tabular(`.sg-price-*`·`.sg-numeric`), 우측 정렬, nowrap, 24시간제.
- 차트: `currentChartTheme()` 로 색을 받고 `seriesColor(i, t)` 순서 고정, 9번째부터 `other`. 가격선은 0 시작 금지, 휴장 구간은 끊는다.
- 모바일 인풋 16px. 하단 탭바 56 + safe-area. 표 4열 이상은 카드 리스트로.
- 화면마다 로딩·빈·오류·장 마감·지연·집계 전 상태를 설계한다.
- 미국 종목 화면은 `data-market="us"` 스코프. 색 분기 코드 금지.
- 문구: 해요체, 동사 버튼, "추천·확실·무조건" 금지, 신호는 사실로.

## 하지 않는다
- `#F04452`·`var(--finance-up)` 를 13px 글자에. `dark:` 분기. 시리즈 색 순환. 파이 차트. 이중 y축. 총자산 카운트업. 순위 리스트 실시간 재정렬 애니메이션.

## 토큰을 고칠 때
`tokens/src` → `node tokens/build.mjs` → 실패 메시지 해결 → `docs/00` → `examples/preview.html` → `CHANGELOG`. `finance.*` 를 바꾸면 `us-*` 와 `[data-market=us]` 도 같이.

## 완료 전
```bash
node tokens/build.mjs
grep -rnE "#[0-9a-fA-F]{6}" C:/stock-gosu/front/src --include=*.{css,tsx} | grep -v chart-theme   # 0건 목표
grep -rn "dark:" C:/stock-gosu/front/src                                                          # 0건
```
