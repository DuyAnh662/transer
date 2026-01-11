require('dotenv').config();
const { startBot } = require('./bot');

console.log('🚀 Launch the Discord translation bot...');
const config = require('./config');
console.log(`🔌 Translation Service: ${config.LIBRETRANSLATE_URL}`);

startBot();