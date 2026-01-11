const { toLangCode, getLangDisplayName } = require('../utils/langMap');
const { getUserLang, setUserLang, setUserMode } = require('../utils/storage');
const { getMessage } = require('../utils/locales');

// Regex for language command: "Auto > Vietnamese", "English > Japanese"
const LANG_COMMAND_REGEX = /^([a-zA-ZÀ-ỹ\s]+)>\s*([a-zA-ZÀ-ỹ\s]+)$/i;

// Regex for mode command: "Mode: Text", "Mode: Image"
const MODE_COMMAND_REGEX = /^mode\s*:\s*(text|image)$/i;

/**
 * Check if message is a language command
 * @param {string} content - Message content
 * @returns {boolean}
 */
function isLanguageCommand(content) {
    return LANG_COMMAND_REGEX.test(content.trim());
}

/**
 * Check if message is a mode command
 * @param {string} content - Message content
 * @returns {boolean}
 */
function isModeCommand(content) {
    return MODE_COMMAND_REGEX.test(content.trim());
}

/**
 * Handle language or mode commands
 * @param {Message} message - Discord message
 * @param {string} type - 'language' or 'mode'
 */
async function handleCommand(message, type) {
    const content = message.content.trim();
    const langConfig = getUserLang(message.author.id) || { to: 'vi' };
    let botLang = langConfig.to === 'vi' ? 'vi' : 'en';

    if (type === 'language') {
        const match = content.match(LANG_COMMAND_REGEX);
        if (!match) {
            await message.reply(getMessage(botLang, 'syntax_error_lang'));
            return;
        }

        const fromName = match[1].trim();
        const toName = match[2].trim();

        const fromCode = toLangCode(fromName);
        const toCode = toLangCode(toName);

        if (!fromCode) {
            await message.reply(getMessage(botLang, 'lang_error_source') + `"${fromName}"`);
            return;
        }

        if (!toCode) {
            await message.reply(getMessage(botLang, 'lang_error_target') + `"${toName}"`);
            return;
        }

        if (toCode === 'auto') {
            await message.reply(getMessage(botLang, 'lang_error_auto_target'));
            return;
        }

        // Save user preference
        setUserLang(message.author.id, fromCode, toCode);

        // Update botLang for confirmation based on new target
        botLang = toCode === 'vi' ? 'vi' : 'en';

        const fromDisplay = getLangDisplayName(fromCode);
        const toDisplay = getLangDisplayName(toCode);

        await message.reply(`${getMessage(botLang, 'lang_set')}${fromDisplay} → ${toDisplay}`);
    }
    else if (type === 'mode') {
        const match = content.match(MODE_COMMAND_REGEX);
        if (!match) {
            await message.reply(getMessage(botLang, 'syntax_error_mode'));
            return;
        }

        const mode = match[1].toLowerCase();
        setUserMode(message.author.id, mode);

        const modeEmoji = mode === 'text' ? '📝' : '🖼️';
        const modeDesc = mode === 'text'
            ? getMessage(botLang, 'mode_desc_text')
            : getMessage(botLang, 'mode_desc_image');

        await message.reply(`${modeEmoji} ${getMessage(botLang, 'mode_set')}${modeDesc}`);
    }
}

module.exports = {
    handleCommand,
    isLanguageCommand,
    isModeCommand,
};
