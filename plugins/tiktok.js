const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fs = require('fs-extra')
const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
let needus = "*Please give me a tiktok url!*" 

//========================================================================================
async function dlPanda(url) {
  try {
    const response = await fetch(`https://dlpanda.com/id?url=${url}&token=G7eRpMaa`),
      html = await response.text(),
      $ = cheerio.load(html),
      results = {
        image: [],
        video: []
      };
    return $("div.hero.col-md-12.col-lg-12.pl-0.pr-0 img, div.hero.col-md-12.col-lg-12.pl-0.pr-0 video").each(function() {
      const element = $(this),
        isVideo = element.is("video"),
        src = isVideo ? element.find("source").attr("src") : element.attr("src"),
        fullSrc = src.startsWith("//") ? "https:" + src : src;
      results[isVideo ? "video" : "image"].push({
        src: fullSrc,
        width: element.attr("width"),
        ...isVideo ? {
          type: element.find("source").attr("type"),
          controls: element.attr("controls"),
          style: element.attr("style")
        } : {}
      });
    }), results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//==================================================================

cmd({
    pattern: "tt",
    alias: ["tiktok"],
    react: '💫',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return await  reply(needus)
  let res = await fetchJson('https://api.tiklydown.eu.org/api/download?url='+q)
  let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`
  const msg = `ＴＩＫＴＯＫ ＤＬ
  *• Title :* ${res.title}
  *• Date:* ${res.created_at}
  *• Duration :* ${res.video.duration}

  `
  
  // Numbered menu for downloads
  let downloadMenu = `Please choose the download option:\n`;
  downloadMenu += `1. Download Without Watermark\n`;
  downloadMenu += `2. Download With Watermark\n`;
  downloadMenu += `3. Download Audio (MP3)\n\n`;
  downloadMenu += `Reply with the number of your choice.`;

  // Send the download menu
  await conn.sendMessage(from, {
    image: { url: res.video.cover },
    caption: msg + downloadMenu
  }, { quoted: mek });

  // Listen for user's reply to the download options
  conn.ev.on("messages.upsert", async (update) => {
    const message = update.messages[0];
    if (!message.message || !message.message.extendedTextMessage) return;
    
    const userReply = message.message.extendedTextMessage.text.trim();

    if (message.message.extendedTextMessage.contextInfo.stanzaId === mek.key.id) {
      switch (userReply) {
        case '1':
          // Send video without watermark
          await conn.sendMessage(from, { video: { url: res.video.noWatermark }, caption: wm }, { quoted: mek });
          break;

        case '2':
          // Send video with watermark
          await conn.sendMessage(from, { video: { url: res.video.watermark }, caption: wm }, { quoted: mek });
          break;

        case '3':
          // Send audio (MP3)
          await conn.sendMessage(from, { audio: { url: res.music.play_url }, mimetype: 'audio/mpeg' }, { quoted: mek });
          break;

        default:
          await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
          reply("Invalid option. Please reply with a valid number (1, 2, or 3).");
          break;
      }
    }
  });

  // Mark as done
  await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

} catch (e) {
  if (!q) return reply('🚩 *Please give me a tiktok url*');
  const data = await dlPanda(q);
  let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;

  if (0 === data.video.length)
    for (let i = 0; i < data.image.length; i++) await conn.sendMessage(from, { image: { url: data.image[i].src }, caption: wm }, { quoted: mek });
  else
    for (let i = 0; i < data.video.length; i++) await conn.sendMessage(from, { video: { url: data.video[i].src }, caption: wm }, { quoted: mek });

  console.log(e);
}
});

//===========================================================================
cmd({
    pattern: "ttdl",
    alias: ["tiktokdl"],
    react: '💫',
    dontAddCommandList: true,
    use: '.tt1 <tiktok link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return await reply(needus);
  let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;

  await conn.sendMessage(from, { video: { url: q }, caption: wm }, { quoted: mek });
  await conn.sendMessage(from, { react: { text: '✅', key: mek.key }});
} catch (e) {
  reply('*Error !*');
  console.log(e);
}
});
//==============================================================================

cmd({
    pattern: "tikmp3",
    alias: ["tiktokmp3"],
    react: '💫',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return await reply(needus);
  conn.sendMessage(from, { audio: { url: q }, mimetype: 'audio/mpeg' }, { quoted: mek });
} catch (e) {
  reply('*Error !*');
  console.log(e);
}
});
