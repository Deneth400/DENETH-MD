const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Function to fetch search results
async function xnxxs(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const results = [];
        
        $('div.mozaique').each((a, b) => {
          $(b).find('div.thumb').each((c, d) => {
            const url = baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/');
            const title = $(d).find('a').attr('title');
            const desc = $(d).find('p.metadata').text();
            results.push({ title, info: desc, link: url });
          });
        });

        resolve({ status: true, result: results });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}

// Command to display search results with numbered menu
cmd({
  pattern: "xnxx",
  alias: ["xnxxs"],
  use: '.xnxx <query>',
  react: "🔞",
  desc: "Search and DOWNLOAD VIDEOS from xnxx.",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('*Please provide a search term* 🔍');
    
    const res = await xnxxs(q);
    const data = res.result;
    if (data.length < 1) return reply("*I could not find anything 😑*");

    let message = `*X N X X - D O W N L O A D E R*\n\nReply with the number to select a video:\n\n`;
    data.forEach((v, i) => {
      message += `*${i + 1}.* ${v.title}\nInfo: ${v.info}\n\n`;
    });
    message += `> Powered by DENETH-MD\n\n`;

    // Send the list of videos
    const sentMessage = await conn.sendMessage(from, { text: message }, { quoted: mek });

    // Listener for the user's response
    conn.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];

      // Verify if the response matches the sent message context
      if (!message.message || !message.message.extendedTextMessage) return;
      if (message.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) return;

      const userReply = parseInt(message.message.extendedTextMessage.text.trim());
      if (isNaN(userReply) || userReply < 1 || userReply > data.length) {
        return reply("Invalid selection. Please reply with a valid number.");
      }

      // Fetch selected link based on user's choice
      const selectedVideo = data[userReply - 1];
      const downloadMessage = `*Downloading:* ${selectedVideo.title}\nPlease wait...`;
      await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

      // Use xdl function to fetch video and send the high-quality version
      const downloadInfo = await xdl(selectedVideo.link);
      await conn.sendMessage(from, { video: { url: downloadInfo.result.files.high }, caption: selectedVideo.title }, { quoted: mek });
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: '*Error!*' }, { quoted: mek });
  }
});

// Function to download video
async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const videoScript = $('#video-player-bg > script:nth-child(6)').html();
        
        const files = {
          low: (videoScript.match(/html5player.setVideoUrlLow\('(.*?)'\);/) || [])[1],
          high: (videoScript.match(/html5player.setVideoUrlHigh\('(.*?)'\);/) || [])[1]
        };
        
        resolve({ status: true, result: { files } });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}
