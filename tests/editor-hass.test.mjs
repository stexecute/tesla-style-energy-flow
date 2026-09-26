import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const source = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/tesla-style-energy-flow.js'), 'utf8');
const elements = new Map();
class ElementStub {
  attachShadow() {
    this.shadowRoot = {
      renders: 0,
      querySelectorAll: () => [],
      querySelector: () => null,
      set innerHTML(value) { this.renders++; this.html = value; },
      get innerHTML() { return this.html; }
    };
  }
}
vm.runInNewContext(source, {
  HTMLElement: ElementStub,
  customElements: { get: (name) => elements.get(name), define: (name, ctor) => elements.set(name, ctor) },
  window: {},
  document: { documentElement: { lang: 'en' } },
  navigator: { language: 'en' },
  console, setTimeout, clearTimeout
});

const Editor = elements.get('tesla-style-energy-flow-editor');
const editor = new Editor();
editor.setConfig({ language: 'en' });
const power = { state: '900', attributes: { unit_of_measurement: 'W', friendly_name: 'Power' } };
const first = { language: 'en', states: { 'sensor.power': power } };
editor.hass = first;
assert.equal(editor.shadowRoot.renders, 2);

editor.hass = { language: 'en', states: { 'sensor.power': { ...power, state: '950' } } };
assert.equal(editor.shadowRoot.renders, 2, 'power state ticks should not rebuild the editor');

editor.hass = { language: 'en', states: { 'sensor.power': power, 'sensor.new': { state: '0', attributes: { unit_of_measurement: 'W' } } } };
assert.equal(editor.shadowRoot.renders, 3, 'new entities should appear without reopening the editor');

editor.hass = { language: 'en', states: { 'sensor.power': { state: '900', attributes: { unit_of_measurement: 'kW', friendly_name: 'Renamed' } }, 'sensor.new': { state: '0', attributes: { unit_of_measurement: 'W' } } } };
assert.equal(editor.shadowRoot.renders, 4, 'option labels and units should refresh');

editor._editingPath = 'entities.solar_power';
editor.hass = { language: 'en', states: { 'sensor.power': power } };
assert.equal(editor.shadowRoot.renders, 4, 'editing should not be interrupted');
editor._editingPath = '';
editor.hass = { language: 'en', states: { 'sensor.power': power } };
assert.equal(editor.shadowRoot.renders, 5, 'an update skipped while editing should be applied later');

editor.hass = { language: 'de', states: { 'sensor.power': power } };
assert.equal(editor.shadowRoot.renders, 6, 'language changes should rebuild the editor');

editor._editingPath = 'title';
editor.setConfig({ language: 'en', title: 'Updated' });
assert.equal(editor.shadowRoot.renders, 6);
editor._editingPath = '';
editor.hass = { language: 'de', states: { 'sensor.power': power } };
assert.equal(editor.shadowRoot.renders, 7, 'config changes skipped while editing should be applied later');
