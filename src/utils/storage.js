const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/userPrefs.json');

// In-memory storage
let userPrefs = {};

/**
 * Load preferences from file
 */
function loadPrefs() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            userPrefs = JSON.parse(data);
            console.log(`📂 Loaded ${Object.keys(userPrefs).length} user preferences`);
        }
    } catch (error) {
        console.error('❌ Error loading preferences:', error);
        userPrefs = {};
    }
}

/**
 * Save preferences to file
 */
function savePrefs() {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(userPrefs, null, 2));
    } catch (error) {
        console.error('❌ Error saving preferences:', error);
    }
}

/**
 * Get user language settings
 * @param {string} userId - Discord user ID
 * @returns {{from: string, to: string}} - Language settings
 */
function getUserLang(userId) {
    const prefs = userPrefs[userId];
    if (prefs && prefs.from && prefs.to) {
        return { from: prefs.from, to: prefs.to };
    }
    return null; // Return null to indicate default should be used
}

/**
 * Set user language settings
 * @param {string} userId - Discord user ID
 * @param {string} from - Source language code
 * @param {string} to - Target language code
 */
function setUserLang(userId, from, to) {
    if (!userPrefs[userId]) {
        userPrefs[userId] = {};
    }
    userPrefs[userId].from = from;
    userPrefs[userId].to = to;
    savePrefs();
}

/**
 * Get user mode (text or image)
 * @param {string} userId - Discord user ID
 * @returns {string} - 'text' or 'image'
 */
function getUserMode(userId) {
    const prefs = userPrefs[userId];
    return prefs?.mode || 'text';
}

/**
 * Set user mode
 * @param {string} userId - Discord user ID
 * @param {string} mode - 'text' or 'image'
 */
function setUserMode(userId, mode) {
    if (!userPrefs[userId]) {
        userPrefs[userId] = {};
    }
    userPrefs[userId].mode = mode;
    savePrefs();
}

// Load preferences on startup
loadPrefs();

module.exports = {
    getUserLang,
    setUserLang,
    getUserMode,
    setUserMode,
};
