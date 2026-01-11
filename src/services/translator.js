const axios = require('axios');
const config = require('../config');

/**
 * Translate text using LibreTranslate API
 * @param {string} text - Text to translate
 * @param {string} from - Source language code ('auto' for auto-detect)
 * @param {string} to - Target language code
 * @returns {Promise<{detected: string, text: string}>}
 */
async function translate(text, from = 'auto', to = 'vi') {
    try {
        // Truncate text if too long
        const truncatedText = text.slice(0, config.MAX_TEXT_LENGTH);

        const response = await axios.post(
            `${config.LIBRETRANSLATE_URL}/translate`,
            {
                q: truncatedText,
                source: from === 'auto' ? 'auto' : from,
                target: to,
                format: 'text',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 second timeout
            }
        );

        console.log('📡 LibreTranslate Response:', JSON.stringify(response.data));

        const detected = response.data.detectedLanguage?.language || from;
        const translatedText = response.data.translatedText;

        if (!translatedText) {
            console.warn('⚠️ translatedText is missing in API response!');
        }

        return {
            detected: detected,
            text: translatedText,
        };
    } catch (error) {
        console.error('❌ Translation Error Detail:', error.response?.data || error.message);

        // Handle specific error cases
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to the server. Please try again later.');
        }
        if (error.response?.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
        }
        if (error.response?.status === 400) {
            throw new Error('Language not supported or invalid text.' + JSON.stringify(error.response?.data));
        }

        console.error('❌ Translation error:', error.message);
        throw new Error('Translation error. Please try again.');
    }
}

/**
 * Get list of supported languages from LibreTranslate
 * @returns {Promise<Array>}
 */
async function getSupportedLanguages() {
    try {
        const response = await axios.get(`${config.LIBRETRANSLATE_URL}/languages`);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching languages:', error.message);
        return [];
    }
}

module.exports = {
    translate,
    getSupportedLanguages,
};
