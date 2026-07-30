const fs = require('node:fs');
const path = require('node:path');
const { Translator } = require('deepl-node');

const ROOT = path.join(__dirname, '..');
const ENV_FILE = path.join(ROOT, 'backend', '.env');
const LOCALES_DIR = path.join(ROOT, 'frontend', 'public', 'locales');
const SOURCE_FILE = path.join(LOCALES_DIR, 'fr', 'translation.json');
const CACHE_FILE = path.join(__dirname, '.translate-cache.json');
const TARGETS = {
    en: 'EN-US',
    es: 'ES',
    ar: 'AR',
    pt: 'PT-PT',
    zh: 'ZH',
    de: 'DE',
    hi: 'HI',
    ru: 'RU',
    ja: 'JA',
};
const WATCH_MODE = process.argv.includes('--watch');

function loadEnv() {
    if (!fs.existsSync(ENV_FILE)) {
        return;
    }

    for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
            continue;
        }

        const [key, ...rest] = trimmed.split('=');
        if (!process.env[key]) {
            process.env[key] = rest.join('=').trim();
        }
    }
}

function readJson(filePath) {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};
}

function writeJson(filePath, data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function flattenObject(obj, prefix = '', output = {}) {
    for (const [key, value] of Object.entries(obj)) {
        const nextKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, nextKey, output);
        } else {
            output[nextKey] = String(value);
        }
    }

    return output;
}

function expandObject(map) {
    const result = {};

    for (const [fullKey, value] of Object.entries(map)) {
        const keys = fullKey.split('.');
        let current = result;

        for (let index = 0; index < keys.length - 1; index += 1) {
            current[keys[index]] ??= {};
            current = current[keys[index]];
        }

        current[keys[keys.length - 1]] = value;
    }

    return result;
}

function protectVariables(text) {
    const variables = [];
    return {
        variables,
        text: text.replace(/\{\{\s*[^}]+\s*\}\}/g, (match) => {
            variables.push(match);
            return `__VAR_${variables.length - 1}__`;
        }),
    };
}

function restoreVariables(text, variables) {
    return text.replace(/__VAR_(\d+)__/g, (_, index) => variables[Number(index)] ?? '');
}

async function translateLanguage(translator, lang, deeplLang, sourceMap, previousSourceMap) {
    const targetFile = path.join(LOCALES_DIR, lang, 'translation.json');
    const targetMap = flattenObject(readJson(targetFile));
    // Clés modifiées dans FR OU absentes du fichier cible
    const changed = Object.entries(sourceMap).filter(
        ([key, text]) => previousSourceMap[key] !== text || !(key in targetMap)
    );
    let removed = 0;

    for (const key of Object.keys(targetMap)) {
        if (!(key in sourceMap)) {
            delete targetMap[key];
            removed += 1;
        }
    }

    if (!changed.length && !removed) {
        console.log(`OK ${lang} -> aucune cle modifiee`);
        return;
    }

    if (changed.length) {
        // On envoie seulement les nouvelles clés FR ou celles qui ont changé.
        const prepared = changed.map(([key, text]) => ({ key, ...protectVariables(text) }));
        const translated = await translator.translateText(
            prepared.map((item) => item.text),
            'fr',
            deeplLang,
            {
                tagHandling: 'html',
            }
        );

        prepared.forEach((item, index) => {
            targetMap[item.key] = restoreVariables(translated[index].text, item.variables);
        });
    }

    writeJson(targetFile, expandObject(targetMap));
    console.log(`OK ${lang} -> ${changed.length} cle(s) retraduites${removed ? `, ${removed} supprimee(s)` : ''}`);
}

async function translateAll() {
    loadEnv();
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey || apiKey === 'your_deepl_api_key' || apiKey === 'ta_cle_deepl' || apiKey.trim() === '') {
        console.warn('⚠️ DEEPL_API_KEY non configurée dans backend/.env. La traduction automatique DeepL est en pause.');
        return;
    }

    const sourceMap = flattenObject(readJson(SOURCE_FILE));
    const previousSourceMap = readJson(CACHE_FILE);
    const translator = new Translator(apiKey);

    for (const [lang, deeplLang] of Object.entries(TARGETS)) {
        await translateLanguage(translator, lang, deeplLang, sourceMap, previousSourceMap);
    }

    writeJson(CACHE_FILE, sourceMap);
}

async function run() {
    try {
        await translateAll();
    } catch (error) {
        if (error.message.includes('Authorization failure') || error.message.includes('auth_key') || error.message.includes('Forbidden')) {
            console.warn('⚠️ Clé DeepL API invalide (Authorization failure / Forbidden). Renseignez une clé API DeepL valide dans backend/.env sous DEEPL_API_KEY.');
        } else {
            console.error('Erreur traduction DeepL :', error.message);
        }
        if (!WATCH_MODE) {
            process.exit(1);
        }
    }
}

function startWatch() {
    console.log('Mode watch actif sur la source FR');
    run();

    let timeoutId = null;
    let isRunning = false;
    fs.watch(SOURCE_FILE, () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            if (isRunning) return;
            isRunning = true;
            await run();
            isRunning = false;
        }, 250);
    });
}

if (WATCH_MODE) {
    startWatch();
} else {
    run();
}