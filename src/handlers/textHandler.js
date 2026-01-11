const { translate } = require('../services/translator');
const { getMessage } = require('../utils/locales');
const { getUserLang } = require('../utils/storage');
const { getLangDisplayName } = require('../utils/langMap');
const config = require('../config');

/**
 * Handle text translation
 * @param {Message} message - Discord message
 */
async function handleText(message) {
    const content = message.content.trim();

    // Get user language preferences or use defaults
    const langConfig = getUserLang(message.author.id) || {
        from: config.DEFAULT_FROM,
        to: config.DEFAULT_TO,
    };

    try {
        // Show typing indicator
        await message.channel.sendTyping();



        // ... inside handleText ...

        const result = await translate(content, langConfig.from, langConfig.to);

        console.log('🔍 Translation Result Object:', JSON.stringify(result));

        // Format response
        const detectedDisplay = getLangDisplayName(result.detected);
        const toDisplay = getLangDisplayName(langConfig.to);

        console.log(`📝 Detected: ${result.detected} (${detectedDisplay}), Target: ${langConfig.to} (${toDisplay})`);

        // Don't translate if same language
        if (result.detected === langConfig.to) {
            console.log('⚠️ Same language detected, but proceeding for debugging.');
            // return; 
        }

        // Determine bot language (vi if target is vi, else en)
        const botLang = langConfig.to === 'vi' ? 'vi' : 'en';

        const header = getMessage(botLang, 'translation_header');

        if (!result.text) {
            console.warn('❌ result.text is undefined before formatting!');
        }

        const response = `📘 **${header}** (${detectedDisplay} → ${toDisplay}):\n\n${result.text || 'Error: Empty translation'}`;

        // Discord message limit is 2000 characters
        if (response.length > 2000) {
            // Split into multiple messages
            const chunks = splitMessage(response, 1900);
            for (const chunk of chunks) {
                await message.reply(chunk);
            }
        } else {
            await message.reply(response);
        }
    } catch (error) {
        const langConfig = getUserLang(message.author.id) || { to: 'vi' };
        const botLang = langConfig.to === 'vi' ? 'vi' : 'en';
        const errorMsg = getMessage(botLang, 'translation_error');
        console.error(error); // Log full error
        await message.reply(`❌ ${errorMsg}: ${error.message}`);
    }
}

/**
 * Split long message into chunks
 * @param {string} text - Text to split
 * @param {number} maxLength - Max length per chunk
 * @returns {string[]} - Array of chunks
 */
function splitMessage(text, maxLength) {
    const chunks = [];
    let remaining = text;

    while (remaining.length > 0) {
        if (remaining.length <= maxLength) {
            chunks.push(remaining);
            break;
        }

        // Find a good breaking point (newline or space)
        let breakPoint = remaining.lastIndexOf('\n', maxLength);
        if (breakPoint === -1 || breakPoint < maxLength / 2) {
            breakPoint = remaining.lastIndexOf(' ', maxLength);
        }
        if (breakPoint === -1) {
            breakPoint = maxLength;
        }

        chunks.push(remaining.slice(0, breakPoint));
        remaining = remaining.slice(breakPoint).trim();
    }

    return chunks;
}

module.exports = { handleText };
