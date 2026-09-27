import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)),
  '../dist/tesla-style-energy-flow.js'), 'utf8');
const elements = new Map();
class ElementStub {
  attachShadow() {
    this.shadowRoot = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  }
}
vm.runInNewContext(source, {
  HTMLElement: ElementStub,
  customElements: { get: name => elements.get(name), define: (name, ctor) => elements.set(name, ctor) },
  window: {}, document: { documentElement: { lang: 'en' } }, navigator: { language: 'en' }, console
});

const Card = elements.get('tesla-style-energy-flow');
const card = new Card();
card.setConfig({ language: 'en' });
const markup = card.shadowRoot.innerHTML;
const flow = markup.match(/<path id="line-grid-load" class="flow-line" d="([^"]+)"><\/path><g class="flow-trail-group" data-flow-path="line-grid-load"[^>]*>([\s\S]*?)<\/g>/);
assert.ok(flow, 'each route has one static guide followed by a moving light group');

const guideStyle = markup.match(/\.flow-line\s*\{([^}]*)\}/)?.[1] || '';
assert.match(guideStyle, /stroke:\s*rgba\(/, 'the full route stays as a muted guide');
assert.doesNotMatch(guideStyle, /stroke-dasharray|animation:/, 'the guide itself does not move or break into dashes');

const trailPaths = [...flow[2].matchAll(/<path class="flow-trail" d="([^"]+)" style="([^"]+)"><\/path>/g)];
assert.equal(trailPaths.length, 18, 'the highlight has enough short strokes for a smooth fade');
const cssVar = (style, name) => {
  const match = style.match(new RegExp(`(?:^|;)\\s*${name}:\\s*([-\\d.]+)(?:px)?(?:;|$)`));
  assert.ok(match, `${name} is present on each moving stroke`);
  return Number(match[1]);
};
const normal = [];
const reverse = [];
const starts = [];
const ends = [];
const reverseEnds = [];
for (const [, d, style] of trailPaths) {
  assert.equal(d, flow[1], 'guide and light share the same initial geometry');
  normal.push(cssVar(style, '--trail-opacity'));
  reverse.push(cssVar(style, '--trail-opacity-reverse'));
  starts.push(cssVar(style, '--trail-start'));
  ends.push(cssVar(style, '--trail-end'));
  reverseEnds.push(cssVar(style, '--trail-reverse-end'));
}
assert.ok(normal[0] < normal.at(-1), 'the forward trail is softer at its rear than its front');
assert.ok(reverse[0] > reverse.at(-1), 'the fade reverses with travel direction');
for (let index = 0; index < normal.length; index++) {
  assert.equal(reverse[index], normal[normal.length - 1 - index], 'reverse travel mirrors the fade profile');
}
assert.ok(starts.every((start, index) => index === 0 || start < starts[index - 1]),
  'the small strokes follow one another along the route');

const dash = markup.match(/\.flow-trail\s*\{[^}]*stroke-dasharray:\s*(\d+)\s+(\d+)/)?.slice(1).map(Number);
assert.ok(dash, 'each moving stroke has a short dash and a gap');
const period = dash[0] + dash[1];
assert.equal(period, 200, 'one complete lap is 200 SVG units');
for (let index = 0; index < starts.length; index++) {
  assert.equal(starts[index] - ends[index], period, 'forward travel makes exactly one lap');
  assert.equal(reverseEnds[index] - starts[index], period, 'reverse travel makes exactly one lap');
}
const durations = [...markup.matchAll(/--flow-speed:\s*([\d.]+)s/g)].map(match => Number(match[1]));
assert.ok(durations.length > 0 && durations.every(duration => duration === 2),
  'all active route colors use the same two-second lap');
assert.match(markup, /@keyframes flowStream\s*\{[^}]*--trail-start[^}]*\}[^}]*\}/);
assert.match(markup, /@keyframes flowStreamReverse\s*\{[^}]*--trail-start[^}]*\}[^}]*\}/);

