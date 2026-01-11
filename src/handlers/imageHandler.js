const axios = require('axios');
const { AttachmentBuilder } = require('discord.js');
const { extractText } = require('../services/ocr');
const { translate } = require('../services/translator');
const { addTextOverlay } = require('../services/imageEditor');
const { getUserLang, getUserMode } = require('../utils/storage');
const { getLangDisplayName } = require('../utils/langMap');
const config = require('../config');
const { getMessage } = require('../utils/locales');

/**
 * Handle image translation
 * @param {Message} message - Discord message
 * @param {Attachment} attachment - Image attachment
 */
async function handleImage(message, attachment) {

    // ... inside handleImage ...

    const langConfig = getUserLang(message.author.id) || {
        from: config.DEFAULT_FROM,
        to: config.DEFAULT_TO,
    };
    const botLang = langConfig.to === 'vi' ? 'vi' : 'en';

    try {
        // Show typing indicator
        await message.channel.sendTyping();

        // Download image
        const imageBuffer = await downloadImage(attachment.url);

        // Extract text using OCR
        await message.channel.send(getMessage(botLang, 'ocr_scanning'));
        const ocrResult = await extractText(imageBuffer);

        if (!ocrResult.text || ocrResult.text.length < 2) {
            await message.reply(getMessage(botLang, 'ocr_no_text'));
            return;
        }

        // Translate extracted text
        const translated = await translate(ocrResult.text, langConfig.from, langConfig.to);

        const detectedDisplay = getLangDisplayName(translated.detected);
        const toDisplay = getLangDisplayName(langConfig.to);

        // Get user mode preference
        const mode = getUserMode(message.author.id);

        if (mode === 'image') {
            // Image mode: overlay translated text on image
            const newImageBuffer = await addTextOverlay(
                imageBuffer,
                ocrResult.text,
                translated.text
            );

            const attachment = new AttachmentBuilder(newImageBuffer, {
                name: 'translated.png',
            });

            const msg = `🖼️ **${getMessage(botLang, 'image_translated')}** (${detectedDisplay} → ${toDisplay})`;
            await message.reply({
                content: msg,
                files: [attachment],
            });
        } else {
            // Text mode (default): send as message
            const response = formatImageResponse(
                ocrResult.text,
                translated.text,
                detectedDisplay,
                toDisplay,
                ocrResult.confidence,
                botLang
            );

            // Discord message limit is 2000 characters
            if (response.length > 2000) {
                // Send original and translation separately
                const header = getMessage(botLang, 'image_text_header');
                const transHeader = getMessage(botLang, 'translation_header');

                await message.reply(`🖼️ **${header}** (${detectedDisplay} → ${toDisplay}):\n\n**${transHeader}:**\n${translated.text.slice(0, 1800)}`);
                if (translated.text.length > 1800) {
                    await message.channel.send(`...\n${translated.text.slice(1800)}`);
                }
            } else {
                await message.reply(response);
            }
        }
    } catch (error) {
        // Redefine botLang in catch block if needed, but it should be available from upper scope
        // However, if error happens before botLang definition (unlikely), safe fallback
        const lang = (getUserLang(message.author.id) || {}).to === 'vi' ? 'vi' : 'en';
        console.error('❌ Image handler error:', error);
        const errorMsg = getMessage(lang, 'translation_error');
        await message.reply(`❌ ${errorMsg}: ${error.message}`);
    }
}

/**
 * Download image from URL
 * @param {string} url - Image URL
 * @returns {Promise<Buffer>} - Image buffer
 */
async function downloadImage(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 30000,
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('❌ Error downloading image:', error.message);
        throw new Error('The image could not be loaded. Please try again.');
    }
}

/**
 * Format response for image translation (text mode)
 * @param {string} original - Original OCR text
 * @param {string} translated - Translated text
 * @param {string} fromLang - Source language display name
 * @param {string} toLang - Target language display name
 * @param {number} confidence - OCR confidence
 * @returns {string} - Formatted response
 */
function formatImageResponse(original, translated, fromLang, toLang, confidence, botLang) {
    const header = getMessage(botLang, 'image_text_header');
    const transHeader = getMessage(botLang, 'translation_header');
    const ocrConf = getMessage(botLang, 'ocr_confidence');
    const origText = getMessage(botLang, 'original_text');

    let response = `🖼️ **${header}** (${fromLang} → ${toLang})\n`;

    // Show confidence if low
    if (confidence < 70) {
        response += `⚠️ *${ocrConf}: ${Math.round(confidence)}%*\n`;
    }

    response += `\n**${transHeader}:**\n${translated}`;

    // Optionally show original text if short enough
    if (original.length < 500 && response.length + original.length < 1800) {
        response += `\n\n<details><summary>📄 ${origText}</summary>\n\n${original}\n</details>`;
    }

    return response;
}

module.exports = { handleImage };
