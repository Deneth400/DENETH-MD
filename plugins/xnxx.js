const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

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
        $('div.mozaique').each(function(a, b) {
          $(b).find('div.thumb').each(function(c, d) {
            url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
          });
        });
        $('div.mozaique').each(function(a, b) {
          $(b).find('div.thumb-under').each(function(c, d) {
            desc.push($(d).find('p.metadata').text());
            $(d).find('a').each(function(e, f) {
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

// Command to search and download videos
cmd({
  pattern: "xnxx",
  alias: ["xnxxs"],
  use: '.xnxx <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from xnxx.",
  category: "search",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');
    let res = await xnxxs(q);
    const data = res.result;

    if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

    // Create a numbered list for the user to choose from
    let response = '乂 X N X X - D O W N L O A D E R\n\nChoose a video by number:\n';
    data.forEach((v, index) => {
      response += `${index + 1}. ${v.title} - Info: ${v.info}\n`;
    });

    response += '\n*Reply with the number of the video you want to download.*';

    await conn.sendMessage(from, { text: response }, { quoted: mek });

    // Listen for the user's reply (this part is fixed)
    conn.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();
      const videoIndex = parseInt(userReply) - 1;

      if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= data.length) {
        return reply("🚩 *Please reply with a valid number from the list.*");
      }

      const selectedVideo = data[videoIndex];
      let videoUrl = selectedVideo.link; 

      // Download and send the selected video
      let videoRes = await xdl(videoUrl);
      let title = videoRes.result.title;

      await conn.sendMessage(from, { video: { url: videoRes.result.files.high }, caption: title }, { quoted: mek });
    });

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching videos!*' }, { quoted: mek });
  }
});

// Function to fetch the download link from the video page
async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const title = $('meta[property="og:title"]').attr('content');
        const videoScript = $('#video-player-bg > script:nth-child(6)').html();
        const videoUrl = videoScript.match(/html5player.setVideoUrlHigh\('([^']+)'\)/);

        if (!videoUrl) {
          return reject({ status: false, result: 'Failed to extract video URL' });
        }

        resolve({ status: true, result: { title, files: { high: videoUrl[1] } } });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}
