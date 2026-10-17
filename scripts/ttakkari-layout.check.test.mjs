import assert from 'node:assert/strict';
import test from 'node:test';
import { findSilentClip, inspectDynamicTargets, navigationError, pageErrorFinding, validateTargets } from './ttakkari-layout.rules.mjs';

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
