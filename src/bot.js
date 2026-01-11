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
        console.log(`✅ Bot đã sẵn sàng! Logged in as ${client.user.tag}`);
        console.log(`📊 Đang hoạt động trên ${client.guilds.cache.size} servers`);
    });

    // Message event
    client.on('messageCreate', async (message) => {
        try {
            await handleMessage(message);
        } catch (error) {
            console.error('❌ Lỗi xử lý tin nhắn:', error);
        }
    });

    // Error handling
    client.on('error', (error) => {
        console.error('❌ Discord client error:', error);
    });

    // Login
    if (!config.DISCORD_TOKEN || config.DISCORD_TOKEN === 'your_bot_token_here') {
        console.error('❌ Lỗi: Chưa cấu hình DISCORD_TOKEN trong file .env');
        process.exit(1);
    }

    client.login(config.DISCORD_TOKEN);
}

module.exports = { startBot };
