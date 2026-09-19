// 앵커 색 목록으로 원시 팔레트 JSON(DTCG)을 출력한다.
// tokens.json 의 color.<ramp> 블록은 이 스크립트 출력으로 갱신한다 — 손으로 hex 를 고치지 않는다.
// 사용: node palette-from-anchors.mjs > ../generated-palette.json
import { buildRamp, contrast } from './ramp.mjs';

// step: 앵커를 고정할 단계. 브랜드 원색은 500, 진한 색은 600~900 처럼 "본인 자리"에 둔다.
// blue 만 500 으로 강제한 이유: 2081C3 은 흰 글자 대비 4.21:1 로 AA(4.5) 미달이다.
// 그래서 500 은 브랜드 원색, 600(#1A76B4, 4.89:1)이 버튼 배경 같은 액션용이 된다.
export const ANCHORS = {
  blue:    { hex: '#2081C3', step: 500, name: 'Steel Blue',    role: '브랜드 주색·액션' },
  indigo:  { hex: '#1D2F6F', step: 900, name: 'Twilight Indigo', role: '브랜드 심색·다크 표면·히어로' },
  cyan:    { hex: '#63D2FF', step: 300, name: 'Frozen Lake',   role: '강조·그라데이션 끝·다크모드 주색' },
  teal:    { hex: '#78D5D7', step: 300, name: 'Pearl Aqua',    role: '보조 강조·정보 배경' },
  neutral: { hex: '#64748B', step: 600, name: 'Cool Slate',    role: '텍스트·테두리·표면 (쿨 그레이)', neutral: true },
  green:   { hex: '#16A34A', step: 500, name: 'Success Green', role: '성공' },
  amber:   { hex: '#FAC748', step: 200, name: 'Tuscan Sun',    role: '경고' },
  red:     { hex: '#CE2D4F', step: 600, name: 'Raspberry Red', role: '위험·오류·파괴적 동작' },
  purple:  { hex: '#9B7EDE', step: 500, name: 'Soft Periwinkle', role: '차트·장식' },
  pink:    { hex: '#F88DAD', step: 400, name: 'Bubblegum Tint', role: '차트·장식' },
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
        $extensions: { 'wh.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } },
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
