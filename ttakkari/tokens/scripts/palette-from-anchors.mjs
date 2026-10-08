// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens/src/palette.json 은 이 스크립트 출력으로 갱신한다. 손으로 hex 를 고치지 않는다.
// 사용: node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
import { buildRamp, contrast } from './ramp.mjs';

// ttakkari 앵커. 사용자가 준 시드(브랜드 3색 + 중립 시드)가 지정 단계에 hex 그대로 박힌다.
// 단계는 OKLCH 명도가 가장 가까운 칸이다: blue 0.531→600, mint 0.848→300, sage(#59645F) 0.492→700, graphite(#30383A) 0.334→900.
// red·amber·plum 은 시드에 없는 상태·분류색이라 보강했다.
//   red   h≈27  : 실패·차단·파괴. amber(h≈72)와 45° 떨어져 '주의'와 '위험'이 섞이지 않는다.
//   amber h≈72  : 승인 필요·주의. mint(h≈167)·blue(h≈252)와 멀다.
//   plum  h≈300 : 이미지 파일·별도 정책(민감·회사 자료) 분류. blue 와 48° 떨어진다.
// 다크 테마는 950 아래 면 단계가 더 필요하다(캔버스 < 기본 면 < 떠 있는 면). graphite 에만 붙인다.
const DARK_SURFACE_STEPS = { 925: 0.275, 975: 0.19 };
// 라이트는 종이(L .965)와 시드 surface-muted(L .940) 사이에 띠 면(사이드바·툴바·표 머리) 한 칸이 더 필요하다. sage 에만 붙인다.
const LIGHT_BAND_STEPS = { 75: 0.955 };

export const ANCHORS = {
  blue:     { hex: '#296EB4', step: 600, name: 'Ttakkari Blue',  role: '사람의 행동: 주 버튼·링크·포커스·선택·사용자 메시지 면. 종이 위 4.77:1, 흰 글자 5.27:1' },
  mint:     { hex: '#00F0B5', step: 300, name: 'Ttakkari Mint',  role: '에이전트 신호: 실행 중·완료·결과물 도착·잉크 면 위 커서. 종이 위 1.35:1 이라 글자 불가, 잉크 위 13.55:1' },
  sage:     { hex: '#59645F', step: 700, name: 'Sage',           role: '라이트 중립(글자·선·면). 시드 --text-muted', curve: 'sage', extraSteps: LIGHT_BAND_STEPS },
  graphite: { hex: '#30383A', step: 900, name: 'Graphite',       role: '다크 중립·잉크 면(코드·로그). 시드 dark --border', curve: 'graphite', extraSteps: DARK_SURFACE_STEPS },
  red:      { hex: '#C93A35', step: 600, name: 'Signal Red',     role: '실패·차단·삭제. 흰 글자 5.07:1. 장식 금지' },
  amber:    { hex: '#E39B2D', step: 400, name: 'Signal Amber',   role: '승인 필요·주의·발표 파일. 원색은 면 전용(종이 위 2.11:1)' },
  plum:     { hex: '#7E57B8', step: 600, name: 'Plum',           role: '이미지 파일·별도 정책 범위(민감·회사 자료). 흰 글자 5.33:1' },
};

// 다크 상태 면: 각 색을 다크 기본 면(시드 #171B1C)에 18% 섞은 값.
// 950 단계를 쓰면 채도가 높아 잉크 캔버스 위에서 남색·녹색 덩어리로 뜬다. 섞는 바탕을 캔버스가 아니라 카드 면으로 잡은 이유는
// 상태 면이 카드 안(실행 카드·승인 카드)에 가장 자주 놓이기 때문이다. 카드보다 어두운 '구멍'이 되지 않는다.
const DARK_TINT_BASE = '#171B1C';
const DARK_TINTS = [['blue', 600], ['mint', 500], ['red', 600], ['amber', 400], ['plum', 600]];

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.curve ?? 'brand', extraSteps: a.extraSteps });
    out[key] = { $type: 'color', $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = {
        $value: hex,
        $extensions: { 'tk.contrast': { onPaper: +contrast(hex, '#F4F4ED').toFixed(2), onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onInk: +contrast(hex, '#080705').toFixed(2) } },
      };
    }
  }
  const mix = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * t + parseInt(b.slice(i, i + 2), 16) * (1 - t)).toString(16).padStart(2, '0')).join('').toUpperCase();
  out['dark-tint'] = { $type: 'color', $description: `다크 상태 면. <색>.<단계> 를 다크 기본 면(${DARK_TINT_BASE})에 18% 섞은 값. 화면 코드가 직접 쓰지 않고 color.dark.json 의 status·run·policy·agent 면이 참조한다` };
  for (const [key, step] of DARK_TINTS) {
    const hex = mix(out[key][step].$value, DARK_TINT_BASE, 0.18);
    out['dark-tint'][key] = { $value: hex, $extensions: { 'tk.contrast': { onPaper: +contrast(hex, '#F4F4ED').toFixed(2), onInk: +contrast(hex, '#080705').toFixed(2) } } };
  }
  return out;
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify(generatePalette(), null, 2) + '\n');
}
