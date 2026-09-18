# 14 · 브랜드 자산

## 1. 컨셉

winterholic의 브랜드 모티프는 **오로라 아래 떠 있는 투명한 얼음 결정**이다. 차갑다는 인상보다 겨울의 정밀함·고요함·맑음을 보여준다. 히어로 이미지 속 실제 결정과 같은 길고 투명한 프리즘 면을 브랜드의 인장으로 쓴다.

- 로고: 히어로 이미지 속 결정의 실루엣과 프리즘 면을 그대로 보존한 하이브리드 SVG·PNG
- 캐릭터: 같은 결정 실루엣을 둥글게 풀어낸 얼음 정령 **윈티(Winty)**
- 브랜드 이미지: Twilight Indigo 밤하늘, Frozen Lake 빛, 넓은 여백
- 장식: 결정 하나를 크게 쓰거나 서리 패턴을 아주 옅게 쓴다. 여러 장식을 동시에 겹치지 않는다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` | 기본 컬러 심볼 |
| `assets/brand/logo-mark.png` | self-contained SVG와 래스터 파생 파일을 만드는 투명 심볼 원본 |
| `assets/brand/logo-mark-mono.svg` | 단색 인쇄, 마스크, 작은 UI |
| `assets/brand/logo-lockup.svg` | 밝은 면의 가로 로고 |
| `assets/brand/logo-lockup-inverse.svg` | 어두운 브랜드 면의 가로 로고 |
| `assets/brand/favicon.svg` | 브라우저 기본 파비콘 |
| `assets/brand/favicon-{16,32,48}.png` | 레거시 브라우저·메타데이터 |
| `assets/brand/app-icon-512.png` | PWA·앱 아이콘 원본 |
| `assets/brand/ice-crystal.svg` | 히어로·빈 상태 장식 |
| `assets/brand/pattern-frost.svg` | 반복 가능한 옅은 배경 패턴 |
| `assets/brand/mascot-winty.png` | 투명 배경 캐릭터 원본 |
| `assets/brand/brand-hero.png` | 랜딩·리포지터리·소셜용 가로 이미지 |

전체 미리보기는 `examples/preview.html`의 브랜드 자산 섹션을 본다.

## 3. 로고 규칙

- 최소 높이: 심볼 20px, 가로 로고 24px. 20px 미만은 `favicon.svg`를 쓴다.
- 안전 여백: 심볼 중심 육각형 높이의 절반만큼 사방을 비운다.
- 밝은 면: 기본 컬러 심볼 + `logo-lockup.svg`.
- 어두운 면: `logo-lockup-inverse.svg`.
- 단색 출력: `logo-mark-mono.svg`에 `color`로 한 색만 지정한다.
- 금지: 비율 변경, 임의 회전, 외곽선 추가, 그림자·광택 추가, 팔레트 외 색으로 재채색.
- 심볼 안에 `W`나 다른 글자를 다시 넣지 않는다. 작은 크기에서 결정 실루엣이 먼저 읽혀야 한다.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/brand/app-icon-512.png" />
```

## 4. 캐릭터 규칙

윈티는 도움말·온보딩·빈 상태·완료 화면처럼 **제품이 먼저 말을 거는 순간**에만 쓴다. 일반 버튼, 표, 설정 화면의 장식으로 반복하지 않는다.

- 권장 크기: 빈 상태 120–180px, 온보딩 200–320px.
- 항상 원본 비율 유지. 얼굴·표정·스카프 색을 바꾸지 않는다.
- 캐릭터 뒤에는 `surface.brand-subtle` 또는 충분한 여백을 둔다.
- 실패·위험 상태에 웃는 캐릭터를 쓰지 않는다. 그때는 상태 아이콘과 명확한 문구가 우선이다.
- 대체 텍스트는 맥락을 전달할 때만 쓴다. 순수 장식이면 `alt=""`.

## 5. 브랜드 이미지 규칙

- `brand-hero.png`의 왼쪽은 제목·설명을 놓을 수 있는 여백이다. 글자는 `text.on-brand`, 필요하면 `gradient.scrim-left`를 덧댄다.
- 데스크톱은 16:9 또는 21:9로 중앙 크롭하고, 결정이 잘리지 않게 `object-position: 65% center`를 기본값으로 둔다.
- 모바일은 이미지 전체를 억지로 넣지 말고 오른쪽 결정 중심으로 4:5 크롭한다.
- 이미지 위에 다른 눈송이·오로라·글로우를 추가하지 않는다.

## 6. 생성 원본과 재생성

`mascot-winty.png`와 `brand-hero.png`는 OpenAI 내장 이미지 생성 경로로 만들었다. 새 포즈나 장면을 만들 때는 다음을 고정한다.

- 윈티: 여섯 갈래 머리 실루엣, 짧고 둥근 팔다리, Twilight Indigo 스카프, 점 눈과 작은 미소
- 팔레트: `brand.snow`, `brand.ice`, `brand.aqua`, `brand.steel`, `brand.twilight`
- 표현: 평면 벡터에 가까운 선명한 기하학 면, 텍스트·워터마크 없음
- 투명 자산: 완전 단색 키 배경에서 생성 후 알파 채널과 가장자리 번짐을 확인

원본 프롬프트는 `assets/brand/README.md`에 보관한다.
