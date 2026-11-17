// 앵커 색으로 원시 팔레트(DTCG)를 출력한다. hex 를 손으로 고치지 않는다.
// 사용: node tokens/scripts/palette-from-anchors.mjs > tokens/src/palette.json
import { buildRamp, contrast } from './ramp.mjs';

// step: 앵커가 앉는 단계. 동화책 팔레트 앵커를 "본인 자리"에 둔다.
export const ANCHORS = {
  burgundy: { hex: '#7A1F2B', step: 800, name: 'Burgundy',       role: '주 행동·브랜드 심색' },
  gold:     { hex: '#D9B36A', step: 300, name: 'Champagne Gold', role: '프레임·강조·다크 모드 주색' },
  sand:     { hex: '#8A7A66', step: 600, name: 'Warm Paper Ink', role: '글자·테두리·표면(따뜻한 중립)', neutral: true },
  fir:      { hex: '#3F5B3A', step: 700, name: 'Fir Green',      role: '성공·숲·전나무' },
  indigo:   { hex: '#1D2347', step: 900, name: 'Night Indigo',   role: '다크 표면·밤하늘' },
  sky:      { hex: '#5C7FA8', step: 500, name: 'Snow Blue',      role: '정보·눈·차가운 보조' },
  red:      { hex: '#B83A3A', step: 600, name: 'Holly Red',      role: '위험·오류' },
  amber:    { hex: '#E0A526', step: 400, name: 'Candle Amber',   role: '경고·촛불' },
};

export function generatePalette() {
  const out = {};
  for (const [key, a] of Object.entries(ANCHORS)) {
    const { ramp } = buildRamp(a.hex, { anchorStep: a.step, chromaCurve: a.neutral ? 'neutral' : 'brand' });
    out[key] = { $description: `${a.name} · ${a.role} · 앵커 ${a.hex} @${a.step}` };
    for (const [step, hex] of Object.entries(ramp)) {
      out[key][step] = { $value: hex, $extensions: { 'mv.contrast': { onWhite: +contrast(hex, '#FFFFFF').toFixed(2), onBlack: +contrast(hex, '#000000').toFixed(2) } } };
    }
  }
  return out;
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify(generatePalette(), null, 2) + '\n');
}
