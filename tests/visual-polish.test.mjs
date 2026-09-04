import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dist', 'tesla-style-energy-flow.js'), 'utf8');

assert.match(
  source,
  /const sceneScale = clamp\(safeNum\(cfg\.scene_scale, 1\), 0\.6, 1\.4\);/,
  'scene_scale should default to 1.0 to avoid clipping the SVG in Safari'
);

assert.doesNotMatch(
  source,
  /<svg viewBox="0 0 600 460" style="transform: scale/,
  'the SVG should not be scaled with CSS transform because ha-card clips the result'
);

assert.match(
  source,
  /'battery-label': Object\.freeze\(\{ x: -30, y: 82 \}\)/,
  'day clear idle battery label should sit high enough to stay inside the card'
);

assert.match(
  source,
  /'solar-label': Object\.freeze\(\{ x: -20, y: -94 \}\),\s*'solar-power': Object\.freeze\(\{ x: -20, y: -72 \}\),\s*'solar-guide': Object\.freeze\(\{ x1: -20, y1: -56, x2: -20, y2: 16 \}\)/,
  'day clear idle solar label, power and guide should sit closer to the PV modules'
);

assert.match(
  source,
  /'grid-label': Object\.freeze\(\{ x: -14, y: 66 \}\),\s*'grid-power': Object\.freeze\(\{ x: -14, y: 88 \}\),\s*'grid-guide': Object\.freeze\(\{ x1: -14, y1: 106, x2: -14, y2: 144 \}\)/,
  'day clear idle grid label and power should sit above the grid guide line, near the grid import line origin so it does not overlap the heat pump node'
);

assert.match(
  source,
  /'load-label': Object\.freeze\(\{ x: -20, y: -125 \}\),\s*'load-power': Object\.freeze\(\{ x: -20, y: -103 \}\),\s*'load-guide': Object\.freeze\(\{ x1: -20, y1: -85, x2: -56, y2: -66 \}\)/,
  'day clear idle house label should sit up in the open sky, with the guide pointing diagonally down to the roof peak (not the solar panels, to avoid confusion), clear of the heat pump node'
);

assert.match(
  source,
  /<text class="flow-arrow" id="flow-battery-arrow" x="0" y="97" text-anchor="middle"><\/text>/,
  'battery charge direction should use a separate green arrow between power and percent'
);

assert.match(
  source,
  /<text class="flow-pct" id="flow-battery-pct" x="8" y="97" text-anchor="start">--%<\/text>/,
  'battery percent should start close to the compact static value row'
);

assert.match(
  source,
  /const COMPACT_VALUE_ROW = Object\.freeze\(\{\s*arrowOffsetX: 8,\s*percentOffsetX: 16\s*\}\);/,
  'compact value row spacing should keep power, arrow and percent visually grouped'
);

