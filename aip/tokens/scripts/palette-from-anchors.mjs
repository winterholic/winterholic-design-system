// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens/src/palette.json 은 이 스크립트 출력으로 갱신한다 — 손으로 hex 를 고치지 않는다.
// 사용: node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
import { buildRamp, contrast } from './ramp.mjs';

// AIP 앵커. 브랜드 5색은 지정 단계에 hex 그대로 박힌다(램프 안에 정확히 존재해야 문서·로고·코드가 같은 색을 부른다).
// 단계는 OKLCH 명도(L)가 가장 가까운 칸이다 — blue 0.558→600, tangerine 0.794→300, yellow 0.913→200, charcoal 0.351→800, slate 0.435→700.
// red·green 은 브랜드 5색에 없는 상태색이라 보강했다. tangerine 과 hue 가 붙지 않도록 red 는 crimson(h≈15), green 은 blue·yellow 와 50° 이상 떨어진 h≈158.
// 다크 테마는 950 아래·사이에 면 단계가 더 필요하다(캔버스 < 기본 면 < 떠 있는 면). 중립·slate 에만 붙인다.
const DARK_SURFACE_STEPS = { 925: 0.275, 975: 0.19 };

export const ANCHORS = {
  blue:      { hex: '#1C77C3', step: 600, name: 'AIP Blue',      role: '브랜드 주색·주 액션·링크·활성·포커스·정보. 흰 배경 4.69:1 이라 600 이 곧 버튼 배경' },
  tangerine: { hex: '#FAA381', step: 300, name: 'AIP Tangerine', role: '보조 강조·경고(warning)·다이어그램 permission. 원색은 글자 불가(1.98:1)' },
  yellow:    { hex: '#F5E663', step: 200, name: 'AIP Yellow',    role: '형광펜(highlight)·Important·Example·다이어그램 intent. 원색은 면 전용(1.28:1)' },
  neutral:   { hex: '#3D3B30', step: 800, name: 'AIP Charcoal',  role: '라이트 테마의 글자·테두리·면, 다크 테마의 면. 800 = 본문 글자', curve: 'charcoal', extraSteps: DARK_SURFACE_STEPS },
  slate:     { hex: '#4D5061', step: 700, name: 'AIP Slate',     role: '코드 면(두 테마 공통)·보조 어두운 요소', extraSteps: DARK_SURFACE_STEPS },
  red:       { hex: '#C62948', step: 600, name: 'Signal Red',    role: '위험·오류·파괴·거부(denied). 브랜드 장식 금지' },
  green:     { hex: '#1C8457', step: 600, name: 'Signal Green',  role: '성공·허용(allowed)·Tip' },
};

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.curve ?? 'brand', extraSteps: a.extraSteps });
    out[key] = { $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = {
        $value: hex,
        $extensions: { 'aip.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } },
      };
    }
  }
  // 다크 테마 상태 면: 각 색 600 을 다크 캔버스(neutral.950)에 14% 섞은 틴트. 950 단계는 채도가 높아 따뜻한 캔버스 위에서 남색·녹색 덩어리로 뜬다.
  const mix = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * t + parseInt(b.slice(i, i + 2), 16) * (1 - t)).toString(16).padStart(2, '0')).join('').toUpperCase();
  const canvas = out.neutral[950].$value;
  out['dark-tint'] = { $description: `다크 상태 면. <색>.600 을 neutral.950(${canvas})에 14% 섞은 값. 직접 쓰지 않고 color.dark.json 의 status·lifecycle·selected 면이 참조한다` };
  for (const [key, step] of [['blue', 600], ['green', 600], ['red', 600], ['tangerine', 400], ['yellow', 300]]) {
    const hex = mix(out[key][step].$value, canvas, 0.14);
    out['dark-tint'][key] = { $value: hex, $extensions: { 'aip.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } } };
  }
  return out;
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify(generatePalette(), null, 2) + '\n');
}
