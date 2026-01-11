require('dotenv').config();
const { startBot } = require('./bot');

console.log('🚀 Khởi động Discord Translation Bot...');
const config = require('./config');
console.log(`🔌 Translation Service: ${config.LIBRETRANSLATE_URL}`);

startBot();
