const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

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

    if (!data || data.length === 0) {
      return await messageHandler.sendMessage(from, { text: "🚩 *No results found :(*" }, { quoted: quotedMessage });
    }

    let message = `𝗫𝗩𝗜𝗗𝗘𝗢 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n\nResults for "${q}":\n\n`;
    let options = '';

    data.forEach((video, index) => {
      options += `${index + 1}. ${video.title} (Duration: ${video.duration})\n\n`;
    });

    message += `${options}Reply with the number of the video you want to download.`;

    // Send message with search results
    const sentMessage = await messageHandler.sendMessage(from, {
      text: message,
      image: { url: `https://logohistory.net/wp-content/uploads/2023/06/XVideos-Logo-2007-1024x576.png` },
    }, { quoted: quotedMessage });

    // Define the listener function for user reply to select a video
    const handleUserReply = async (update) => {
      const userMessage = update.messages[0];

      // Ensure this message is a reply to the original prompt
      if (!userMessage.message.extendedTextMessage ||
          userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
        return;
      }

      const userReply = userMessage.message.extendedTextMessage.text.trim();
      const videoIndex = parseInt(userReply) - 1; // Convert reply to an index

      if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= data.length) {
        return reply("🚩 *Please enter a valid number from the list.*");
      }

      const selectedVideo = data[videoIndex];

      // Fetch direct video URL for downloading
      const downloadResponse = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/download?url=${selectedVideo.url}`);
      const videoUrl = downloadResponse.url;

      if (!videoUrl) {
        return reply("🚩 *Failed to fetch video. Try a different selection.*");
      }

      // Send the selected video to the user
      await messageHandler.sendMessage(from, { 
        video: { url: videoUrl },
        caption: `> Downloaded via DENETH-MD Bot\n${selectedVideo.title}\nDuration: ${selectedVideo.duration}`,
      }, { quoted: quotedMessage });

      // Remove listener after handling the reply
      messageHandler.ev.off("messages.upsert", handleUserReply);
    };

    // Attach the listener function to the message update event
    messageHandler.ev.on("messages.upsert", handleUserReply);

  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, { text: '🚩 *An error occurred during the process!*' }, { quoted: quotedMessage });
  }
});
