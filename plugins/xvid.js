const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

cmd({
  pattern: "xvideo",
  alias: ["xvid"],
  use: '.xvid <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from xvideos.",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');
    
    let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/search?query=' + q);
    const wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    const msg = `乂 X V I D - D O W N L O A D E R `;
    const data = res.result;

    if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

    let response = 'Choose a video to download by number:\n\n';
    data.forEach((v, index) => {
      response += `${index + 1}. ${v.title} - Info: ${v.duration}\n`;
    });

    response += '\n*Reply with the number of the video you want to download.*';

    await conn.sendMessage(from, { text: response }, { quoted: mek });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error occurred while searching for videos!*' }, { quoted: mek });
  }
});

//------------------------dl---------------
cmd({
  pattern: "xvideodown",
  alias: ["xviddl", "xvideodl"],
  react: '🍟',
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('*Please reply with the number of the video to download!*');
    
    let videoIndex = parseInt(q) - 1;
    if (isNaN(videoIndex) || videoIndex < 0) return reply('*Invalid selection! Please provide a valid number.*');
    
    let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/search?query=' + q);
    const video = res.result[videoIndex];
    
    if (!video) return reply('*Video not found!*');
    
    // Fetch the video download link
    let downloadRes = await fetchJson('https://raganork-network.vercel.app/api/xvideos/download?url=' + video.url);
    
    const wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    
    await conn.sendMessage(from, { video: { url: downloadRes.url }, caption: wm }, { quoted: mek });
  } catch (e) {
    console.log(e);
    reply('*Error occurred while downloading the video!*');
  }
});
