# 23 · 일러스트 자산 명세 (Ttakkari)

앱 로고·마스코트·빈 상태·오류·온보딩 일러스트의 **필요 목록과 규격**, 그리고 컴포넌트의 일러스트 자리(`.tk-art`)를 정리한다. 이미지는 별도 세션(GPT 이미지 생성)이 만들고, 이 시스템은 이미지를 새로 만들지 않는다. 크기·형식을 바꾼 웹 파생본만 만든다.

## 1. 원칙

- 일러스트는 **장식**이다. 뜻은 옆 글(`.tk-empty__title` + 한 줄 이유 + 행동 하나)이 말한다. `alt=""`.
- 한 화면에 한 장. 목록 행·배지·아바타 자리에는 쓰지 않는다(아이콘이 맡는다).
- 캐릭터는 하나다: 짧고 둥근 귀가 있는 **토끼형 빵 심부름꾼**(크림 몸, Ink 외곽선, Blue 목도리, 크림·Mint 앞치마, 빵 봉지). Blue 는 사람의 지시, Mint 는 에이전트의 표식이라는 시스템 규칙과 맞다. 겁에 질리거나 피해를 입는 연출은 없다(귀엽고 부지런하게).
- 앱의 에이전트 아바타(`.tk-avatar--agent`, '따')와 마스코트는 **다른 층**이다. 아바타는 정보 표지(채팅 글쓴이), 마스코트는 감정 표지(빈·오류·온보딩). 서로 대체하지 않는다.
- 민트 글로우·네온·그라데이션·반짝이(sparkles) 연출 금지. 시드 색(Paper `#F4F4ED` · Ink `#080705` · Blue `#296EB4` · Mint `#00F0B5`)을 지향한다. 생성물의 면 색이 hex 와 픽셀 단위로 같다고 보증하지 않는다.
- 이미지 안에 글자·숫자·UI 를 넣지 않는다(번역·접근성·다크 대응이 깨진다).

## 2. 규격

| 항목 | 값 |
|---|---|
| 원본 | 1254×1254 정사각, RGBA PNG, **투명 배경**, 그림은 중앙 80% 안 |
| 외곽선 | Ink, 일정한 굵기, 면은 평평한 색(그림자·그라데이션 없음) |
| 웹 파생 | `assets/art/<키>-480.webp`(1x) · `-960.webp`(2x). 투명 유지. 예산 60 KB · 180 KB |
| 슬롯 크기 | `.tk-art--sm` 96 · 기본 154 · `--lg` 230 (CSS px, 정사각) |
| 로딩 | `loading="lazy" decoding="async"` + `width`/`height` 속성으로 자리 확보(레이아웃이 밀리지 않는다) |
| 접근성 | `alt=""` (장식). 이미지가 정보를 담는 예외는 만들지 않는다 |
| 다크 | 투명 PNG 의 Ink 외곽선이 다크 캔버스에서 묻힌다. `.tk-art > img` 가 토큰 `color.art.halo` 로 외곽에 Paper 한 겹을 두른다(다크만). 별도 다크 이미지는 필요 없다 |
| 고대비 | 윤곽 띠가 있어 형태가 남는다. 이미지 자체의 색 대비는 보증하지 않는다(확인 필요) |

파생본은 `python3 assets/art/build-art.py`(원본 `brand/generated/{states,onboarding,domain-empty}`)로 다시 만든다. 바깥 투명 여백을 잘라 같은 상자 안에서 그림이 크게 보이게 한다. 예산을 넘으면 실패하고, 품질을 낮추는 대신 원본을 다시 의뢰한다.

## 3. 자리(컴포넌트)

```html
<!-- 그림이 있을 때 -->
<figure class="tk-art tk-art--md" data-art="state-empty">
  <img src="/art/state-empty-480.webp" srcset="/art/state-empty-480.webp 480w, /art/state-empty-960.webp 960w" sizes="154px" alt="" width="480" height="480" loading="lazy" decoding="async">
</figure>
<!-- 그림이 아직 없거나 불러오지 못했을 때: 자리만 -->
<figure class="tk-art tk-art--md" data-pending data-art="state-not-found"><svg class="tk-icon" aria-hidden="true"><use href="#i-image"/></svg></figure>
```

- 쓰는 곳은 `.tk-empty > .tk-art`(빈·오류·오프라인·권한), 온보딩 한 장짜리 화면, 로그인 위 장식. 미리보기는 `examples/art.html`.
- `data-pending` 은 점선 정사각 + 아이콘이다. 이미지 로드 실패 시 React 는 `onError` 로 `data-pending` 을 켜서 같은 자리를 지킨다.
- 가로 모드 폰(높이가 낮음)에서는 자동으로 줄어든다.

## 4. 목록과 상태

납품 상태는 `brand/generated/manifest.md`(생성 세션의 기록) 기준이다. **납품 = 원본 PNG 가 있고 웹 파생본이 만들어짐.**

### 4.1 상태 일러스트 (`states/`)

