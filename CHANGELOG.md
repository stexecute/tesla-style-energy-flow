# Changelog

## 0.3.25 - 2026-03-28

- Added optional `roof_a_label` and `roof_b_label` so PV array names can be customized

## 0.3.19 - 2026-03-27

- Fixed EV scene selection so presence-aware backgrounds do not override the classic scene logic when no presence entities are configured
- Added EV label fallback from the configured entity friendly name when no custom `ev_label` / `ev2_label` is set

## 0.3.17 - 2026-03-26

- Added optional `ev_label` and `ev2_label` for custom vehicle names
- Added optional `ev_presence` and `ev2_presence` entities to show EV scenes based on vehicle presence, not only charging
- When only one EV is present/active, the card reuses the single-car scene and maps the visible label/data to that vehicle

## 0.3.16 - 2026-03-26

- Added optional `battery_invert` to flip the battery power sign without creating a template sensor
- Added optional `font_scale` to make labels and values easier to read on smaller cards or tablet layouts
- Added default section grid row hints to reduce overlap in Home Assistant sections layout

## 0.3.15 - 2026-03-25

- Added optional roof array overlays for two arrays with power, voltage and current values
- Added roof array entity fields to the editor and example config

## 0.3.14 - 2026-03-24

- Changed the default grid sign handling to follow the sensor sign directly (`grid_invert: false`)
- Improved grid export visibility by using the grid threshold for solar-to-grid export flow activation

## 0.3.13 - 2026-03-24

- Added a `power_unit_mode` option (`auto`, `w`, `kw`)
- Improved visibility of battery export towards grid on the shared grid/home branch

## 0.3.9 - 2026-03-24

- Improved editor stability by stopping full re-renders while editing normal fields
- Added `scene_component_map` editing directly in the UI for label, percentage and guide positions

## 0.3.8 - 2026-03-24

- The card title/header is now always rendered exactly as configured and is no longer auto-translated

## 0.3.7 - 2026-03-24

- Added a `show_header` option to hide the card title
- Added EV power threshold control in the editor
- Hide the battery node entirely when no battery entities are configured

## 0.3.6 - 2026-03-24

- Fixed dual-EV charging scene flow paths to match the packaged dual background assets
- Fixed dual-EV charging label and value positions for day/night and clear/rain variants

## 0.3.5 - 2026-03-24

- Added packaged dual-EV charging background assets
- Dynamic background selection now automatically uses dual-EV charging scenes when EV2 is configured and charging

## 0.3.4 - 2026-03-24

- Improved the Lovelace entity picker UX with searchable inputs backed by suggestions
- Entity selection fields now commit on change instead of re-rendering on every keystroke, preventing the picker from closing while you are selecting an entity

## 0.3.3 - 2026-03-24

- Fixed automatic dynamic background resolution when `background_map` keys are left empty in the config editor
- Empty background overrides no longer replace the built-in default scene mappings

## 0.3.2 - 2026-03-23

- Improved text readability on top of bright and dark backgrounds with a subtle dark glow
- Hide node guide lines when the corresponding node is inactive, so idle solar/grid/EV labels do not leave detached guide markers

## 0.3.1 - 2026-03-23

- Show values below 1 kW in watts instead of rounding them down to `0.0 kW`
- Animate the existing grid-home branch in reverse when battery discharge is exported to the grid

## 0.3.0 - 2026-03-23

- Added optional dual-EV support with separate `ev2_power`, `ev2_battery`, and `ev2_charge_switch` entities
- Kept the single-EV behavior unchanged when EV2 is not configured
- Added a second EV flow branch and node rendering logic
- Added support for `scene_path_map` and `scene_component_map` overrides for custom dual-EV backgrounds
- Extended the Lovelace editor with EV2 entity selectors
- Updated README usage and feature documentation for 2 EV setups

## 0.2.1 - 2026-03-21

- HACS packaging refresh release
- Verified root package structure with bundled `backgrounds/` assets
- Renamed package/public card identity to `Tesla Style Energy Flow`

## 0.2.0 - 2026-03-21

- Synced package code with the latest Home Assistant production version
- Updated scene component coordinates for all major day/night and rain charging/idle backgrounds
- Improved battery percentage positioning and readability across scenes
- Kept battery percentage visible when battery flow is idle
- Simplified status copy to focus on battery charging/discharging state
- Removed unused node dots from the flow scene for a cleaner presentation

## 0.1.2 - 2026-02-14

- Moved battery text block slightly lower (label, power, status)
- Reduced status label font size for all entities
- Added `ev_hide_when_idle` option in editor/config to hide EV node details when EV is not charging
- Improved EV charging detection: when EV power sensor is present, charging is based on EV power > 0

## 0.1.1 - 2026-02-14

- Renamed day clear backgrounds for clarity:
  - `scene_day_clear_charging.png`
  - `scene_day_clear_idle.png`
- Updated default background mapping to use the renamed files
- Aligned day/night fallback mappings to coherent day/night scenes

## 0.1.0 - 2026-02-14

- Initial public package
- Dynamic energy flow logic (solar, grid, battery, home, EV)
- Multilanguage support (`auto`, `it`, `en`, `es`, `fr`, `de`)
- Dynamic background mapping
- Configurable thresholds for solar/grid/battery
- EV charging flow without threshold
