const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

// Store session information for ongoing interactions
let session = {};

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
    if (!q) return reply('🚩 *Please provide search terms.*');

    // Fetch TikTok search results from the API
    let res = await fetchJson(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${q}`);
    let data = res.data;
    
    let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
    const msg = `乂 *TIKTOK SEARCH RESULTS*`;

    // If no results, send a failure message
    if (data.length < 1) return await messageHandler.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: quotedMessage });

    let message = `Search Results for "${q}":\n\n`;
    let options = '';

    // Create a list of video results
    data.forEach((v, index) => {
      options += `${index + 1}. ${v.title} (Creator: ${v.creator})\n`;
    });

    message += options;
    message += `\nPlease reply with the number(s) of the video(s) you want to download, separated by commas (e.g., 1, 3, 5).`;

    // Send the list of search results to the user
    const sentMessage = await messageHandler.sendMessage(from, { text: message, image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/Tiktok.jpg?raw=true` } }, { quoted: quotedMessage });

    // Store session information for the user
    session[from] = {
      searchResults: data,
      messageId: sentMessage.key.id,  // Store message ID for future reference
    };

    // Function to handle the user reply
    const handleUserReply = async (update) => {
      const userMessage = update.messages[0];

      // Ensure this message is a reply to the original prompt
      if (!userMessage.message.extendedTextMessage ||
          userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
        return;
      }

      const userReply = userMessage.message.extendedTextMessage.text.trim();
      const videoIndexes = userReply.split(',').map(x => parseInt(x.trim()) - 1); // Convert reply to an array of indexes

      // Check if all selected indexes are valid
      for (let index of videoIndexes) {
        if (isNaN(index) || index < 0 || index >= data.length) {
          return reply("🚩 *Please enter valid numbers from the list.*");
        }
      }

      // Fetch and send videos for each valid index
      for (let index of videoIndexes) {
        const selectedVideo = data[index];

        try {
          // Send the selected video to the user
          await messageHandler.sendMessage(from, {
            video: { url: selectedVideo.nowm }, // Direct video URL for download
            caption: `> Downloaded via DENETH-MD Bot\n${selectedVideo.title}\nCreator: ${selectedVideo.creator}`,
          }, { quoted: quotedMessage });
        } catch (err) {
          console.error(err);
          return reply(`🚩 *An error occurred while downloading "${selectedVideo.title}".*`);
        }
      }

      // After a selection, clear the session for that user (this is important to prevent unwanted interactions)
      delete session[from];
    };

    // Attach the listener for user replies
    messageHandler.ev.on("messages.upsert", handleUserReply);

  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, { text: '🚩 *Error occurred during the process!*' }, { quoted: quotedMessage });
  }
});

// Download video command (for direct URL input)
cmd({
  pattern: "ttsdl",
  alias: ["tiktakdown", "tiktokdl"],
  react: '🍟',
  dontAddCommandList: true,
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('*Please provide a TikTok video URL!*');
    
    // Fetch the download link for the provided TikTok URL
    let res = await fetchJson(`https://apis-starlights-team.koyeb.app/starlight/tiktokdownload?url=${q}`);
    let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

    // Send the video to the user
    await messageHandler.sendMessage(from, {
      video: { url: res.url }, // Direct download URL
      caption: wm
    }, { quoted: quotedMessage });

  } catch (error) {
    reply('*Error occurred during the download process!*');
    console.log(error);
  }
});
