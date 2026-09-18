# 12 · 페이지 패턴 — 자주 만드는 화면의 정답 골격

컴포넌트를 조립하는 순서와 값을 화면 유형별로 적었다. 새 화면은 여기서 가장 가까운 것을 복사해 시작한다.

## 1. 로그인 · 회원가입

```
canvas 배경 (또는 좌 50% gradient.brand 패널 + 우 50% 폼, lg 이상)
  ┌ 카드 없이 컨테이너 sm(640) → 실제 폼 폭 400, 가운데
  │ 로고 28 (아래 space.8)
  │ heading-2 "로그인"  (아래 space.2)
  │ body-sm text.secondary 한 줄  (아래 space.8)
  │ 필드 lg(48): 이메일 / 비밀번호(eye 토글)  간격 space.4
  │ 우측 정렬 link body-sm "비밀번호를 잊었나요?"  (위 space.2)
  │ primary lg 전폭 "로그인"  (위 space.6)
  │ 구분선 "또는"  (상하 space.6)
  │ secondary lg 전폭 소셜 버튼들 간격 space.3
  │ 하단 caption text.secondary "계정이 없나요? 가입하기(link)"  (위 space.8)
```
- 오류: 폼 상단 danger 배너("이메일 또는 비밀번호가 맞지 않아요") + 필드 표시 없음(어느 쪽이 틀렸는지 노출 금지).
- 제출 중: 버튼 loading, 필드 disabled.

## 2. 대시보드

```
컨테이너 xl(1280), 상단 여백 space.6
  heading-1 + 우측 액션(기간 세그먼트 · secondary "내보내기")  (아래 space.6)
  KPI 타일 4열 (11 §4), 간격 space.4  (아래 space.6)
  2열 그리드 (2fr 1fr), 간격 space.6
    카드 lg 패딩 24: heading-3 + 차트 320
    카드: heading-3 + 리스트(최근 항목 5개, 아이템 패딩 12)
  전폭 카드: heading-3 + 표(compact 36)
```
- 카드 제목 옆 우측에 ghost sm "전체 보기 →".
- 위젯 하나 실패 시 그 카드만 오류 상태(07 §3).
- 모바일: 전부 1열, KPI 2열, 차트 높이 240.

## 3. 목록 (표형)

```
컨테이너 xl
  breadcrumb (선택)  (아래 space.2)
  heading-1 + 우측 primary md "+ 새 항목"  (아래 space.6)
  툴바 한 줄: 검색 인풋 sm(폭 280) · 필터 chip 들 · 우측 세그먼트(보기 방식) — 높이 32 통일, 간격 space.2  (아래 space.4)
  선택 시 툴바가 액션 바로 교체: "3개 선택됨 · 삭제(danger-ghost) · 내보내기"
  표 (06 §11), 카드 안에 border.default, radius.lg
  페이지네이션 우측 (위 space.4)
```
- 0건: 표 자리에 빈 상태(첫 사용 vs 필터 결과 없음 구분).
- 행 클릭 → 상세(우측 드로어 480 또는 페이지 이동). 행 안 액션 열은 ⋯ 메뉴.
- 모바일: 열 4개 이상이면 카드 리스트로, 툴바는 검색 + 필터 아이콘 버튼(바텀시트).

## 4. 목록 (카드형)

```
heading-1 + 액션  (아래 space.6)
툴바 (위와 같음)  (아래 space.6)
grid auto-fill minmax(280px, 1fr), gap 16/24
  카드 md 패딩 20: 썸네일 16:9(선택) · heading-5 · body-sm secondary 2줄 clamp · 하단 메타(caption + 배지) 
```
카드 전체 클릭 가능이면 안쪽에 버튼을 두지 않는다(⋯ 메뉴만 예외로 `stopPropagation`).

## 5. 상세

```
컨테이너 lg(1024)
  breadcrumb  (아래 space.2)
  헤더 행: heading-1 + 상태 배지 md · 우측 액션(secondary "편집" · ⋯ 메뉴)  (아래 space.2)
  메타 행: caption text.tertiary "만든 사람 · 2026.09.18 · 수정 3분 전"  (아래 space.8)
  2열 (2fr 1fr), gap space.8
    본문: 섹션마다 heading-3 (아래 space.3) + 내용, 섹션 사이 space.8
    사이드: 카드 sm 패딩 16 — 속성 목록(dl: caption 라벨 / body-sm 값, 행 간격 space-3)
```
- 편집은 같은 화면 인라인 또는 모달 md. 필드 몇 개면 모달, 많으면 편집 페이지.
- 삭제는 ⋯ 메뉴 안 `text.danger` 항목 → 확인 다이얼로그.

