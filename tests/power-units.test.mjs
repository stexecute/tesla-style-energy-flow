import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/tesla-style-energy-flow.js'), 'utf8');
const window = {};
vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, 'window.testToWatt = toWatt;})();'), {
  HTMLElement: class {},
  customElements: { get: () => true },
  window
});

const state = (value, unit) => ({ state: String(value), attributes: { unit_of_measurement: unit } });
assert.equal(window.testToWatt(state(0.9, 'kW')), 900);
assert.equal(window.testToWatt(state(1, 'MW')), 1_000_000);
assert.equal(window.testToWatt(state(900, 'mW')), 0.9);
assert.equal(window.testToWatt(state(900, 'W')), 900);
