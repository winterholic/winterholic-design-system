# 13 · 운영 (memoir) — 파일 구조, 토큰 변경 절차, 이름 규칙, 버전, 채택 기준, 결정 기록

## 1. 파일 구조
```
memoir/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ assets/brand/            memoir-symbol.png 정본 · 파생 로고/아이콘 · mascot.png · 레거시 apple-icon.png
├─ tokens/
│  ├─ src/                  ★ 단일 진실
│  │  ├─ palette.json       생성물. 앵커 pink·blue·neutral·red·green·amber, fixed 로 기존 값 고정
│  │  ├─ brand.json         브랜드 12색 + white/black
│  │  ├─ color.light.json   surface(종이 층)·text·border(예외 목록)·action·chip·status(+secure)·interactive·category·code·chart
│  │  ├─ color.dark.json    라이트와 경로 1:1
│  │  ├─ dimension.json     space·size(control·icon·avatar·container·layout)·breakpoint·radius·border·focus
│  │  ├─ typography.json    font.* + typography.* 21종
│  │  ├─ effects.json       shadow(+dark)·glass·gradient·opacity·blur·z-index
│  │  ├─ motion.json
│  │  └─ component.json     컴포넌트 토큰 30여 종
│  ├─ scripts/ramp.mjs · palette-from-anchors.mjs
│  ├─ build.mjs             src → tokens.json + dist/*. 라이트/다크 1:1·대비 116쌍 검사. + Tailwind 별칭 + legacy-aliases.css + .mm-glass-*
│  └─ tokens.json · tokens.dark.json (생성물)
├─ dist/  tokens.css · typography.css · tokens.js/.d.ts · tokens.scss · tokens.figma.json · tailwind.preset.cjs · legacy-aliases.css · contrast-report.json
├─ docs/ 00~16
└─ examples/preview.html
```

## 2. 토큰을 바꾸는 절차
1. 왜 필요한지 한 줄. 기존 토큰으로 안 되는 이유가 없으면 바꾸지 않는다.
2. `tokens/src/*.json` 편집. 색은 라이트·다크 둘 다.
3. `node tokens/build.mjs` — 참조 오류·라이트/다크 불일치·대비 미달이면 실패. 기준을 낮추지 않는다.
4. 새 색 조합은 `build.mjs` `pairs` 에 추가. 특히 **핑크·블러시 위 글자**는 `text.on-pink` 만 허용되니 새 조합을 만들면 반드시 검사망에.
5. `docs/00` 표, 상세 문서, `docs/16` 상황 갱신.
6. `examples/preview.html` 갱신 → 라이트/다크/375 확인. **면(`surface.*`)을 바꾸면 canvas·zone·default 세 층이 눈에 구분되는지, 그렇다고 선처럼 보이지 않는지 본다.**
7. `CHANGELOG.md`, 버전(§4).
8. 커밋 `tokens(memoir): …`.

### 원시 팔레트
`ANCHORS` 수정 → `node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json && node tokens/build.mjs`. `fixed` 는 기존 값 고정(pink 400/600/800, blue 400/600, neutral 950).

### 카테고리가 추가되면
`color.category.<name>`(라이트·다크), 기획서 2.1, `docs/03 §3` 골격표, `docs/06 §8` 본문 규격, `docs/12` 페이지 패턴, 드롭다운 항목. 이모지도 정한다.

## 3. 이름 규칙
`[카테고리].[역할 또는 스케일].[속성].[상태]`. 원시는 값 이름, 시맨틱은 역할 이름, 컴포넌트는 `component.<이름>.<부위>.<속성>`.
- CSS 변수 `--mm-` + 경로. 예 `--mm-color-surface-zone`.
- Tailwind 프리셋: 시맨틱 경로(`bg-surface-zone`, `text-text-tertiary`, `shadow-ambient`, `rounded-lg`, `h-control-md`, `z-modal`) + **기존 별칭**(`primary` `primary-dark` `secondary` `secondary-dark` `on-surface` `surface` `surface-low` `sub-pink` `sub-cream`, `shadow-soft`). 새 코드는 시맨틱 경로. 별칭은 이관 호환용.
- 타이포 클래스 `.mm-headline` 등, 로고 `.mm-logo` + `.mm-logo-mark`, 글래스 `.mm-glass-modal/.mm-glass-floating`.
- 데이터 속성: 테마 `data-theme`, 잠금 `data-locked`, 카테고리 `data-category`.

## 4. 버전
semver, 태그 `memoir-vX.Y.Z`.
| 변경 | 버전 |
|---|---|
| 토큰 삭제·이름 변경, 값의 의미 변경, 종이 층(surface) 값 변경 | major / surface 는 minor 이상 |
| 토큰·컴포넌트 규격·문서 추가 | minor |
| 대비 미세 조정·오탈자·빌드 수정 | patch |
이름 변경은 한 major 동안 `$deprecated`.

