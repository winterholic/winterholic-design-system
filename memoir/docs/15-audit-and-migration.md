# 15 · 기존 디자인 가이드 점검과 이관 안내 (memoir)

읽은 것: `docs/Memoir-Planning.md` §5(컬러·레이아웃·카테고리 UI), `design-guide/design-guide.md`(Digital Editorial), `design-guide/memo.txt`(Stitch 프롬프트 원칙), `design-guide/etc/v4/screen.png`(코드 스니펫 시안), `memoir-frontend/tailwind.config.ts`, `app/globals.css`, `components/ui/*`, `components/layout/*`. 2026-09-19 기준.

## 1. 잘 돼 있던 것 (그대로 옮김)
- 컨셉이 뚜렷하다: Warm Minimalist, No-Line, 톤으로 깊이, 파랑 = 상호작용, 순검정 금지, 대문자 메타 라벨, 넉넉한 행간.
- 헤더 의존 설계(사이드바 없음, 60 + 44 sticky), 카테고리별 전용 UI 표.
- 색 5개(핑크·블루·블러시·크림·잉크)와 파생 2개(로즈·인디고)가 이미 tailwind 에 있다.
- 타이포 4단계(display 3.5rem / headline 1.75rem / body 1rem·1.6 / label 0.75rem 대문자).
- 컴포넌트 골격(Button·Chip·Input·Modal·WideModal·PromptModal·SearchBar·CustomSelect·CodeMirrorEditor·MemoirLogo).
- 모션 4종(slide-in-right·slide-up·fade-in·shake).

## 2. 없거나 어긋나 있던 것 → 보완

| # | 발견 | 근거 | 보완 |
|---|---|---|---|
| 1 | **문서 3개가 서로 다른 말을 한다** | 기획서 5.1 "메인 블랙 #000000 텍스트", design-guide "순검정 금지 #231917". 기획서 "CTA #FF82A9 + 흰 글자", design-guide "Primary #a1385e" | 하나로: 글자 ink, 액션 로즈, 핑크는 강조. 13 §7 결정 기록 |
| 2 | **primary 버튼 대비 미달** | `Button.tsx` `bg-primary text-white` = #FF82A9 위 흰 글자 **2.33:1**. 10곳 | `action.primary` = 로즈(6.48). 프리셋 별칭 `bg-primary` 는 남지만 버튼은 `bg-action-primary-bg` 로 |
| 3 | **보조 버튼이 테두리** | `secondary: "bg-white text-primary border border-primary/20"` — No-Line 위반 + 핑크 글자 2.33 | `action.secondary` = paper-deep 면 + 로즈 글자, 테두리 없음 |
| 4 | **텍스트 핑크 남용** | `text-primary` 68곳: 강조 단어뿐 아니라 본문·아이콘에 #FF82A9 (2.33) | `text.brand`(로즈)로. 핑크 글자는 0건이 목표 |
| 5 | **No-Line 인데 테두리 24곳** | `border`·`border-b`·`divide-y` 24건(캘린더 제외해도 다수) | 면 차이(zone/default/zone-deep)로. 15 §3 대응표 |
| 6 | **그림자 남용** | `shadow-sm` 20, `shadow-md` 9, `shadow-lg` 7, `shadow-xl` 2 (design-guide: "Drop shadow 금지") | 4단계만: none(카드)·soft(hover·드롭다운)·ambient(플로팅)·modal. 프리셋이 Tailwind 기본 shadow-md 등을 덮지는 않으니 grep 으로 치환 |
| 7 | **hex 리터럴** | tsx 안 `#FF82A9` 24건 등 55건 | 토큰. 로고 SVG 그라데이션은 14 로 정리 |
| 8 | **다크 모드 없음** | `dark:` 1건 | 따뜻한 다크 전체 추가 |
| 9 | **로고가 가이드와 어긋남** | `MemoirLogo.tsx` 워드마크 Georgia 세리프 + 핑크 그라데이션 텍스트 | 14 §3: Jakarta 800, m 로즈. 기존 SVG 는 심볼만 재사용 |
| 10 | **캔버스가 순백** | `--background: #ffffff`, `bg-surface-low` 78곳이 카드 배경으로 쓰임 → 캔버스와 카드가 같은 흰색, 톤 레이어링 불성립 | canvas paper #FFF9F8 → zone paper-tint → card white. `surface-low` 별칭은 canvas 로 매핑(기존 코드에서 카드 배경으로 쓴 곳은 `bg-surface-zone` 으로 바꿔야 한다) |
| 11 | **활성 메뉴 흰 글자 대비** | 페리윙클 #7F95D1 위 흰 글자 2.95 | 유지하되 라벨 14/600 + 체크 아이콘, `surface.interactive` 를 indigo 로 바꾸는 선택지 |
| 12 | 캡션 회색 | 기획서 "#555555 계열", 코드 `text-on-surface/60` 류 | `text.tertiary` #635654 (크림 위 6.2) |
| 13 | 한글 폰트 폴백 없음 | `fontFamily.sans: [var(--font-jakarta), sans-serif]` — 한글이 시스템 고딕으로 | Pretendard 를 두 번째로. 02 §1 |
| 14 | 타이포 4단계만 | title·caption·tag·code·pin 없음 → 즉석 `text-sm font-semibold` 조합 | 역할 스타일 21종 |
| 15 | 간격 규칙 없음 | 기획서 "여백 좌우 24~32" 만 | 4px 스케일 + 리스트 24·섹션 48 + 컨테이너 6종 |
| 16 | radius 혼용 | `rounded-lg`(8)·`rounded-xl`(12)·`rounded-2xl`(16)·`rounded-full` 즉석 | 7단계 + 컴포넌트별 지정 |
| 17 | 글래스 규격 없음 | 기획서 `bg-white/40 backdrop-blur-xl`, design-guide `80% + 20px` 두 값 | `glass.bg-floating`(40, 벤토) / `bg-modal`(80, 모달) 로 역할 분리 |
| 18 | 카테고리 식별색 없음 | 드롭다운에서 이모지만 | `color.category.*` 10종 |
| 19 | 보안 상태 색 없음 | 기획서 "경고/보안 = 핑크 계열" 만 | `status.secure` + 잠금 블러·카운트다운 토큰 |
| 20 | 코드 블록 색 즉석 | v4 시안 `#1a1a1a` 하드코딩 | `color.code.*` 하이라이트 포함 |
| 21 | 컴포넌트 규격 없음 | 카테고리별 카드가 문서에 문장으로만 | 06 §8 카테고리별 본문 규격 + 토큰 |
| 22 | 접근성 검사 없음 | | 빌드 116쌍 + No-Line 함정 규칙(08) |
| 23 | 단일 소스 없음 | tailwind.config 이 곧 소스 | DTCG → 8종 산출, 프리셋이 기존 클래스명 유지 |
| 24 | z-index·모션 토큰 없음 | `z-50` 등 즉석, keyframes 만 | `z-index.*`, `motion.*` |