## 6. 폼 (만들기 · 편집 페이지)

```
컨테이너 sm(640) 또는 md(768)
  heading-1 "새 프로젝트"  (아래 space.8)
  섹션: heading-5 + caption 설명  (아래 space.4)
    필드들 간격 space.4
  섹션 사이 space.10
  하단 고정 바(스크롤 길 때) 또는 마지막 필드 아래 space.8: 우측 "취소(secondary) · 저장(primary)"
```
- 필드 폭: 짧은 값(우편번호·수량)은 내용 폭에 맞춘다. 전부 전폭이면 어색하다.
- 저장 전 이탈: 변경 있으면 확인 다이얼로그.
- 자동 저장이면 헤더에 caption "저장됨 · 14:30" 상태 표시, 버튼 없음.
- 모바일: 하단 고정 바에 primary lg 전폭.

## 7. 설정

```
컨테이너 lg
  heading-1 "설정"  (아래 space.6)
  좌 세로 탭 200 (06 §12) · 우 콘텐츠 (gap space.8)
    섹션 카드 lg 패딩 24, 사이 space.6
      heading-3 + caption  (아래 space.5)
      행: 좌 label-md + caption 설명 / 우 컨트롤(switch 또는 select sm)  행 간격 space.4, 구분선 border.subtle
```
- 즉시 반영 항목은 Switch, 저장 필요한 항목은 섹션 하단 "저장" 버튼. 한 섹션 안에 둘을 섞지 않는다.
- 위험 구역(탈퇴·삭제): 마지막 섹션, 카드 테두리 `status.danger.border`, 제목 옆 경고 아이콘, 버튼 `danger` secondary 형태.

## 8. 랜딩

```
헤더 64 (스크롤 시 blur) — 로고 · 내비 label-md · 우측 secondary "로그인" + primary "시작하기"
히어로 (상하 space.20 / 데스크톱 space.32), 컨테이너 lg, 가운데 정렬
  overline text.brand  (아래 space.4)
  display-lg 2줄 이내  (아래 space.6)
  body-lg text.secondary 1~2문장, 최대 폭 prose  (아래 space.8)
  버튼 행: primary xl(radius.full 허용) + ghost xl, 간격 space.3
  목업 이미지 (위 space.16) radius.2xl shadow.xl
섹션 (상하 space.16 / space.24), 번갈아 canvas / gradient.frost 배경
  overline + display-md + body-lg (아래 space.12)
  피처 그리드 3열: 아이콘 배경 원 48 brand-subtle + heading-4 + body-sm
CTA 섹션 gradient.brand: display-md white + primary(흰 배경 secondary 형태)
푸터 gradient.twilight 또는 surface.brand: 로고 · 링크 열 · caption 저작권
```
- 스크롤 리빌(05 §4)은 랜딩에서만.
- 그라데이션은 `brand` + `frost` 두 종류.
- 모바일: display 자동 축소, 버튼 세로 쌓기 lg 전폭, 피처 1열.

## 9. 온보딩 · 빈 첫 화면

- 단계 표시: 상단 프로그레스 바 4px 또는 "2 / 4" caption. 단계 4개 이하.
- 한 화면 한 질문. 컨테이너 sm. 제목 heading-2, 설명 body-md secondary, 컨트롤 lg.
- 하단: 좌 ghost "건너뛰기", 우 primary lg "다음". 마지막은 "시작하기".
- 다 끝나면 빈 첫 화면은 07 §2 첫 사용 빈 상태로.

## 10. 오류 페이지 (404 · 500 · 403)

```
canvas, 세로 가운데, 컨테이너 sm
  display-sm text.brand "404" (또는 아이콘 2xl)  (아래 space.4)
  heading-2 "페이지를 찾을 수 없어요"  (아래 space.2)
  body-md text.secondary 한 문장  (아래 space.8)
  primary md "홈으로" + ghost "이전 페이지"
  caption text.tertiary 오류 ID (500 일 때)  (위 space.8)
```
