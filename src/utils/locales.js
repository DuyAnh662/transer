/**
 * Localization strings for the bot
 */
const locales = {
    vi: {
        lang_set: '🌍 Đã đặt chế độ dịch:\n',
        lang_error_source: '❌ Không nhận diện được ngôn ngữ nguồn: ',
        lang_error_target: '❌ Không nhận diện được ngôn ngữ đích: ',
        lang_error_auto_target: '❌ Ngôn ngữ đích không thể là "Auto"',
        syntax_error_lang: '❌ Cú pháp không hợp lệ. Ví dụ: `Auto > Vietnamese`',
        syntax_error_mode: '❌ Cú pháp không hợp lệ. Ví dụ: `Mode: Text` hoặc `Mode: Image`',
        mode_set: 'Đã đặt chế độ dịch ảnh:\n',
        mode_desc_text: 'Văn bản (OCR → dịch → gửi tin nhắn)',
        mode_desc_image: 'Hình ảnh (OCR → dịch → ghi lên ảnh)',
        translation_header: 'Bản dịch',
        translation_error: 'Lỗi dịch thuật',
        ocr_scanning: '🔍 Đang nhận diện chữ trong ảnh...',
        ocr_no_text: '❌ Không phát hiện được chữ trong ảnh',
        image_translated: 'Đã dịch ảnh',
        image_text_header: 'Văn bản trong ảnh',
        original_text: 'Văn bản gốc',
        ocr_confidence: 'Độ chính xác OCR',
    },
    en: {
        lang_set: '🌍 Translation mode set:\n',
        lang_error_source: '❌ Unknown source language: ',
        lang_error_target: '❌ Unknown target language: ',
        lang_error_auto_target: '❌ Target language cannot be "Auto"',
        syntax_error_lang: '❌ Invalid syntax. Example: `Auto > Vietnamese`',
        syntax_error_mode: '❌ Invalid syntax. Example: `Mode: Text` or `Mode: Image`',
        mode_set: 'Image translation mode set:\n',
        mode_desc_text: 'Text (OCR → translate → send message)',
        mode_desc_image: 'Image (OCR → translate → overlay on image)',
        translation_header: 'Translation',
        translation_error: 'Translation error',
        ocr_scanning: '🔍 Scanning text in image...',
        ocr_no_text: '❌ No text detected in image',
        image_translated: 'Image translated',
        image_text_header: 'Text in image',
        original_text: 'Original text',
        ocr_confidence: 'OCR Confidence',
    }
};

/**
 * Get message string based on language
 * @param {string} lang - Language code (vi, en, etc.)
 * @param {string} key - Message key
 * @returns {string} - Localized message
 */
function getMessage(lang, key) {
    // Default to Vietnamese if lang not found, or use English as fallback
    const locale = locales[lang] || locales.vi;
    return locale[key] || locales.vi[key] || key;
}

module.exports = { getMessage };
