const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');
const { handleMessage } = require('./handlers/messageHandler');

/**
 * Start the Discord bot
 */
function startBot() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages,
        ],
        partials: [Partials.Channel], // For DMs
    });

    // Bot ready event
    client.once('ready', () => {
        console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
        console.log(`📊 Currently operating on ${client.guilds.cache.size} servers`);
    });

    // Message event
    client.on('messageCreate', async (message) => {
        try {
            await handleMessage(message);
        } catch (error) {
            console.error('❌ Message processing error:', error);
        }
    });

    // Error handling
    client.on('error', (error) => {
        console.error('❌ Discord client error:', error);
    });

    // Login
    if (!config.DISCORD_TOKEN || config.DISCORD_TOKEN === 'your_bot_token_here') {
        console.error('❌ Error: DISCORD_TOKEN not configured in the .env file');
        process.exit(1);
    }

    client.login(config.DISCORD_TOKEN);
}

module.exports = { startBot };
