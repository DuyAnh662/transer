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

        return {
            detected: response.data.detectedLanguage?.language || from,
            text: response.data.translatedText,
        };
    } catch (error) {
        console.error('❌ Translation Error Detail:', error.response?.data || error.message);

        // Handle specific error cases
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Không thể kết nối đến server dịch. Vui lòng thử lại sau.');
        }
        if (error.response?.status === 429) {
            throw new Error('Quá nhiều yêu cầu. Vui lòng đợi một chút.');
        }
        if (error.response?.status === 400) {
            throw new Error('Ngôn ngữ không được hỗ trợ hoặc văn bản không hợp lệ. ' + JSON.stringify(error.response?.data));
        }

        console.error('❌ Translation error:', error.message);
        throw new Error('Lỗi dịch thuật. Vui lòng thử lại.');
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
