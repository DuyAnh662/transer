const { handleCommand, isLanguageCommand, isModeCommand } = require('./commandHandler');
const { handleText } = require('./textHandler');
const { handleImage } = require('./imageHandler');
const config = require('../config');

/**
 * Main message dispatcher
 * Routes messages to appropriate handlers
 * @param {Message} message - Discord message object
 */
async function handleMessage(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    const content = message.content.trim();

    // Check for language command (e.g., "Auto > Vietnamese")
    if (isLanguageCommand(content)) {
        await handleCommand(message, 'language');
        return;
    }

    // Check for mode command (e.g., "Mode: Text")
    if (isModeCommand(content)) {
        await handleCommand(message, 'mode');
        return;
    }

    // Check for image attachments
    const imageAttachment = message.attachments.find((att) => {
        const ext = att.name?.split('.').pop()?.toLowerCase();
        return config.SUPPORTED_IMAGE_FORMATS.includes(ext);
    });

    if (imageAttachment) {
        await handleImage(message, imageAttachment);
        return;
    }

    // If there's text content, translate it
    if (content.length > 0) {
        // Ignore very short messages (likely not meant for translation)
        if (content.length < 2) return;

        // Ignore messages that look like commands for other bots
        if (content.startsWith('!') || content.startsWith('/') || content.startsWith('.')) {
            return;
        }

        await handleText(message);
    }
}

module.exports = { handleMessage };
