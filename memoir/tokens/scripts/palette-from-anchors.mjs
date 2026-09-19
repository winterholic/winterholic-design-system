// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens.json 의 color.<ramp> 블록은 이 스크립트 출력으로 갱신한다 — 손으로 hex 를 고치지 않는다.
// 사용: node palette-from-anchors.mjs > ../generated-palette.json
import { buildRamp, contrast } from './ramp.mjs';

// memoir 앵커. fixed = 제품(tailwind.config.ts·design-guide.md)이 이미 쓰는 값.
// pink 400 #FF82A9 는 브랜드 원색이지만 흰 배경 대비 2.33 이라 글자·버튼 배경으로 못 쓴다.
// 그래서 600 = #a1385e(design-guide 의 Primary, 6.48:1) 이 액션색, 800 = #78163e 가 활성 칩(핑크 배경) 위 글자색.
export const ANCHORS = {
  pink:    { hex: '#FF82A9', step: 400, name: 'Memoir Pink',   role: '브랜드 원색·강조·활성 칩', fixed: { 400: '#FF82A9', 600: '#A1385E', 800: '#78163E' } },
  blue:    { hex: '#7F95D1', step: 400, name: 'Periwinkle',    role: '상호작용(링크·활성 메뉴·포커스)', fixed: { 400: '#7F95D1', 600: '#465D95' } },
  neutral: { hex: '#231917', step: 950, name: 'Warm Ink',      role: '글자·아이콘 (따뜻한 검정)', neutral: true, fixed: { 950: '#231917' } },
  red:     { hex: '#D93A4F', step: 500, name: 'Alert Red',     role: '오류·삭제' },
  green:   { hex: '#2E9E6B', step: 500, name: 'Sage Green',    role: '성공·저장됨' },
  amber:   { hex: '#C98A00', step: 500, name: 'Honey Amber',   role: '경고·2FA 만료 임박' },
};

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.neutral ? 'neutral' : 'brand' });
    // fixed: 이미 제품에서 쓰이는 손조정 값이 있으면 그 단계만 생성값 대신 고정한다(기존 화면과의 호환).
    Object.assign(ramp, a.fixed ?? {});
    out[key] = { $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}${a.fixed ? ' · 고정 단계 ' + Object.keys(a.fixed).join('/') : ''}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = {
        $value: hex,
        $extensions: { 'mm.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } },
      };
    }
  }
  return out;
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify(generatePalette(), null, 2) + '\n');
}
