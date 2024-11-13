const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Function to search xnxx
async function xnxxs(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const title = [];
        const url = [];
        const desc = [];
        const results = [];
        $('div.mozaique').each(function (a, b) {
          $(b).find('div.thumb').each(function (c, d) {
            url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
          });
        });
        $('div.mozaique').each(function (a, b) {
          $(b).find('div.thumb-under').each(function (c, d) {
            desc.push($(d).find('p.metadata').text());
            $(d).find('a').each(function (e, f) {
              title.push($(f).attr('title'));
            });
          });
        });
        for (let i = 0; i < title.length; i++) {
          results.push({ title: title[i], info: desc[i], link: url[i] });
        }
        resolve({ status: true, result: results });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}

// Command for searching xnxx videos
cmd({
  pattern: "xnxx",
  alias: ["xnxxs"],
  use: '.xnxx <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from xnxx.",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');
    let res = await xnxxs(q);
    const wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    const data = res.result;

    if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

    // Send a numbered list of search results to the user
    let msg = `乂 X N X X - D O W N L O A D E R\n\n*Search results for:* ${q}\n\nSelect a video by typing its number:\n`;
    data.forEach((v, index) => {
      msg += `\n${index + 1}. *${v.title}*\n   Info: ${v.info}\n`;
    });
    msg += `\n\n${wm}`;

    await conn.sendMessage(from, { text: msg }, { quoted: mek });

    // Now wait for the user input for video selection
    conn.once('message', async (message) => {
      if (message.key.remoteJid !== from || !message.message || !message.message.conversation) return;

      const choice = parseInt(message.message.conversation.trim()) - 1;

      if (isNaN(choice) || choice < 0 || choice >= data.length) {
        return await reply("🚩 Invalid choice. Please reply with a valid number.");
      }

      const selectedVideo = data[choice];
      const downloadMessage = `*Downloading:* ${selectedVideo.title}\nPlease wait...`;

      await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

      // Proceed with video download
      let downloadRes = await xdl(selectedVideo.link);
      const downloadUrl = downloadRes.result.files.high;

      await conn.sendMessage(from, { video: { url: downloadUrl }, caption: selectedVideo.title }, { quoted: mek });
    });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error!*' }, { quoted: mek });
  }
});

// Function to download xnxx video
async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const title = $('meta[property="og:title"]').attr('content');
        const duration = $('meta[property="og:duration"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');
        const videoType = $('meta[property="og:video:type"]').attr('content');
        const videoWidth = $('meta[property="og:video:width"]').attr('content');
        const videoHeight = $('meta[property="og:video:height"]').attr('content');
        const info = $('span.metadata').text();
        const videoScript = $('#video-player-bg > script:nth-child(6)').html();
        const files = {
          low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
          high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
          HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
          thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
          thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
          thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
          thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]
        };
        resolve({
          status: true,
          result: { title, URL, duration, image, videoType, videoWidth, videoHeight, info, files }
        });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}

// Command for downloading xnxx video
cmd({
  pattern: "xnxxdown",
  alias: ["dlxnxx", "xnxxdl"],
  react: '🍟',
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('*Please give me a valid xnxx URL!*');
    let res = await xdl(q);
    let title = res.result.title;
    await conn.sendMessage(from, { video: { url: res.result.files.high }, caption: title }, { quoted: mek });
  } catch (e) {
    reply('*Error!*');
    console.log(e);
  }
});
