import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const exampleDir = join(root, "examples");
const htmlPath = join(exampleDir, "experience-templates.html");
const cssPath = join(exampleDir, "experience-templates.css");
const jsPath = join(exampleDir, "experience-templates.js");
const docsPath = join(root, "docs", "17-experience-templates.md");

test("notting: 복사 가능한 경험 템플릿 파일 묶음을 제공한다", () => {
  for (const path of [htmlPath, cssPath, jsPath, docsPath]) {
    assert.ok(existsSync(path), `누락된 경험 템플릿 파일: ${path}`);
  }
});

test("notting: 핵심 제품 여정 다섯 묶음을 실제 화면으로 제공한다", () => {
  const html = readFileSync(htmlPath, "utf8");
  for (const template of ["onboarding", "auth", "empty", "resilience", "import"]) {
    assert.match(html, new RegExp(`data-template=["']${template}["']`), `${template} 템플릿이 없습니다.`);
  }
  for (const state of ["offline", "readonly", "conflict", "403", "404", "500", "partial-success"]) {
    assert.match(html, new RegExp(`data-state=["']${state}["']`), `${state} 상태가 없습니다.`);
  }
});

test("notting: 온보딩은 실제 작업을 끝내는 네 단계 흐름이다", () => {
  const html = readFileSync(htmlPath, "utf8");
  for (const step of ["welcome", "workspace", "import", "ready"]) {
    assert.match(html, new RegExp(`data-onboarding-step=["']${step}["']`), `${step} 단계가 없습니다.`);
  }
  assert.match(html, /mascot\.webp/);
  assert.match(html, /첫 페이지 열기/);
});

test("notting: 템플릿은 접근성·반응형·토큰 규칙을 지킨다", () => {
  const html = readFileSync(htmlPath, "utf8");
  const css = readFileSync(cssPath, "utf8");
  assert.match(html, /<html[^>]+lang="ko"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<main\b/);
  assert.doesNotMatch(html, /<button(?![^>]*\btype=)/, "type 없는 button이 있습니다.");
  assert.doesNotMatch(html, /<img(?![^>]*\balt=)/, "alt 없는 img가 있습니다.");
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(/i, "CSS에 토큰이 아닌 색상 값이 있습니다.");
  assert.doesNotMatch(html, /https?:\/\//i, "예제가 외부 런타임 자산에 의존합니다.");
  assert.match(css, /@media\s*\(max-width:/);
  assert.match(css, /prefers-reduced-motion/);
});

test("notting: 기존 미리보기와 문서에서 경험 템플릿으로 진입할 수 있다", () => {
  const preview = readFileSync(join(exampleDir, "preview.html"), "utf8");
  const docs = readFileSync(docsPath, "utf8");
  assert.match(preview, /experience-templates\.html/);
  assert.match(docs, /experience-templates\.html/);
  for (const component of ["SetupShell", "StepIndicator", "EmptyState", "Coachmark", "SetupChecklist", "ResultState"]) {
    assert.match(docs, new RegExp(`\\b${component}\\b`), `${component} 조립 규칙이 없습니다.`);
  }
});