| 키 | 쓰는 곳 | 비율·배경 | 상태 |
|---|---|---|---|
| `state-empty` | 빈 세션·빈 목록 기본 | 1:1 투명 | 납품 |
| `state-working` | 오래 걸리는 작업 전체 화면(짧은 작업에는 쓰지 않는다. Run 카드가 맡는다) | 1:1 투명 | 납품 |
| `state-complete` | 작업 완료 전체 화면·온보딩 마지막. 크게 축하하지 않는다 | 1:1 투명 | 납품 |
| `state-error` | 500·렌더 오류 화면(14 §7). 일러스트 없음 규칙을 이 장으로 대체 | 1:1 투명 | 납품 |
| `state-approval-wait` | 승인 대기가 길어질 때 전체 화면(Approval 카드 자체에는 쓰지 않는다) | 1:1 투명 | 납품 |
| `state-offline` | 오프라인 전체 화면(띠 `.tk-banner` 와 함께) | 1:1 투명 | 납품 |
| `state-usage-limit` | 사용량 한도 도달 | 1:1 투명 | 납품 |

### 4.2 온보딩 (`onboarding/`)

| 키 | 쓰는 곳 | 상태 |
|---|---|---|
| `onboarding-01-intro` | 첫 실행 1/3: 소개 | 납품 |
| `onboarding-02-task` | 2/3: 작업 전달 | 납품 |
| `onboarding-03-result` | 3/3: 결과 받기 | 납품 |

### 4.3 도메인 빈 상태 (`domain-empty/`) — 21 의 아키타입과 1:1

| 키 | 아키타입 | 상태 |
|---|---|---|
| `empty-github-project` | A 저장소 열람 · B PR | 납품 |
| `empty-notebook-library` | C 자료 노트 | 납품 |
| `empty-ml-research` | D 연구 지표 | 납품 |
| `empty-blog` | E 글쓰기 | 납품 |
| `empty-harness-visualization` | F 구조 그래프 | 납품 |
| `empty-stock-analysis` | G 시장 대시보드 | 납품 |
| `empty-game-creation` | H 창작 작업대 | 납품 |
| `empty-remote-control` | I 원격 조종 | 납품 |
| `empty-work-visualization` | J 결과 갤러리·비교 | 납품 |

### 4.4 브랜드·참고 (`mascot/` `icons/` `concepts/`) — 앱에 연결하지 않았다

| 파일 | 용도 | 상태·결정 |
|---|---|---|
| `mascot/rabbit-identity-master-1254.png` | 캐릭터 기준 원본(다음 컷의 참조 이미지) | 납품, 참조 전용 |
| `icons/app-icon-light-1024.png` · `app-icon-dark-1024.png` | PWA 아이콘 후보(마스코트) | 납품. **교체는 사용자 결정**: 지금 정본은 '따' 로고(16). OS 마스크 안전영역 검증 미실시 |
| `icons/favicon-simple-transparent.png` · `favicon-16/32.png` | 파비콘 후보 | 납품. 같은 결정 |
| `icons/splash-paper-portrait.png` | 세로 스플래시 후보 1024×1536 | 납품. 같은 결정 |
| `concepts/*` | 시안 비교·전체 미리보기 | 참조 전용 |

### 4.5 아직 없는 컷(다음에 의뢰할 목록)

같은 캐릭터·규격(투명 1254)으로, 우선순위 순서. 앱에 이미 자리가 있어 지금은 `data-pending` 으로 둔다.

| 키 | 쓰는 곳 | 장면 | 우선 |
|---|---|---|---|
| `state-not-found` | 404 · 지워진 세션 | 빈 봉지를 들고 길을 살핀다 | 상 |
| `state-no-results` | 검색 0건 | 돋보기로 빈 트레이를 본다 | 상 |
| `state-forbidden` | 권한 없음·별도 정책 폴더 | 잠긴 문 앞에서 공손히 | 상 |
| `state-session-expired` | 재인증 | 열쇠를 찾는다 | 중 |
| `state-update-available` | PWA 새 버전 | 새 봉지를 가져온다 | 중 |
| `state-unsupported-preview` | 미리보기 불가 파일 | 낯선 상자를 들고 갸웃 | 중 |
| `state-link-expired` | 공유 링크 만료 | 끊어진 줄을 든다 | 중 |
| `state-notifications-empty` | 알림 없음 | 조용히 쉬는 모습 | 하 |
| `state-vpn-required` | 원격 조종 전(VPN 밖) | 휴대폰·모니터 사이 끊긴 길 | 중 |
| `empty-diff-clean` | PR 변경 없음 | 정돈된 한 묶음 | 하 |

의뢰할 때 지킬 것: 위 §1·§2, 기준 원본(`rabbit-identity-master`)을 참조 이미지로, 글자·숫자·UI 금지, 파일명 `<그룹>-<이름>.png` 를 `brand/generated/<그룹>/` 에, `manifest.md` 에 표 한 행(용도·프롬프트 요약), 끝난 뒤 `build-art.py` 를 돌려 예산을 확인한다.

## 5. 앱 연결 순서(소비 프로젝트)

1. `scripts/sync-design-system.sh` 가 `assets/art/*.webp` 를 앱 `public/art/` 로 복사한다.
2. 빈 상태 컴포넌트가 키를 받아 `.tk-art` 를 그린다. 키가 없거나 파일이 없으면 `data-pending`.
3. 앱 아이콘·파비콘 교체는 사용자 결정 뒤에 `assets/brand/` 를 정본으로 갱신한다(16).

## 6. 한계

- 마스코트 컷 사이의 표정·비율이 조금씩 다르다(생성 세션 기록). 픽셀 단위 일관성은 없다.
- 다크의 윤곽 띠는 CSS `drop-shadow` 4방향이라 1 CSS px 두께다. 아주 복잡한 윤곽에서는 거칠 수 있다(확인 필요).
- 앱 아이콘 후보는 OS 마스크(원·둥근 사각) 미리보기를 하지 않았다.
