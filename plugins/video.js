const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "ytmp4",
  desc: "Download a YouTube video.",
  category: "media",
  react: "📹",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    const url = q.trim();
    if (!url) return reply("Please provide a valid YouTube video URL!");

    // Make a request to the Pink Venom API to fetch the download link
    const apiUrl = `https://api-pink-venom.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid and contains a download link
    if (response.data.status !== "success" || !response.data.result) {
      return reply("Could not retrieve the download link. Please check the URL or try again later.");
    }

    const videoDownloadLink = response.data.result;
    const videoTitle = response.data.title || "YouTube Video";

    // Send the download link to the user
    await messageHandler.sendMessage(from, {
      document: {
        url: videoDownloadLink
      },
      mimetype: 'video/mp4',
      fileName: `${videoTitle}.mp4`,
      caption: `Here is your download link for *${videoTitle}*.\n\nPowered by Pink Venom API`
    }, { quoted: quotedMessage });

    // React with success
    await messageHandler.sendMessage(from, {
      react: {
        text: '✅',
        key: quotedMessage.key
      }
    });

  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, {
      react: {
        text: '❌',
        key: quotedMessage.key
      }
    });
    reply("An error occurred while processing your request. Please try again later.");
  }
});
