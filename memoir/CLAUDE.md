# memoir design system — AI 에이전트 규칙

`C:\mydevelop\memoir\memoir-frontend` 의 UI 를 만들거나 고칠 때 따른다. 구조는 `winterholic-base/CLAUDE.md` 와 같고, 아래는 memoir 전용이다. 프로젝트 `CLAUDE.md`(frontend-design 스킬 사용 등)와 함께 적용한다.

## 시작할 때
1. `docs/00-decision-guide.md` §1(면과 구획)부터.
2. 화면은 `docs/12-page-patterns.md` 의 카테고리 골격에서, 컴포넌트는 `docs/06-components.md`.
3. 기존 코드를 고칠 때는 `docs/15-audit-and-migration.md` 대응표.

## 반드시
- 토큰만: `var(--mm-…)`, 프리셋 클래스(`bg-surface-zone` `text-text-brand`), `.mm-*` 타이포 클래스. hex·임의 px 금지.
- **선 대신 면.** `border`·`border-b`·`divide-y`·`hr` 로 구획하지 않는다. 카드는 `bg-surface-zone` 위에 `bg-surface-default`. 카드 안 구획은 `zone-deep`. 예외는 캘린더 그리드·인풋 밑줄·포커스 링·체크박스.
- **그림자는 플로팅에만.** 카드 `shadow` 없음. 드롭다운 `shadow-soft`, FAB·플로팅 `shadow-ambient`, 모달 `shadow-modal`.
- **핑크 `#FF82A9`(`bg-primary`·`text-primary`)를 글자·버튼 배경에 쓰지 않는다.** 버튼은 `action.primary`(로즈), 강조 글자는 `text.brand`(로즈), 핑크는 칩 활성·히트맵·로고 m.
- **파랑은 클릭 가능한 것에만**(링크 `text.link`, 활성 메뉴 `action.interactive`, 포커스).
- 글자 `#231917`(`text.primary`). `#000`·`text-black` 금지.
- 헤더 의존: 필터·검색·액션은 서브 헤더·메인 헤더에. 사이드바·콘텐츠 툴바 금지.
- 리스트 항목 사이 24, 카드 패딩 24, 섹션 48.
- Plus Jakarta Sans 뒤에 Pretendard 폴백. 메타는 `.mm-label`(대문자 자간).
- 화면마다 로딩·빈·오류·(보안이면) 잠김 상태.
- 보이스: 해요체, 동사 버튼, 미국 SaaS 톤 금지, 보안 과장 금지.

## 하지 않는다
`dark:` 분기 · 카드 hover 떠오름(`translateY`) · 그라데이션 버튼·텍스트 · 세리프 로고 · 카테고리 이모지를 본문 문장에 · 모달을 순백 캔버스 위 글래스로.

## 토큰을 고칠 때
`tokens/src` → `node tokens/build.mjs` → 실패 해결 → `docs/00` → `examples/preview.html` → `CHANGELOG`. 면(`surface.*`) 변경은 preview 에서 세 층이 구분되는지 본다.

## 완료 전
```bash
node tokens/build.mjs
grep -rn "bg-primary" C:/mydevelop/memoir/memoir-frontend/app C:/mydevelop/memoir/memoir-frontend/components | grep "text-white"   # 0
grep -rnE "#[0-9a-fA-F]{6}" C:/mydevelop/memoir/memoir-frontend/app C:/mydevelop/memoir/memoir-frontend/components --include=*.tsx   # 0 (로고 SVG 제외)
grep -rn "border-b\|divide-y" C:/mydevelop/memoir/memoir-frontend/app C:/mydevelop/memoir/memoir-frontend/components   # 캘린더 외 0
```
