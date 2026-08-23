import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dist', 'tesla-style-energy-flow.js'), 'utf8');

// The packaged bundle is a DOM-dependent IIFE, so the translation tables are
// lifted out of the source text and evaluated on their own.
function sliceBalanced(marker, open, close) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `could not find "${marker}" in the packaged bundle`);
  const from = source.indexOf(open, start);
  assert.notEqual(from, -1, `could not find "${open}" after "${marker}"`);
  let depth = 0;
  for (let i = from; i < source.length; i += 1) {
    if (source[i] === open) depth += 1;
    else if (source[i] === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced "${open}" after "${marker}"`);
}

const { SUPPORTED_LANGS, LANGUAGE_ALIASES, LANGUAGE_OPTIONS, I18N, normalizeLanguageCode } =
  new Function(`
    ${sliceBalanced('const SUPPORTED_LANGS =', '[', ']')};
    ${sliceBalanced('const LANGUAGE_ALIASES =', '[', ']')});
    ${sliceBalanced('const LANGUAGE_OPTIONS =', '[', ']')});
    ${sliceBalanced('const I18N =', '{', '}')});
    ${sliceBalanced('function normalizeLanguageCode(', '{', '}')}
    return { SUPPORTED_LANGS, LANGUAGE_ALIASES, LANGUAGE_OPTIONS, I18N, normalizeLanguageCode };
  `)();

for (const lang of ['it', 'en', 'es', 'fr', 'de', 'pt-br', 'pt-pt']) {
  assert.ok(SUPPORTED_LANGS.includes(lang), `${lang} should be a supported language`);
  assert.ok(I18N[lang], `${lang} should have a translation bundle`);
}

function flatKeys(bundle, prefix = '') {
  return Object.entries(bundle).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' ? flatKeys(value, full) : [full];
  });
}

const referenceKeys = flatKeys(I18N.en).sort();
for (const lang of SUPPORTED_LANGS) {
  assert.deepEqual(
    flatKeys(I18N[lang]).sort(),
    referenceKeys,
    `${lang} translation keys should match the en bundle exactly`
  );
}

for (const { value, labelKey } of LANGUAGE_OPTIONS) {
  assert.ok(
    value === 'auto' || SUPPORTED_LANGS.includes(value),
    `language option "${value}" should be a supported language`
  );
  assert.ok(
    referenceKeys.includes(labelKey),
    `language option "${value}" should point at an existing label key (${labelKey})`
  );
}

// Portuguese needs the region, so normalization must not truncate at the dash.
assert.equal(normalizeLanguageCode('pt-BR'), 'pt-br');
assert.equal(normalizeLanguageCode('pt_BR'), 'pt-br');
assert.equal(normalizeLanguageCode('pt-PT'), 'pt-pt');
// Home Assistant ships European Portuguese as a bare "pt".
assert.equal(normalizeLanguageCode('pt'), 'pt-pt');
assert.equal(LANGUAGE_ALIASES.get('pt'), 'pt-pt');

// Region-less bundles keep resolving from any regional tag, as before.
assert.equal(normalizeLanguageCode('en-GB'), 'en');
assert.equal(normalizeLanguageCode('de_CH'), 'de');
assert.equal(normalizeLanguageCode('it'), 'it');
assert.equal(normalizeLanguageCode('auto'), 'auto');
assert.equal(normalizeLanguageCode(''), '');
assert.equal(normalizeLanguageCode(undefined), '');
// Unsupported languages still normalize to their base tag and fall back later.
assert.equal(normalizeLanguageCode('zh-CN'), 'zh');

console.log('i18n tests passed');
