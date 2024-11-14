const config = require('../config')
const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions');
const fs = require('fs');

cmd({
    pattern: "jid",
    desc: "Get the bot's JID.",
    category: "owner",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    // Ensure `conn.user` contains the bot's information
    // `conn.user.jid` may need to be accessed in a different way based on your setup.
    // Common way to access JID in WhatsApp Web API-like clients:
    const botJID = conn.user ? conn.user.id : conn.info.wid;

    reply(`🤖 *Bot JID:* ${botJID}`);
});
