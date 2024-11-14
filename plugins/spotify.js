const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

// Store session information for ongoing interactions
let session = {};

cmd({
  pattern: "spotify",
  alias: ["spot"],
  use: '.spotify <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD SONGS from Spotify.",
  category: "download",
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');

    // Fetch Spotify search results from the API
    let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
    let data = res.result;

    // If no results, send a failure message
    if (data.length < 1) return await messageHandler.sendMessage(from, { text: "🚩 *I Couldn't Find Anything 🙄*" }, { quoted: quotedMessage });

    let message = `𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗦𝗘𝗔𝗥𝗖𝗛\n\n_Search Results for_ "${q}":\n\n`;
    let options = '';

    // Create a list of search results
    data.forEach((v, index) => {
      options += `${index + 1}. ${v.name} (Artist: ${v.artists})\n`;
    });

    message += options;
    message += `\n❗ *You Can Reply To A Single Number From This Command To Get The Song You Want. (Example: 1)*`;
    message += `\n❗ *You Can Reply Multiple Numbers To Get Several Songs. (Example: 1,2,3)*`; 
    message += `\n\n> Powered by DENETH-xd Tech®`;

    // Send the list of search results to the user
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: `https://upload.wikimedia.org/wikipedia/commons/6/6b/Spotify_Logo.png` },
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: quotedMessage });

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
      const songIndexes = userReply.split(',').map(x => parseInt(x.trim()) - 1); // Convert reply to an array of indexes

      // Check if all selected indexes are valid
      for (let index of songIndexes) {
        if (isNaN(index) || index < 0 || index >= data.length) {
          return reply("🚩 *Please Enter Valid Numbers From The List.*");
        }
      }

      // Fetch and send songs for each valid index
      for (let index of songIndexes) {
        const selectedSong = data[index];

        try {
          // Send the selected song to the user
          await messageHandler.sendMessage(from, {
            audio: { url: selectedSong.download }, // Direct song URL for download
            caption: `${selectedSong.name}\nArtist: ${selectedSong.artists}\n\n> Powered by DENETH-xd Tech®`,
          }, { quoted: quotedMessage });
        } catch (err) {
          console.error(err);
          return reply(`🚩 *An Error Occurred While Downloading "${selectedSong.name}".*`);
        }
      }

      // After a selection, clear the session for that user
      delete session[from];
    };

    // Attach the listener for user replies
    messageHandler.ev.on("messages.upsert", handleUserReply);

  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, { text: '🚩 *Error Occurred During The Process!*' }, { quoted: quotedMessage });
  }
});
