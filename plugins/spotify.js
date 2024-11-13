const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');
let ayo = `© 𝖰𝗎𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

// Spotify Search Command with Numbered Menu
cmd({
  pattern: "spotify",
  alias: ["spot"],
  use: '.spotify <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD music from Spotify.",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please provide search terms.*');
    const res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
    const wm = `© 𝖰𝗎𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

    if (!res.result || res.result.length < 1) {
      return await conn.sendMessage(from, { text: "🚩 *No results found.*" }, { quoted: mek });
    }

    // Display results with numbered menu
    let msg = `乂 S P O T I F Y - D L\n\n*Search:* ${q}\n\nSelect a song by typing its number:\n`;
    res.result.forEach((v, index) => {
      msg += `\n${index + 1}. *${v.name}*\n   Artist: ${v.artists}\n   Duration: ${v.duration_ms} ms\n`;
    });
    msg += `\n\n${wm}`;

    const sentMessage = await conn.sendMessage(from, { text: msg }, { quoted: mek });

    // Listen for response with song selection
    conn.ev.once("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.conversation) return;
      if (message.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) return;

      const choice = parseInt(message.message.conversation.trim()) - 1;
      if (isNaN(choice) || choice < 0 || choice >= res.result.length) {
        return reply("Invalid choice. Please reply with a valid number.");
      }

      const selectedSong = res.result[choice];
      const downloadMessage = `*Downloading:* ${selectedSong.name}\nPlease wait...`;
      await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

      const downloadMenu = `Select the format:\n1. Document\n2. Audio\n\n${wm}`;
      const formatMessage = await conn.sendMessage(from, { text: downloadMenu }, { quoted: mek });

      // Listen for format selection
      conn.ev.once("messages.upsert", async (formatUpdate) => {
        const formatMessage = formatUpdate.messages[0];
        if (!formatMessage.message || !formatMessage.message.conversation) return;
        if (formatMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) return;

        const formatChoice = parseInt(formatMessage.message.conversation.trim());
        const fileBuffer = await getBuffer(selectedSong.link);

        if (formatChoice === 1) {
          await conn.sendMessage(from, { document: fileBuffer, mimetype: 'audio/mpeg', fileName: selectedSong.name + '.mp3', caption: ayo }, { quoted: mek });
        } else if (formatChoice === 2) {
          await conn.sendMessage(from, { audio: fileBuffer, mimetype: 'audio/mpeg' }, { quoted: mek });
        } else {
          reply("Invalid format choice. Please reply with 1 or 2.");
        }
      });
    });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error!*' }, { quoted: mek });
  }
});
