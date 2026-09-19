import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import test from "node:test";

const root = process.cwd();
const system = basename(root);
const brandDir = join(root, "assets", "brand");
const expectedSystems = new Set(["stock-gosu", "memoir"]);

assert.ok(expectedSystems.has(system), `지원하지 않는 디자인 시스템: ${system}`);

const requiredAssets = [
  "logo-mark.svg",
  "logo-mark.png",
  "logo-mark-mono.svg",
  "logo-lockup.svg",
  "logo-lockup-inverse.svg",
  "favicon.svg",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "favicon.ico",
  "app-icon-512.png",
  "brand-hero.png",
  "brand-hero.webp",
  "README.md",
];

function readPngSize(path) {
  const png = readFileSync(path);
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG", `${path}는 PNG가 아닙니다.`);
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

test(`${system}: base와 같은 브랜드 자산 묶음을 제공한다`, () => {
  const missing = requiredAssets.filter((file) => !existsSync(join(brandDir, file)));
  assert.deepEqual(missing, [], `누락된 브랜드 자산: ${missing.join(", ")}`);
});

test(`${system}: 브라우저용 SVG는 외부 참조와 DOCTYPE 없이 독립적으로 렌더링된다`, () => {
  for (const file of ["logo-mark.svg", "logo-mark-mono.svg", "logo-lockup.svg", "logo-lockup-inverse.svg", "favicon.svg"]) {
    const svg = readFileSync(join(brandDir, file), "utf8");
    assert.match(svg, /<svg\b/);
    assert.doesNotMatch(svg, /<!DOCTYPE/i, `${file}에 레거시 DOCTYPE이 있습니다.`);
    assert.doesNotMatch(svg, /(?:href|src)=["'](?:https?:|\/)/i, `${file}이 외부 자산에 의존합니다.`);
  }
});

test(`${system}: 파비콘과 앱 아이콘 크기가 선언과 일치한다`, () => {
  for (const size of [16, 32, 48]) {
    assert.deepEqual(readPngSize(join(brandDir, `favicon-${size}.png`)), { width: size, height: size });
  }
  assert.deepEqual(readPngSize(join(brandDir, "app-icon-512.png")), { width: 512, height: 512 });
  assert.deepEqual(readPngSize(join(brandDir, "brand-hero.png")), { width: 1600, height: 900 });
});

test(`${system}: 문서와 미리보기가 새 브랜드 자산을 실제로 연결한다`, () => {
  const doc = readFileSync(join(root, "docs", "14-brand-assets.md"), "utf8");
  const preview = readFileSync(join(root, "examples", "preview.html"), "utf8");
  const brandReadme = readFileSync(join(brandDir, "README.md"), "utf8");

  for (const name of ["logo-mark.svg", "logo-lockup.svg", "favicon.svg", "app-icon-512.png", "brand-hero.png"]) {
    assert.ok(doc.includes(name), `14-brand-assets.md에 ${name}이 없습니다.`);
  }
  assert.ok(preview.includes("logo-lockup.svg"), "preview가 새 로크업을 사용하지 않습니다.");
  assert.ok(preview.includes("brand-hero.webp"), "preview가 브랜드 히어로를 사용하지 않습니다.");
  assert.match(brandReadme, /원본|source/i);
  assert.doesNotMatch(doc, /보완 필요/);
});

test(`${system}: 브랜드 히어로 글자색은 테마 반전과 독립적이다`, () => {
  const preview = readFileSync(join(root, "examples", "preview.html"), "utf8");
  const rule = system === "stock-gosu"
    ? /\.hero\s*\{[^}]*color:\s*var\(--sg-base-white\)/s
    : /\.brand-hero\s*\{[^}]*color:\s*var\(--mm-brand-ink\)/s;
  assert.match(preview, rule, "브랜드 히어로 글자색이 다크 테마에서 반전될 수 있습니다.");
});