const guide = {
  d: 'M 0 0 L 1 1',
  getAttribute(name) { return name === 'd' ? this.d : null; },
  setAttribute(name, value) { if (name === 'd') this.d = value; }
};
const copies = Array.from({ length: 18 }, () => ({
  d: guide.d,
  setAttribute(name, value) { if (name === 'd') this.d = value; }
}));
const geometryCard = new Card();
geometryCard.shadowRoot.querySelector = selector => selector === '#line-grid-load' ? guide : null;
geometryCard._query = selector => selector === '[data-flow-path="line-grid-load"]'
  ? { querySelectorAll: () => copies } : null;
assert.equal(geometryCard._applyPathProfile({ 'line-grid-load': 'M 2 3 L 5 8' }, 'scene-change'), true);
assert.equal(guide.d, 'M 2 3 L 5 8');
assert.ok(copies.every(copy => copy.d === guide.d), 'a scene geometry change moves every light stroke with its guide');

const syncCard = new Card();
const first = { currentTime: 640, playState: 'running' };
const second = { currentTime: 0, playState: 'running' };
let secondAnimations = [second];
const activeGroups = [
  { getAnimations: options => { assert.equal(options.subtree, true); return [first]; } }
];
syncCard.shadowRoot.querySelectorAll = selector => {
  assert.equal(selector, '.flow-trail-group.active');
  return activeGroups;
};
syncCard._syncedFlowAnimations = new WeakSet();
syncCard._syncFlowTrailAnimations();
assert.equal(first.currentTime, 640, 'the first active route keeps its phase');
activeGroups.push({ getAnimations: options => { assert.equal(options.subtree, true); return secondAnimations; } });
syncCard._syncFlowTrailAnimations();
assert.equal(second.currentTime, 640, 'a later route joins the existing phase');
assert.equal(first.currentTime, 640, 'joining a route does not restart an existing animation');

first.currentTime = 1050;
second.currentTime = 890;
syncCard._syncFlowTrailAnimations();
assert.equal(first.currentTime, 1050, 'an existing route is never rewound on a later update');
assert.equal(second.currentTime, 890, 'an already synchronized route keeps advancing independently');
const replacement = { currentTime: 0, playState: 'running' };
secondAnimations = [replacement];
syncCard._syncFlowTrailAnimations();
assert.equal(replacement.currentTime, 1050, 'a new CSSAnimation for an existing route joins the live phase again');

first.playState = 'paused';
replacement.playState = 'paused';
const pausedArrival = { currentTime: 0, playState: 'paused' };
activeGroups.push({ getAnimations: () => [pausedArrival] });
syncCard._syncFlowTrailAnimations();
assert.equal(pausedArrival.currentTime, 1050, 'a route activated while offscreen still joins the shared phase');
assert.equal(pausedArrival.playState, 'paused', 'phase alignment does not resume an offscreen animation');

const noAnimationCard = new Card();
let discoveredGroups = [];
noAnimationCard.shadowRoot.querySelectorAll = () => discoveredGroups;
assert.doesNotThrow(() => noAnimationCard._syncFlowTrailAnimations(), 'no active routes need no animation API');
discoveredGroups = [{}, { getAnimations: () => [] }];
assert.doesNotThrow(() => noAnimationCard._syncFlowTrailAnimations(),
  'a route without getAnimations and an empty animation list are harmless');
const firstAvailable = { currentTime: 280, playState: 'running' };
discoveredGroups = [{ getAnimations: () => [firstAvailable] }];
noAnimationCard._syncFlowTrailAnimations();
assert.equal(firstAvailable.currentTime, 280, 'a later available first animation retains its phase');

const oldAnimationSet = card._syncedFlowAnimations;
oldAnimationSet.add(firstAvailable);
card._renderStatic();
assert.notEqual(card._syncedFlowAnimations, oldAnimationSet, 'rerendering the SVG replaces the animation registry');
assert.equal(card._syncedFlowAnimations.has(firstAvailable), false,
  'animations from the removed SVG cannot count as synchronized in the new tree');
