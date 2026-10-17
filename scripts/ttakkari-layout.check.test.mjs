import assert from 'node:assert/strict';
import test from 'node:test';
import {
  dialogClosedError, dialogMeasurementError, fileButtonMismatch, findSilentClip, inspectDynamicTargets,
  navigationError, pageErrorFinding, tableViewportFinding, touchTargetFinding, validateTargets,
} from './ttakkari-layout.rules.mjs';

const visuallyHidden = {
  position: 'absolute', width: '1px', height: '1px', paddingTop: '0px', paddingRight: '0px',
  paddingBottom: '0px', paddingLeft: '0px', overflowX: 'hidden', overflowY: 'hidden',
  clip: 'rect(0px, 0px, 0px, 0px)', clipPath: 'none', textOverflow: 'clip', webkitLineClamp: 'none', display: 'block',
};

test('일반적인 시각 숨김(sr-only·비활성 탭 패널)은 silent-clip 오탐이 아니다', () => {
  assert.equal(findSilentClip({ sig: 'h2.sr-only', text: '접근성 이름', scrollWidth: 160, clientWidth: 1, style: visuallyHidden }), null);
  assert.equal(findSilentClip({ sig: 'section[role=tabpanel][data-active=false]', role: 'tabpanel', dataActive: 'false', text: '비활성 패널', scrollWidth: 160, clientWidth: 1, style: visuallyHidden }), null);
});

test('활성 탭 패널에 남은 clip은 fail하고 culprit을 표시한다', () => {
  const finding = findSilentClip({
    sig: 'section[role=tabpanel][data-active=true]', role: 'tabpanel', dataActive: 'true',
    text: '현재 패널 내용', scrollWidth: 260, clientWidth: 1, style: visuallyHidden,
  });
  assert.equal(finding?.rule, 'silent-clip');
  assert.equal(finding?.sig, 'section[role=tabpanel][data-active=true]');
});

test('의도적으로 숨긴 것으로 볼 수 없는 visible clip은 culprit을 표시한다', () => {
  const finding = findSilentClip({
    sig: 'div.visible-clip', text: '잘린 텍스트', scrollWidth: 260, clientWidth: 80,
    style: { ...visuallyHidden, width: '80px', height: '24px' },
  });
  assert.equal(finding?.rule, 'silent-clip');
  assert.equal(finding?.sig, 'div.visible-clip');
});

test('dialog target이 검사 중 제거되면 미측정으로 내고 통과시키지 않는다', async () => {
  const dialog = { isConnected: true };
  const report = await inspectDynamicTargets([dialog], async (target) => {
    target.isConnected = false;
    return [{ rule: 'dialog-overflow-x', sig: 'dialog#removed' }];
  });
  assert.deepEqual(report.findings, []);
  assert.deepEqual(report.errors.map(({ rule, status }) => [rule, status]), [['checker-error', 'unmeasured']]);
  assert.match(report.errors[0].detail, /removed/);
});

test('dialog 검사기의 예외는 앱 오류와 섞지 않고 checker-error로 남긴다', async () => {
  const report = await inspectDynamicTargets([{ isConnected: true }], async () => { throw new Error('measure exploded'); });
  assert.deepEqual(report.findings, []);
  assert.equal(report.errors[0].rule, 'checker-error');
  assert.equal(report.errors[0].status, 'unmeasured');
  assert.match(report.errors[0].detail, /measure exploded/);
});

test('0개 target과 HTTP 404는 미측정 오류로 남는다', () => {
  assert.equal(validateTargets([])?.status, 'unmeasured');
  assert.equal(validateTargets([{ name: '/memos', url: 'http://local/memos' }]), null);
  assert.equal(navigationError('/missing', 'http://local/missing', 404)?.status, 'unmeasured');
  assert.equal(navigationError('/memos', 'http://local/memos', 200), null);
});

test('앱의 페이지 렌더 예외는 checker-error와 분리된 render-error다', () => {
  assert.deepEqual(pageErrorFinding('/memos', new Error('app render failed')), {
    rule: 'page-error', status: 'render-error', sig: '/memos', detail: 'app render failed',
  });
});

