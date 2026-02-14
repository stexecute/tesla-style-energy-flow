# Changelog

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
