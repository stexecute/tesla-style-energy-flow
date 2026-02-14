# Energy Flow Pro Card

Custom Home Assistant Lovelace card for energy flows on a house scene.

## Features

- Smooth animated SVG flow lines
- Flow colors by source:
  - solar = yellow
  - battery = green
  - grid = red
- Dynamic background (weather + day/night + EV charging)
- Config editor with entity dropdowns
- Multilanguage UI (`auto`, `it`, `en`, `es`, `fr`, `de`)
- Configurable thresholds for flow visibility:
  - `thresholds.solar_min_w`
  - `thresholds.grid_min_w`
  - `thresholds.battery_min_w`
- EV flow without threshold (shows immediately when charging)
- Optional `ev_hide_when_idle` to hide EV labels/guide when not charging

## Installation

### HACS (Custom Repository)

1. HACS -> Frontend -> Custom repositories
2. Add this GitHub repo URL
3. Category: `Dashboard`
4. Install `Energy Flow Pro Card`
5. Refresh browser cache

### Manual

1. Copy package files to:
   - `/config/www/community/energy-flow-pro-card/energy-flow-pro-card.js`
   - `/config/www/community/energy-flow-pro-card/backgrounds/*`
2. Add Lovelace resource:

```yaml
lovelace:
  resources:
    - url: /local/community/energy-flow-pro-card/energy-flow-pro-card.js
      type: module
```

3. Reload frontend (or restart Home Assistant)

## Usage

```yaml
type: custom:energy-flow-pro-card
title: Energy Flow
language: auto
background: /local/community/energy-flow-pro-card/backgrounds/scene_day_clear_idle.png
dynamic_background: true
background_asset_base: /local/community/energy-flow-pro-card/backgrounds
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

`paths` non e incluso nell'esempio: la card usa i path di default e puoi cambiarli solo se necessario.

## Screenshots

Day clear (idle)

![Day clear idle](docs/screenshots/01-day-clear-idle.png)

Day rain (EV charging)

![Day rain charging](docs/screenshots/02-day-rain-charging.png)

Night clear (EV charging)

![Night clear charging](docs/screenshots/03-night-clear-charging.png)

Night rain (idle)

![Night rain idle](docs/screenshots/04-night-rain-idle.png)

## Files

- `energy-flow-pro-card.js`: custom card source
- `backgrounds/`: built-in background assets used by default (`scene_day_clear_charging.png`, `scene_day_clear_idle.png`, `scene_day_rain_*`, `scene_night_*`)
- `hacs.json`: HACS metadata
- `examples/lovelace-card.yaml`: config example
- `docs/screenshots/`: preview images for README

## License

MIT
