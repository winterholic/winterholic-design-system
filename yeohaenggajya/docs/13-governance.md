# 13 · 운영 (여행가쟈) — 파일 구조, 원본과의 관계, 변경 절차, 결정 기록

## 0. 이 시스템의 성격
원본 프로젝트(`C:\tour-data\frontend`)는 **디자인을 수정할 계획이 거의 없다.** 이 저장소는 원본 `tokens.css` + `.claude/skills/design-system` 을 winterholic 저장소 형식(DTCG → dist → 문서 16편)으로 옮긴 **기록·참조본**이다. 따라서
- 값은 원본 그대로(73개 변수 전부 `legacy-aliases.css` 로 검증, 그림자 표기 차이만).
- **정본은 원본.** 두 곳이 어긋나면 원본 코드(`tokens.css`·`components/`)가 이기고, 이 저장소를 고친다.
- 원본에 없는 것(시맨틱 이름·컴포넌트 토큰·상황 사전·무대 스코프)은 이 저장소가 더한 해석이다. 원본에 되가져갈지는 별건.

## 1. 파일 구조
```
yeohaenggajya/
├─ README.md · CLAUDE.md · CHANGELOG.md · package.json
├─ assets/brand/          로고 svg(outlined 2종·icon)·png 640 (public/brand 에서 복사)
├─ tokens/
│  ├─ src/
│  │  ├─ palette.json     원시 이름 그룹(램프 없음): hanji·dancheong·ink·korean·holo·stage — 원본 값
│  │  ├─ brand.json
│  │  ├─ color.light.json 시맨틱(한지) — surface·text·border·action·rarity·status·chip·interactive·band·fx·chart
│  │  ├─ color.dark.json  무대(tone=dark) — 라이트와 경로 1:1
│  │  ├─ dimension.json   space(원본 sp 번호)·size(control·icon·capsule·card·dex-cell·container w-*·layout)·breakpoint·radius·border·focus
│  │  ├─ typography.json  font 7종 + 역할 스타일 19종
│  │  ├─ effects.json     shadow(stamp·paper·foil·holo·deep)·gradient(band·holo)·texture·opacity·blur·z-index
│  │  ├─ motion.json      dur·ease + 키프레임 주기·회전·스케일
│  │  └─ component.json   컴포넌트 토큰 30종(원본 module.css 실측)
│  ├─ scripts/ramp.mjs    대비 계산에만 사용(램프 생성 안 함)
│  ├─ build.mjs           src → tokens.json + dist. 무대는 [data-tone=dark] 스코프, prefers-color-scheme 무시. legacy-aliases.css 생성
│  └─ tokens.json · tokens.dark.json
├─ dist/  tokens.css · typography.css(.yg-* 역할 클래스·.yg-band·.yg-hanji-scroll) · tokens.js/.d.ts · tokens.scss · tokens.figma.json · tailwind.preset.cjs · legacy-aliases.css · contrast-report.json
├─ docs/ 00~16 (11 은 등급·연출)
└─ examples/preview.html
```

## 2. 변경 절차 (원본이 먼저)
1. 디자인 값이 바뀌면 **원본 `tokens.css` 와 스킬 references 가 먼저** 바뀐다(원본 규약: 의미 기반 이름, raw hex 금지, `tokens.md` 반영).
2. 그 다음 이 저장소 `tokens/src` 에 같은 값을 반영 → `node tokens/build.mjs` → 대비·경로 검사 통과.
3. `dist/legacy-aliases.css` 를 원본 `tokens.css` 와 대조(아래 명령) — 값이 같아야 한다.
4. `docs/00`·해당 문서·`docs/16` 갱신, `examples/preview.html`, `CHANGELOG`.
```bash
node -e "…"   # README §검증 의 대조 스크립트(73개 변수 diff 0, 그림자 표기 차이만 허용)
```
원본을 거치지 않고 이 저장소만 바꾸면 드리프트다. 원본 `CLAUDE.md` 의 "문서 정본 갱신 규칙"과 같은 정신.

