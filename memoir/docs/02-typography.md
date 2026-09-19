# 02 · 타이포그래피 (memoir)

## 1. 서체
- **Plus Jakarta Sans** (라틴·숫자) + **Pretendard** (한글 폴백). Jakarta 에는 한글 글리프가 없어 한글은 자동으로 두 번째 폰트로 떨어진다. 두 폰트를 **모두** 로드해야 한다. Pretendard 를 안 넣으면 한글이 시스템 고딕(맑은 고딕)으로 떨어져 굵기·x-height 가 어긋난다.
- 코드·명령어·PIN 은 JetBrains Mono.

```ts
// app/layout.tsx (Next.js)
import { Plus_Jakarta_Sans } from 'next/font/google';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['400','500','600','700','800'] });
// <html className={jakarta.variable}> 그리고 globals.css 또는 tokens.css 위에서
// :root { --mm-font-family-sans: var(--font-jakarta), "Pretendard Variable", Pretendard, …; }
```
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```
한·영 혼용 줄에서 Jakarta 600 과 Pretendard 600 의 굵기가 비슷해 위화감이 적다. 400 은 Pretendard 가 살짝 굵어 보이니 본문은 그대로 두고 라틴 자간을 조이지 않는다.

## 2. 스케일
| 토큰 | px | 어디에 |
|---|---|---|
| `2xs` | 11 | 코드 줄 번호 |
| `xs` | 12 | label·태그·타임스탬프·캡션 |
| `sm` | 14 | 보조 본문·칩·미리보기·명령어 |
| `md` | 16 | **본문·에디터·인풋** |
| `lg` | 18 | 리드 문단 |
| `xl` | 20 | 카드 제목 |
| `2xl` | 24 | 섹션·모달 제목·PIN·로고 |
| `3xl` | 28 | headline(메모·페이지 제목) |
| `4xl` | 36 | display-sm |
| `5xl` | 44 | display-md |
| `6xl` | 56 | display-lg (design-guide 3.5rem) |

## 3. 굵기
`regular` 400 본문 · `medium` 500 메타·칩 · `semibold` 600 제목·버튼·label · `bold` 700 display·강조 단어 · `extrabold` 800 로고만.

## 4. 행간·자간
| 행간 | 값 | 어디에 |
|---|---|---|
| `tight` 1.1 | display |
| `snug` 1.3 | headline·title |
| `normal` 1.5 | 라벨·버튼·칩 |
| `relaxed` 1.6 | 본문(design-guide: 한글 장문 넉넉하게) |
| `loose` 1.8 | 에디터 본문 |

| 자간 | 값 | 어디에 |
|---|---|---|
| `tighter` -0.03em | 로고 |
| `tight` -0.02em | display·headline (design-guide) |
| `snug` -0.01em | title |
| `normal` 0 | 본문·라벨 |
| `wide` +0.05em | label 대문자 메타 (design-guide) |

## 5. 텍스트 스타일

| 스타일 | size/weight/lh | 언제 | 짝 색 |
|---|---|---|---|
| `display-lg` | 56/700/1.1 | 랜딩 히어로·빈 상태 대형. 모바일 36 | primary + 강조 단어 brand |
| `display-md` | 44/700/1.1 | 대시보드 인사("좋은 아침이에요")·카테고리 히어로. 모바일 36 | |
| `display-sm` | 36/700/1.1 | | |
| `headline` | 28/600/1.3 | 메모 제목·페이지 제목(기존 .text-headline). 모바일 24 | primary |
| `title-lg` | 24/600/1.3 | 섹션·모달 제목 | |
| `title` | 20/600/1.3 | 카드·스니펫·벤토 제목 | |
| `title-sm` | 16/600/1.5 | 리스트 항목·북마크·폴더 | |
| `body-lg` | 18/400/1.6 | 리드 문단·온보딩 | secondary |
| `body` | 16/400/1.6 | 본문(기존 .text-body) | primary |
| `body-sm` | 14/400/1.6 | 카드 설명·미리보기 | secondary |
| `editor` | 16/400/1.8 | 일반 메모 블록 에디터 | primary |
| `label` | 12/600/1.5 대문자 +0.05em | 타임스탬프·언어 배지·섹션 라벨(기존 .text-label) | tertiary |
| `label-md` | 14/600/1.5 | 버튼·칩·드롭다운·헤더 메뉴 | |
| `label-lg` | 16/600/1.5 | lg 버튼·2FA CTA | |
| `caption` | 12/500/1.5 | 도움말·글자 수·저장 상태 | tertiary |
| `tag` | 12/500/1 | #태그 | on-pink 또는 ink |
| `code` | 14 mono/1.6 | 코드 블록 | code.text |
| `command` | 14 mono/500 | 명령어 행 | primary |
| `pin` | 24 mono/600 +0.05em | 2FA PIN 칸 | primary |
| `logo` | 24/800/-0.03em | 워드마크. `m` 로즈 + `emoir` ink | |

### 에디토리얼 위계 만드는 법
- 제목은 크게(display·headline), 본문은 절제(16/400). 그 사이 단계를 많이 두지 않는다.
- 메타는 작게 + 대문자 + 자간(`label`). 한글 메타("2023년 10월 24일")는 대문자가 없으니 자간만 적용된다 → 날짜는 `OCT 24, 2023` 처럼 라틴 표기를 허용(v4 시안). 한글 UI 문구는 `caption`.
- 강조 단어 한 개만 로즈: "Your Digital **Archival Ledger**."

## 6. 한국어·조판
- `word-break: keep-all`, `overflow-wrap: anywhere` 전역.
- 에디터 한 줄 폭 `container.prose` 680. lg 이상에서 좌 10% 우 5% 비대칭 여백(design-guide) → `padding-inline: 10% 5%`.
- 날짜: UI 는 `2026.09.19`, 메타 라벨은 `SEP 19, 2026` 허용. 시간 24시간제.
- 숫자 카운트(글자 수·메모 수)는 tabular 불필요(표가 없다). PIN 만 tabular.

## 7. 반응형
767px 이하: display-lg·md 36, display-sm 28, headline 24. 본문 16 유지. 인풋 16 이라 iOS 확대 없음.

## 8. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| Jakarta 만 로드 | Pretendard 폴백 동시 로드 |
| 본문 15px | 16 |
| 제목 6단계 | display → headline → title → title-sm 네 단계 |
| 메타를 회색 본문으로 | `label` 대문자 자간 + tertiary |
| 로고를 그냥 텍스트로 | `.mm-logo` + `<span class="mm-logo-mark">m</span>emoir` |
| 에디터 행간 1.5 | 1.8 |
