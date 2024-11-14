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

    // Fetch search results using yt-search
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
    videoDetailsMessage += `*1 - 144p 🎥*\n`;
    videoDetailsMessage += `*2 - 240p 🎥*\n`;
    videoDetailsMessage += `*3 - 360p 🎥*\n`;
    videoDetailsMessage += `*4 - 480p 🎥*\n`;
    videoDetailsMessage += `*5 - 720p 🎥*\n\n`;
    videoDetailsMessage += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1®`;

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
          case '1': quality = '144p'; break;
          case '2': quality = '240p'; break;
          case '3': quality = '360p'; break;
          case '4': quality = '480p'; break;
          case '5': quality = '720p'; break;
          default:
            await messageHandler.sendMessage(from, {
              react: {
                text: '❌',
                key: quotedMessage.key
              }
            });
            return reply("Invalid option. Please select a valid option🔴");
        }

        // Fetch download link for the selected quality
        const downloadLinkResult = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp4?url=${encodeURIComponent(videoData.url)}&quality=${quality}`);
        const downloadLink = downloadLinkResult.result?.dl_link;

        if (downloadLink) {
          await messageHandler.sendMessage(from, {
            document: {
              url: downloadLink
            },
            mimetype: 'video/mp4',
            fileName: `${videoData.title}-${quality}.mp4`,
            caption: `${videoData.title} (${quality})\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴛᴇᴄʜ*`
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
      }
    });
  } catch (error) {
    console.error(error);
    // Handle errors
    await messageHandler.sendMessage(from, {
      react: {
        text: '❌',
        key: quotedMessage.key
      }
    });
    reply("An error occurred while processing your request.");
  }
});
