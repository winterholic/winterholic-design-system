# 09 · 다크 모드 (memoir)

기존 프로젝트에는 다크가 없었다(`dark:` 1건). 개인 메모는 밤에 많이 쓴다. 이 시스템은 **따뜻한 다크**를 추가했다: 검정이 아니라 ink 계열 갈색 검정 위에 따뜻한 흰 글자. 종이가 어두워진 느낌이지, 화면이 꺼진 느낌이 아니다.

## 1. 동작 방식
`dist/tokens.css` 하나로 세 가지 모드.

| 상황 | 결과 |
|---|---|
| 아무 설정 없음 | 시스템 설정(`prefers-color-scheme`) |
| `<html data-theme="dark">` | 항상 다크 |
| `<html data-theme="light">` | 항상 라이트 |

```tsx
// app/layout.tsx — 깜빡임 방지. 설정 화면 세그먼트(시스템/라이트/다크)가 localStorage 'mm-theme' 에 저장
<html lang="ko" suppressHydrationWarning>
  <head><script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('mm-theme');if(t)document.documentElement.dataset.theme=t;}catch{}` }} /></head>
```
`:root` 에 `color-scheme: light dark` 가 걸려 스크롤바·네이티브 셀렉트·체크박스 기본색도 따라온다. Zustand 스토어에 테마를 두면 `document.documentElement.dataset.theme` 만 바꾼다. 나머지는 CSS.

## 2. 컴포넌트가 할 일: 없음
시맨틱 토큰·프리셋 클래스(`bg-surface-default` 등)만 쓰면 자동. 기존 별칭(`bg-surface-low`·`text-on-surface`·`bg-sub-cream`·`text-primary`)도 시맨틱을 가리켜 따라온다. `dark:` 접두사 금지. 다크 분기가 필요해졌다면:
- Tailwind 원시 클래스(`bg-white` `text-black` `bg-gray-100` `border-gray-200`)를 썼다 → 시맨틱으로(15 대응표).
- 시맨틱 토큰이 부족하다 → `color.dark.json` 에 추가(라이트 같은 경로, 빌드 검사).

## 3. 매핑 원리 — 밝기 반전이 아니라 종이를 어둡게
| 축 | 라이트 | 다크 | 이유 |
|---|---|---|---|
| 종이 층 | paper #FFF9F8 → paper-tint #FFF0EE → white | #1B1514 → ink #231917 → neutral.900 #382D2B | 위로 갈수록 밝게. 갈색 계열 유지 |
| zone-deep | paper-deep | #1F1816 | 카드보다 어둡게(눌린 면) |
| 글자 | ink / 800 / 700 | paper #FFF9F8 / neutral.300 / 400 | 순백 아닌 따뜻한 흰색 |
| **primary 버튼** | 로즈 + 흰 | **핑크 #FF82A9 + wine 글자** | 어두운 면에서 핑크 원색이 살아난다(7.4:1 on ink). 로즈는 다크에서 죽는다 |
| secondary 버튼 | paper-deep + 로즈 | pink.950 + pink.300 | |
| ghost | 투명 + 700 | 투명 + 300, hover neutral.900 | |
| 활성 메뉴 | 페리윙클 + 흰 | 인디고 + 흰 | 페리윙클은 어두운 면에서 흐리다 |
| 링크·브랜드 글자 | indigo / rose | blue.300 / pink.300 | |
| 칩 기본 / 활성 / ALL | paper-deep+700 / 핑크+wine / ink+paper | neutral.800+300 / 핑크+wine / paper+ink | 핑크는 양쪽에서 강조색 |
| 태그 | blush + ink | pink.300 + wine | |
| 상태 배너 | 50 + 700 | 950 + 300 | |
| 보안 상태 | pink.50 + 700 | pink.950 + 300 | |
| 코드 블록 | #1A1A1A | #141010 | 카드(#382D2B)보다 어둡게 |
| 인라인 코드 | paper-deep + pink.700 | neutral.800 + pink.300 | |
| 글래스 | white 80% / 40% | neutral.900 90% / 60% | 어두운 글래스는 더 불투명해야 글자가 산다 |
| 그림자 | ink 5~8% | 검정 35~65% | + 면 차이가 주 신호 |
| 포커스 링·밑줄 | indigo | blue.300 | 3:1 |
| 카테고리 색 원 | 100~300 | 600~900 | 옅은 원은 다크에서 눈부시다 |
| 히트맵 | paper-deep → pink.400 | neutral.800 → pink.400 | 최고 단계 공통 |
| 선택 배경 | pink.50 | pink.950 | |
| hover 덧칠 | ink 4% | paper 6% | 면이 밝아지는 방향 |
| 스크림 | ink 40% | 검정 65% | |

## 4. 다크에서 특히 확인할 것
- **순백 면**: 북마크 OG 이미지 흰 배경, 마스코트 PNG 흰 여백, QR 코드 → `surface.default` 카드 안 + radius/원형 마스크. QR 은 흰 카드 유지(스캔 대비 필요) + 패딩 16.
- **블롭**(랜딩·로그인): `blob-*` alpha 라 그대로 OK. 다크에서 채도가 튀면 `opacity: .6`.
- **`gradient.paper`·`fade-right`**: 원시 참조라 밝게 남는다 → `surface.zone` 단색 / `linear-gradient(90deg, transparent, var(--mm-color-surface-canvas))`.
- **코드 하이라이트**: 다크 전용 테마 하나로 양쪽 공용(코드 블록은 항상 어둡다). `color.code.*` 매핑.
- **벤토 글래스**: 뒤에 크림(다크 neutral.900)이 있어야 보인다. 다크에서 블롭 위 벤토는 60% 로.
- **언어 배지 100 단계**(JS amber.100 등): 다크에서 눈부시다 → 다크는 `zone-deep` + 300 글자로 통일(16 §G).
- **에디터**: `zone` 위 글자 paper. 선택 영역 `blush`(pink.300) 대신 `pink.900` 로 오버라이드(브라우저 `::selection`).
- **이미지 블록**: `brightness(0.9)`. 사진은 그대로.
- **스켈레톤**: `zone-deep` #1F1816 이 카드 #382D2B 위에서 보이는지(보인다).
- **아이콘 SVG 하드코딩 색**: `currentColor` 로.

## 5. 검증
- 빌드가 다크 116쌍 검사(`contrast-report.json` mode=dark).
- `data-theme="dark"` 강제 후: ① `bg-white`·`text-black`·`bg-gray-*` 잔존 grep ② 흰 이미지 박스 ③ 로즈 버튼이 핑크로 바뀌는지 ④ 태그 wine 글자 읽히는지 ⑤ 글래스 모달 글자 대비 ⑥ 코드 블록이 카드보다 어두운지.

## 6. 하지 말 것 → 대신
| ❌ | ✅ |
|---|---|
| `dark:bg-neutral-900` | `bg-surface-default` |
| 다크 캔버스 `#000`·`#111` | `#1B1514`(토큰) |
| 다크에서 로즈 버튼 유지 | 토큰 그대로(핑크 + wine) |
| 다크 글래스 40% 모달 | 모달 90%, 벤토만 60% |
| 다크에서 `gradient.paper` | `surface.zone` |
| 다크 언어 배지 100 단계 | `zone-deep` + 300 |
| 다크에서 흰 QR 카드 제거 | 흰 카드 유지(스캔) |
