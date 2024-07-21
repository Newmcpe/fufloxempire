const API_ID = parseInt(process.env.API_ID!);
const API_HASH = process.env.API_HASH!;
const TELEGRAM_BOT_PANEL_TOKEN = process.env.TELEGRAM_BOT_PANEL_TOKEN;
const LZT_TOKEN = process.env.LZT_TOKEN;

if (isNaN(API_ID) || !API_HASH) {
    throw new Error('API_ID or API_HASH not set!');
}

export { API_HASH, API_ID, TELEGRAM_BOT_PANEL_TOKEN, LZT_TOKEN };
