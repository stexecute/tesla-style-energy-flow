# Tesla Style Energy Flow

Custom Home Assistant Lovelace card for energy flows on a house scene, with dynamic weather/day-night backgrounds and EV-aware layout switching.

![Tesla Style Energy Flow preview](docs/screenshots/05-night-rain-grid-home-ev.png)

[Watch demo video](docs/media/tesla-style-energy-flow-demo.mp4)

## Features

- Smooth animated SVG flow lines
- Flow colors by source:
  - solar = yellow
  - battery = green
  - grid = red
- Dynamic background (weather + day/night + EV charging)
- Scene-specific label/guide positioning for each background
- Config editor with entity dropdowns
- Multilanguage UI (`auto`, `it`, `en`, `es`, `fr`, `de`)
- Configurable thresholds for flow visibility:
  - `thresholds.solar_min_w`
  - `thresholds.grid_min_w`
  - `thresholds.battery_min_w`
- EV flow without threshold (shows immediately when charging)
- Optional `ev_hide_when_idle` to hide EV labels/guide when not charging
- Battery percentage remains readable even when battery power is idle
- Simplified node status text with battery-focused charging/discharging state

## Installation

### HACS (Custom Repository)

1. HACS -> Frontend -> Custom repositories
2. Add this GitHub repo URL
3. Category: `Dashboard`
4. Install `Tesla Style Energy Flow`
5. Refresh browser cache

### Manual

1. Copy package files to:
   - `dist/tesla-style-energy-flow.js` -> `/config/www/community/tesla-style-energy-flow/tesla-style-energy-flow.js`
   - `dist/backgrounds/*` -> `/config/www/community/tesla-style-energy-flow/backgrounds/*`
2. Add Lovelace resource:

```yaml
lovelace:
  resources:
    - url: /local/community/tesla-style-energy-flow/tesla-style-energy-flow.js
      type: module
```

3. Reload frontend (or restart Home Assistant)

## Usage

```yaml
type: custom:tesla-style-energy-flow
title: Tesla Style Energy Flow
language: auto
background: /local/community/tesla-style-energy-flow/backgrounds/scene_day_clear_idle.png
dynamic_background: true
background_asset_base: /local/community/tesla-style-energy-flow/backgrounds
grid_invert: true
ev_hide_when_idle: false
thresholds:
  solar_min_w: 50
  grid_min_w: 50
  battery_min_w: 50
entities:
  solar_power: sensor.solar_power
  grid_power: sensor.grid_power
  battery_power: sensor.battery_power
  load_power: sensor.home_load_power
  battery_level: sensor.battery_level
  ev_power: sensor.ev_charging_power
  ev_battery: sensor.ev_battery_level
  ev_charge_switch: switch.ev_charge
  weather: weather.home
  sun: sun.sun
```

The card ships with built-in SVG flow paths and scene presets, so no extra `paths:` block is required for a normal install.

## Screenshots

Day clear (idle)

![Day clear idle](docs/screenshots/01-day-clear-idle.png)

Day rain (EV charging)

![Day rain charging](docs/screenshots/02-day-rain-charging.png)

Night clear (EV charging)

![Night clear charging](docs/screenshots/03-night-clear-charging.png)

Night rain (idle)

![Night rain idle](docs/screenshots/04-night-rain-idle.png)

Night rain (grid + home + EV)

![Night rain grid home ev](docs/screenshots/05-night-rain-grid-home-ev.png)

## Files

- `tesla-style-energy-flow.js`: custom card source
- `dist/tesla-style-energy-flow.js`: packaged card file used by HACS
- `dist/backgrounds/`: packaged background assets used by HACS
- `hacs.json`: HACS metadata
- `examples/lovelace-card.yaml`: config example
- `docs/screenshots/`: preview images for README

## Notes

- This repository is ready for manual installation or HACS custom repository usage.
- If you publish it on GitHub, keep the repository root as-is so `hacs.json` and `tesla-style-energy-flow.js` stay in the expected locations.

## License

MIT
