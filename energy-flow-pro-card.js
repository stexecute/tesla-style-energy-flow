/* Energy Flow Pro Card
 * Public Home Assistant custom card with configurable sensors, background, and flow paths.
 */
(function () {
  const CARD_TYPE = 'energy-flow-pro-card';
  const FLOW_MIN_W = 50;
  const SUPPORTED_LANGS = ['it', 'en', 'es', 'fr', 'de'];
  const DEFAULT_LANG = 'it';
  const LANGUAGE_OPTIONS = Object.freeze([
    { value: 'auto', labelKey: 'editor.lang_auto' },
    { value: 'it', labelKey: 'editor.lang_it' },
    { value: 'en', labelKey: 'editor.lang_en' },
    { value: 'es', labelKey: 'editor.lang_es' },
    { value: 'fr', labelKey: 'editor.lang_fr' },
    { value: 'de', labelKey: 'editor.lang_de' }
  ]);
  const I18N = Object.freeze({
    it: {
      card: {
        default_title: 'Flusso Energia',
        node: {
          solar: 'Solare',
          grid: 'Rete',
          home: 'Casa',
          battery: 'Batteria',
          ev: 'EV'
        },
        status: {
          inactive: 'INATTIVO',
          connected: 'CONNESSA',
          consuming: 'IN CONSUMO',
          waiting: 'IN ATTESA',
          off: 'OFF',
          producing: 'IN PRODUZIONE',
          charging: 'IN CARICA',
          discharging: 'IN SCARICA'
        }
      },
      editor: {
        section_general: 'Generale',
        field_title: 'Titolo',
        field_language: 'Lingua',
        field_background: 'Background URL',
        field_background_base: 'Background Assets Base (auto)',
        field_grid_invert: 'Inverti segno rete',
        field_show_labels: 'Mostra etichette',
        field_hide_ev_idle: 'Nascondi EV se non in carica',
        field_scene_scale: 'Scene Scale',
        field_solar_threshold: 'Soglia Solar (W)',
        field_grid_threshold: 'Soglia Grid (W)',
        field_battery_threshold: 'Soglia Battery (W)',
        section_sensors: 'Sensori',
        sensor_solar: 'Solar Power',
        sensor_grid: 'Grid Power',
        sensor_battery: 'Battery Power',
        sensor_load: 'Load Power',
        sensor_battery_level: 'Battery Level %',
        sensor_ev_power: 'EV Power',
        sensor_ev_battery: 'EV Battery %',
        sensor_ev_switch: 'EV Charge Switch',
        sensor_weather: 'Weather Entity',
        sensor_sun: 'Sun Entity',
        hint_entities: 'Menu pulito con entita filtrate per dominio.',
        section_dynamic_bg: 'Background Dinamico',
        field_dynamic_bg: 'Abilita dinamico',
        hint_bg_lookup: 'Priorita lookup: period+meteo+charging -> period+meteo -> period_default -> default -> background.',
        placeholder_select: '-- seleziona --',
        placeholder_sensor: '-- seleziona sensore --',
        placeholder_switch: '-- seleziona switch --',
        placeholder_weather: '-- seleziona weather --',
        placeholder_sun: '-- seleziona sun --',
        lang_auto: 'Automatico (Home Assistant)',
        lang_it: 'Italiano',
        lang_en: 'Inglese',
        lang_es: 'Spagnolo',
        lang_fr: 'Francese',
        lang_de: 'Tedesco'
      }
    },
    en: {
      card: {
        default_title: 'Energy Flow',
        node: {
          solar: 'Solar',
          grid: 'Grid',
          home: 'Home',
          battery: 'Battery',
          ev: 'EV'
        },
        status: {
          inactive: 'IDLE',
          connected: 'CONNECTED',
          consuming: 'CONSUMING',
          waiting: 'STANDBY',
          off: 'OFF',
          producing: 'PRODUCING',
          charging: 'CHARGING',
          discharging: 'DISCHARGING'
        }
      },
      editor: {
        section_general: 'General',
        field_title: 'Title',
        field_language: 'Language',
        field_background: 'Background URL',
        field_background_base: 'Background Assets Base (auto)',
        field_grid_invert: 'Invert grid sign',
        field_show_labels: 'Show labels',
        field_hide_ev_idle: 'Hide EV when idle',
        field_scene_scale: 'Scene Scale',
        field_solar_threshold: 'Solar threshold (W)',
        field_grid_threshold: 'Grid threshold (W)',
        field_battery_threshold: 'Battery threshold (W)',
        section_sensors: 'Sensors',
        sensor_solar: 'Solar Power',
        sensor_grid: 'Grid Power',
        sensor_battery: 'Battery Power',
        sensor_load: 'Load Power',
        sensor_battery_level: 'Battery Level %',
        sensor_ev_power: 'EV Power',
        sensor_ev_battery: 'EV Battery %',
        sensor_ev_switch: 'EV Charge Switch',
        sensor_weather: 'Weather Entity',
        sensor_sun: 'Sun Entity',
        hint_entities: 'Clean menu with domain-filtered entities.',
        section_dynamic_bg: 'Dynamic Background',
        field_dynamic_bg: 'Enable dynamic',
        hint_bg_lookup: 'Lookup priority: period+weather+charging -> period+weather -> period_default -> default -> background.',
        placeholder_select: '-- select --',
        placeholder_sensor: '-- select sensor --',
        placeholder_switch: '-- select switch --',
        placeholder_weather: '-- select weather --',
        placeholder_sun: '-- select sun --',
        lang_auto: 'Automatic (Home Assistant)',
        lang_it: 'Italian',
        lang_en: 'English',
        lang_es: 'Spanish',
        lang_fr: 'French',
        lang_de: 'German'
      }
    },
    es: {
      card: {
        default_title: 'Flujo de Energia',
        node: {
          solar: 'Solar',
          grid: 'Red',
          home: 'Casa',
          battery: 'Bateria',
          ev: 'EV'
        },
        status: {
          inactive: 'INACTIVO',
          connected: 'CONECTADA',
          consuming: 'CONSUMIENDO',
          waiting: 'EN ESPERA',
          off: 'OFF',
          producing: 'PRODUCIENDO',
          charging: 'CARGANDO',
          discharging: 'DESCARGANDO'
        }
      },
      editor: {
        section_general: 'General',
        field_title: 'Titulo',
        field_language: 'Idioma',
        field_background: 'URL de fondo',
        field_background_base: 'Base de assets de fondo (auto)',
        field_grid_invert: 'Invertir signo de red',
        field_show_labels: 'Mostrar etiquetas',
        field_hide_ev_idle: 'Ocultar EV si no carga',
        field_scene_scale: 'Escala de escena',
        field_solar_threshold: 'Umbral Solar (W)',
        field_grid_threshold: 'Umbral Red (W)',
        field_battery_threshold: 'Umbral Bateria (W)',
        section_sensors: 'Sensores',
        sensor_solar: 'Potencia Solar',
        sensor_grid: 'Potencia Red',
        sensor_battery: 'Potencia Bateria',
        sensor_load: 'Potencia Casa',
        sensor_battery_level: 'Nivel Bateria %',
        sensor_ev_power: 'Potencia EV',
        sensor_ev_battery: 'Bateria EV %',
        sensor_ev_switch: 'Switch carga EV',
        sensor_weather: 'Entidad clima',
        sensor_sun: 'Entidad sol',
        hint_entities: 'Menu limpio con entidades filtradas por dominio.',
        section_dynamic_bg: 'Fondo Dinamico',
        field_dynamic_bg: 'Activar dinamico',
        hint_bg_lookup: 'Prioridad: periodo+clima+cargando -> periodo+clima -> period_default -> default -> background.',
        placeholder_select: '-- seleccionar --',
        placeholder_sensor: '-- seleccionar sensor --',
        placeholder_switch: '-- seleccionar switch --',
        placeholder_weather: '-- seleccionar weather --',
        placeholder_sun: '-- seleccionar sun --',
        lang_auto: 'Automatico (Home Assistant)',
        lang_it: 'Italiano',
        lang_en: 'Ingles',
        lang_es: 'Espanol',
        lang_fr: 'Frances',
        lang_de: 'Aleman'
      }
    },
    fr: {
      card: {
        default_title: 'Flux Energie',
        node: {
          solar: 'Solaire',
          grid: 'Reseau',
          home: 'Maison',
          battery: 'Batterie',
          ev: 'EV'
        },
        status: {
          inactive: 'INACTIF',
          connected: 'CONNECTE',
          consuming: 'CONSOMMATION',
          waiting: 'EN ATTENTE',
          off: 'OFF',
          producing: 'PRODUCTION',
          charging: 'CHARGE',
          discharging: 'DECHARGE'
        }
      },
      editor: {
        section_general: 'General',
        field_title: 'Titre',
        field_language: 'Langue',
        field_background: 'URL du fond',
        field_background_base: 'Base assets fond (auto)',
        field_grid_invert: 'Inverser signe reseau',
        field_show_labels: 'Afficher etiquettes',
        field_hide_ev_idle: 'Masquer EV si inactif',
        field_scene_scale: 'Echelle scene',
        field_solar_threshold: 'Seuil Solaire (W)',
        field_grid_threshold: 'Seuil Reseau (W)',
        field_battery_threshold: 'Seuil Batterie (W)',
        section_sensors: 'Capteurs',
        sensor_solar: 'Puissance Solaire',
        sensor_grid: 'Puissance Reseau',
        sensor_battery: 'Puissance Batterie',
        sensor_load: 'Puissance Maison',
        sensor_battery_level: 'Niveau Batterie %',
        sensor_ev_power: 'Puissance EV',
        sensor_ev_battery: 'Batterie EV %',
        sensor_ev_switch: 'Switch charge EV',
        sensor_weather: 'Entite meteo',
        sensor_sun: 'Entite soleil',
        hint_entities: 'Menu propre avec entites filtrees par domaine.',
        section_dynamic_bg: 'Fond Dynamique',
        field_dynamic_bg: 'Activer dynamique',
        hint_bg_lookup: 'Priorite: periode+meteo+charge -> periode+meteo -> period_default -> default -> background.',
        placeholder_select: '-- selectionner --',
        placeholder_sensor: '-- selectionner capteur --',
        placeholder_switch: '-- selectionner switch --',
        placeholder_weather: '-- selectionner weather --',
        placeholder_sun: '-- selectionner sun --',
        lang_auto: 'Automatique (Home Assistant)',
        lang_it: 'Italien',
        lang_en: 'Anglais',
        lang_es: 'Espagnol',
        lang_fr: 'Francais',
        lang_de: 'Allemand'
      }
    },
    de: {
      card: {
        default_title: 'Energiefluss',
        node: {
          solar: 'Solar',
          grid: 'Netz',
          home: 'Haus',
          battery: 'Batterie',
          ev: 'EV'
        },
        status: {
          inactive: 'INAKTIV',
          connected: 'VERBUNDEN',
          consuming: 'VERBRAUCH',
          waiting: 'BEREIT',
          off: 'OFF',
          producing: 'ERZEUGUNG',
          charging: 'LADUNG',
          discharging: 'ENTLADUNG'
        }
      },
      editor: {
        section_general: 'Allgemein',
        field_title: 'Titel',
        field_language: 'Sprache',
        field_background: 'Hintergrund URL',
        field_background_base: 'Hintergrund Asset-Basis (auto)',
        field_grid_invert: 'Netz-Vorzeichen invertieren',
        field_show_labels: 'Labels anzeigen',
        field_hide_ev_idle: 'EV ausblenden wenn nicht laedt',
        field_scene_scale: 'Szenen-Skalierung',
        field_solar_threshold: 'Solar-Schwelle (W)',
        field_grid_threshold: 'Netz-Schwelle (W)',
        field_battery_threshold: 'Batterie-Schwelle (W)',
        section_sensors: 'Sensoren',
        sensor_solar: 'Solarleistung',
        sensor_grid: 'Netzleistung',
        sensor_battery: 'Batterieleistung',
        sensor_load: 'Hausverbrauch',
        sensor_battery_level: 'Batteriestand %',
        sensor_ev_power: 'EV Leistung',
        sensor_ev_battery: 'EV Batterie %',
        sensor_ev_switch: 'EV Lade-Switch',
        sensor_weather: 'Wetter-Entitat',
        sensor_sun: 'Sonnen-Entitat',
        hint_entities: 'Sauberes Menu mit nach Domain gefilterten Entitaten.',
        section_dynamic_bg: 'Dynamischer Hintergrund',
        field_dynamic_bg: 'Dynamik aktivieren',
        hint_bg_lookup: 'Prioritat: periode+wetter+laden -> periode+wetter -> period_default -> default -> background.',
        placeholder_select: '-- auswaehlen --',
        placeholder_sensor: '-- sensor auswaehlen --',
        placeholder_switch: '-- switch auswaehlen --',
        placeholder_weather: '-- weather auswaehlen --',
        placeholder_sun: '-- sun auswaehlen --',
        lang_auto: 'Automatisch (Home Assistant)',
        lang_it: 'Italienisch',
        lang_en: 'Englisch',
        lang_es: 'Spanisch',
        lang_fr: 'Franzosisch',
        lang_de: 'Deutsch'
      }
    }
  });

  const DEFAULT_CONFIG = Object.freeze({
    type: `custom:${CARD_TYPE}`,
    title: 'Energy Flow',
    language: 'auto',
    background: '/local/community/energy-flow-pro-card/backgrounds/scene_day_clear_idle.png',
    dynamic_background: true,
    background_asset_base: '/local/community/energy-flow-pro-card/backgrounds',
    show_labels: true,
    ev_hide_when_idle: false,
    scene_scale: 1.06,
    grid_invert: true,
    thresholds: {
      solar_min_w: 50,
      grid_min_w: 50,
      battery_min_w: 50
    },
    entities: {
      solar_power: '',
      grid_power: '',
      battery_power: '',
      load_power: '',
      battery_level: '',
      ev_power: '',
      ev_battery: '',
      ev_charge_switch: '',
      weather: '',
      sun: 'sun.sun'
    },
    background_map: {
      default: '',
      day_default: '',
      night_default: '',
      day_clear: '',
      day_cloudy: '',
      day_rain: '',
      day_snow: '',
      day_storm: '',
      night_clear: '',
      night_cloudy: '',
      night_rain: '',
      night_snow: '',
      night_storm: '',
      day_clear_idle: '',
      day_clear_charging: '',
      night_clear_idle: '',
      night_clear_charging: ''
    },
    paths: {
      line_solar_load: 'M 351 292 L 352 338 L 352 338',
      line_grid_load: 'M 434 402 Q 434 402 351 375 Q 352 340 351 341',
      line_battery_load: 'M 310 348 Q 353 339 352 338',
      line_junction_home_load: 'M 354 338 Q 386 330 408 324',
      line_wallbox_ev: 'M 164 322 Q 160 368 182 344',
      line_solar_grid: 'M 344 288 L 344 336 L 448 336',
      line_solar_battery: 'M 344 288 L 344 330 L 314 330',
      line_grid_battery: 'M 448 336 L 314 330'
    }
  });

  function deepMerge(base, extra) {
    const out = { ...base };
    Object.keys(extra || {}).forEach((k) => {
      const bv = out[k];
      const ev = extra[k];
      if (bv && ev && typeof bv === 'object' && typeof ev === 'object' && !Array.isArray(bv) && !Array.isArray(ev)) {
        out[k] = deepMerge(bv, ev);
      } else {
        out[k] = ev;
      }
    });
    return out;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function safeNum(value, fallback = 0) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function toWatt(entityState) {
    if (!entityState) return 0;
    const raw = safeNum(entityState.state, 0);
    const unit = String(
      entityState.attributes?.unit_of_measurement ||
      entityState.attributes?.unit ||
      'W'
    ).trim().toLowerCase();
    if (unit === 'kw') return raw * 1000;
    if (unit === 'mw') return raw * 1000000;
    return raw;
  }

  function toPct(entityState, fallback = 0) {
    if (!entityState) return fallback;
    return clamp(safeNum(entityState.state, fallback), 0, 100);
  }

  function joinAsset(base, file) {
    const b = String(base || '').trim().replace(/\/+$/, '');
    const f = String(file || '').trim();
    if (!f) return '';
    if (f.startsWith('/') || /^https?:\/\//i.test(f)) return f;
    return b ? `${b}/${f.replace(/^\/+/, '')}` : f;
  }

  function normalizeLanguageCode(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/_/g, '-')
      .split('-')[0];
  }

  function resolveLanguage(preferred, hass) {
    const pref = normalizeLanguageCode(preferred);
    if (pref && pref !== 'auto' && SUPPORTED_LANGS.includes(pref)) return pref;

    const candidates = [
      hass?.locale?.language,
      hass?.language,
      typeof document !== 'undefined' ? document.documentElement?.lang : '',
      typeof navigator !== 'undefined' ? navigator.language : ''
    ];

    for (const candidate of candidates) {
      const code = normalizeLanguageCode(candidate);
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
    return DEFAULT_LANG;
  }

  function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = String(path).split('.');
    let cur = obj;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur == null) break;
    }
    return cur;
  }

  function tLang(lang, key, fallback = '') {
    const normalized = normalizeLanguageCode(lang);
    const source = I18N[normalized] || I18N[DEFAULT_LANG];
    const value = getByPath(source, key);
    if (typeof value === 'string' && value.length) return value;

    const defaultValue = getByPath(I18N[DEFAULT_LANG], key);
    if (typeof defaultValue === 'string' && defaultValue.length) return defaultValue;
    return fallback || key;
  }

  class EnergyFlowProCard extends HTMLElement {
    static getConfigElement() {
      return document.createElement('energy-flow-pro-card-editor');
    }

    static getStubConfig() {
      return deepMerge(DEFAULT_CONFIG, {
        entities: {
          solar_power: 'sensor.fotovoltaico_potenza',
          grid_power: 'sensor.solaredge_i1_m1_ac_power',
          battery_power: 'sensor.solaredge_i1_b1_dc_power',
          load_power: 'sensor.consumo_casa_2',
          battery_level: 'sensor.solaredge_i1_b1_state_of_energy',
          ev_power: 'sensor.wallbox_portal_charging_power',
          ev_battery: 'sensor.battery',
          ev_charge_switch: 'switch.lancia_y_charge',
          weather: 'weather.home',
          sun: 'sun.sun'
        }
      });
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = deepMerge(DEFAULT_CONFIG, {});
      this._hass = null;
      this._initialized = false;
      this._renderLang = DEFAULT_LANG;
    }

    setConfig(config) {
      this._config = deepMerge(DEFAULT_CONFIG, config || {});
      this._initialized = false;
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._render();
    }

    getCardSize() {
      return 7;
    }

    _entityState(entityId) {
      if (!entityId || !this._hass) return null;
      return this._hass.states[entityId] || null;
    }

    _resolvedLang() {
      return resolveLanguage(this._config.language, this._hass);
    }

    _t(key, fallback = '') {
      return tLang(this._resolvedLang(), key, fallback);
    }

    _formatKW(watt) {
      return `${(Math.abs(watt) / 1000).toFixed(1)} kW`;
    }

    _setText(id, value) {
      const el = this.shadowRoot.querySelector(id);
      if (el) el.textContent = value;
    }

    _toggleNode(id, active) {
      const el = this.shadowRoot.querySelector(id);
      if (el) el.classList.toggle('active', !!active);
    }

    _activatePath(id, cls, watt, minW = FLOW_MIN_W) {
      if (watt < minW) return;
      const el = this.shadowRoot.querySelector(`#${id}`);
      if (!el) return;
      el.classList.add('active', cls);
    }

    _dominantFlowClass(solarW, batteryW, gridW, fallback) {
      if (gridW >= solarW && gridW >= batteryW) return 'flow-broken';
      if (batteryW >= solarW && batteryW >= gridW) return 'flow-green';
      if (solarW >= batteryW && solarW >= gridW) return 'flow-solar';
      return fallback || 'flow-solar';
    }

    _flowThreshold(key, fallback = FLOW_MIN_W) {
      const value = safeNum(this._config.thresholds?.[key], fallback);
      return Math.max(0, value);
    }

    _isEvCharging(evPower) {
      const evPowerEntity = this._entityState(this._config.entities.ev_power);
      if (evPowerEntity) return evPower > 0;
      const chargeSwitchState = this._entityState(this._config.entities.ev_charge_switch);
      return chargeSwitchState?.state === 'on';
    }

    _weatherGroup(weatherState) {
      const s = String(weatherState || '').toLowerCase();
      if (s === 'lightning') return 'storm';
      if (s === 'rainy' || s === 'pouring' || s === 'lightning-rainy') return 'rain';
      if (s === 'snowy' || s === 'snowy-rainy' || s === 'hail') return 'snow';
      if (s === 'cloudy' || s === 'partlycloudy' || s === 'fog' || s === 'windy' || s === 'windy-variant') return 'cloudy';
      return 'clear';
    }

    _scenePeriod(weatherState) {
      const ws = String(weatherState || '').toLowerCase();
      if (ws === 'clear-night') return 'night';

      const sunEntity = this._entityState(this._config.entities.sun || 'sun.sun');
      const sunState = String(sunEntity?.state || '').toLowerCase();
      if (sunState === 'above_horizon') return 'day';
      if (sunState === 'below_horizon') return 'night';

      const hour = new Date().getHours();
      return hour >= 7 && hour < 19 ? 'day' : 'night';
    }

    _defaultBackgroundMap() {
      const base = this._config.background_asset_base || '/local/community/energy-flow-pro-card/backgrounds';
      const m = {
        day_clear_charging: 'scene_day_clear_charging.png',
        day_clear_idle: 'scene_day_clear_idle.png',
        day_cloudy_charging: 'scene_day_clear_charging.png',
        day_cloudy_idle: 'scene_day_clear_idle.png',
        day_rain_charging: 'scene_day_rain_charging.png',
        day_rain_idle: 'scene_day_rain_idle.png',
        day_snow_charging: 'scene_day_clear_charging.png',
        day_snow_idle: 'scene_day_clear_idle.png',
        day_storm_charging: 'scene_day_clear_charging.png',
        day_storm_idle: 'scene_day_clear_idle.png',
        night_clear_charging: 'scene_night_clear_charging.png',
        night_clear_idle: 'scene_night_clear_idle.png',
        night_cloudy_charging: 'scene_night_clear_charging.png',
        night_cloudy_idle: 'scene_night_clear_idle.png',
        night_rain_charging: 'scene_night_rain_charging.png',
        night_rain_idle: 'scene_night_rain_idle.png',
        night_snow_charging: 'scene_night_clear_charging.png',
        night_snow_idle: 'scene_night_clear_idle.png',
        night_storm_charging: 'scene_night_clear_charging.png',
        night_storm_idle: 'scene_night_clear_idle.png',
        day_default: 'scene_day_clear_idle.png',
        night_default: 'scene_night_clear_idle.png',
        default: 'scene_day_clear_idle.png'
      };
      const out = {};
      Object.entries(m).forEach(([k, v]) => {
        out[k] = joinAsset(base, v);
      });
      // Alias senza charging state
      out.day_clear = out.day_clear_idle;
      out.day_cloudy = out.day_cloudy_idle;
      out.day_rain = out.day_rain_idle;
      out.day_snow = out.day_snow_idle;
      out.day_storm = out.day_storm_idle;
      out.night_clear = out.night_clear_idle;
      out.night_cloudy = out.night_cloudy_idle;
      out.night_rain = out.night_rain_idle;
      out.night_snow = out.night_snow_idle;
      out.night_storm = out.night_storm_idle;
      return out;
    }

    _resolveBackground(evCharging) {
      const cfg = this._config;
      if (!cfg.dynamic_background) return cfg.background;

      const weatherState = this._entityState(cfg.entities.weather)?.state || '';
      const period = this._scenePeriod(weatherState);
      const weatherGroup = this._weatherGroup(weatherState);
      const chargeState = evCharging ? 'charging' : 'idle';
      const map = {
        ...this._defaultBackgroundMap(),
        ...(cfg.background_map || {})
      };

      const candidates = [
        `${period}_${weatherGroup}_${chargeState}`,
        `${period}_${weatherGroup}`,
        `${period}_default`,
        'default'
      ];
      for (const key of candidates) {
        const url = String(map[key] || '').trim();
        if (url) return url;
      }
      return cfg.background;
    }

    _setBackground(url) {
      const img = this.shadowRoot.querySelector('#flow-scene-image');
      if (!img || !url) return;
      if (img.getAttribute('href') !== url) {
        img.setAttribute('href', url);
      }
    }

    _renderStatic() {
      const cfg = this._config;
      const p = cfg.paths;
      const showLabelsClass = cfg.show_labels ? '' : 'hide-labels';
      const titleText = cfg.title === DEFAULT_CONFIG.title
        ? this._t('card.default_title', DEFAULT_CONFIG.title)
        : cfg.title;
      const titleHtml = titleText ? `<div class="card-title">${titleText}</div>` : '';
      const sceneScale = clamp(safeNum(cfg.scene_scale, 1.06), 0.6, 1.4);

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          ha-card {
            overflow: hidden;
          }
          .wrap {
            padding: 0;
          }
          .card-title {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.04em;
            padding: 14px 14px 8px;
            color: var(--primary-text-color);
          }
          .scene {
            padding: 10px;
          }
          svg {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            background: #020617;
          }
          .flow-scene-dim {
            fill: #020617;
            opacity: 0.18;
          }
          .flow-node-bg {
            fill: rgba(255,255,255,0.08);
            transition: fill 0.2s ease, filter 0.2s ease;
          }
          .flow-node-bg.active {
            fill: rgba(255,255,255,0.72);
            filter: drop-shadow(0 0 6px rgba(255,255,255,0.35));
          }
          .flow-node-guide {
            stroke: rgba(255, 255, 255, 0.78);
            stroke-width: 1.15;
            stroke-linecap: round;
            opacity: 0.95;
          }
          .flow-label,
          .flow-power,
          .flow-status {
            fill: #f8fafc;
            text-shadow: 0 1px 2px rgba(2, 6, 23, 0.55);
            text-anchor: middle;
            font-family: sans-serif;
          }
          .flow-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .flow-power {
            font-size: 12px;
            font-weight: 700;
          }
          .flow-status {
            font-size: 8.5px;
            font-weight: 600;
            opacity: 0.9;
          }
          .ev-hidden {
            display: none;
          }
          .flow-line {
            fill: none;
            stroke: rgba(255,255,255,0.2);
            stroke-width: 1.8;
            opacity: 0;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: opacity 0.18s ease, stroke-width 0.18s ease;
          }
          .flow-line.active {
            opacity: 1;
            stroke-dasharray: 56 88;
            animation: flowStream 2.05s linear infinite, flowPulse 1.5s ease-in-out infinite;
            filter: drop-shadow(0 0 2px var(--flow-glow, rgba(255,255,255,0.25)))
                    drop-shadow(0 0 7px var(--flow-glow, rgba(255,255,255,0.25)));
          }
          .flow-line.active.flow-solar {
            stroke: #facc15;
            --flow-glow: rgba(250, 204, 21, 0.56);
          }
          .flow-line.active.flow-green {
            stroke: #22c55e;
            --flow-glow: rgba(34, 197, 94, 0.5);
          }
          .flow-line.active.flow-broken {
            stroke: #ef4444;
            --flow-glow: rgba(239, 68, 68, 0.5);
          }
          .hide-labels .flow-label,
          .hide-labels .flow-power,
          .hide-labels .flow-status {
            display: none;
          }
          @keyframes flowStream {
            to { stroke-dashoffset: -144; }
          }
          @keyframes flowPulse {
            0%, 100% { opacity: 0.84; stroke-width: 1.9; }
            45% { opacity: 1; stroke-width: 2.2; }
          }
        </style>
        <ha-card>
          <div class="wrap ${showLabelsClass}">
            ${titleHtml}
            <div class="scene">
              <svg viewBox="0 0 600 460" style="transform: scale(${sceneScale}); transform-origin: center;">
                <image id="flow-scene-image" href="${cfg.background}" x="0" y="0" width="600" height="460" preserveAspectRatio="xMidYMid slice"></image>
                <rect class="flow-scene-dim" x="0" y="0" width="600" height="460"></rect>

                <path id="line-solar-load" class="flow-line" d="${p.line_solar_load}"></path>
                <path id="line-grid-load" class="flow-line" d="${p.line_grid_load}"></path>
                <path id="line-battery-load" class="flow-line" d="${p.line_battery_load}"></path>
                <path id="line-junction-home-load" class="flow-line" d="${p.line_junction_home_load}"></path>
                <path id="line-wallbox-ev" class="flow-line" d="${p.line_wallbox_ev}"></path>
                <path id="line-solar-grid" class="flow-line" d="${p.line_solar_grid}"></path>
                <path id="line-solar-battery" class="flow-line" d="${p.line_solar_battery}"></path>
                <path id="line-grid-battery" class="flow-line" d="${p.line_grid_battery}"></path>

                <g transform="translate(286, 155)">
                  <line class="flow-node-guide" x1="0" y1="-92" x2="0" y2="-12"></line>
                  <text class="flow-label" x="0" y="-96">${this._t('card.node.solar', 'Solare')}</text>
                  <text class="flow-power" id="flow-solar-power" x="0" y="-78">0.0 kW</text>
                  <text class="flow-status" id="flow-solar-status" x="0" y="-62">${this._t('card.status.inactive', 'INATTIVO')}</text>
                </g>

                <g transform="translate(448, 336)">
                  <line class="flow-node-guide" x1="0" y1="12" x2="0" y2="42"></line>
                  <text class="flow-label" x="6" y="67">${this._t('card.node.grid', 'Rete')}</text>
                  <text class="flow-power" id="flow-grid-power" x="6" y="85">0.0 kW</text>
                  <text class="flow-status" id="flow-grid-status" x="6" y="100">${this._t('card.status.connected', 'CONNESSA')}</text>
                </g>

                <g transform="translate(465, 247)">
                  <line class="flow-node-guide" x1="0" y1="-84" x2="0" y2="-12"></line>
                  <text class="flow-label" x="0" y="-96">${this._t('card.node.home', 'Casa')}</text>
                  <text class="flow-power" id="flow-load-power" x="0" y="-78">0.0 kW</text>
                  <text class="flow-status" id="flow-load-status" x="0" y="-62">${this._t('card.status.consuming', 'IN CONSUMO')}</text>
                </g>

                <g transform="translate(314, 330)">
                  <line class="flow-node-guide" x1="0" y1="12" x2="0" y2="42"></line>
                  <text class="flow-label" x="0" y="67">${this._t('card.node.battery', 'Batteria')}</text>
                  <text class="flow-power" id="flow-battery-power" x="0" y="85">0.0 kW</text>
                  <text class="flow-status" id="flow-battery-status" x="0" y="100">${this._t('card.status.waiting', 'IN ATTESA')}</text>
                </g>

                <g id="ev-node-group" transform="translate(184, 332)">
                  <line class="flow-node-guide" x1="0" y1="12" x2="0" y2="42"></line>
                  <text class="flow-label" x="0" y="61">${this._t('card.node.ev', 'EV')}</text>
                  <text class="flow-power" id="flow-ev-power" x="0" y="79">0.0 kW</text>
                  <text class="flow-status" id="flow-ev-status" x="0" y="94">${this._t('card.status.off', 'OFF')}</text>
                </g>
              </svg>
            </div>
          </div>
        </ha-card>
      `;
      this._initialized = true;
    }

    _renderDynamic() {
      const cfg = this._config;

      const solarPower = toWatt(this._entityState(cfg.entities.solar_power));
      const gridRaw = toWatt(this._entityState(cfg.entities.grid_power));
      const gridPower = cfg.grid_invert ? -gridRaw : gridRaw;
      const batteryPower = toWatt(this._entityState(cfg.entities.battery_power));
      const loadPower = toWatt(this._entityState(cfg.entities.load_power));
      const batteryLevel = toPct(this._entityState(cfg.entities.battery_level), 0);
      const evPower = toWatt(this._entityState(cfg.entities.ev_power));
      const evBattery = toPct(this._entityState(cfg.entities.ev_battery), 0);
      const solarMin = this._flowThreshold('solar_min_w', FLOW_MIN_W);
      const gridMin = this._flowThreshold('grid_min_w', FLOW_MIN_W);
      const batteryMin = this._flowThreshold('battery_min_w', FLOW_MIN_W);
      const homeMin = Math.min(solarMin, gridMin, batteryMin);

      const evCharging = this._isEvCharging(evPower);
      const evHideIdle = !!cfg.ev_hide_when_idle;
      const evNodeGroup = this.shadowRoot.querySelector('#ev-node-group');
      if (evNodeGroup) {
        evNodeGroup.classList.toggle('ev-hidden', evHideIdle && !evCharging);
      }
      this._setBackground(this._resolveBackground(evCharging));

      this._setText('#flow-solar-power', this._formatKW(solarPower));
      this._setText('#flow-grid-power', this._formatKW(gridPower));
      this._setText('#flow-load-power', this._formatKW(loadPower));
      this._setText('#flow-battery-power', `${this._formatKW(batteryPower)} | ${Math.round(batteryLevel)}%`);
      this._setText('#flow-ev-power', `${this._formatKW(evPower)} | ${Math.round(evBattery)}%`);

      this._setText('#flow-solar-status', solarPower > solarMin
        ? this._t('card.status.producing', 'IN PRODUZIONE')
        : this._t('card.status.inactive', 'INATTIVO'));
      this._setText('#flow-load-status', loadPower > homeMin
        ? this._t('card.status.consuming', 'IN CONSUMO')
        : this._t('card.status.inactive', 'INATTIVO'));
      this._setText('#flow-ev-status', evCharging
        ? this._t('card.status.charging', 'IN CARICA')
        : this._t('card.status.off', 'OFF'));

      if (batteryPower > batteryMin) this._setText('#flow-battery-status', this._t('card.status.charging', 'IN CARICA'));
      else if (batteryPower < -batteryMin) this._setText('#flow-battery-status', this._t('card.status.discharging', 'IN SCARICA'));
      else this._setText('#flow-battery-status', this._t('card.status.waiting', 'IN ATTESA'));

      this._toggleNode('#node-solar-bg', solarPower > solarMin);
      this._toggleNode('#node-grid-bg', Math.abs(gridPower) > gridMin);
      this._toggleNode('#node-load-bg', loadPower > homeMin);
      this._toggleNode('#node-battery-bg', Math.abs(batteryPower) > batteryMin);
      this._toggleNode('#node-ev-bg', evCharging);

      this.shadowRoot.querySelectorAll('.flow-line').forEach((line) => {
        line.classList.remove('active', 'flow-solar', 'flow-green', 'flow-broken');
      });

      const solarPos = Math.max(0, solarPower);
      const loadPos = Math.max(0, loadPower);
      const gridImport = Math.max(0, gridPower);
      const gridExport = Math.max(0, -gridPower);
      const batteryCharge = Math.max(0, batteryPower);
      const batteryDischarge = Math.max(0, -batteryPower);
      const evDraw = evCharging ? Math.max(0, evPower) : 0;

      const solarToLoad = Math.min(solarPos, loadPos);
      const remainingLoad = Math.max(0, loadPos - solarToLoad);

      let solarRemaining = Math.max(0, solarPos - solarToLoad);
      let battDischargeRemaining = batteryDischarge;
      let gridImportRemaining = gridImport;

      const solarToEv = Math.min(evDraw, solarRemaining);
      solarRemaining = Math.max(0, solarRemaining - solarToEv);
      let evRemaining = Math.max(0, evDraw - solarToEv);

      const battToEv = Math.min(evRemaining, battDischargeRemaining);
      battDischargeRemaining = Math.max(0, battDischargeRemaining - battToEv);
      evRemaining = Math.max(0, evRemaining - battToEv);

      const gridToEv = Math.min(evRemaining, gridImportRemaining);
      gridImportRemaining = Math.max(0, gridImportRemaining - gridToEv);
      evRemaining = Math.max(0, evRemaining - gridToEv);

      const battToLoad = Math.min(remainingLoad, battDischargeRemaining);
      battDischargeRemaining = Math.max(0, battDischargeRemaining - battToLoad);
      let loadRemaining = Math.max(0, remainingLoad - battToLoad);

      const gridToLoad = Math.min(loadRemaining, gridImportRemaining);
      gridImportRemaining = Math.max(0, gridImportRemaining - gridToLoad);
      loadRemaining = Math.max(0, loadRemaining - gridToLoad);

      let battChargeRemaining = batteryCharge;
      const solarToBattery = Math.min(battChargeRemaining, solarRemaining);
      battChargeRemaining = Math.max(0, battChargeRemaining - solarToBattery);
      solarRemaining = Math.max(0, solarRemaining - solarToBattery);

      let gridToBattery = 0;
      if (solarToBattery < batteryMin) {
        gridToBattery = Math.min(battChargeRemaining, gridImportRemaining);
        gridImportRemaining = Math.max(0, gridImportRemaining - gridToBattery);
      }

      const solarExport = Math.min(gridExport, solarRemaining);

      let gridToLoadVisual = gridToLoad;
      // Fallback visuale: se il carico e sostenuto di fatto dalla rete ma il calcolo cade sotto soglia.
      if (
        !evCharging &&
        gridToLoadVisual < gridMin &&
        gridImport >= gridMin &&
        loadPos >= homeMin &&
        solarToLoad < solarMin &&
        battToLoad < batteryMin
      ) {
        gridToLoadVisual = Math.min(gridImport, loadPos);
      }

      this._activatePath('line-solar-load', 'flow-solar', solarToLoad, solarMin);
      this._activatePath('line-grid-load', 'flow-broken', gridToLoadVisual, gridMin);
      this._activatePath('line-battery-load', 'flow-green', battToLoad, batteryMin);

      const homeTotal = solarToLoad + battToLoad + gridToLoadVisual;
      const homeCls = this._dominantFlowClass(solarToLoad, battToLoad, gridToLoadVisual, 'flow-solar');
      this._activatePath('line-junction-home-load', homeCls, homeTotal, homeMin);

      this._activatePath('line-solar-battery', 'flow-solar', solarToBattery, batteryMin);
      this._activatePath('line-grid-battery', 'flow-broken', gridToBattery, batteryMin);
      this._activatePath('line-solar-grid', 'flow-green', solarExport, solarMin);

      const evTotal = solarToEv + battToEv + gridToEv;
      const evCls = this._dominantFlowClass(solarToEv, battToEv, gridToEv, 'flow-green');
      this._activatePath('line-wallbox-ev', evCls, evTotal, 1);
    }

    _render() {
      if (!this._config) return;
      const lang = this._resolvedLang();
      if (!this._initialized || this._renderLang !== lang) {
        this._renderStatic();
        this._renderLang = lang;
      }
      if (this._hass) this._renderDynamic();
    }
  }

  class EnergyFlowProCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = deepMerge(DEFAULT_CONFIG, {});
      this._hass = null;
    }

    setConfig(config) {
      const incoming = { ...(config || {}) };
      if (
        (incoming.language === undefined || incoming.language === null || incoming.language === '') &&
        this._config?.language &&
        this._config.language !== 'auto'
      ) {
        incoming.language = this._config.language;
      }
      this._config = deepMerge(DEFAULT_CONFIG, incoming);
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._render();
    }

    _emitConfig() {
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true
      }));
    }

    _update(path, value) {
      if (path === 'language') {
        const normalized = normalizeLanguageCode(value);
        value = (normalized === 'auto' || SUPPORTED_LANGS.includes(normalized)) ? normalized : 'auto';
      }
      const keys = path.split('.');
      const next = { ...this._config };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        cur[k] = { ...(cur[k] || {}) };
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = value;
      this._config = deepMerge(DEFAULT_CONFIG, next);
      this._emitConfig();
      this._render();
    }

    _entityIdsByDomain(domain) {
      if (!this._hass) return [];
      return Object.keys(this._hass.states)
        .filter((id) => id.startsWith(`${domain}.`))
        .sort((a, b) => a.localeCompare(b));
    }

    _getByPath(path) {
      const keys = path.split('.');
      let value = this._config;
      keys.forEach((k) => { value = value?.[k]; });
      return value;
    }

    _resolvedLang() {
      return resolveLanguage(this._config.language, this._hass);
    }

    _t(key, fallback = '') {
      return tLang(this._resolvedLang(), key, fallback);
    }

    _escapeHtml(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    _entitySelectRow(label, path, options, placeholder) {
      const current = String(this._getByPath(path) || '');
      const values = Array.isArray(options) ? [...options] : [];
      if (current && !values.includes(current)) values.unshift(current);
      const opts = values
        .map((id) => {
          const selected = id === current ? ' selected' : '';
          return `<option value="${this._escapeHtml(id)}"${selected}>${this._escapeHtml(id)}</option>`;
        })
        .join('');
      return `
        <label>${label}</label>
        <select data-path="${path}">
          <option value="">${this._escapeHtml(placeholder || this._t('editor.placeholder_select', '-- select --'))}</option>
          ${opts}
        </select>
      `;
    }

    _languageSelectRow() {
      const raw = normalizeLanguageCode(this._config.language || 'auto');
      const current = (raw === 'auto' || SUPPORTED_LANGS.includes(raw)) ? raw : 'auto';
      const opts = LANGUAGE_OPTIONS
        .map(({ value, labelKey }) => {
          const selected = value === current ? ' selected' : '';
          const label = this._t(labelKey, value.toUpperCase());
          return `<option value="${value}"${selected}>${this._escapeHtml(label)}</option>`;
        })
        .join('');
      return `
        <label>${this._t('editor.field_language', 'Language')}</label>
        <select data-path="language">
          ${opts}
        </select>
      `;
    }

    _render() {
      const sensorIds = this._entityIdsByDomain('sensor');
      const switchIds = this._entityIdsByDomain('switch');
      const weatherIds = this._entityIdsByDomain('weather');
      const sunIds = this._entityIdsByDomain('sun');

      const cfg = this._config;
      const b = cfg.background_map || {};

      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          .wrap {
            padding: 12px;
            display: grid;
            gap: 12px;
          }
          .block {
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 10px;
            display: grid;
            gap: 8px;
          }
          h4 {
            margin: 0;
            font-size: 13px;
            letter-spacing: 0.04em;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 6px;
          }
          label {
            font-size: 12px;
            color: var(--secondary-text-color);
          }
          input, textarea, select {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.14);
            background: rgba(17,24,39,0.55);
            color: var(--primary-text-color);
            font-size: 12px;
            box-sizing: border-box;
          }
          textarea {
            min-height: 46px;
            resize: vertical;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
          }
          .row {
            display: grid;
            grid-template-columns: 1fr 42px;
            gap: 8px;
            align-items: center;
            min-height: 36px;
          }
          .row label {
            font-size: 13px;
            font-weight: 500;
          }
          input[type="checkbox"] {
            width: 24px;
            height: 24px;
            margin: 0;
            justify-self: end;
            accent-color: var(--primary-color);
            cursor: pointer;
          }
          .hint {
            font-size: 11px;
            color: var(--secondary-text-color);
            opacity: 0.85;
          }
          select {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
          }
        </style>
        <div class="wrap">
          <div class="block">
            <h4>${this._t('editor.section_general', 'General')}</h4>
            <div class="grid">
              <label>${this._t('editor.field_title', 'Title')}</label>
              <input data-path="title" value="${cfg.title || ''}">
              ${this._languageSelectRow()}
              <label>${this._t('editor.field_background', 'Background URL')}</label>
              <input data-path="background" value="${cfg.background || ''}">
              <label>${this._t('editor.field_background_base', 'Background Assets Base (auto)')}</label>
              <input data-path="background_asset_base" value="${cfg.background_asset_base || '/local/community/energy-flow-pro-card/backgrounds'}">
              <div class="row">
                <label>${this._t('editor.field_grid_invert', 'Invert grid sign')}</label>
                <input type="checkbox" data-path="grid_invert" ${cfg.grid_invert ? 'checked' : ''}>
              </div>
              <div class="row">
                <label>${this._t('editor.field_show_labels', 'Show labels')}</label>
                <input type="checkbox" data-path="show_labels" ${cfg.show_labels ? 'checked' : ''}>
              </div>
              <div class="row">
                <label>${this._t('editor.field_hide_ev_idle', 'Hide EV when idle')}</label>
                <input type="checkbox" data-path="ev_hide_when_idle" ${cfg.ev_hide_when_idle ? 'checked' : ''}>
              </div>
              <label>${this._t('editor.field_scene_scale', 'Scene Scale')}</label>
              <input type="number" step="0.01" data-path="scene_scale" value="${safeNum(cfg.scene_scale, 1.06)}">
              <label>${this._t('editor.field_solar_threshold', 'Solar threshold (W)')}</label>
              <input type="number" data-path="thresholds.solar_min_w" value="${safeNum(cfg.thresholds?.solar_min_w, 50)}">
              <label>${this._t('editor.field_grid_threshold', 'Grid threshold (W)')}</label>
              <input type="number" data-path="thresholds.grid_min_w" value="${safeNum(cfg.thresholds?.grid_min_w, 50)}">
              <label>${this._t('editor.field_battery_threshold', 'Battery threshold (W)')}</label>
              <input type="number" data-path="thresholds.battery_min_w" value="${safeNum(cfg.thresholds?.battery_min_w, 50)}">
            </div>
          </div>

          <div class="block">
            <h4>${this._t('editor.section_sensors', 'Sensors')}</h4>
            <div class="grid">
              ${this._entitySelectRow(this._t('editor.sensor_solar', 'Solar Power'), 'entities.solar_power', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_grid', 'Grid Power'), 'entities.grid_power', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_battery', 'Battery Power'), 'entities.battery_power', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_load', 'Load Power'), 'entities.load_power', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_battery_level', 'Battery Level %'), 'entities.battery_level', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_ev_power', 'EV Power'), 'entities.ev_power', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_ev_battery', 'EV Battery %'), 'entities.ev_battery', sensorIds, this._t('editor.placeholder_sensor', '-- select sensor --'))}
              ${this._entitySelectRow(this._t('editor.sensor_ev_switch', 'EV Charge Switch'), 'entities.ev_charge_switch', switchIds, this._t('editor.placeholder_switch', '-- select switch --'))}
              ${this._entitySelectRow(this._t('editor.sensor_weather', 'Weather Entity'), 'entities.weather', weatherIds, this._t('editor.placeholder_weather', '-- select weather --'))}
              ${this._entitySelectRow(this._t('editor.sensor_sun', 'Sun Entity'), 'entities.sun', sunIds, this._t('editor.placeholder_sun', '-- select sun --'))}
            </div>
            <div class="hint">${this._t('editor.hint_entities', 'Clean menu with domain-filtered entities.')}</div>
          </div>

          <div class="block">
            <h4>${this._t('editor.section_dynamic_bg', 'Dynamic Background')}</h4>
            <div class="grid">
              <div class="row">
                <label>${this._t('editor.field_dynamic_bg', 'Enable dynamic')}</label>
                <input type="checkbox" data-path="dynamic_background" ${cfg.dynamic_background ? 'checked' : ''}>
              </div>
              <label>background_map.default</label>
              <input data-path="background_map.default" value="${b.default || ''}">
              <label>background_map.day_default</label>
              <input data-path="background_map.day_default" value="${b.day_default || ''}">
              <label>background_map.night_default</label>
              <input data-path="background_map.night_default" value="${b.night_default || ''}">
              <label>background_map.day_clear</label>
              <input data-path="background_map.day_clear" value="${b.day_clear || ''}">
              <label>background_map.day_cloudy</label>
              <input data-path="background_map.day_cloudy" value="${b.day_cloudy || ''}">
              <label>background_map.day_rain</label>
              <input data-path="background_map.day_rain" value="${b.day_rain || ''}">
              <label>background_map.night_clear</label>
              <input data-path="background_map.night_clear" value="${b.night_clear || ''}">
              <label>background_map.night_cloudy</label>
              <input data-path="background_map.night_cloudy" value="${b.night_cloudy || ''}">
              <label>background_map.night_rain</label>
              <input data-path="background_map.night_rain" value="${b.night_rain || ''}">
              <label>background_map.day_clear_idle</label>
              <input data-path="background_map.day_clear_idle" value="${b.day_clear_idle || ''}">
              <label>background_map.day_clear_charging</label>
              <input data-path="background_map.day_clear_charging" value="${b.day_clear_charging || ''}">
              <label>background_map.night_clear_idle</label>
              <input data-path="background_map.night_clear_idle" value="${b.night_clear_idle || ''}">
              <label>background_map.night_clear_charging</label>
              <input data-path="background_map.night_clear_charging" value="${b.night_clear_charging || ''}">
            </div>
            <div class="hint">${this._t('editor.hint_bg_lookup', 'Lookup priority: period+weather+charging -> period+weather -> period_default -> default -> background.')}</div>
          </div>
        </div>
      `;

      this.shadowRoot.querySelectorAll('input, select, textarea').forEach((el) => {
        const path = el.dataset.path;
        if (!path) return;
        const eventName = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
        el.addEventListener(eventName, () => {
          if (el.type === 'checkbox') {
            this._update(path, el.checked);
          } else if (el.type === 'number') {
            this._update(path, safeNum(el.value, 0));
          } else {
            this._update(path, el.value);
          }
        });
      });
    }
  }

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, EnergyFlowProCard);
  }
  if (!customElements.get('energy-flow-pro-card-editor')) {
    customElements.define('energy-flow-pro-card-editor', EnergyFlowProCardEditor);
  }

  window.customCards = window.customCards || [];
  if (!window.customCards.find((c) => c.type === CARD_TYPE)) {
    window.customCards.push({
      type: CARD_TYPE,
      name: 'Energy Flow Pro Card',
      description: 'Flow card with background, configurable entities, and color logic.'
    });
  }
})();
