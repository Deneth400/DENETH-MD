const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Search for videos on XNXX
async function xnxxs(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' }).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, { xmlMode: false });
      const title = [];
      const url = [];
      const desc = [];
      const results = [];
      
      // Collect video data from page
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

      // Prepare results
      for (let i = 0; i < title.length; i++) {
        results.push({ title: title[i], info: desc[i], link: url[i] });
      }

      resolve({ status: true, result: results });
    }).catch((err) => reject({ status: false, result: err }));
  });
}

cmd({
    pattern: "xnxx",
    alias: ["xnxxs"],
    use: '.xnxx <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from xnxx.",
    category: "search",
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
  try {
    if (!q) return reply('🚩 *Please provide a search query*');
    let res = await xnxxs(q);
    let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    const msg = `乂 X N X X - D O W N L O A D E R `;
    
    const data = res.result;
    if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });
    
    let resultsMessage = "Search Results:\n\n";
    data.forEach((v, index) => {
      resultsMessage += `${index + 1}. ${v.title}\nInfo: ${v.info}\nLink: ${v.link}\n\n`;
    });

    // Send message with results
    await conn.sendMessage(from, { text: resultsMessage }, { quoted: mek });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error !!*' }, { quoted: mek });
  }
});

// Download video from XNXX
async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: 'get' }).then((res) => res.text()).then((res) => {
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
    }).catch((err) => reject({ status: false, result: err }));
  });
}

cmd({
    pattern: "xnxxdown",
    alias: ["dlxnxx","xnxxdl"],
    react: '🍟',
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
  try {
    if (!q) return reply('*Please provide the video URL!*');
    let res = await xdl(q);
    let title = res.result.title;

    // Send video download link
    await conn.sendMessage(from, { video: { url: res.result.files.high }, caption: title }, { quoted: mek });
  } catch (e) {
    reply('*Error !!*');
    console.log(e);
  }
});
