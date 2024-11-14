const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

let needus = "*Please give me a TikTok URL!*";

// Function to fetch download options for TikTok videos
async function dlPanda(url) {
  try {
    const response = await fetch(`https://dlpanda.com/id?url=${url}&token=G7eRpMaa`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = { image: [], video: [] };

    $("div.hero.col-md-12.col-lg-12.pl-0.pr-0 img, div.hero.col-md-12.col-lg-12.pl-0.pr-0 video").each(function () {
      const element = $(this);
      const isVideo = element.is("video");
      const src = isVideo ? element.find("source").attr("src") : element.attr("src");
      const fullSrc = src.startsWith("//") ? "https:" + src : src;
      results[isVideo ? "video" : "image"].push({ src: fullSrc });
    });
    return results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Command to display TikTok download options with a numbered menu
cmd({
  pattern: "tt",
  alias: ["tiktok"],
  react: '💫',
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return await reply(needus);

    const res = await fetchJson('https://api.tiklydown.eu.org/api/download?url=' + q);
    if (!res || !res.video) return reply("Unable to fetch download options.");

    const msg = `𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n✒ Tɪᴛʟᴇ: ${res.title}\n📅 Dᴀᴛᴇ: ${res.created_at}\n⏰ ᴅᴜʀᴀᴛɪᴏɴ: ${res.video.duration}`;
    const wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

    // Construct numbered options menu
    let message = `${msg}\n\nREPLY THE DOWNLOAD OPTION\n\n`;
    message += `𝟭 | 𝗪𝗜𝗧𝗛𝗢𝗨𝗧 𝗪𝗔𝗧𝗘𝗥𝗠𝗔𝗥𝗞\n`;
    message += `𝟮 | 𝗪𝗜𝗧𝗛 𝗪𝗔𝗧𝗘𝗥𝗠𝗔𝗥𝗞\n`;
    message += `𝟯 | 𝗔𝗨𝗗𝗜𝗢\n\n${wm}`;

    // Send message with menu
    const sentMessage = await conn.sendMessage(from, {
            image: res.video.cover,
            caption: message,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });
    // Listen for the user's reply
    conn.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;
      if (message.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) return;

      const userChoice = message.message.extendedTextMessage.text.trim();
      let url;
      
      switch (userChoice) {
        case '1':
          url = res.video.noWatermark;
          break;
        case '2':
          url = res.video.watermark;
          break;
        case '3':
          url = res.music.play_url;
          break;
        default:
          return reply("Invalid choice. Please reply with a valid number.");
      }

      const downloadMessage = `*Downloading:* ${res.title}\nPlease wait...`;
      await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

      // Send media based on selection
      if (userChoice === '3') {
        await conn.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: mek });
      } else {
        await conn.sendMessage(from, { video: { url }, caption: wm }, { quoted: mek });
      }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: '*Error!*' }, { quoted: mek });
  }
});
