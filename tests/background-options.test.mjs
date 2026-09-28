import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/tesla-style-energy-flow.js'), 'utf8');
const elements = new Map();
class ElementStub {
  attachShadow() {
    this.shadowRoot = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] };
  }
}
vm.runInNewContext(source, {
  HTMLElement: ElementStub,
  customElements: { get: (name) => elements.get(name), define: (name, ctor) => elements.set(name, ctor) },
  window: {}, document: { documentElement: { lang: 'en' } }, navigator: { language: 'en' }, console
});

const Card = elements.get('tesla-style-energy-flow');
const card = new Card();
card.setConfig({
  language: 'en',
  background_dim: 0.25,
  background_map: {
    day_clear_ev2_only: '/local/my-second-car.png',
    day_clear_charging: '/local/my-first-car.png'
  }
});
card._hass = { states: { 'sun.sun': { state: 'above_horizon' } } };
assert.match(card.shadowRoot.innerHTML, /class="flow-background-dim" opacity="0\.25"/);
assert.equal(card._computeBackground(true, false, 'sunny', true), '/local/my-second-car.png');
assert.equal(card._computeBackground(true, false, 'sunny', false), '/local/my-first-car.png');
assert.match(card._computeBackground(false, false, 'sunny', true), /scene_day_clear_idle\.png$/, 'idle scenes remain unchanged');

card.setConfig({ language: 'en', background_dim: 2 });
assert.match(card.shadowRoot.innerHTML, /class="flow-background-dim" opacity="1"/);

const sceneCard = new Card();
let selectedScene = '';
sceneCard.setConfig({
  language: 'en',
  background_map: { day_clear_ev2_only: '/local/my-second-car.png' },
  entities: { ev_power: 'sensor.ev1', ev2_power: 'sensor.ev2', ev2_presence: 'binary_sensor.ev2' }
});
sceneCard._setBackground = (url) => { selectedScene = url; };
const evState = (ev1Power) => ({ language: 'en', states: {
  'sun.sun': { state: 'above_horizon' },
  'sensor.ev1': { state: String(ev1Power), attributes: { unit_of_measurement: 'W' } },
  'sensor.ev2': { state: '0', attributes: { unit_of_measurement: 'W' } },
  'binary_sensor.ev2': { state: 'on', attributes: {} }
} });
sceneCard.hass = evState(0);
assert.equal(selectedScene, '/local/my-second-car.png', 'EV 2 presence should select its custom image');
sceneCard.hass = evState(1500);
assert.notEqual(selectedScene, '/local/my-second-car.png', 'EV 1 charging means EV 2 is not alone');

const sceneDefaults = sceneCard._sceneFlowComponentMap();
for (const scene of ['scene_day_clear_idle.png', 'scene_night_rain_dual_charging.png']) {
  assert.equal(sceneDefaults[scene]['heat-pump-label'], undefined, 'standard scenes omit heat pump positions');
}
assert.match(sceneCard.shadowRoot.innerHTML, /id="flow-heat-pump-guide"/);

const sceneFiles = ['day_clear_idle', 'day_clear_charging', 'day_clear_dual_charging',
  'day_rain_idle', 'day_rain_charging', 'day_rain_dual_charging',
  'night_clear_idle', 'night_clear_charging', 'night_clear_dual_charging',
  'night_rain_idle', 'night_rain_charging', 'night_rain_dual_charging'];
const backgrounds = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/backgrounds');
for (const scene of sceneFiles) {
  assert.ok(fs.existsSync(path.join(backgrounds, `scene_${scene}.png`)), `${scene} standard asset exists`);
  assert.ok(fs.existsSync(path.join(backgrounds, `scene_${scene}_heat_pump.png`)), `${scene} heat pump asset exists`);
}

const modeCard = new Card();
modeCard.setConfig({ language: 'en' });
assert.match(modeCard._defaultBackgroundMap().day_clear_idle, /scene_day_clear_idle\.png$/);
assert.equal(modeCard._sceneFlowPathMap()['scene_day_clear_idle.png']['line-solar-load'],
  'M 351 292 L 352 338 L 352 338');
// Every derived guide drops vertically and sits centred under its text, with
// EV 2's block below EV 1's so the two never share a row.
const assertDerivedLayout = (map, mode) => {
  for (const scene of sceneFiles) {
    const profile = map[`scene_${scene}.png`];
    for (const node of ['load', 'battery', 'grid', 'ev', 'ev2']) {
      const guide = profile[`${node}-guide`];
      assert.equal(guide.x1, guide.x2, `${mode} ${scene} ${node} guide is vertical`);
      assert.equal(profile[`${node}-label`].x, guide.x1, `${mode} ${scene} ${node} label centred on guide`);
    }
    assert.ok(profile['ev2-label'].y + 316 > profile['ev-power'].y + 332,
      `${mode} ${scene} EV 2 text sits below EV 1 text`);
  }
};
assertDerivedLayout(modeCard._sceneFlowComponentMap(), 'standard');
const stdDayIdle = modeCard._sceneFlowComponentMap()['scene_day_clear_idle.png'];
assert.equal(stdDayIdle['load-guide'].x1 + 465, 431, 'home guide centred on the four-pane window');
assert.deepEqual({ ...stdDayIdle['battery-guide'] }, { x1: -17, y1: 58, x2: -17, y2: 78 },
  'battery guide points into the battery');
