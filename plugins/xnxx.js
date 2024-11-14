const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Function to fetch search results from XNXX
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

cmd({
  pattern: "xnxx",
  alias: ["xnxxs"],
  use: '.xnxx <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from XNXX.",
  category: "search",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');

    let res = await xnxxs(q);
    let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    const msg = `乂 X N X X - D O W N L O A D E R `;
    const data = res.result;

    if (data.length < 1) return await messageHandler.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: quotedMessage });

    let response = msg + '\nChoose a Number to Download a Video:\n';
    data.forEach((v, index) => {
      response += `${index + 1}. ${v.title}\n\n`;
    });

    response += '\n*Reply With The Number Of The Video You Want To Download.*';

    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: `https://1000logos.net/wp-content/uploads/2021/04/XNXX-logo.png` },
      caption: response,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: quotedMessage });

    const handleUserReply = async (update) => {
      const message = update.messages[0];

      // Ensure this message is a reply to the original prompt
      if (!message.message || !message.message.extendedTextMessage ||
        message.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
        return;
      }

      const userReply = message.message.extendedTextMessage.text.trim();
      let videoIndex = parseInt(userReply) - 1; // Get the index from the user's response

      if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= data.length) {
        return reply("🚩 *Please enter a valid number from the list.*");
      }

      let selectedVideo = data[videoIndex];
      let videoUrl = selectedVideo.link; // Direct video URL

      // Send the video to the user
      await messageHandler.sendMessage(from, {
        video: { url: videoUrl },
        caption: `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`
      }, { quoted: quotedMessage });

      // Remove this listener after processing
      messageHandler.ev.off("messages.upsert", handleUserReply);
    };

    // Attach the listener function to the message update event
    messageHandler.ev.on("messages.upsert", handleUserReply);
  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, { text: '🚩 *Error Occurred!*' }, { quoted: quotedMessage });
  }
});

// ------------------------ Video Download Handler ------------------------

async function xdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res, { xmlMode: false });
        const title = $('meta[property="og:title"]').attr('content');
        const videoScript = $('#video-player-bg > script:nth-child(6)').html();
        const videoUrl = videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);')[1];

        resolve({ status: true, result: { title, videoUrl } });
      })
      .catch((err) => reject({ status: false, result: err }));
  });
}

cmd({
  pattern: "xnxxdown",
  alias: ["dlxnxx", "xnxxdl"],
  react: '🍟',
  dontAddCommandList: true,
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('*Please give me the XNXX URL!*');

    let res = await xdl(q);
    let title = res.result.title;
    let videoUrl = res.result.videoUrl;

    // Send the video to the user
    await messageHandler.sendMessage(from, {
      video: { url: videoUrl },
      caption: title
    }, { quoted: quotedMessage });
  } catch (e) {
    reply('*Error !!*');
    console.log(e);
  }
});
