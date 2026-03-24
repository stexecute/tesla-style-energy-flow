# Changelog

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
