# 02 · 타이포그래피 (stock-gosu)

## 1. 서체
- 본문·제목·숫자 전부 **Pretendard Variable**(`font.family.sans`, 기존 `--font-sans` 그대로).
- 코드·티커 심볼만 `font.family.mono`. **금액·가격은 mono 가 아니다.** Pretendard + `font-variant-numeric: tabular-nums` 가 자릿수 정렬과 가독성을 모두 준다.
- 로드(소비 앱): `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />`. `dynamic-subset` 은 쓰인 글자만 받는다. 셀프 호스팅이면 woff2 + `font-display: swap`. 모노는 코드가 있는 화면에서만 로드.

## 2. 스케일
기존 FDS(13/15/17/18/20/24/32)를 유지하고 12·28·40 을 더했다.

| 토큰 | px | 어디에 |
|---|---|---|
| `2xs` | 11 | 하단 탭바 라벨만 |
| `xs` | 12 | 배지·표 헤더·시장 태그·타임스탬프. **하한** |
| `sm` | 13 | 캡션·등락률·보조 설명 |
| `md` | 15 | **본문·버튼·리스트 행·표 셀·인풋** |
| `lg` | 17 | 안내 문장·리서치 본문·lg 버튼 |
| `xl` | 18 | title-3 |
| `2xl` | 20 | title-2·가격 md |
| `3xl` | 24 | title-1 |
| `4xl` | 28 | 가격 lg(현재가) |
| `5xl` | 32 | display(총자산) |
| `6xl` | 40 | 온보딩 히어로 |

"보조정보도 12 아래로 내리지 않는다"(기존 규칙). 인풋 주의: iOS Safari 는 인풋 글자가 16px 미만이면 포커스 시 화면을 자동 확대한다. 본문 15 를 인풋에 그대로 쓰면 모바일에서 확대가 일어나므로 767px 이하에서는 `component.input.font-size-mobile`(16px)로 올린다.

## 3. 굵기 5단계
| 토큰 | 값 | 어디에 |
|---|---|---|
| `regular` 400 | 본문 |
| `medium` 500 | 라벨·표 헤더·일반 수치 |
| `semibold` 600 | 버튼·title-3·title-4·강조 |
| `bold` 700 | title-1·2, 가격 sm/md, 등락률, 배지 |
| `extrabold` 800 | display·가격 lg **전용** |

기존 코드에 700 과 800 이 뒤섞여 있었다. 800 은 큰 숫자에만 쓴다. 15px 에서 800 은 뭉친다.

## 4. 행간·자간
| 행간 | 값 | 어디에 |
|---|---|---|
| `none` 1 | 가격·KPI 숫자(줄바꿈 없음) |
| `tight` 1.2 | display |
| `snug` 1.35 | title |
| `normal` 1.45 | 라벨·버튼·리스트 행 |
| `relaxed` 1.6 | 본문 |

| 자간 | 값 | 어디에 |
|---|---|---|
| `tighter` -0.03em | display·가격 lg |
| `tight` -0.02em | title-1·2, 가격 md |
| `snug` -0.01em | 본문 기본(body 전역) |
| `normal` 0 | 캡션·배지·작은 숫자 |

## 5. 텍스트 스타일 (이것만 쓴다)

| 스타일 | size/weight/lh | 언제 | 짝 색 |
|---|---|---|---|
| `display-lg` | 40/800/1.2 | 온보딩 히어로. 모바일 32 | primary |
| `display` | 32/800/1.2 | 총자산·홈 요약 숫자. 모바일 28 | primary |
| `title-1` | 24/700/1.35 | 페이지 제목. 모바일 20 | primary |
| `title-2` | 20/700/1.35 | 섹션·모달·바텀시트 제목 | primary |
| `title-3` | 18/600/1.35 | 카드·패널 제목 | primary |
| `title-4` | 15/600/1.45 | 리스트 행 종목명·작은 카드 제목 | primary |
| `body-1` | 17/400/1.6 | 안내 문장·리서치 본문 | primary |
| `body-2` | 15/400/1.6 | **본문 기본**·표 셀 | primary |
| `body-3` | 13/400/1.6 | 보조 설명 | secondary |
| `caption` | 13/500/1.45 | 라벨·메타 | tertiary |
| `micro` | 12/500/1.45 | 표 헤더·타임스탬프·시장 태그 | tertiary |
| `label-lg` | 17/600/1.45 | lg 버튼·하단 CTA | |
| `label-md` | 15/600/1.45 | **버튼·탭·세그먼트** | |
| `label-sm` | 13/600/1.45 | sm 버튼·필터 칩 | |
| `badge` | 12/700/1 | 배지·시장 태그 | |
| `price-lg` | 28/800/1 tabular | 현재가·총자산 | primary (등락은 옆에) |
| `price-md` | 20/700/1 tabular | KPI 타일·카드 가격 | primary |
| `price-sm` | 15/700/1 tabular | 리스트·표 가격 | primary |
| `change` | 13/700/1 tabular | 등락률·등락폭 | `finance.<d>.text` |
| `numeric` | 15/500/1 tabular | 거래량·PER·시총 | primary |
| `code` | 13 mono | 코드·티커 심볼 | primary |

