const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

cmd({
  pattern: "xvideo",
  alias: ["xvid"],
  use: '.xvideo <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from xvideos.",
  category: "search",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please provide search terms*');
    
    // Fetch xvideos search results from the API
    let response = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/search?query=${q}`);
    let data = response.result;

    let message = `𝗫𝗩𝗜𝗗𝗘𝗢 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n\n» ʀᴇꜱᴜʟᴛꜱ for "${q}"\n\n`;

    if (data.length < 1) return await messageHandler.sendMessage(from, { text: "🚩 *No results found :(*" }, { quoted: quotedMessage });

    // Display numbered options to download videos
    let resultList = message + 'Choose a number to download:\n';
    data.forEach((v, index) => {
      resultList += `${index + 1}. ${v.title}\nInfo: ${v.duration}\n\n`;
    });
    resultList += '\n*Reply with the number of the video you want to download.*';

    // Send results to the user
    const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: `https://logohistory.net/wp-content/uploads/2023/06/XVideos-Logo-2007-1024x576.png` },
            caption: resultList,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: quotedMessage });

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
      let videoUrl = selectedVideo.url; // Direct video URL

      // Send the video to the user
      await messageHandler.sendMessage(from, { 
        video: { url: videoUrl }, 
        caption: `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®` 
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
