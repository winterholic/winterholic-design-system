import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
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

function readAlphaOccupancy(path) {
  const script = [
    "from PIL import Image",
    "import json, sys",
    "im=Image.open(sys.argv[1]).convert('RGBA')",
    "box=im.getchannel('A').getbbox()",
    "w=(box[2]-box[0])/im.width if box else 0",
    "h=(box[3]-box[1])/im.height if box else 0",
    "print(json.dumps({'width':w,'height':h}))",
  ].join(";");
  const result = spawnSync("python", ["-c", script, path], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function readEmbeddedSvgOccupancy(path) {
  const script = [
    "from PIL import Image",
    "import base64, io, json, re, sys",
    "svg=open(sys.argv[1], encoding='utf-8').read()",
    "m=re.search(r'<image x=\"([\\d.]+)\" y=\"([\\d.]+)\" width=\"([\\d.]+)\" height=\"([\\d.]+)\" href=\"data:image/png;base64,([^\"]+)', svg)",
    "x,y,w,h=map(float,m.groups()[:4])",
    "im=Image.open(io.BytesIO(base64.b64decode(m.group(5)))).convert('RGBA')",
    "box=im.getchannel('A').getbbox()",
    "print(json.dumps({'width':((box[2]-box[0])/im.width*w)/64,'height':((box[3]-box[1])/im.height*h)/64}))",
  ].join(";");
  const result = spawnSync("python", ["-c", script, path], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function readIcoContentOccupancy(path, background) {
  const script = [
    "from PIL import Image",
    "import json, sys",
    "im=Image.open(sys.argv[1])",
    "im=im.ico.getimage((16,16)).convert('RGBA')",
    "bg=tuple(map(int,sys.argv[2].split(',')))",
    "mask=Image.new('L',im.size)",
    "mask.putdata([255 if max(abs(p[i]-bg[i]) for i in range(3)) > 10 else 0 for p in im.getdata()])",
    "box=mask.getbbox()",
    "print(json.dumps({'width':(box[2]-box[0])/im.width,'height':(box[3]-box[1])/im.height}))",
  ].join(";");
  const result = spawnSync("python", ["-c", script, path, background.join(",")], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
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

test(`${system}: 파비콘과 앱 아이콘은 base처럼 캔버스를 충분히 채운다`, () => {
  for (const name of ["favicon-16.png", "favicon-32.png", "favicon-48.png", "app-icon-512.png"]) {
    const occupancy = readAlphaOccupancy(join(brandDir, name));
    assert.ok(occupancy.width >= 0.95 && occupancy.height >= 0.95, `${name} 점유율이 작습니다: ${JSON.stringify(occupancy)}`);
  }
  const mark = readAlphaOccupancy(join(brandDir, "logo-mark.png"));
  assert.ok(mark.width >= 0.65 && mark.height >= 0.55, `logo-mark.png 점유율이 작습니다: ${JSON.stringify(mark)}`);
});

if (system === "stock-gosu") {
  test("stock-gosu: 단색 심볼은 임의 윤곽이 아니라 파랑새 원본을 사용한다", () => {
    const color = readFileSync(join(brandDir, "logo-mark.svg"), "utf8");
    const mono = readFileSync(join(brandDir, "logo-mark-mono.svg"), "utf8");
    const colorSource = color.match(/href="(data:image\/png;base64,[^"]+)"/)?.[1];
    const monoSource = mono.match(/href="(data:image\/png;base64,[^"]+)"/)?.[1];
    assert.ok(monoSource, "단색 심볼이 파랑새 원본을 포함하지 않습니다.");
    assert.equal(monoSource, colorSource, "단색 심볼이 컬러 심볼과 다른 윤곽을 사용합니다.");
    assert.match(mono, /flood-color="currentColor"/, "단색 심볼의 color 지정이 동작하지 않습니다.");
    assert.match(mono, /<svg[^>]+color="#1473E6"/, "외부 이미지로 표시할 때 사용할 기본 브랜드 색이 없습니다.");
  });

  test("stock-gosu: SVG 파비콘의 파랑새는 탭 면적을 94% 이상 채운다", () => {
    const occupancy = readEmbeddedSvgOccupancy(join(brandDir, "favicon.svg"));
    assert.ok(occupancy.width >= 0.94, `파랑새 가로 점유율이 작습니다: ${JSON.stringify(occupancy)}`);
  });

  test("stock-gosu: ICO의 16px 파랑새도 탭 면적을 94% 이상 채운다", () => {
    const occupancy = readIcoContentOccupancy(join(brandDir, "favicon.ico"), [232, 243, 255, 255]);
    assert.ok(occupancy.width >= 0.94, `ICO 파랑새 가로 점유율이 작습니다: ${JSON.stringify(occupancy)}`);
  });

  test("stock-gosu: preview의 단색 심볼은 호환되는 이미지 방식으로 표시한다", () => {
    const preview = readFileSync(join(root, "examples", "preview.html"), "utf8");
    assert.match(preview, /<img[^>]+logo-mark-mono\.svg/, "preview가 단색 심볼을 표시하지 않습니다.");
    assert.doesNotMatch(preview, /mask:[^;]*logo-mark-mono\.svg/, "중첩 이미지를 포함한 SVG는 Chromium 외부 마스크로 표시되지 않습니다.");
  });
}

test(`${system}: 문서와 미리보기가 새 브랜드 자산을 실제로 연결한다`, () => {
  const doc = readFileSync(join(root, "docs", "14-brand-assets.md"), "utf8");
  const preview = readFileSync(join(root, "examples", "preview.html"), "utf8");
  const brandReadme = readFileSync(join(brandDir, "README.md"), "utf8");

  for (const name of ["logo-mark.svg", "logo-lockup.svg", "favicon.svg", "app-icon-512.png", "brand-hero.png"]) {
    assert.ok(doc.includes(name), `14-brand-assets.md에 ${name}이 없습니다.`);
  }
  assert.ok(preview.includes("logo-lockup.svg"), "preview가 새 로크업을 사용하지 않습니다.");
  assert.ok(preview.includes("brand-hero.webp"), "preview가 브랜드 히어로를 사용하지 않습니다.");
  assert.ok(preview.includes('id="brand"'), "preview에 브랜드 자산 전용 섹션이 없습니다.");
  for (const name of ["logo-mark.svg", "logo-mark-mono.svg", "logo-lockup-inverse.svg", "favicon-16.png", "favicon-32.png", "favicon-48.png", "app-icon-512.png"]) {
    assert.ok(preview.includes(name), `preview가 ${name}을 보여주지 않습니다.`);
  }
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