### 유지한 것
- 카테고리 이모지(드롭다운·헤더). 기획서 정체성.
- 활성 메뉴 페리윙클 + 흰 글자. 기획서 명시. 보완 조건 붙임.
- 코드 블록 다크. v4 시안.
- 기존 tailwind 클래스명. 프리셋 별칭으로 전부 살렸다.

## 3. 이관 안내 (memoir-frontend)

### 0단계 — 로드 (화면 거의 무변경, 다크 획득)
```css
/* app/globals.css 맨 위 */
@import '../vendor/memoir/tokens.css';
@import '../vendor/memoir/typography.css';
@import '../vendor/memoir/legacy-aliases.css';   /* --background/--foreground, .text-display 등 */
```
```ts
// tailwind.config.ts
import preset from './vendor/memoir/tailwind.preset.cjs';
const config: Config = { presets: [preset], content: [...], theme: { extend: { fontFamily: { sans: ['var(--font-jakarta)', '"Pretendard Variable"', 'Pretendard', 'sans-serif'] } } } };
// 기존 theme.extend.colors / boxShadow 삭제 — 프리셋이 같은 이름을 제공한다
```
바뀌는 것: `--background` 가 #FFF9F8(크림 캔버스)로, `text-primary`(핑크)는 값 유지. 카드가 `bg-surface-low`(=canvas)라 캔버스와 같은 색이 된다 → 1단계.

### 1단계 — 종이 층 세우기
`bg-surface-low` 로 카드 배경을 쓴 곳(78건) → 카드는 `bg-surface-default`(흰), 카드가 놓이는 구역은 `bg-surface-zone`. 한 화면씩: 구역 컨테이너에 zone, 카드에 default.

