import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/tesla-style-energy-flow.js'), 'utf8');
const elements = new Map();
class ElementStub {
  attachShadow() { this.shadowRoot = { innerHTML: '', querySelector: () => null, querySelectorAll: () => [] }; }
}
vm.runInNewContext(source, {
  HTMLElement: ElementStub,
  customElements: { get: (name) => elements.get(name), define: (name, ctor) => elements.set(name, ctor) },
  window: {}, document: { documentElement: { lang: 'en' } }, navigator: { language: 'en' }, console
});

const Card = elements.get('tesla-style-energy-flow');
function activePaths(batteryPower, batteryInvert = false) {
  const card = new Card();
  const paths = [];
  card.setConfig({
    language: 'en', battery_invert: batteryInvert,
    entities: { battery_power: 'sensor.battery', load_power: 'sensor.home' }
  });
  card._activatePath = (id, cls, watts, threshold) => {
    if (watts >= threshold) paths.push(id);
  };
  card.hass = { language: 'en', states: {
    'sensor.battery': { state: String(batteryPower), attributes: { unit_of_measurement: 'W' } },
    'sensor.home': { state: '900', attributes: { unit_of_measurement: 'W' } }
  } };
  return paths;
}

assert.ok(activePaths(-900).includes('line-battery-load'), 'negative battery power discharges to home');
assert.ok(activePaths(900, true).includes('line-battery-load'), 'battery_invert supports positive discharge sensors');
assert.deepEqual(activePaths(900), [], 'positive battery power is charging and cannot supply home');

const heatPumpCard = new Card();
heatPumpCard.setConfig({ language: 'en', entities: { heat_pump_power: 'sensor.heat_pump' } });
let renders = 0;
heatPumpCard._renderDynamic = () => { renders++; };
const heatPumpHass = (watts) => ({ language: 'en', states: {
  'sensor.heat_pump': { state: String(watts), attributes: { unit_of_measurement: 'W' } }
} });
heatPumpCard.hass = heatPumpHass(1000);
heatPumpCard.hass = heatPumpHass(2000);
assert.equal(renders, 2, 'heat pump sensor updates must redraw the card');

const allocationCard = new Card();
allocationCard.setConfig({
  language: 'en', heat_pump_in_load: true,
  entities: { grid_power: 'sensor.grid', load_power: 'sensor.home', heat_pump_power: 'sensor.heat_pump' }
});
const labels = new Map();
const active = [];
allocationCard._setText = (id, value) => labels.set(id, value);
allocationCard._activatePath = (id, cls, watts, threshold) => {
  if (watts >= threshold) active.push(id);
};
allocationCard.hass = { language: 'en', states: {
  'sensor.grid': { state: '2000', attributes: { unit_of_measurement: 'W' } },
  'sensor.home': { state: '2000', attributes: { unit_of_measurement: 'W' } },
  'sensor.heat_pump': { state: '1000', attributes: { unit_of_measurement: 'W' } }
} };
assert.equal(labels.get('#flow-load-power'), '1.0 kW', 'whole-home load must exclude the separate heat pump draw');
assert.equal(labels.get('#flow-heat-pump-power'), '1.0 kW');
assert.ok(active.includes('line-heat-pump'), 'configured heat pump draw should light its own path');

// EV line colour: solar-only stays yellow, with hysteresis around the 5 % boundary.
// Each step is [solarW, gridW, batteryW (negative = discharging)]; the 500 W base load is covered by solar first.
function evLineClasses(steps, evW = 4000) {
  const card = new Card();
  card.setConfig({
    language: 'en',
    entities: { solar_power: 'sensor.solar', grid_power: 'sensor.grid', battery_power: 'sensor.battery', load_power: 'sensor.home', ev_power: 'sensor.ev' }
  });
  let cls = null;
  card._setText = () => {};
  card._activatePath = (id, c, watts, threshold) => {
    if (id === 'line-wallbox-ev' && watts >= threshold) cls = c;
  };
  const state = (v) => ({ state: String(v), attributes: { unit_of_measurement: 'W' } });
  return steps.map(([solarW, gridW, batteryW = 0]) => {
    cls = null;
    card.hass = { language: 'en', states: {
      'sensor.solar': state(solarW), 'sensor.grid': state(gridW), 'sensor.battery': state(batteryW),
      'sensor.home': state(500), 'sensor.ev': state(evW)
    } };
    return cls;
  });
}

assert.deepEqual(evLineClasses([[4500, 0]]), ['flow-solar'], 'solar-only EV charging is yellow');
assert.deepEqual(
  evLineClasses([[4500, 0, 0], [4260, 0, -240], [4340, 0, -160], [4260, 0, -240], [4340, 0, -160]]),
  ['flow-solar', 'flow-solar', 'flow-solar', 'flow-solar', 'flow-solar'],
  'a battery share crossing 5 % (but below 10 %) must not flicker between yellow and green'
);
assert.equal(evLineClasses([[1500, 3000]])[0], 'flow-broken', 'grid-dominated EV charging is not solar-only');
assert.deepEqual(
  evLineClasses([[4500, 0, 0], [2500, 0, -2000], [4260, 0, -240], [4400, 0, -100]]),
  ['flow-solar', 'flow-green', 'flow-green', 'flow-solar'],
  'once green it needs a battery share below 5 % to return to solar-only'
);

// Without a battery contribution the line never turns green, even at >= 80 % renewable.
assert.deepEqual(
  evLineClasses([[3600, 900]]),
  ['flow-solar'],
  '90 % solar + 10 % grid and no battery stays yellow, not green'
);
assert.equal(evLineClasses([[1600, 3000]])[0], 'flow-broken', 'grid-dominant mix with no battery is red');
