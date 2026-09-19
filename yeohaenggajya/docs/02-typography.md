# 02 · 타이포그래피 (여행가쟈)

## 1. 서체 7종 — 역할 고정 (Bright Line 7)
| 토큰 | 서체 | 역할 | 금지 |
|---|---|---|---|
| `myeongjo` | Nanum Myeongjo | **heading(800)**·카드 지역명·버튼·도감 제목·한자 도장 | 본문에 쓰지 않는다 |
| `batang` | Gowun Batang | **본문**·입력값·태그라인·카드 인용 | 제목에 쓰지 않는다 |
| `brush` | Nanum Brush Script | **강조 1~2곳**. 항상 `rotate(-1~-2deg)` | 3곳 이상·본문 |
| `rank` | Cinzel | **등급 라벨(영문)**·카드 헤더 메타·eyebrow | 한국어 문장 |
| `hand` | Gaegu | 손글씨 보조(온보딩 말풍선) | 드물게만 |
| `ui` | Pretendard | UI 시스템(폼·설정·법적 고지·탭바 라벨·body 기본) | |
| `mono` | DM Mono | **숫자·메타** NO.0001·남은 횟수·좌표·통계·visitorNote | 본문 |

- `body` 기본 서체는 `ui`(Pretendard)다(base.css). 본문 문단은 `.yg-body`(Batang)로 명시한다.
- 본문에 한자 금지 — 지명 1~2곳만(智異山·河回·保寧·鐵原·新安). 영문 등급명은 Cinzel 라벨에만, 문장은 한국어.

### 로드 (Next.js `next/font/google`)
```ts
import { Nanum_Myeongjo, Gowun_Batang, Nanum_Brush_Script, Cinzel, Gaegu, DM_Mono } from 'next/font/google';
// Pretendard 는 CDN 또는 로컬. 각 폰트를 CSS 변수(--font-*)로 노출하고 tokens.css 의 --f-* 가 그 변수를 참조하게 한다(원본 방식 유지).
```
7종은 무겁다. `display: swap`, 한글 서체(Myeongjo·Batang·Brush·Gaegu)는 서브셋. Cinzel·DM Mono 는 라틴만.

## 2. 스케일 (모바일 375 기준, Bright Line 10)
| 토큰 | px | 어디에 |
|---|---|---|
| `2xs` | 11 | 등급 라벨 sub·카드 메타·입력 도움말·이미지 출처. **하한** |
| `xs` | 12 | 칩·배지·탭바 라벨·입력 라벨·sm 버튼·mono 메타 |
| `sm` | 13 | 본문 보조·리스트 메타 |
| `md` | 14 | **본문·버튼·입력값** |
| `lg` | 16 | lg 버튼·강조 본문·hand |
| `xl` | 17 | 도감 셀 도장·리스트 제목·title |
| `2xl` | 20 | 헤더 하한·섹션 제목 |
| `3xl` | 22 | 헤더 상한·페이지 타이틀 |
| `4xl` | 28 | 카드 지역명·결과 제목 |
| `5xl` | 36 | 등급 배너(BannerRank)·온보딩 |
| `brush-lg` | 24 | 붓글씨 강조 |

본문 13~14, 헤더 20~22. 카피는 375 에서 한 줄. 데스크톱은 폰 프레임 셸 안이라 같은 크기.

## 3. 굵기
`regular` 400 본문 · `medium` 500 라벨·칩 · `semibold` 600 · `bold` 700 Cinzel·mono 강조 · `heading` 800 Myeongjo 전부(heading·버튼·도장).

## 4. 행간·자간
| 행간 | 값 | 어디에 |
|---|---|---|
| `none` 1 | 등급 라벨·mono·도장 |
| `tight` 1.15 | heading·배너 |
| `snug` 1.3 | title·버튼·시트 제목 |
| `normal` 1.5 | 라벨·도움말 |
| `relaxed` 1.6 | 본문(base.css) |
| `loose` 1.8 | 안내 문서(확률 안내·법적) |

| 자간 | 값 | 어디에 |
|---|---|---|
| `tight` −0.01em | 버튼·heading |
| `normal` 0 | 본문 |
| `wide` +0.08em | Cinzel 등급 라벨·eyebrow(대문자) |
| `wider` +0.12em | DM Mono 메타 |