### 2단계 — 버튼·글자 핑크 걷어내기
- `Button.tsx`: primary `bg-action-primary-bg text-action-primary-text hover:bg-action-primary-bg-hover`, secondary `bg-action-secondary-bg text-action-secondary-text`(테두리 제거), ghost `text-action-ghost-text hover:bg-action-ghost-bg-hover`. 높이 `h-control-md`(44).
- `text-primary`(68건): 강조 단어·로고 m → `text-text-brand`, 아이콘 → `text-text-tertiary`, 링크 → `text-text-link`.
- `bg-primary` 배지·도트 → 칩 활성은 `bg-chip-bg-active text-chip-text-active`, 장식 도트만 `bg-brand-pink`.

### 3단계 — 선·그림자 걷어내기
- `border-b`·`divide-y`·`border` 24건 → 여백 24 또는 zone-deep 면. 캘린더 그리드만 `border-border-default`.
- `shadow-sm/md/lg/xl` → 카드 없음, 드롭다운 `shadow-soft`, FAB·플로팅 `shadow-ambient`, 모달 `shadow-modal`.

### 4단계 — 타이포·간격
즉석 `text-sm font-semibold` → `.mm-label-md` 등. `p-4 gap-3` 류는 컴포넌트 규격(06)으로. 로고 교체(14).

### 5단계 — hex 0, 별칭 제거
`grep -rnE "#[0-9a-fA-F]{6}"` 0건. `legacy-aliases.css` 제거, 프리셋 별칭(`primary` 등)은 남겨도 되지만 새 코드는 시맨틱.

### 대응표
| 기존 | 새 토큰 / 클래스 |
|---|---|
| `bg-white` 카드 | `bg-surface-default` (zone 위에서) |
| `bg-surface-low` 카드 배경 | `bg-surface-zone` (구역) / 캔버스는 body 가 이미 canvas |
| `bg-sub-cream` | `bg-surface-cream` |
| `bg-sub-pink` 배지 | `bg-chip-tag-bg text-chip-tag-text` |
| `text-on-surface` | `text-text-primary` (별칭 유지) |
| `text-on-surface/60` | `text-text-tertiary` |
| `text-primary` 강조 | `text-text-brand` |
| `text-secondary-dark` 링크 | `text-text-link` |
| `bg-primary text-white` 버튼 | `bg-action-primary-bg text-action-primary-text` |
| `bg-secondary text-white` 활성 메뉴 | `bg-action-interactive-bg text-action-interactive-text` |
| `border border-primary/20` | 없음 → `bg-action-secondary-bg` |
| `border-b border-gray-100` | 없음 → `space-y-6` 또는 `bg-surface-zone-deep` |
| `shadow-soft` | 유지(=`shadow.soft`) |
| `shadow-md`·`lg` | `shadow-ambient` / `shadow-modal` |
| `rounded-lg` 버튼 | `rounded-md`(8) |
| `rounded-2xl` 카드 | `rounded-lg`(12) / 벤토 `rounded-xl`(16) |
| `.text-display` 등 | `.mm-display-lg` 등(별칭 CSS 가 잇는다) |
| `bg-white/40 backdrop-blur-xl` | `bg-[var(--mm-glass-bg-floating)] backdrop-blur-[var(--mm-glass-blur-strong)]` 또는 `.mm-glass-floating` 유틸 |
| `z-50` | `z-dropdown` / `z-sticky` / `z-modal` |
| `animate-fade-in` 등 | 유지. duration 만 토큰으로 |

## 4. 점검 방법 (재현)
```bash
cd C:/mydevelop/memoir/memoir-frontend
grep -rn "bg-primary" app components --include=*.tsx | grep -c "text-white"      # 10
grep -rhoE "(bg|text|border)-(primary|secondary|sub-pink|sub-cream|surface-low|on-surface)[a-z-]*" app components | sort | uniq -c | sort -rn
grep -rn "border\b\|border-\|divide-y\|<hr" app components --include=*.tsx | grep -v "border-none\|border-0\|rounded" | wc -l   # 24
grep -rn "shadow-" app components --include=*.tsx | grep -oE "shadow-[a-z]+" | sort | uniq -c
grep -rn "dark:" app components | wc -l                                           # 1
node -e "import('../../winterholic-design-system/winterholic-base/tokens/scripts/ramp.mjs').then(m=>console.log(m.contrast('#FF82A9','#FFFFFF')))"  # 2.33
```
