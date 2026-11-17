// Canvas 렌더러. 공유 포스터(9:16 PNG) 출력과 정적 검증용. DOM 렌더러와 같은 scene 데이터를 그린다.
// ctx.filter 는 사파리·인앱 브라우저에서 불안정해 쓰지 않는다. 색 보정은 multiply 오버레이로 한다.
import { mulberry32, hashString } from './prng.mjs';

const TONES = ['#FFE2A8', '#FFF3D6', '#FFC98F'];

export function collectImageSrcs(scene) {
  return [...new Set(scene.layers.filter((l) => l.src).map((l) => l.src))];
}

export function drawScene(ctx, scene, images, opts = {}) {
  const W = opts.width ?? scene.size.w, H = opts.height ?? scene.size.h, time = opts.time ?? 0;
  const shadowColor = opts.shadowColor ?? '58,34,20';
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  for (const l of scene.layers) {
    ctx.save();
    ctx.globalAlpha = l.opacity ?? 1;
    ctx.globalCompositeOperation = l.blend === 'screen' ? 'screen' : l.blend === 'multiply' ? 'multiply' : 'source-over';
    if (l.type === 'image') {
      const img = images.get(l.src);
      if (img) ctx.drawImage(img, l.x * W, l.y * H, l.w * W, l.h * H);
    } else if (l.type === 'shadow') {
      ctx.translate(l.cx * W, l.cy * H);
      ctx.scale(1, (l.ry * H) / (l.rx * W));
      const r = l.rx * W;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(${shadowColor},${0.42 * (l.opacity ?? 1)})`);
      g.addColorStop(0.6, `rgba(${shadowColor},${0.18 * (l.opacity ?? 1)})`);
      g.addColorStop(1, `rgba(${shadowColor},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    } else if (l.type === 'lights') {
      ctx.globalCompositeOperation = 'lighter';
      for (const p of l.points) {
        const a = 0.62 + 0.28 * Math.sin(2 * Math.PI * (time / 2.4 + p.phase));
        const r = p.r * W;
        const g = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, r);
        g.addColorStop(0, hexA(TONES[p.tone % 3], a));
        g.addColorStop(0.35, hexA(l.color, a * 0.35));
        g.addColorStop(1, hexA(l.color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(p.x * W - r, p.y * H - r, r * 2, r * 2);
      }
    } else if (l.type === 'ornament') {
      const w = l.w * W, h = l.h * H;
      ctx.translate(l.ax * W, l.ay * H);
      ctx.rotate(((l.rotate ?? 0) * Math.PI) / 180);
      if (l.hero) {
        const g = ctx.createRadialGradient(0, h * 0.4, 0, 0, h * 0.4, w * 0.9);
        g.addColorStop(0, 'rgba(255,226,168,0.55)'); g.addColorStop(1, 'rgba(255,226,168,0)');
        ctx.fillStyle = g; ctx.fillRect(-w, -h * 0.5, w * 2, h * 2);
      }
      const img = images.get(l.src);
      if (img) ctx.drawImage(img, -l.anchor.x * w, -l.anchor.y * h, w, h);
    } else if (l.type === 'particles') {
      const rng = mulberry32(hashString(`${l.key}:${scene.treeId}`));
      const n = Math.round((l.count ?? 40) * (opts.particleScale ?? 1));
      ctx.fillStyle = l.kind === 'sparkle' ? 'rgba(255,236,190,0.9)' : 'rgba(255,255,255,0.85)';
      for (let i = 0; i < n; i++) {
        const r = (l.kind === 'sparkle' ? 1.2 : 1.5) + rng() * (l.kind === 'sparkle' ? 2.2 : 3.2);
        ctx.globalAlpha = (l.opacity ?? 1) * (0.35 + rng() * 0.6);
        ctx.beginPath(); ctx.arc(rng() * W, rng() * H, r * (W / 1080), 0, Math.PI * 2); ctx.fill();
      }
    } else if (l.type === 'grade') {
      ctx.fillStyle = l.color; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }
  ctx.restore();
}
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.slice(0, 6), 16);
  const base = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a * base))})`;
}

/** 브라우저에서 이미지 로드. 오류는 호출자가 처리한다 */
export async function loadImages(srcs) {
  const map = new Map();
  await Promise.all(srcs.map((src) => new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => { map.set(src, img); res(); };
    img.onerror = () => rej(new Error(`이미지 로드 실패: ${src}`));
    img.src = src;
  })));
  return map;
}
