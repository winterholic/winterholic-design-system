# Changelog

## stock-gosu-v1.2.0 — 2026-09-19

정상 표시되던 PWA 파랑새 PNG를 정본으로 브랜드 자산을 재구축. self-contained 컬러 SVG·단색 심볼·라이트/반전 로크업·SVG/PNG/ICO 파비콘·512 앱 아이콘·1600×900 브랜드 히어로를 추가하고, 깨지던 레거시 `stock-gosu.svg`/`.ico` 경로도 새 자산의 호환 별칭으로 교체. 브랜드 자산 회귀 검사와 재생성 스크립트 추가.

## stock-gosu-v1.1.0 — 2026-09-19

완성도 보강(base 수준). 06 컴포넌트 22절로 확장(스텝퍼·아코디언·페이지네이션·브레드크럼·알림·설정 행·필터 바 토큰 추가), 04·05·08·09·10·13 을 base 참조 없이 자립화, 12 에 설정·오류·알림·검색·비교·관리자·온보딩 골격 추가, **16 상황 사전** 신설. 버튼 md 좌우 패딩 18→16.

## stock-gosu-v1.0.0 — 2026-09-19

첫 버전. 기존 FDS(`front/src/styles/global.css`, `finance-design-system.html`, `chartTheme.ts`)를 winterholic-base 구조로 옮기고 보완.

- 팔레트: Toss Blue·회색조 50~900 기존 값 고정(`ANCHORS.fixed`), 950 과 red/green/yellow 중간 단계·차트 보조 램프(orange·violet·magenta) 생성. blue.600/red.600 을 AA 기준으로 미세 조정, green/yellow 단계 재배치.
- 시맨틱: surface·text·border·action(primary/primary-strict/secondary/outline/ghost/danger)·finance(up/down/flat × text/solid/bg/on-bg/border/muted, flash, us-*)·status·interactive·chart(series/overlay/candle/sparkline/heat) 라이트·다크 1:1.
- 다크 모드 신규.
- 간격 4px 이름 체계(2·6·10·14 포함), 컨트롤 28/36/44/52, 컨테이너 1180, 탭바·sticky-offset, radius 4~24, 그림자 1~4 매핑 + sticky, 그라데이션 5, 모션(flash·chart 추가), z-index.
- 타이포: 13/15/17 기존 스케일 + 12·28·40, 굵기 5단계, 역할 스타일 21종(price-lg/md/sm·change·numeric 포함), 모바일 인풋 16.
- 컴포넌트 토큰 24종(stock-row·price-cell·market-tag·kpi·segmented·tabbar·sheet·search·chart-tooltip 등).
- 빌드: base 산출물 + `chart-theme.ts`(recharts raw, 라이트·다크) + `legacy-aliases.css`(기존 변수명 브리지) + `[data-market=us]` 반전. 대비 106쌍 검사.
- 문서 16편 + 점검·이관 문서(27항목·5단계·대응표) + AI 규칙 + 미리보기.
- 로고 자산 복사(svg/png/ico). 투명 배경·단색·로크업은 미제작.
