const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const yts = require('yt-search');

cmd({
  pattern: "song",
  desc: "Download songs.",
  category: "download",
  react: '🎧',
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
      return reply("No song found matching your query.");
    }

    const songData = searchResults.videos[0]; // Get the first video from search results

    // Fetch download link for the song
    const downloadLinkResult = await fetchJson(https://dark-yasiya-api-new.vercel.app/download/ytmp3?url=${songData.url});
    const downloadLink = downloadLinkResult.result.dl_link;

    // Prepare the message with song details
    let songDetailsMessage = ‎‎*DENETH-MD AUDIO DOWNLOADER*\n\n;
    songDetailsMessage += *⚜ ᴛɪᴛʟᴇ* : ${songData.title}\n;
    songDetailsMessage += *📃 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ* : ${songData.description}\n;
    songDetailsMessage += *👀 ᴠɪᴇᴡꜱ* : ${songData.views}\n;
    songDetailsMessage += *⏰ ᴅᴜʀᴀᴛɪᴏɴ* : ${songData.timestamp}\n;
    songDetailsMessage += *📆 ᴜᴘʟᴏᴀᴅᴇᴅ ᴏɴ* : ${songData.ago}\n;
    songDetailsMessage += *📽 ᴄʜᴀɴɴᴇʟ* : ${songData.author.name}\n;
    songDetailsMessage += *🖇️ ᴜʀʟ* : ${songData.url}\n\n;
    songDetailsMessage += > *Choose Your Download Format:*  \n\n;
    songDetailsMessage += *1-𝖠𝗎𝖽𝗂𝗈 File🎶*\n;
    songDetailsMessage += *2-Document File📂*\n\n;
    songDetailsMessage += > *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®*;

    // Send the song details and options (you can also send a thumbnail or any other media)
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: songData.thumbnail },  // Assuming songData has a thumbnail property
      caption: songDetailsMessage,
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

      // If the reply matches the sent options, download the audio or document
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        switch (userReply) {
          case '1':
            // Send audio download link
            await messageHandler.sendMessage(from, {
              audio: {
                url: downloadLink
              },
              mimetype: "audio/mpeg"
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
            // Send document (mp3) download link
            await messageHandler.sendMessage(from, {
              document: {
                url: downloadLink
              },
              mimetype: 'audio/mpeg',
              fileName: ${songData.title}.mp3,
              caption: ${songData.title}\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪᴋᴀ-ᴛᴇᴄʜ*
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