assert.match(
  source,
  /_alignCompactValueRow\(powerSelector, arrowSelector, percentSelector\) \{/,
  'battery and EV value rows should share one alignment helper'
);

assert.match(
  source,
  /_alignCompactValueRows\(\) \{[\s\S]*'#flow-battery-power', '#flow-battery-arrow', '#flow-battery-pct'[\s\S]*'#flow-ev-power', '#flow-ev-arrow', '#flow-ev-pct'[\s\S]*'#flow-ev2-power', '#flow-ev2-arrow', '#flow-ev2-pct'/,
  'battery, EV 1 and EV 2 arrow and percent should stay locked to their power baselines'
);

assert.match(
  source,
  /<text class="flow-power" id="flow-ev-power" x="0" y="79" text-anchor="end">0\.0 kW<\/text>[\s\S]*<text class="flow-arrow" id="flow-ev-arrow" x="8" y="79" text-anchor="middle"><\/text>[\s\S]*<text class="flow-pct" id="flow-ev-pct" x="16" y="79" text-anchor="start">--%<\/text>/,
  'EV 1 static markup should match the compact battery value row'
);

assert.match(
  source,
  /<text class="flow-power" id="flow-ev2-power" x="0" y="-8" text-anchor="end">0\.0 kW<\/text>[\s\S]*<text class="flow-arrow" id="flow-ev2-arrow" x="8" y="-8" text-anchor="middle"><\/text>[\s\S]*<text class="flow-pct" id="flow-ev2-pct" x="16" y="-8" text-anchor="start">--%<\/text>/,
  'EV 2 static markup should be prepared with the compact battery value row'
);

assert.match(
  source,
  /'ev-arrow': Object\.freeze\(\{ id: 'flow-ev-arrow', attrs: Object\.freeze\(\['x', 'y'\]\) \}\),[\s\S]*'ev2-arrow': Object\.freeze\(\{ id: 'flow-ev2-arrow', attrs: Object\.freeze\(\['x', 'y'\]\) \}\),/,
  'scene component bindings should allow EV arrows to be positioned with their rows'
);

assert.match(
  source,
  /const ev1Arrow = \(\(ev1\.power \|\| 0\) > 0 \|\| ev1\.switchOn\) \? '▲' : '';[\s\S]*this\._setText\('#flow-ev-arrow', ev1Arrow\);[\s\S]*const ev2Arrow = \(\(ev2\.power \|\| 0\) > 0 \|\| ev2\.switchOn\) \? '▲' : '';[\s\S]*this\._setText\('#flow-ev2-arrow', ev2Arrow\);/,
  'EV arrows should turn on with the same green charging indicator semantics as the battery row'
);

assert.match(
  source,
  /_alignLabelPowerColumns\(\) \{/,
  'labels should be realigned after scene profiles so headings stay centered over their power values'
);

assert.match(
  source,
  /const GUIDE_ALIGNED_TEXT_PAIRS = Object\.freeze\(\[[\s\S]*\['#flow-solar-label', '#flow-solar-power', '#flow-solar-guide'\],[\s\S]*\['#flow-grid-label', '#flow-grid-power', '#flow-grid-guide'\],[\s\S]*\['#flow-load-label', '#flow-load-power', '#flow-load-guide'\],[\s\S]*\['#flow-ev-label', '#flow-ev-power', '#flow-ev-guide'\],[\s\S]*\['#flow-ev2-label', '#flow-ev2-power', '#flow-ev2-guide'\][\s\S]*\]\);/,
  'middle-anchored headings and values should share the same x coordinate as their guide lines'
);

assert.match(
  source,
  /const GUIDE_TEXT_CLEARANCE = Object\.freeze\(\{\s*base: 8,\s*scaleExtra: 6\s*\}\);/,
  'guide line spacing should grow when font_scale grows'
);

assert.match(
  source,
  /const VIEWBOX_TEXT_FIT = Object\.freeze\(\{\s*margin: 18,\s*labelPowerGap: 22\s*\}\);/,
  'scene_scale should have a viewbox text safety margin'
);

assert.match(
  source,
  /'scene_night_clear_idle\.png': Object\.freeze\(\{[\s\S]*'grid-label': Object\.freeze\(\{ x: 18, y: -14 \}\),\s*'grid-power': Object\.freeze\(\{ x: 18, y: 8 \}\),\s*'grid-guide': Object\.freeze\(\{ x1: 18, y1: 30, x2: 18, y2: 60 \}\)/,
  'night clear idle grid label and power should sit above the grid guide line'
);

assert.match(
  source,
  /_sceneViewBox\(\) \{[\s\S]*const sceneScale = clamp\(safeNum\(this\._config\.scene_scale, 1\), 0\.6, 1\.4\);[\s\S]*minY: 230 - \(230 \/ sceneScale\),[\s\S]*maxY: 230 \+ \(230 \/ sceneScale\)/,
  'scene_scale should expose the visible SVG viewbox for text fitting'
);

assert.match(
  source,
  /_fitTextBlocksToViewBox\(\) \{[\s\S]*const viewBox = this\._sceneViewBox\(\);[\s\S]*this\._fitGuideTextPairToViewBox\(label, power, guide, viewBox\)[\s\S]*this\._fitBatteryBlockToViewBox\(viewBox\)/,
  'labels and battery values should be fitted back into the scaled scene viewbox'
);

assert.match(
  source,
  /_fitBatteryBlockToViewBox\(viewBox\) \{[\s\S]*'#flow-battery-label'[\s\S]*'#flow-battery-power'[\s\S]*'#flow-battery-guide'[\s\S]*this\._shiftGuideY\(guide, delta\)/,
  'battery guide line should move with battery label and kW when scene_scale reduces the visible viewbox'
);

assert.match(
  source,
  /_alignGuideTextClearance\(\) \{[\s\S]*const gap = this\._guideTextGap\(\);[\s\S]*const textTop = Math\.min\(labelY, powerY\);[\s\S]*const textBottom = Math\.max\(labelY, powerY\);[\s\S]*this\._moveGuideEndpoint\(guide, nearAttr, nextNear\)/,
  'guide line endpoints should keep a font-scale-aware clearance from nearby labels and values'
);

assert.match(
  source,
  /const GUIDE_CLEARANCE_TEXT_PAIRS = Object\.freeze\(\[[\s\S]*\['#flow-battery-label', '#flow-battery-power', '#flow-battery-guide'\][\s\S]*\]\);/,
  'battery guide line should use the same text clearance guard as solar, grid and house labels'
);

assert.match(
  source,
  /const EDITOR_UPDATE_DEBOUNCE_MS = 500;/,
  'visual editor text and number controls should debounce Home Assistant config updates'
);

assert.match(
  source,
  /_queueEditorUpdate\(path, value\) \{[\s\S]*this\._applyEditorValue\(path, value\);[\s\S]*setTimeout\(\(\) => \{[\s\S]*this\._emitConfig\(\);[\s\S]*EDITOR_UPDATE_DEBOUNCE_MS[\s\S]*\}/,
  'visual editor should update local input state immediately but emit config changes after a short pause'
);

assert.match(
  source,
  /set hass\(hass\) \{[\s\S]*this\._hass = hass;[\s\S]*if \(this\._isEditorBusy\(\)\) return;[\s\S]*this\._render\(\);[\s\S]*\}/,
  'visual editor should not rerender focused inputs on every Home Assistant state refresh'
);

assert.match(
  source,
  /const POSITION_EDITOR_SCENES = Object\.freeze\(/,
  'visual editor should expose known scene profiles in a position editor'
);

assert.match(
  source,
  /const POSITION_EDITOR_GROUPS = Object\.freeze\(\[[\s\S]*title: 'Solar'[\s\S]*title: 'Grid'[\s\S]*title: 'Home'[\s\S]*title: 'Battery'[\s\S]*title: 'EV 1'[\s\S]*scene: 'charging'[\s\S]*title: 'EV 2'[\s\S]*scene: 'dual_charging'[\s\S]*\]\);/,
  'visual editor should provide per-component controls for fixed nodes and charging EV nodes'
);

assert.match(
  source,
  /const POSITION_EDITOR_NODE_ORIGINS = Object\.freeze\(\{[\s\S]*solar: Object\.freeze\(\{ x: 286, y: 155 \}\)[\s\S]*grid: Object\.freeze\(\{ x: 448, y: 336 \}\)[\s\S]*load: Object\.freeze\(\{ x: 465, y: 247 \}\)[\s\S]*battery: Object\.freeze\(\{ x: 314, y: 330 \}\)[\s\S]*ev: Object\.freeze\(\{ x: 184, y: 332 \}\)[\s\S]*ev2: Object\.freeze\(\{ x: 106, y: 316 \}\)[\s\S]*\}\);/,
  'visual position preview should know the SVG node origins for fixed and EV scene coordinate updates'
);

assert.match(
  source,
  /_positionEditorGroups\(sceneKey\) \{[\s\S]*group\.scene === 'charging'[\s\S]*sceneKey\.includes\('charging'\)[\s\S]*group\.scene === 'dual_charging'[\s\S]*sceneKey\.includes\('dual_charging'\)/,
  'visual editor should show EV markers only for charging scenes where those markers are relevant'
);

assert.match(
  source,
  /_positionPreviewSvg\(sceneKey\) \{[\s\S]*<svg class="position-preview-svg"[\s\S]*data-position-preview-svg[\s\S]*viewBox="0 0 600 460"/,
  'visual editor should render an SVG preview for visual position tuning'
);

assert.match(
  source,
  /_positionEditorModal\(\) \{[\s\S]*data-position-editor-modal[\s\S]*data-close-position-editor[^>]*>\$\{this\._t\('editor\.position_close_button', 'Close'\)\}<\/button>[\s\S]*this\._positionEditorControls\(\{ modal: true \}\)/,
  'visual position editor should render the large editing surface inside a modal'
);

assert.match(
  source,
  /<button type="button" class="[^"]*position-open-button[^"]*" data-open-position-editor>/,
  'scene positions section should open the visual editor in a popup instead of embedding the full workspace'
);

assert.match(
  source,
  /_positionAxisInput\(sceneKey, componentKey, attr, axis\) \{[\s\S]*class="position-axis-field"[\s\S]*data-position-path=/,
  'position inputs should render as compact axis fields below the preview'
);

assert.match(
  source,
  /_positionPairRow\(sceneKey, title, xComponentKey, xAttr, yComponentKey, yAttr\) \{[\s\S]*class="position-pair-row"[\s\S]*this\._positionAxisInput\(sceneKey, xComponentKey, xAttr, 'X'\)[\s\S]*this\._positionAxisInput\(sceneKey, yComponentKey, yAttr, 'Y'\)/,
  'position inputs should render as compact x/y pairs below the preview'
);

assert.match(
  source,
  /\.position-editor-panel \{[\s\S]*width: 100%;[\s\S]*max-width: min\(1180px, calc\(100vw - 32px\)\);[\s\S]*overflow: hidden;[\s\S]*box-sizing: border-box;/,
  'position editor popup should keep its panel bounded inside the available container and viewport'
);

assert.match(
  source,
  /_isEditorBusy\(\) \{[\s\S]*!!this\._positionEditorOpen/,
  'Home Assistant refreshes should not rerender the open position editor and reset scroll or scene selection'
);

assert.match(
  source,
  /\.position-editor-workspace \{[\s\S]*display: flex;[\s\S]*flex-direction: column;[\s\S]*overflow: auto;/,
  'position editor workspace should stack preview and controls in normal flow so they cannot overlap'
);

assert.match(
  source,
  /\.position-pair-grid \{[\s\S]*grid-template-columns: repeat\(auto-fit, minmax\(210px, 1fr\)\);/,
  'position value pairs should use a compact responsive grid below the preview'
);

assert.match(
  source,
  /\.position-groups-modal \{[\s\S]*max-height: none;[\s\S]*overflow: visible;/,
  'position groups inside the popup should scroll with the workspace instead of being clipped as a side rail'
);

assert.match(
  source,
  /positionSceneSelect\.addEventListener\('focus', \(\) => \{[\s\S]*this\._editingPath = 'position-scene';[\s\S]*positionSceneSelect\.addEventListener\('blur', \(\) => \{[\s\S]*this\._editingPath = '';/,
  'scene selector should be protected from Home Assistant refreshes while the dropdown is being used'
);

assert.match(
  source,
  /this\._positionEditorOpen = true;[\s\S]*this\._render\(\);[\s\S]*this\._positionEditorOpen = false;[\s\S]*this\._render\(\);/,
  'visual position editor popup should have open and close event handlers'
);

assert.match(
  source,
  /_positionPreviewGroup\(sceneKey, group\) \{[\s\S]*data-drag-kind="text"/,
  'visual editor preview should include draggable text handles'
);

assert.match(
  source,
  /_positionPreviewGroup\(sceneKey, group\) \{[\s\S]*data-drag-kind="guide"/,
  'visual editor preview should include draggable text and guide handles'
);

assert.match(
  source,
  /_positionPointerPoint\(event, svg\) \{[\s\S]*createSVGPoint[\s\S]*matrixTransform[\s\S]*getScreenCTM\(\)\.inverse\(\)/,
  'visual editor drag handling should convert pointer positions into SVG coordinates'
);

assert.match(
  source,
  /_beginPositionDrag\(event\) \{[\s\S]*setPointerCapture\?\.\(event\.pointerId\)[\s\S]*this\._positionDrag =/,
  'visual editor should capture pointer drags from preview handles'
);

assert.match(
  source,
  /_positionTextDragValues\(sceneKey, group\) \{[\s\S]*group\.label, attr: 'x'[\s\S]*group\.power, attr: 'x'[\s\S]*group\.guide, attr: 'x1'[\s\S]*group\.guide, attr: 'x2'/,
  'dragging a label block should move the label, kW value and guide x coordinate together'
);

assert.match(
  source,
  /_positionGuideDragValues\(sceneKey, componentKey, endpoint\) \{[\s\S]*attr: `y\$\{endpoint\}`/,
  'dragging a guide endpoint should only change its y coordinate so guide lines stay vertical'
);

assert.match(
  source,
  /_movePositionDrag\(event\) \{[\s\S]*const changes = this\._positionDrag\.values\.map[\s\S]*this\._queueScenePositionChanges\(sceneKey, changes\)[\s\S]*this\._updatePositionPreviewDom\(sceneKey, changes\)/,
  'visual editor should update scene_component_map and the preview DOM while dragging'
);

assert.match(
  source,
  /_positionLinkedChanges\(sceneKey, componentKey, attr, value\) \{[\s\S]*if \(\['x', 'x1', 'x2'\]\.includes\(attr\) && group\)[\s\S]*componentKey: group\.label, attr: 'x'[\s\S]*componentKey: group\.power, attr: 'x'[\s\S]*componentKey: group\.guide, attr: 'x1'[\s\S]*componentKey: group\.guide, attr: 'x2'/,
  'manual x edits should keep labels, kW values and guide lines centered in the GUI editor'
);

assert.match(
  source,
  /_queueScenePositionChanges\(sceneKey, changes\) \{[\s\S]*this\._applyScenePositionChanges\(sceneKey, changes, false\)[\s\S]*EDITOR_UPDATE_DEBOUNCE_MS/,
  'visual editor should debounce drag updates before emitting Home Assistant config changes'
);

assert.match(
  source,
  /data-position-scene/,
  'visual editor should render a scene selector for position tuning'
);

assert.match(
  source,
  /_updateSceneComponentPosition\(sceneKey, componentKey, attr, value, emit = true\) \{[\s\S]*const nextMap = \{ \.\.\.\(this\._config\.scene_component_map \|\| \{\}\) \};[\s\S]*nextMap\[sceneKey\] = scene;[\s\S]*this\._applyEditorValue\('scene_component_map', nextMap\);/,
  'scene position updates should preserve scene filenames with dots instead of using dotted config paths'
);

assert.doesNotMatch(
  source,
  /\.flow-node\.inactive \.flow-node-guide\s*\{\s*opacity: 0;\s*\}/,
  'node guide lines should remain visible even when a value is below the flow threshold'
);

assert.match(
  source,
  /morning_clear_idle: '',[\s\S]*afternoon_clear_idle: '',[\s\S]*evening_clear_idle: '',[\s\S]*night_clear_idle: '',/,
  'background_map should expose time-of-day keys for cleaner morning, afternoon, evening and night assets'
);

assert.match(
  source,
  /_sceneTimeSlot\(period\) \{/,
  'the card should derive a time-of-day slot for background lookup and tone overlays'
);

assert.match(
  source,
  /data-scene-tone="afternoon"/,
  'the static render should default to a readable afternoon tone until live state is available'
);

assert.match(
  source,
  /<rect class="flow-sky-dim" x="0" y="0" width="600" height="260"><\/rect>/,
  'the SVG should include a sky dimming layer so text remains readable on bright backgrounds'
);

// Regression for #27 "Stutter from grid to home": the flowStream keyframe scrolls
// stroke-dashoffset by a fixed distance every cycle, so a seamless loop requires the
// dash period (--flow-seg + --flow-gap) of every flow colour to equal that distance.
// flow-broken (the grid/import colour) used 40 + 96 = 136 while the offset is 144,
// producing an 8-unit phase jump once per cycle — a visible stutter on the grid->home line.
const flowStreamCycle = (() => {
  const m = source.match(/@keyframes flowStream \{\s*to \{ stroke-dashoffset: -(\d+(?:\.\d+)?)/);
  assert.ok(m, 'flowStream keyframe should define a stroke-dashoffset scroll distance');
  return Number(m[1]);
})();

for (const colour of ['flow-solar', 'flow-green', 'flow-broken']) {
  const block = source.match(new RegExp(`\\.flow-line\\.active\\.${colour} \\{([\\s\\S]*?)\\}`));
  assert.ok(block, `${colour} flow-line rule should exist`);
  const seg = Number(block[1].match(/--flow-seg:\s*(\d+(?:\.\d+)?)/)?.[1]);
  const gap = Number(block[1].match(/--flow-gap:\s*(\d+(?:\.\d+)?)/)?.[1]);
  assert.equal(
    seg + gap,
    flowStreamCycle,
    `${colour} dash period (--flow-seg ${seg} + --flow-gap ${gap} = ${seg + gap}) must equal the flowStream scroll distance ${flowStreamCycle} so the dashes loop without stuttering`
  );
}

// Heat pump node: config, waterfall wiring, and SVG scaffolding should all be present.
assert.match(
  source,
  /heat_pump_power: ''/,
  'DEFAULT_CONFIG.entities should expose a heat pump power sensor'
);

assert.match(
  source,
  /heat_pump_in_load: false/,
  'DEFAULT_CONFIG should expose a heat_pump_in_load flag mirroring ev_in_load'
);

assert.match(
  source,
  /'line-heat-pump': 'line_heat_pump'/,
  'FLOW_PATH_KEYS should register the heat pump flow line'
);

assert.match(
  source,
  /id="heat-pump-node-group"/,
  'the card template should render a heat pump node group'
);

assert.match(
  source,
  /const flexDraw = evDraw \+ heatPumpDraw;/,
  'heat pump should share its draw pool with EV in the flow-allocation waterfall'
);

assert.match(
  source,
  /id="heat-pump-icon" href="\$\{joinAsset\(cfg\.background_asset_base, 'heat_pump_icon_day\.png'\)\}"/,
  'the card template should render a heat pump sprite icon sourced from background_asset_base'
);

assert.match(
  source,
  /_setHeatPumpIcon\(joinAsset\(cfg\.background_asset_base, heatPumpIconFile\)\)/,
  'the heat pump icon should switch between day/rain/night variants based on scene period and weather'
);

// The dual-charging renders are 1376x768 with a wider camera (vs 1536x1024 for
// every other scene), so the heat pump needs a scene-specific origin and feed
// line there — otherwise the sprite lands mid-driveway and its line starts at
// the battery instead of the distribution box.
assert.match(
  source,
  /const HEAT_PUMP_SCENE_ORIGINS = Object\.freeze\(\{/,
  'heat pump should support per-scene origins'
);

for (const scene of [
  'scene_day_clear_dual_charging.png',
  'scene_day_rain_dual_charging.png',
  'scene_night_clear_dual_charging.png',
  'scene_night_rain_dual_charging.png'
]) {
  assert.match(
    source,
    new RegExp(`'${scene.replace(/\./g, '\.')}': HEAT_PUMP_DUAL_ORIGIN`),
    `${scene} should use the dual-charging heat pump origin`
  );
}

assert.match(
  source,
  /heatPumpNodeGroup\.setAttribute\('transform', hpTransform\)/,
  'the card should apply the scene-specific heat pump origin at render time'
);

{
  // Every scene whose camera differs from the default framing needs its own
  // line-heat-pump, or the feed line starts in the wrong place. Only the three
  // scenes that share the default camera (day_clear_idle, day_clear_charging,
  // night_clear_idle) fall through to DEFAULT_CONFIG.paths.
  const sceneBlocks = source.match(/'line-junction-home-load': '[^']*',\s*\n\s*'line-heat-pump': '[^']*'/g) || [];
  assert.equal(
    sceneBlocks.length,
    9,
    `expected 9 scene-specific heat pump lines (12 scenes minus the 3 sharing the default camera), found ${sceneBlocks.length}`
  );
}
