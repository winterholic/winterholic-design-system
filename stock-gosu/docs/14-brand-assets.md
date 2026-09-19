# 14 · 브랜드 자산 (stock-gosu)

## 1. 컨셉

파랑새는 가볍고 빠르게 시장을 살펴보는 눈이다. Toss Blue 계열 몸통과 맑은 하이라이트, 남색 눈을 유지한다. 금색·로켓·상승 화살표처럼 수익을 약속하는 모티프는 쓰지 않는다.

## 2. 파일 지도

| 파일 | 용도 |
|---|---|
| `assets/brand/logo-mark.svg` | PWA 파랑새 원본을 보존한 self-contained 컬러 심볼 |
| `assets/brand/logo-mark.png` | 투명 컬러 심볼 래스터 원본 |
| `assets/brand/logo-mark-mono.svg` | 단색 인쇄·마스크·작은 UI |
| `assets/brand/logo-lockup.svg` | 밝은 면의 가로 로고 |
| `assets/brand/logo-lockup-inverse.svg` | 브랜드 면·어두운 면의 가로 로고 |
| `assets/brand/favicon.svg` | 브라우저 기본 파비콘. 레거시 DOCTYPE과 외부 참조 없음 |
| `assets/brand/favicon-{16,32,48}.png` | 브라우저·검색 결과·레거시 메타데이터 |
| `assets/brand/favicon.ico` | 16~256 멀티사이즈 ICO |
| `assets/brand/app-icon-512.png` | PWA·앱 아이콘 |
| `assets/brand/brand-hero.png` | 랜딩·저장소·소셜용 1600×900 브랜드 이미지 |
| `assets/brand/brand-hero.webp` | 웹 미리보기용 경량 브랜드 이미지 |

기존 경로 `stock-gosu.svg`와 `stock-gosu.ico`도 각각 새 심볼과 ICO의 호환 별칭으로 유지한다.

## 3. 로고 규칙

- 최소 높이: 심볼 20px, 로크업 24px. 그보다 작으면 전용 `favicon.svg` 또는 PNG를 쓴다.
- 안전 여백: 파랑새 몸통 높이의 절반만큼 사방을 비운다.
- 밝은 면: `logo-lockup.svg`. 브랜드·어두운 면: `logo-lockup-inverse.svg`.
- 단색 출력은 `logo-mark-mono.svg`를 쓴다. 외부 이미지 기본색은 브랜드 블루이며, SVG를 인라인으로 사용할 때 `color`로 다른 단색을 지정할 수 있다.
- 워드마크는 `stock-gosu`, Pretendard 700, 자간 -0.02em, 하이픈 유지다.
- 금지: 비율 변경, 회전, 임의 색 변경, 상승 화살표 합성, 회색 사각 배경 추가.

```html
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/brand/favicon-32.png" sizes="32x32" />
<link rel="apple-touch-icon" href="/brand/app-icon-512.png" />
```

## 4. 파비콘·PWA

파비콘 PNG와 ICO는 브라우저가 큰 SVG를 축소하게 두지 않고, 정상 표시되던 PWA 원본에서 각 크기로 직접 리샘플링한다. `favicon.svg`도 같은 원본의 128px 파생 이미지를 내부에 포함해 네트워크 경로나 MIME 설정 때문에 깨지지 않는다. 앱 아이콘은 투명 원본과 6% 안전 여백을 유지하며 OS 마스크를 자산에 미리 굽지 않는다.

## 5. 브랜드 이미지

`brand-hero`는 1600×900이다. 왼쪽은 제목·설명용 빈 공간, 오른쪽은 파랑새, 배경은 `brand` 계열과 추상 차트 그리드다. 실제 종목·수익률·상승을 보장하는 숫자를 넣지 않는다. 16:9 또는 1.91:1로 크롭할 때 파랑새가 잘리지 않도록 오른쪽 40%를 보존한다.

## 6. 생성 원본

파생 방법과 원본 관계는 `assets/brand/README.md`에 기록한다. `python scripts/build-brand-assets.py`를 다시 실행하면 PNG·WebP·ICO·SVG 호환 파일을 같은 규격으로 재생성한다.
