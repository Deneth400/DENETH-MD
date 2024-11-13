const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

cmd({
  pattern: "video",
  desc: "Download YouTube videos.",
  category: "download",
  react: '🎬',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    // Ensure the user has provided a song name or URL
    if (!q) {
      return reply("Please provide a song name or URL!");
    }

    // Fetch search results using yt-search
    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("No video found matching your query.");
    }

    const videoData = searchResults.videos[0]; // Get the first video from search results

    // Fetch download link for the video
    const downloadLinkResult = await fetchJson(`https://dark-yasiya-api-new.vercel.app/download/ytmp4?url=${videoData.url}&quality=480p`);
    const downloadLink = downloadLinkResult.result.videoData;

    // Prepare the message with video details
    let videoDetailsMessage = `𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n`;
    videoDetailsMessage += `✒ ᴛɪᴛʟᴇ : ${videoData.title}\n`;
    videoDetailsMessage += `💭 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ : ${videoData.description}\n`;
    videoDetailsMessage += `👀 ᴠɪᴇᴡꜱ : ${videoData.views}\n`;
    videoDetailsMessage += `⏰ ᴅᴜʀᴀᴛɪᴏɴ : ${videoData.timestamp}\n`;
    videoDetailsMessage += `📆 ᴜᴘʟᴏᴀᴅᴇᴅ ᴏɴ : ${videoData.ago}\n`;
    videoDetailsMessage += `🎬 ᴄʜᴀɴɴᴇʟ : ${videoData.author.name}\n`;
    videoDetailsMessage += `🖇️ ᴜʀʟ : ${videoData.url}\n\n`;
    videoDetailsMessage += `*REPLY THE DOWNLOAD OPTION* 🚀 \n\n`;
    videoDetailsMessage += `*1-𝖵𝗂𝖽𝖾𝗈 File🎥*\n`;
    videoDetailsMessage += `*2-Document File📂*\n\n`;
    videoDetailsMessage += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

    // Send the video details and options (you can also send a thumbnail or any other media)
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: videoData.thumbnail },  // Assuming videoData has a thumbnail property
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

      // If the reply matches the sent options, download the video or document
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        switch (userReply) {
          case '1':
            // Send video download link
            await messageHandler.sendMessage(from, {
              video: {
                url: downloadLink
              },
              mimetype: "video/mp4"
            }, { quoted: quotedMessage });

            // React with a success emoji
            await messageHandler.sendMessage(from, {
              react: {
                text: '✅',
                key: quotedMessage.key
              }
            });
            break;

          case '2':
            // Send document (mp4) download link
            await messageHandler.sendMessage(from, {
              document: {
                url: downloadLink
              },
              mimetype: 'video/mp4',
              fileName: `${videoData.title}.mp4`,
              caption: `${videoData.title}\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪᴋᴀ-ᴛᴇᴄʜ*`
            }, { quoted: quotedMessage });

            // React with a success emoji
            await messageHandler.sendMessage(from, {
              react: {
                text: '✅',
                key: quotedMessage.key
              }
            });
            break;

          default:
            // Invalid option handling
            await messageHandler.sendMessage(from, {
              react: {
                text: '❌',
                key: quotedMessage.key
              }
            });
            reply("Invalid option. Please select a valid option🔴");
            break;
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
