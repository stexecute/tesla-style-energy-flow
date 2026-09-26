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
