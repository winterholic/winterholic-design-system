// 색 램프 생성기 — 앵커 hex 하나로 50~950 단계를 OKLCH 공간에서 뽑는다.
// 사용: node ramp.mjs "#2081C3" [--name blue]
// 왜 OKLCH인가: HSL은 같은 L값이라도 색상별로 체감 밝기가 달라 램프가 들쭉날쭉해진다.
// OKLCH의 L은 지각 균등이라 blue-500 과 red-500 의 명도가 실제로 비슷해진다.

const L_STEPS = {
  50: 0.975, 100: 0.945, 200: 0.89, 300: 0.815, 400: 0.725,
  500: 0.63, 600: 0.545, 700: 0.465, 800: 0.385, 900: 0.31, 950: 0.24,
};

// ---------- sRGB <-> OKLab (Björn Ottosson 공식) ----------
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
export function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
export function rgbToOklab([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(linearToSrgb);
}
export function hexToOklch(hex) {
  const [L, a, b] = rgbToOklab(hexToRgb(hex));
  return { L, C: Math.hypot(a, b), h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}
export function oklchToHex({ L, C, h }) {
  const rad = (h * Math.PI) / 180;
  // sRGB 범위를 벗어나면 채도만 줄여서 안으로 들여온다 (명도·색상은 유지)
  let c = C;
  for (let i = 0; i < 24; i++) {
    const rgb = oklabToRgb([L, c * Math.cos(rad), c * Math.sin(rad)]);
    if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return rgbToHex(rgb);
    c *= 0.9;
  }
  return rgbToHex(oklabToRgb([L, 0, 0]));
}

// ---------- 램프 ----------
export function buildRamp(anchorHex, { chromaCurve = 'brand', anchorStep: forced } = {}) {
  const anchor = hexToOklch(anchorHex);
  // 앵커를 가장 가까운 단계에 그대로 박는다 — 브랜드 색이 램프 안에 정확히 존재해야 한다.
  // forced 로 단계를 고정하면 나머지 단계는 그 위치를 기준으로 퍼진다(대비 확보용).
  const anchorStep = forced ?? Object.entries(L_STEPS).reduce((best, [k, L]) =>
    Math.abs(L - anchor.L) < Math.abs(L_STEPS[best] - anchor.L) ? Number(k) : best, 500);
  const out = {};
  for (const [k, L] of Object.entries(L_STEPS)) {
    const step = Number(k);
    if (step === anchorStep) { out[step] = anchorHex.toUpperCase(); continue; }
    // 채도: 중간(500~600)에서 최대, 양끝에서 줄인다. 무채색 램프는 채도를 아주 낮게 고정.
    let C;
    if (chromaCurve === 'neutral') C = 0.012 + (1 - Math.abs(L - 0.6)) * 0.006;
    // stone: notting 중립. neutral 곡선(베이지 기운)보다 채도를 1/3 로 낮춰 '따뜻한 회색'에 머문다.
    else if (chromaCurve === 'stone') C = 0.004 + (1 - Math.abs(L - 0.6)) * 0.004;
    else {
      const peak = anchor.C;
      const dist = Math.abs(L - anchor.L);
      C = Math.max(peak * (1 - dist * 1.35), peak * 0.18);
      if (L > 0.9) C = Math.min(C, 0.06); // 50·100은 옅게
    }
    out[step] = oklchToHex({ L, C, h: anchor.h });
  }
  return { ramp: out, anchorStep, anchor };
}

// ---------- 대비 (WCAG 2.x) ----------
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const hex = process.argv[2];
  if (!hex) { console.error('usage: node ramp.mjs "#RRGGBB" [--neutral|--stone] [--step 500]'); process.exit(1); }
  const stepIdx = process.argv.indexOf('--step');
  const { ramp, anchorStep } = buildRamp(hex, {
    chromaCurve: process.argv.includes('--stone') ? 'stone' : process.argv.includes('--neutral') ? 'neutral' : 'brand',
    anchorStep: stepIdx > -1 ? Number(process.argv[stepIdx + 1]) : undefined,
  });
  console.log(`anchor ${hex} -> step ${anchorStep}`);
  for (const [k, v] of Object.entries(ramp)) {
    console.log(`${k.padStart(3)}  ${v}  on-white ${contrast(v, '#FFFFFF').toFixed(2)}  on-black ${contrast(v, '#000000').toFixed(2)}`);
  }
}