## 3. 이름 규칙
- CSS 변수 `--yg-` + 경로. 원본 변수명은 별칭으로 전부 유지(`--hanji` `--dc-red` `--sp-4` `--r-common` `--f-myeongjo` `--sh-stamp` `--dur-fast` `--w-doc`…).
- 등급 키는 원본 코드와 같이 `common rare epic legend unique moment`(`legend` 이지 `legendary` 아님 — 라벨 텍스트만 풀네임).
- 타이포 클래스 `.yg-heading` `.yg-body` `.yg-brush` `.yg-rank` `.yg-mono` `.yg-seal`… 서체가 이름에 드러난다.
- 데이터 속성: 무대 `data-tone="dark"`, 등급 `data-rarity`, 캡슐 모션 `data-motion`.
- Tailwind 프리셋: 원본 `@theme inline` 의 `background`·`foreground` 유지 + 시맨틱 경로. 원본은 CSS Modules 우선이라 프리셋은 레이아웃 보조용.

## 4. 버전
태그 `yeohaenggajya-vX.Y.Z`. 원본 값이 바뀌면 minor, 시맨틱 해석·문서만 바뀌면 patch, 등급 체계·서체 역할이 바뀌면 major.

## 5. 채택 기준 (원본이 이 저장소를 쓸 경우 — 선택)
원본은 이미 자체 `tokens.css` 로 완결이라 **채택 의무가 없다.** 쓰고 싶다면:
- [ ] `dist/tokens.css` + `legacy-aliases.css` 로드 → 원본 `tokens.css` 를 대체해도 화면 불변(대조 스크립트로 증명)
- [ ] `typography.css` 의 `.yg-*` 클래스는 선택(원본 module.css 가 서체를 직접 지정)
- [ ] 원본 Bright Line 11 + 스킬 체크리스트가 그대로 유효
다른 프로젝트가 여행가쟈 톤을 빌릴 때: `dist/` 만 가져가고 아트워크(필터 프레임·도장·민화)는 별도 라이선스 확인.

## 6. 원본 스킬과의 관계
| 원본 | 이 저장소 |
|---|---|
| `CLAUDE.md` Bright Line 11 | 헌법. 이 저장소 `CLAUDE.md` 가 그대로 인용 |
| `references/tokens.md` | 01·02·03·04·05 (값 + 대비 실측 보강, `--ink-3` 옛 값 정정) |
| `references/components.md` | 06 (실측 수치·상태·a11y 보강) + 부채 트래커 → 15 |
| `references/copy-and-a11y.md` | 07·08 |
| `references/page-blueprints.md` | 12 (실제 라우트 반영) |
| `references/rarity-system.md` | 11 |
| 없음 | 00 결정표 · 09 무대 · 10 아트워크 · 13 · 14 · 16 상황 사전 |

## 7. 결정 기록
| 결정 | 근거 | 뒤집을 조건 |
|---|---|---|
| 값을 재생성하지 않고 원본 고정 | 디자인 변경 계획 없음(사용자 2026-09-19) | 원본이 리디자인하면 |
| 다크 모드 없음, 무대만 `data-tone` | Bright Line 2. 시스템 다크는 한지 정체성 파괴 | 없음 |
| `ink-4` 를 `text.decorative` 로 격리 | 2.49:1. 원본 부채 트래커의 권장안 중 "용도 좁히기" 채택(값은 안 바꿈) | 원본이 값을 어둡게 조정하면 |
| `--ink-3` 값은 코드(#735F47) 기준 | 스킬 문서의 #7c6b53 은 옛 값 | 없음 |
| 등급 키 `legend` 유지 | 코드 클래스명 호환 | 없음 |
| 버튼 6/10/18 예외 토큰화 | 원본 실측. 디자인 불변 | 없음 |
| Toast 규격만 정의(미구현) | 원본 부채 | 구현되면 실측으로 갱신 |
| 11 을 등급·연출로 | 차트 없음, 등급이 데이터 시각화 | 없음 |

## 8. 알려진 한계·미결
- 원본 부채: `--ink-4` 21곳(15), Toast·Sheet 일부 미구현, 지도 SDK 교체 예정.
- Storybook a11y 결과는 이 저장소에 없다(원본에서 실행).
- 아트워크 원본(민화·필터 프레임)은 복사하지 않았다(오너 제공 에셋, 라이선스 경계). 로고만.
- Figma 수동 import.