assert.deepEqual({ ...stdDayIdle['grid-guide'] }, { x1: -51, y1: 57, x2: -51, y2: 76 },
  'grid guide rises onto the ground cable');
assert.match(sceneCard.shadowRoot.innerHTML, /id="flow-grid-guide"/, 'grid guide is rendered');

modeCard.setConfig({ language: 'en', entities: { heat_pump_power: 'sensor.heat_pump' } });
for (const scene of sceneFiles) {
  assert.match(modeCard._defaultBackgroundMap()[scene], new RegExp(`scene_${scene}_heat_pump\\.png$`));
}
assert.equal(modeCard._sceneFlowPathMap()['scene_day_clear_idle.png']['line-solar-load'],
  'M 346 287 Q 349 289 351 295 L 352 338');
assertDerivedLayout(modeCard._sceneFlowComponentMap(), 'heat pump');
const hpDayIdle = modeCard._sceneFlowComponentMap()['scene_day_clear_idle.png'];
assert.equal(hpDayIdle['load-guide'].x1 + 465, 418, 'home guide drops onto the distribution box');
assert.deepEqual({ ...modeCard._sceneFlowComponentMap()['scene_day_clear_idle.png']['heat-pump-label'] },
  { x: 80, y: -38 }, 'heat pump label sits beside the unit, below the roof eave');
assert.deepEqual({ ...modeCard._sceneFlowComponentMap()['scene_day_clear_dual_charging.png']['heat-pump-label'] },
  { x: 10, y: -86 }, 'dual scenes lack room right of the unit');
const dualGuide = modeCard._sceneFlowComponentMap()['scene_day_clear_dual_charging.png']['heat-pump-guide'];
assert.equal(dualGuide.x1, dualGuide.x2, 'dual heat pump guide drops vertically onto the unit');
const base = '/local/community/tesla-style-energy-flow/backgrounds';
modeCard.setConfig({ language: 'en', dynamic_background: false,
  background: `${base}/scene_night_rain_idle.png`, entities: { heat_pump_power: 'sensor.heat_pump' } });
assert.equal(modeCard._resolveBackground(false), `${base}/scene_night_rain_idle_heat_pump.png`);
modeCard.setConfig({ language: 'en', dynamic_background: false,
  background: '/local/my-scene.png', entities: { heat_pump_power: 'sensor.heat_pump' } });
assert.equal(modeCard._resolveBackground(false), '/local/my-scene.png');
modeCard.setConfig({ language: 'en', background_map: { day_clear_idle: '/local/my-scene.png' },
  entities: { heat_pump_power: 'sensor.heat_pump' } });
modeCard._hass = { states: { 'sun.sun': { state: 'above_horizon' } } };
assert.equal(modeCard._computeBackground(false, false, 'sunny'), '/local/my-scene.png');

const Editor = elements.get('tesla-style-energy-flow-editor');
const editor = new Editor();
editor.setConfig({ language: 'en' });
assert.ok(!editor._positionEditorGroups('scene_day_clear_idle.png').some((group) => group.node === 'heat-pump'));
assert.match(editor._positionPreviewBackground('scene_day_clear_idle.png'), /scene_day_clear_idle\.png$/);
assert.doesNotMatch(editor._positionPreviewSvg('scene_day_clear_idle.png'), /position-preview-heat-pump-icon/);
editor.setConfig({ language: 'en', entities: { heat_pump_power: 'sensor.heat_pump' } });
assert.ok(editor._positionEditorGroups('scene_day_clear_idle.png').some((group) => group.node === 'heat-pump'));
assert.equal(editor._positionValue('scene_day_clear_idle.png', 'heat-pump-label', 'y'), -38);
// Moving a block sideways keeps the offsets between text and guide, so the
// sideways heat pump guide survives manual edits.
const hpMove = Object.fromEntries(editor._positionLinkedChanges('scene_day_clear_idle.png', 'heat-pump-label', 'x', 90)
  .map(({ componentKey, attr, value }) => [`${componentKey}.${attr}`, value]));
assert.deepEqual(hpMove, {
  'heat-pump-label.x': 90, 'heat-pump-power.x': 90, 'heat-pump-guide.x1': 48, 'heat-pump-guide.x2': 58
});
const hpPreview = editor._positionPreviewGeometry('scene_day_clear_idle.png',
  editor._positionEditorGroups('scene_day_clear_idle.png').find((group) => group.node === 'heat-pump'));
assert.notEqual(hpPreview.guideStart.x, hpPreview.guideEnd.x, 'editor preview keeps the heat pump guide horizontal');
assert.match(editor._positionPreviewBackground('scene_day_clear_idle.png'), /scene_day_clear_idle_heat_pump\.png$/);
assert.match(editor._positionPreviewSvg('scene_day_clear_idle.png'), /position-preview-heat-pump-icon" href="[^\"]*heat_pump_icon_day\.png" x="410" y="311"/);
assert.match(editor._positionPreviewSvg('scene_day_rain_idle.png'), /position-preview-heat-pump-icon" href="[^\"]*heat_pump_icon_rain\.png" x="398" y="304"/);
assert.match(editor._positionPreviewSvg('scene_night_clear_dual_charging.png'), /position-preview-heat-pump-icon" href="[^\"]*heat_pump_icon_rain\.png" x="460" y="311"/);
assert.match(editor._positionPreviewFlowPaths('scene_day_clear_idle.png'), /M 346 287 Q 349 289 351 295 L 352 338/);
