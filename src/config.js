module.exports = {
    // Discord Bot Token
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,

    // LibreTranslate API
    LIBRETRANSLATE_URL: process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com',

    // Default translation settings
    DEFAULT_FROM: 'auto',
    DEFAULT_TO: 'vi',

    // Default mode for image translation
    DEFAULT_MODE: 'text', // 'text' or 'image'

    // Supported image formats
    SUPPORTED_IMAGE_FORMATS: ['png', 'jpg', 'jpeg', 'webp', 'gif'],

    // OCR languages (Tesseract)
    OCR_LANGUAGES: 'eng+vie+jpn+kor+chi_sim',

    // Rate limit (messages per minute per user)
    RATE_LIMIT: 10,

    // Max text length for translation
    MAX_TEXT_LENGTH: 5000,
};
