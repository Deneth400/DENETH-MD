const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

cmd({
  pattern: "tiktoksearch",
  alias: ["tiks"],
  use: '.tiktoksearch <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from TikTok.",
  category: "search",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');

    // Fetch TikTok search results using an external API
    let mal = await fetchJson('https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=' + q);
    let data = mal.data;

    let message = `ＴＩＫＴＯＫ - S E A R C H \n\n*Results for:* ${q}\n\n`;

    if (data.length < 1) return await messageHandler.sendMessage(from, {image: {url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/Tiktok.jpg?raw=true`}, text: "🚩 *I couldn't find anything :(*" }, { quoted: quotedMessage });

    let response = message + 'Choose a number to download a video:\n';
    data.forEach((v, index) => {
      response += `${index + 1}. ${v.title}\n`;
    });

    response += '\n*Reply with the number of the video you want to download.*';

    // Send results with numbered options to download
    const sentMessage = await messageHandler.sendMessage(from, { text: response }, { quoted: quotedMessage });

    // Define a listener function for handling the user's reply
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
      let videoUrl = selectedVideo.nowm; // Direct video URL

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
