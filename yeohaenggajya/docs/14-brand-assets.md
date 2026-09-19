# 14 · 브랜드 자산 (여행가쟈)

## 1. 컨셉
브랜드 표기는 **여행가쟈**(여행 가자 + 가챠 말장난). 로고 = 캡슐 심볼 + 워드마크. 무드는 한지 위 단청 선 민화. 뽑기 행위의 일반명사는 "가챠"("여행가쟈에서 가챠를 굴려요" O, "여행가챠" X).

## 2. 파일 (원본 `public/brand/` · `public/icons/`)
| 파일 | 이 저장소 | 언제 |
|---|---|---|
| `yeohaenggajya-logo-horizontal-outlined.svg` | `assets/brand/` | **웹앱 기본 로고**(캡슐 + 워드마크, 폰트 outline 처리 → 폰트 미로드 환경 안전) |
| `yeohaenggajya-logo-text-outlined.svg` | `assets/brand/` | 워드마크만(좁은 헤더) |
| `yeohaenggajya-icon.svg` | `assets/brand/` | 정사각 마크 1024(둥근 사각 배경 포함). 앱 아이콘 원본 |
| `logo-horizontal-{320,640,1280}.png` | 640 만 복사 | OG·외부 공유 래스터 |
| `logo-text-*.png` | 원본만 | |
| `icons/icon-192.png` `icon-512.png` | 원본만 | PWA(`site.webmanifest`) |
| `icons/apple-touch-icon.png` `favicon-*.png`, `app/favicon.ico` | 원본만 | `layout.tsx` metadata.icons |
| `yeohaenggajya-logo-horizontal.svg`(outline 아님) | 원본만 | 폰트 로드 보장 환경만 |

## 3. 사용 규칙 (원본 `components.md` 브랜드 에셋)
- UI 에서는 `<img>` 직접 금지 → `Logo` 컴포넌트(`variant horizontal|text|icon`, `size sm|md|lg|xl` = 높이 20/28/40/64, 비율 고정, `alt` 기본 "여행가쟈", 옆에 브랜드명 텍스트 있으면 `alt=""`, `priority` 홈 헤더).
- **변형 금지**: 재채색·늘리기·회전·그림자 추가. 크기만.
- 로고 SVG 내부 그라데이션 색은 **에셋 고유 색** — "토큰만 쓴다" 규칙의 예외. 컴포넌트 CSS 에서 그 색을 흉내내 박지 않는다.
- 여백: 로고 높이의 1/2 이상(`component.logo.clear-space` 12 최소).
- 배경: 한지(base·bright) 위가 정본. 무대(어두운 배경)에는 로고를 두지 않는다(연출 화면 헤더 없음). 필요하면 워드마크 outlined 에 `filter` 없이 hanji.bright 단색 버전을 원본에 요청.
- 최소 크기: 심볼 20, 가로 로고 높이 20(sm). 파비콘은 icon.svg 파생 PNG.

## 4. 메타·매니페스트 (CSS 변수를 못 쓰는 곳)
`layout.tsx` `viewport.themeColor` = `--hanji` #F4ECDA · `site.webmanifest` `theme_color` #F4ECDA, `background_color` #FBF5E5. 토큰 값이 바뀌면 여기도(원본 tokens.md §13). OG 기본 `public/og-default.png`.

## 5. 아트워크 자산 (로고 외, 복사하지 않음)
필터 프레임·낙관 도장(`public/ui/`), 민화 도감 아트(`public/dex/`·`docs/dex-art-samples`), 카드 프레임(`public/borders/` `cards/`), 세트·배지(`public/sets/` `badges/`). 오너 제공 에셋. 규칙은 10 §2·§4.

## 6. 워드마크 타이포(텍스트로 써야 할 때)
로고 대신 텍스트 브랜드명이 필요하면(메타 타이틀·문장) "여행가쟈" 그대로. UI 에서 서체로 흉내낸 워드마크는 만들지 않는다 — 항상 SVG.
