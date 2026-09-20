# 14 · 브랜드 자산 (notting)

## 1. 컨셉

notting 의 심볼은 **잉크 페이지 위에 붙은 근거 마커**다. 검은 타일(잉크) 안에 문서 줄 셋(종이색), 오른쪽에 verdigris 세로 마커. "문서에 근거가 붙는다" — 제품의 세 번째 계약(근거 계약)을 형태로 만들었다. Notion 의 흑백 N, Linear 의 보라 원과 겹치지 않고, 16px 에서도 "줄 셋 + 막대" 실루엣이 읽힌다.

- 로고: 타일 + 줄 + 마커. 글자를 심볼 안에 넣지 않는다.
- 캐릭터: 잉크 문서 몸체, 종이 얼굴, verdigris 북마크와 periwinkle 근거 불빛을 가진 **기록지기**다. 로고를 얼굴로 바꾸지 않고 같은 재료와 역할을 별도 캐릭터로 확장한다.
- 브랜드 이미지: `gradient.brand` 위에 큰 심볼과 종이 줄. 넓은 여백.
- 장식: 심볼 하나를 크게, 또는 줄 패턴을 옅게. 겹치지 않는다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` | 기본 컬러 심볼(잉크 타일 + 종이 줄 + verdigris 마커) |
| `assets/brand/logo-mark-mono.svg` | 단색(`currentColor`). 줄 + 마커만, 타일 없음. 작은 UI·인쇄·마스크 |
| `assets/brand/logo-lockup.svg` | 밝은 면 가로 로고(심볼 + `notting` 워드마크 잉크색) |
| `assets/brand/logo-lockup-inverse.svg` | 어두운 면 가로 로고(워드마크 종이색, 타일 종이색 + 잉크 줄) |
| `assets/brand/favicon.svg` | 브라우저 파비콘(타일 radius 22%) |
| `assets/brand/favicon-{16,32,48}.png` · `favicon.ico` | 레거시 폴백 |
| `assets/brand/app-icon-512.png` | PWA·앱 아이콘 |
| `assets/brand/app-icon-maskable-512.png` | Android/PWA maskable 안전 영역 앱 아이콘 |
| `assets/brand/apple-touch-icon-180.png` | iOS 홈 화면용 불투명 설치 아이콘 |
| `assets/brand/brand-hero.png` · `.webp` | 랜딩·저장소·소셜 가로 이미지 1600×900 |
| `assets/brand/mascot.png` · `.webp` | 온보딩·빈 상태·404용 투명 캐릭터 마스터와 웹용 파일 |
| `assets/brand/mascot-avatar-512.png` | 저장소·커뮤니티·소개 영역의 정사각 캐릭터 아바타 |
| `assets/brand/build-brand-assets.py` | 위 파일을 전부 다시 만드는 스크립트(SVG 원본 → PNG/ICO/히어로) |
| `assets/brand/README.md` | 생성 방법 |

전체 미리보기는 `examples/preview.html` 첫 영역.

## 3. 로고 규칙

- 최소 높이: 심볼 20px, 가로 로고 24px. 20 미만은 `favicon.svg`.
- 안전 여백: 타일 한 변의 1/4 을 사방에 비운다.
- 밝은 면: `logo-lockup.svg`. 어두운 면(`surface.brand`·`gradient.brand`·`ink`): `logo-lockup-inverse.svg`.
- 단색: `logo-mark-mono.svg` 에 `color` 하나. 툴바·트리 워크스페이스 아이콘 자리에서는 mono 를 `text.primary` 로.
- 워드마크 `notting` 은 Pretendard 700, 자간 -0.02em, 소문자. 심볼과 워드마크 사이 = 심볼 높이의 0.35.
- 금지: 비율 변경, 회전, 외곽선·그림자 추가, 팔레트 외 색, 마커 색 변경(마커는 항상 verdigris — 다크에서도), 타일 안에 글자.
- 타일 색은 잉크 고정. 다크에서 잉크 타일이 캔버스와 붙어 보이면 inverse 락업(종이 타일)을 쓴다.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/brand/apple-touch-icon-180.png" />
```

## 4. 캐릭터 규칙

- 역할은 문서를 지키고 근거를 건네는 기록지기다. 일반 챗봇·로봇으로 부르지 않는다.
- 검은 문서 몸체, 종이색 얼굴과 세 줄, 오른쪽 verdigris 북마크는 항상 유지한다.
- periwinkle 불빛은 근거·Context Pack을 상징한다. AI가 만든 내용 옆에서는 별도 sparkles 라벨을 함께 써 저작 주체를 구분한다.
- 표정은 침착한 미소를 기본으로 한다. 과장된 눈물·분노·밈 표정, 모자·안경·의상 교체는 금지한다.
- 권장 크기: 빈 상태 160~240px, 온보딩 240~360px, 아바타 64px 이상. 64px 미만은 캐릭터 대신 로고 심볼을 쓴다.
- 밝은 면과 어두운 면 모두 투명 `mascot.png`를 쓰되, 검은 몸체가 묻히는 잉크 면에서는 paper 또는 brand-subtle 원형 받침을 둔다.

## 5. 브랜드 이미지 규칙

- `brand-hero.png` 왼쪽 45% 는 제목·설명 여백. 글자는 `text.on-brand`(흰색). 왼쪽이 그라데이션의 어두운 시작점이라 스크림 없이 6.7:1 이상.
- 데스크톱 16:9 또는 21:9 중앙 크롭, 심볼이 잘리지 않게 `object-position: 70% center`.
- 모바일은 오른쪽 심볼 중심 4:5 크롭.
- 이미지 위에 다른 도형·글로우를 추가하지 않는다.

## 6. 재생성

```bash
cd notting/assets/brand
python build-brand-assets.py      # Pillow 필요. SVG 는 스크립트 안 기하로 그린다
```
SVG 기하와 PNG 래스터가 같은 좌표에서 나오므로 파비콘·앱 아이콘·히어로 속 심볼이 항상 일치한다. 심볼 모양을 바꾸려면 스크립트의 `GEOMETRY` 만 고친다. 손으로 PNG 를 편집하지 않는다.