test('아이콘은 작아도 모바일 히트 영역이 44×44면 정상이고, 실제 히트 영역 미달은 위치·원시 치수와 함께 실패한다', () => {
  assert.equal(touchTargetFinding({
    sig: 'button.icon', visual: { x: 12, y: 12, width: 20, height: 20 },
    hit: { x: 0, y: 0, width: 44, height: 44 },
  }), null);
  assert.deepEqual(touchTargetFinding({
    sig: 'button.icon', visual: { x: 12, y: 12, width: 20, height: 20 },
    hit: { x: 4, y: 5, width: 36, height: 38 },
  }), {
    rule: 'touch-target-under-44', sig: 'button.icon',
    detail: '히트 영역 36×38 @ 4,5; 시각 요소 20×20 @ 12,12 (기준 44×44)',
  });
});

test('모바일 입력 글자 16px 미달만 검출하고 16px 경계는 통과한다', () => {
  assert.deepEqual(touchTargetFinding({ kind: 'input-font', sig: 'input.search', fontSize: 15.5 }), {
    rule: 'input-font-under-16', sig: 'input.search', detail: 'font-size 15.5px (기준 16px)',
  });
  assert.equal(touchTargetFinding({ kind: 'input-font', sig: 'input.search', fontSize: 16 }), null);
  assert.deepEqual(touchTargetFinding({ kind: 'input-font', sig: 'input.search', fontSize: Number.NaN }), {
    rule: 'checker-error', status: 'unmeasured', sig: 'input.search', detail: 'input font-size could not be measured',
  });
});

test('FileButton 투명 input은 버튼과 위치·크기가 맞아야 하고 일치하면 통과한다', () => {
  assert.equal(fileButtonMismatch(
    { x: 100, y: 30, width: 44, height: 44 }, { x: 100, y: 30, width: 44, height: 44 },
  ), null);
  assert.deepEqual(fileButtonMismatch(
    { x: 100, y: 30, width: 44, height: 44 }, { x: 101, y: 30, width: 30, height: 44 }, 'button.tk-file-button',
  ), {
    rule: 'file-input-hitbox-mismatch', sig: 'button.tk-file-button',
    detail: '버튼 100,30 44×44 · 투명 input 101,30 30×44 · 위치/크기 차이',
  });
});

test('표가 뷰포트 밖이면 실패하고, 뷰포트 안의 의도된 가로 스크롤은 허용한다', () => {
  const viewport = { left: 0, top: 0, right: 390, bottom: 700 };
  assert.equal(tableViewportFinding({
    sig: 'table.wbs', table: { left: 0, top: 20, right: 720, bottom: 400 }, viewport,
    scroller: { left: 0, top: 10, right: 390, bottom: 430 }, overflowX: 'auto', scrollWidth: 720, clientWidth: 390,
  }), null);
  assert.equal(tableViewportFinding({
    sig: 'table.wbs', table: { left: 0, top: 20, right: 410, bottom: 400 }, viewport,
    scroller: null, overflowX: 'visible', scrollWidth: 410, clientWidth: 410,
  })?.rule, 'table-outside-viewport');
  assert.equal(tableViewportFinding({
    sig: 'table.wbs', table: { left: 0, top: 20, right: 720, bottom: 400 }, viewport,
    scroller: { left: 0, top: 10, right: 401, bottom: 430 }, overflowX: 'auto', scrollWidth: 720, clientWidth: 401,
  })?.rule, 'table-outside-viewport');
});

test('dialog가 닫혔거나 두 프레임 사이에 움직이면 미측정, 안정된 open 상태만 측정 가능', () => {
  assert.equal(dialogMeasurementError([
    { open: true, rect: { x: 10, y: 20, width: 300, height: 400 } },
    { open: true, rect: { x: 10, y: 20, width: 300, height: 400 } },
  ]), null);
  assert.match(dialogMeasurementError([
    { open: true, rect: { x: 10, y: 20, width: 300, height: 400 } },
    { open: false, rect: { x: 10, y: 20, width: 300, height: 400 } },
  ]), /closed/);
  const unstable = dialogMeasurementError([
    { open: true, rect: { x: 10, y: 20, width: 300, height: 400 } },
    { open: true, rect: { x: 30, y: 20, width: 300, height: 400 } },
  ]);
  assert.match(unstable, /unstable/);
  assert.match(unstable, /x=10/);
  assert.match(unstable, /x=30/);
  assert.match(dialogClosedError(true), /remained open/);
  assert.equal(dialogClosedError(false), null);
});
