/**
 * Language name to ISO code mapping
 * Supports Vietnamese, English, and common language names
 */
const langMap = {
    // Auto detect
    auto: 'auto',
    detect: 'auto',
    'tự động': 'auto',

    // English
    english: 'en',
    anh: 'en',
    en: 'en',

    // Vietnamese
    vietnamese: 'vi',
    viet: 'vi',
    việt: 'vi',
    'tiếng việt': 'vi',
    vi: 'vi',

    // Japanese
    japanese: 'ja',
    nhật: 'ja',
    'tiếng nhật': 'ja',
    ja: 'ja',

    // Korean
    korean: 'ko',
    hàn: 'ko',
    'tiếng hàn': 'ko',
    ko: 'ko',

    // Chinese (Simplified)
    chinese: 'zh',
    trung: 'zh',
    'tiếng trung': 'zh',
    zh: 'zh',

    // French
    french: 'fr',
    pháp: 'fr',
    'tiếng pháp': 'fr',
    fr: 'fr',

    // German
    german: 'de',
    đức: 'de',
    'tiếng đức': 'de',
    de: 'de',

    // Spanish
    spanish: 'es',
    'tây ban nha': 'es',
    es: 'es',

    // Russian
    russian: 'ru',
    nga: 'ru',
    'tiếng nga': 'ru',
    ru: 'ru',

    // Thai
    thai: 'th',
    thái: 'th',
    'tiếng thái': 'th',
    th: 'th',

    // Indonesian
    indonesian: 'id',
    indonesia: 'id',
    id: 'id',

    // Portuguese
    portuguese: 'pt',
    'bồ đào nha': 'pt',
    pt: 'pt',

    // Italian
    italian: 'it',
    ý: 'it',
    'tiếng ý': 'it',
    it: 'it',

    // Arabic
    arabic: 'ar',
    'ả rập': 'ar',
    ar: 'ar',

    // Hindi
    hindi: 'hi',
    'ấn độ': 'hi',
    hi: 'hi',
};

/**
 * Convert language name to ISO code
 * @param {string} langName - Language name (e.g., "Vietnamese", "Việt", "vi")
 * @returns {string|null} - ISO code or null if not found
 */
function toLangCode(langName) {
    if (!langName) return null;
    const normalized = langName.toLowerCase().trim();
    return langMap[normalized] || null;
}

/**
 * Get display name for language code
 * @param {string} langCode - ISO language code
 * @returns {string} - Display name
 */
function getLangDisplayName(langCode) {
    const displayNames = {
        auto: 'Auto',
        en: 'English',
        vi: 'Vietnamese',
        ja: 'Japanese',
        ko: 'Korean',
        zh: 'Chinese',
        fr: 'French',
        de: 'German',
        es: 'Spanish',
        ru: 'Russian',
        th: 'Thai',
        id: 'Indonesian',
        pt: 'Portuguese',
        it: 'Italian',
        ar: 'Arabic',
        hi: 'Hindi',
    };
    return displayNames[langCode] || langCode.toUpperCase();
}

module.exports = {
    langMap,
    toLangCode,
    getLangDisplayName,
};
