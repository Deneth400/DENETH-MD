const { cmd } = require('../command');

cmd({
  pattern: "ytvideo",
  desc: "Download YouTube video with specific quality.",
  category: "video",
  react: "🎥",
  filename: __filename
}, 
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    const url = q.trim();
    if (!url) return reply("Please provide a YouTube video URL!");

    // Specify the quality options for download
    let message = `🎥 *YouTube Video Downloader*\n\n`;
    message += `Please select a quality:\n\n`;
    message += `*1 | SD 480p*\n`;
    message += `*2 | HD 720p*\n`;
    message += `*3 | FHD 1080p*\n\n`;
    message += `> Powered by Your Bot®`;

    // Send the quality selection options
    const sentMessage = await messageHandler.sendMessage(from, {
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: quotedMessage });

    // Listen for user reply on quality choice
    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();

      // Check if the user's reply matches the sent options
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        let quality;
        switch (userReply) {
          case '1':
            quality = "480p";
            break;
          case '2':
            quality = "720p";
            break;
          case '3':
            quality = "1080p";
            break;
          default:
            await messageHandler.sendMessage(from, {
              react: {
                text: '❌',
                key: quotedMessage.key
              }
            });
            return reply("Invalid option. Please select from 1, 2, or 3.");
        }

        // Fetch the download link
        const response = await fetch(`https://dark-yasiya-api-new.vercel.app/download/ytmp4?url=${url}&quality=${quality}`);
        const data = await response.json();
        if (data && data.status && data.download_url) {
          await messageHandler.sendMessage(from, {
            document: {
              url: data.download_url
            },
            mimetype: 'video/mp4',
            fileName: `${data.title}.mp4`,
            caption: `${data.title}\n\n> Powered by Your Bot®`
          }, { quoted: quotedMessage });

          // React with success
          await messageHandler.sendMessage(from, {
            react: {
              text: '✅',
              key: quotedMessage.key
            }
          });
        } else {
          await messageHandler.sendMessage(from, {
            react: {
              text: '❌',
              key: quotedMessage.key
            }
          });
          return reply(`Could not find the ${quality} download link. Please check the URL or try another quality.`);
        }
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
    reply("An error occurred while processing your request.");
  }
});