`price-*`·`change`·`numeric` 클래스는 `typography.css` 가 `tabular-nums` + `white-space: nowrap` 을 자동으로 건다.

### 숫자 위계 공식
```
[caption 라벨]            총 평가금액
[price-lg 또는 display]   12,840,000원      ← 단위 '원' 은 body-2 로 작게
[change + 화살표]         ▲ 240,000 (+1.9%)
[micro 보조]              오늘 15:30 기준
```
숫자 크기 단계는 세 개까지. 라벨 13 → 숫자 28 → 등락 13. 그 사이에 20 을 또 넣지 않는다.

## 6. 숫자·통화 표기 (기존 FDS 규칙 유지)

| 항목 | 규칙 | 예 |
|---|---|---|
| 천 단위 | 쉼표 필수 | 1,284,500원 |
| 통화 | 금액 뒤 "원" 붙여쓰기, 달러는 앞 "$" | 50,000원 · $142.80 |
| 정렬 | tabular-nums + 우측 정렬 | 표·리스트 전부 |
| 등락 부호 | 상승 `+`, 하락 `−`(U+2212), 보합 부호 없음 `0.00%` | +1.66% / −1.30% |
| 화살표 | `▲▼` 는 배지·큰 숫자 옆. 표 열에는 부호만 | |
| 퍼센트 | 소수 둘째 자리, `%` 붙여쓰기 | 12.40% |
| 큰 금액 | 요약은 만/억, 상세는 전체 | 1,284만원 · 12,840,000원 |
| 거래량 | 천 단위 쉼표, 요약은 K/M 대신 만/억 | 1,204만주 |
| 시가총액 | 조/억 | 412조 5,000억 |
| 날짜 | `YYYY.MM.DD` | 2026.09.19 |
| 시간 | 24시간제 `HH:mm` (기존 문서의 오전/오후 12시간제는 폐기 — 장중 시각 비교에 24시간이 명확) | 15:30 |
| 상대 시간 | 7일까지 "3분 전", 그 뒤 날짜 | |
| 0 / 빈 값 | "0원" 명시. `–`·공백 금지. 데이터 없음은 `—` + 툴팁 "집계 전" | |
| 음수 | 하이픈이 아니라 마이너스 `−` | −3.8% |
| 줄바꿈 | 금액·핵심 숫자 `white-space: nowrap`. 잘릴 것 같으면 한 단계 줄인다 | |

## 7. 반응형
`typography.css` 가 767px 이하에서 `display-lg` 40→32, `display` 32→28, `title-1` 24→20, `price-lg` 28→24 로 내린다. 본문 15 는 유지.

## 8. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `font-size: 14px` | `sm`(13) 또는 `md`(15). 14 는 스케일에 없다 |
| 가격에 mono 서체 | Pretendard + `.sg-price-*` (tabular) |
| 등락률 800 | `change` 700. 800 은 28px 이상 |
| 현재가·등락폭·등락률 같은 크기 | 28 → 13 두 단계 |
| 표 숫자 좌측 정렬 | `.sg-numeric` + `text-align: right` |
| 하이픈으로 음수 `-3.8%` | `−3.8%` (U+2212) |
| 총자산 20자리 한 줄에 억지로 | 요약 만/억, 상세 전체 |