## 5. 텍스트 스타일 (이것만 쓴다)
| 스타일 | 서체 / size / weight / lh | 언제 | 짝 색 |
|---|---|---|---|
| `heading-xl` | Myeongjo 28/800/1.15 | 카드 지역명·결과 제목·온보딩 | primary |
| `heading` | Myeongjo 22/800/1.15 | 페이지 타이틀(헤더 좌) | primary |
| `heading-sm` | Myeongjo 20/800/1.3 | 섹션·시트·다이얼로그 제목 | primary |
| `title` | Myeongjo 17/800/1.3 | 리스트 항목·카드·도감 셀 지역명·탭 | primary |
| `body` | Batang 14/400/1.6 | 본문·태그라인·카드 인용·다이얼로그 본문 | primary |
| `body-sm` | Batang 13/400/1.6 | 보조 설명·리스트 메타 문장 | secondary |
| `ui` | Pretendard 14/400/1.6 | 폼·설정·시스템 문구·법적 고지 | primary |
| `ui-sm` | Pretendard 12/500/1.5 | 입력 라벨·탭바 라벨·칩 | secondary / tertiary |
| `button` / `-sm` / `-lg` | Myeongjo 14 / 12 / 16, 800, −0.01em | 버튼 md/sm/lg | on-brand |
| `brush` | Brush 24/400, rotate −1.5° | 카드 한 줄 인용·홈 태그라인 강조. 화면당 1~2곳 | primary 또는 brand |
| `rank` | Cinzel 12/700/1, +0.08em 대문자 | Common…Unique 라벨·eyebrow | rarity.<r>.text |
| `rank-lg` | Cinzel 36/700 | BannerRank | 무대 위 |
| `mono` / `mono-sm` | DM Mono 12 / 11, +0.12em, tabular | NO.0001·7/10·좌표·통계·visitorNote | tertiary |
| `seal` | Myeongjo 17/800/1 | 한자 도장 常隱運傳唯 | 도장 위 hanji.bright |
| `hand` | Gaegu 16 | 손글씨 보조 | secondary |
| `caption` | Pretendard 11/400/1.5 | 입력 도움말·이미지 출처 | tertiary |

### 위계 만드는 법
- 제목은 Myeongjo 800 한 종류. 크기(28/22/20/17)로만 단계. 굵기 변화 없음.
- 제목 아래 본문은 서체가 바뀌는 것(Myeongjo → Batang)이 곧 위계. 색은 primary 유지, 보조만 secondary.
- 메타는 DM Mono 자간 넓게 + tertiary. 한 줄에 mono 와 Batang 을 섞지 않는다.
- 붓글씨는 "한 장면에 한 획". 두 곳 넘으면 무드가 어수선해진다.

## 6. 한국어·조판
- `word-break: keep-all` + `overflow-wrap: break-word` 를 텍스트 요소에 `:where()` 로 전역(특이도 0, base.css). 어절 중간 줄바꿈 금지("오 / 늘의" 사고 방지).
- 카피는 해요체. 등급명은 한국어 문장에 녹인다("전설의 발견이에요"). 07.
- 숫자: 남은 횟수 `7/10`, 카드 번호 `NO.0001`(대문자 NO + 4자리), 방문자 `7만 7천 명`(만 단위 한글), 날짜 `2026.09.19`, 좌표 소수 4자리 mono.
- 한자 도장은 한 글자, 지명 한자는 괄호 없이 바로("머드철 保寧").
- 영문 대문자는 Cinzel 라벨과 mono 메타에만.

## 7. 반응형
없음. 375 기준 값이 데스크톱 폰 프레임 안에서도 그대로다. 프레임 밖 데스크톱 문서(확률 안내·법적)는 `size.container.doc` 720 안에서 같은 스케일, 행간만 `loose`.

## 8. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| 본문을 Myeongjo 로 | Batang(`.yg-body`) |
| 제목을 Batang 굵게 | Myeongjo 800 |
| 붓글씨 세 곳 | 두 곳 이하 |
| 붓글씨 수평 | rotate −1~−2° |
| "LEGENDARY 등장!" 본문 | 라벨은 Cinzel `Legendary`, 문장은 "전설의 발견이에요" |
| 등급 알파벳 `L` | 풀네임 |
| 숫자를 Batang 으로 | DM Mono tabular |
| 12px 아래 글자 | 11 하한, 정보를 줄인다 |
| 본문 한자 | 지명 1~2곳만 |