## 5. 소비 프로젝트(memoir-frontend) 채택 기준
- [ ] `dist/tokens.css` + `typography.css` + (이관 중) `legacy-aliases.css` 를 `app/globals.css` 위에서 import
- [ ] `tailwind.config.ts` 에 프리셋, 기존 `theme.extend.colors/boxShadow` 제거, `fontFamily.sans` 에 Pretendard 폴백
- [ ] `grep -rnE "#[0-9a-fA-F]{6}" app components --include=*.tsx` 0건(로고 SVG 제외)
- [ ] `grep -rn "bg-white\|text-black\|bg-gray-\|border-gray-\|text-gray-" app components` 0건
- [ ] `grep -rn "border-b\|divide-y\|<hr" app components` 캘린더 외 0건
- [ ] `grep -rn "bg-primary" app components | grep "text-white"` 0건
- [ ] `grep -rn "shadow-sm\|shadow-md\|shadow-lg\|shadow-xl" app components` 0건(→ none/soft/ambient/modal)
- [ ] `grep -rn "dark:" app components` 0건
- [ ] 카드가 zone 위에 있는지(캔버스 위 흰 카드 0)
- [ ] 화면마다 로딩·빈·오류·(보안) 잠김 상태
- [ ] 다크 강제 후 순백 면 0, 로즈 버튼 → 핑크 전환
- [ ] `docs/08` 체크리스트

임시 위반은 `/* TODO(ds): 이유 */`.

## 6. base 와의 관계
구조·빌드·문서 목차는 `winterholic-base` 와 같다. 값이 다른 곳: 팔레트(핑크·로즈·페리윙클·따뜻한 회색), 캔버스(크림 종이 층), 서체(Jakarta + Pretendard), 그림자(4단계·ink 틴트), 테두리(No-Line 예외 목록), 글래스, 헤더 2단·사이드바 없음, 카테고리 10종 전용 컴포넌트, 보안 상태. base 의 **구조** 변경은 여기도 맞춘다. **값**은 독립. 세 시스템 모두 `docs/16-situations.md` 를 갖는다.

## 7. 결정 기록
| 결정 | 근거 | 뒤집을 조건 |
|---|---|---|
| 기획서 `#000000` 대신 `#231917` | design-guide "순검정 진동". 대비 17.2 | 없음 |
| 액션 로즈 `#A1385E`, 핑크 `#FF82A9` 는 강조만 | 핑크 위 흰 글자 2.33. design-guide 도 Primary 를 로즈로 | 없음 |
| 활성 메뉴 페리윙클 + 흰 글자(2.95) 유지 | 기획서 5.2 명시. 라벨 14/600 + 체크 아이콘 | 접근성 감사 시 indigo |
| `text.tertiary` 600 → 700, `secondary` 700 → 800 | 크림 면 위 4.33 미달 | 없음 |
| 캔버스 순백 → `#FFF9F8`, 종이 3층 | 톤 레이어링이 성립하려면 캔버스가 카드보다 어두워야 | 없음 |
| 다크 primary = 핑크 원색 + wine | 로즈는 어두운 면에서 죽는다 | 없음 |
| 다크 blush = pink.300 | wine 글자 대비 유지 | 없음 |
| 코드 블록 항상 어둡게 | v4 시안·코드 카테고리 정체성 | 없음 |
| 카테고리 이모지는 드롭다운·헤더만 | 기획서 정체성, 본문 문장에는 소음 | 없음 |
| 컨테이너: 리스트 1280, 에디터 960/prose 680, 캘린더·대시보드 full | 기획서 "전체 너비" + design-guide 비대칭 여백 | 없음 |
| 그림자 4단계(none·soft·ambient·modal) | design-guide "Tonal Layering" | 없음 |
| 인풋 두 형태(underline·filled), 상자형 없음 | design-guide "Minimalist Underline" | 없음 |
| 페이지네이션 없음, "더 보기"·무한 스크롤 | 개인 메모 리스트 성격 | 항목 1만 개 이상이면 재검토 |
| 로고 워드마크 세리프 → Jakarta 800 | design-guide 서체 규정 | 없음 |
| Tailwind 기존 클래스명 별칭 유지 | 이관 중 화면 무붕괴 | 이관 완료 후 제거 검토 |

## 8. 알려진 한계·미결
- `prefers-contrast: more` 미지원. No-Line 시스템이라 특히 필요 → 다음 버전에 `border.ghost` 를 켜는 오버라이드 블록(`@media (prefers-contrast: more) { :root { --mm-color-border-subtle: var(--mm-neutral-300); } }` 식).
- 컴포넌트 코드 없음. `components/ui` 가 구현체. 15 대응표.
- 로고 SVG 재제작 미완(14).
- Figma 수동 import.
- 에디터 라이브러리(노션형 블록) 선택은 소비 프로젝트 몫. 이 시스템은 블록 규격만 준다.
