const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

cmd({
  pattern: "ytv",
  desc: "Download YouTube videos with quality options.",
  category: "download",
  react: '🎬',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    // Ensure the user has provided a video name or URL
    if (!q) {
      return reply("Please provide a video name or URL!");
    }

    // Search for the video using yt-search
    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("No video found matching your query.");
    }

    const videoData = searchResults.videos[0]; // Get the first video from search results

    // Prepare the message with video details
    let videoDetailsMessage = `𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n`;
    videoDetailsMessage += `✒ ᴛɪᴛʟᴇ : ${videoData.title}\n`;
    videoDetailsMessage += `👀 ᴠɪᴇᴡꜱ : ${videoData.views}\n`;
    videoDetailsMessage += `⏰ ᴅᴜʀᴀᴛɪᴏɴ : ${videoData.timestamp}\n`;
    videoDetailsMessage += `📆 ᴜᴘʟᴏᴀᴅᴇᴅ ᴏɴ : ${videoData.ago}\n`;
    videoDetailsMessage += `🎬 ᴄʜᴀɴɴᴇʟ : ${videoData.author.name}\n`;
    videoDetailsMessage += `🖇️ ᴜʀʟ : ${videoData.url}\n\n`;
    videoDetailsMessage += `*REPLY WITH DOWNLOAD OPTION* 🚀 \n\n`;
    videoDetailsMessage += `𝟭 | 𝗦𝗗 𝟯𝟲𝟬𝗽\n`;
    videoDetailsMessage += `𝟮 | 𝗦𝗗 𝟰𝟴𝟬𝗽\n`;
    videoDetailsMessage += `𝟯 | 𝗛𝗗 𝟳𝟮𝟬𝗽\n`;
    videoDetailsMessage += `𝟰 | 𝗙𝗛𝗗 𝟭𝟬𝟴𝟬𝗽\n\n`;
    videoDetailsMessage += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®\n`;

    // Send video details and options (you can also send a thumbnail or any other media)
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: videoData.thumbnail },
      caption: videoDetailsMessage,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: quotedMessage });

    // Listen for the user's reply to the download options
    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];

      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();

      // If the reply matches the sent options, fetch the download link based on quality
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        let quality;
        switch (userReply) {
          case '1': quality = '360p'; break;
          case '2': quality = '480p'; break;
          case '3': quality = '720p'; break;
          case '4': quality = '1080p'; break;
          default:
            await messageHandler.sendMessage(from, {
              react: {
                text: '❌',
                key: quotedMessage.key
              }
            });
            return reply("Invalid option. Please select a valid option🔴");
        }

        try {
          // Fetch download link for the selected quality
          const apiUrl = `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(videoData.url)}&quality=${quality}`;
          console.log(`Fetching download link from API URL: ${apiUrl}`);
          const downloadLinkResult = await fetchJson(apiUrl);
          console.log("API Response:", downloadLinkResult);

          // Access the dl_link directly from the response
          if (downloadLinkResult && downloadLinkResult.dl_link) {
            const downloadLink = downloadLinkResult.dl_link;
            await messageHandler.sendMessage(from, {
              video: {
                url: downloadLink
              },
              mimetype: 'video/mp4',
              caption: `${videoData.title} (${quality})\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
            }, { quoted: quotedMessage });

            await messageHandler.sendMessage(from, {
              react: {
                text: '✅',
                key: quotedMessage.key
              }
            });
          } else {
            reply("Failed to retrieve download link. Please try another quality or check the video URL.");
          }
        } catch (error) {
          console.error("Error fetching download link:", error);
          reply("An error occurred while fetching the download link. Please try again.");
        }
      }
    });
  } catch (error) {
    console.error(error);
    // Handle general errors
    await messageHandler.sendMessage(from, {
      react: {
        text: '❌',
        key: quotedMessage.key
      }
    });
    reply("An error occurred while processing your request.");
  }
});
