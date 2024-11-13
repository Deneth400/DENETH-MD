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

    const msg = `ＴＩＫＴＯＫ ＤＬ\n *• Title:* ${res.title}\n *• Date:* ${res.created_at}\n *• Duration:* ${res.video.duration}`;
    const wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;

    // Construct numbered options menu
    let message = `${msg}\n\nReply with the number of your choice:\n\n`;
    message += `1. Without Watermark\n`;
    message += `2. With Watermark\n`;
    message += `3. Audio\n\n${wm}`;

    // Send message with menu
    const sentMessage = await conn.sendMessage(from, { text: message }, { quoted: mek });

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
