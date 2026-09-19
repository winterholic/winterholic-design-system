# 13 · 운영 (memoir)

## 1. 파일 구조
```
memoir/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ assets/brand/mascot.png     (기존 public/mascot.png 복사)
├─ tokens/
│  ├─ src/ palette.json(생성) · brand.json · color.light.json · color.dark.json
│  │       dimension.json · typography.json · effects.json · motion.json · component.json
│  ├─ scripts/ ramp.mjs · palette-from-anchors.mjs (ANCHORS: pink·blue·neutral·red·green·amber, fixed 로 기존 값 고정)
│  ├─ build.mjs   base 와 같은 구조 + Tailwind 별칭(primary·surface-low…) + legacy-aliases.css
│  └─ tokens.json · tokens.dark.json (생성)
├─ dist/ tokens.css · typography.css · tokens.js/.d.ts · tailwind.preset.cjs · tokens.scss · tokens.figma.json · legacy-aliases.css · contrast-report.json
├─ docs/ 00~15
└─ examples/preview.html
```

## 2. 토큰 변경 절차
base 13 §2 와 같다: 이유 → `tokens/src` 편집(색은 라이트·다크 둘 다) → `node tokens/build.mjs` → 새 조합은 `pairs` 에 → `docs/00` → `examples/preview.html` → `CHANGELOG` → 커밋 `tokens(memoir): …`.

memoir 추가 규칙
- 면(`surface.*`)을 바꾸면 No-Line 이 유지되는지 preview 로 본다. canvas·zone·default 세 층의 밝기 차이가 눈에 보여야 하고, 그렇다고 선처럼 보이면 안 된다.
- 핑크(`pink.400`) 위 글자 조합을 새로 만들면 반드시 `text.on-pink`. `pairs` 에 등록.
- 카테고리 색(`color.category.*`)은 드롭다운·벤토 헤더에만. 새 카테고리가 생기면 여기와 기획서 2.1 둘 다.

## 3. 이름 규칙
base 13 §3 + 접두 `--mm-`. Tailwind 프리셋은 시맨틱 경로(`bg-surface-zone`, `text-text-tertiary`) + 기존 별칭(`primary` `primary-dark` `secondary` `secondary-dark` `on-surface` `surface` `surface-low` `sub-pink` `sub-cream`, `shadow-soft`). **새 코드는 시맨틱 경로를 쓴다.** 별칭은 이관 중 호환용.

## 4. 버전
태그 `memoir-vX.Y.Z`. 기준은 base 와 같다. 종이 층(surface) 값 변경은 화면 전체 인상이 바뀌므로 minor 이상.

## 5. 소비 프로젝트(memoir-frontend) 채택 기준
- [ ] `dist/tokens.css` + `typography.css` + `legacy-aliases.css`(이관 중) 를 `app/globals.css` 위에서 import
- [ ] `tailwind.config.ts` 에 `presets: [require('…/memoir/dist/tailwind.preset.cjs')]`, 기존 `theme.extend.colors` 제거
- [ ] `grep -rnE "#[0-9a-fA-F]{6}" app components --include=*.tsx` 0건 (현재 24건 `#FF82A9` 등)
- [ ] `grep -rn "bg-white\|text-black\|bg-gray-\|border-gray-" app components` 0건
- [ ] `grep -rn "border-b\|divide-y\|<hr" app components` 캘린더 외 0건
- [ ] `bg-primary` 가 붙은 버튼 0건(→ `bg-action-primary-bg`)
- [ ] 다크 강제 후 순백 면 0
- [ ] 08 체크리스트

## 6. 알려진 한계·미결
- `prefers-contrast: more` 미지원. No-Line 시스템에는 특히 필요하다 → 다음 버전에 `border.ghost` 를 켜는 오버라이드 블록.
- 컴포넌트 코드 없음. 기존 `components/ui` 가 구현체. 15 대응표로 맞춘다.
- 로고 SVG 없음(`MemoirLogo.tsx` 가 텍스트 로고). 14 참조.
- Figma 수동 import.

## 7. 결정 기록
| 결정 | 근거 | 뒤집을 조건 |
|---|---|---|
| 기획서 `#000000` 대신 `#231917` | design-guide "순검정 진동". 대비 17.2 로 충분 | 없음 |
| 액션은 로즈(`#A1385E`), 핑크는 강조만 | 핑크 위 흰 글자 2.33. design-guide 도 Primary 를 로즈로 정의 | 없음 |
| 활성 메뉴 페리윙클 + 흰 글자(2.95) 유지 | 기획서 5.2 명시, 라벨 14/600 + 아이콘 동반으로 보완 | 접근성 감사 시 indigo 로 |
| `text.tertiary` 600 → 700 | 크림 면 위 4.33 미달 | 없음 |
| 다크 primary = 핑크 원색 + wine | 로즈는 어두운 면에서 죽는다 | 없음 |
| 코드 블록 항상 어둡게 | v4 시안·코드 카테고리 정체성 | 없음 |
| 카테고리 이모지 유지(드롭다운·헤더만) | 기획서 정체성 | 없음 |
| 컨테이너: 리스트 1280, 에디터 960/prose 680, 캘린더·대시보드 full | 기획서 "전체 너비 활용" + design-guide 비대칭 여백 | 없음 |
| 그림자 4단계만(none·soft·ambient·modal) | design-guide "Tonal Layering" | 없음 |
