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
