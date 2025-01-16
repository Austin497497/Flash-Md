const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU0h0Z2lYbDUrYnZVSHRyVEYyRTlkZFh2QzdNRUVoTjJxSjh4L09kUXdHbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidkJKaFRabFJrWERHMkZYdkM2UFdEa29uWXpubkQ5bml3SVVCc2ViTmhpWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpT3QweEMxZ0N6UnBoUE0wQUhrK1RiZXRzbTl6YlpPcEhZMEdrMnY3aFVJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJySGNvYkZKQmFvamd5U0tYRHpTWGFjK201enBsTGxHVThhWXlGVlFZTHdFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdMOVptVWc3OHZoeGoyRHdZWmpwVjRLRm0vOGpickRQOXdpOEFWZElQMzg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InR1N1BZelpsWmRCNTVVdzM2UERWWGVEWE5jeUNsN0szUE56cFRRTlFpUjg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUJsSzc1emh5QzlYSlJ2SUVpWks2Y0doWWt6aXNBdUdJbTRoaGRiTDZIdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOXBqY3dqOGlHZWU1RkhPVW9XbStmWHlKUmNJcWllRm9aenI0UFpDOUNGND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldFeTdiQ1pwTkJHV3BDanUyZ0ZUck5XV2xJeUxrVkxjaUoyNW9IK1BydnlTMU8xNkhFQ253c2s2SlpzSU1aK2h5c1ZpaEMxWitmUm9qbmFFS0xMVEJnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI4LCJhZHZTZWNyZXRLZXkiOiJRd3pCQmlzNXJEYnlXcE51Mk03dE4wZ3RYUndScHZRcitRYUJCRVJpZTZBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIwOGl2RU5VUFRIeWp3STFXYnp6emx3IiwicGhvbmVJZCI6IjI1ODVkMTY4LWE3NzctNGFhZS05YjE5LWVjZGEwYjJjOTFlNCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2QVJ0Y1ZiTWdoRFhCOXlVbHBjaDFmc2dMbjg9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiblhzTEVzaWU4NDdVZzJxOVdhVzNYNlRDNEdZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjRaTUFaQUg2IiwibWUiOnsiaWQiOiIyNTQ3NTc3MjU2NTY6OTNAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0l5VXhNTUVFSUtZcEx3R0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IllBM0tFMmtKNlZaMjQvWHYvb2JJdlRjRkE2MzdQUnNubkpqQWtseEwxMFk9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjY0cjRjTy8yODRpckVqNXdUTVZMZGprZ2VNQk5kV1EzWjBGcWp6WFVjbnpLM2ZLUC91M3hNYm1mYTNWcVZ0U1B5Zm9NdTMyNkRyamNVR3hDdjFoTkFnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJGNlkydEVMaFhmUStYMysweXJkSWhTaEhMLzFPdktIMVNleVNDVS83aXNzb3pRMnFhV2xocG1GRm5WSDhjUWJGZGRFNHllclp2R2hoTTZ3aXpCZmFEZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc1NzcyNTY1Njo5M0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJXQU55aE5wQ2VsV2R1UDE3LzZHeUwwM0JRT3QrejBiSjV5WXdKSmNTOWRHIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzM3MDM0NzY3LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUxOdiJ9',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "★DRACO★",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254757725656",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'recording',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
