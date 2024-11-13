const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

// Command to fetch episode details and provide download links
cmd({
  pattern: "episode",
  desc: "Get episode details and download options.",
  category: "movie",
  react: "🎬",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    const episodeUrl = q.trim();
    if (!episodeUrl) return reply("Please provide a valid episode URL!");

    // Fetch episode details from the API
    const episodeDetails = await fetchJson(`https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/episode?url=${episodeUrl}`);

    if (!episodeDetails.result) return reply("Episode details not found.");

    const episode = episodeDetails.result;
    let message = `*${episode.title}*\n\n`;
    message += `Episode: ${episode.episode}\n`;
    message += `Show: ${episode.show_name}\n\n`;
    message += `Description: ${episode.description}\n`;
    message += `Duration: ${episode.duration}\n`;
    message += `Released on: ${episode.release_date}\n\n`;
    message += `*Select the number for download options*\n\n`;
    message += `1. 𝗦𝗗 𝟰𝟴𝟬\n`;
    message += `2. 𝗛𝗗 𝟳𝟮𝟬\n`;
    message += `3. 𝗙𝗛𝗗 𝟭𝟬𝟴𝟬\n\n`;
    message += `Use .download <Quality Number> <episode_url> to download.\n\n`;
    message += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

    // Send episode details along with download options
    const sentMessage = await messageHandler.sendMessage(from, {
      caption: message,
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

      // If the reply matches the sent options, download the episode
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        let quality;
        switch (userReply) {
          case '1':
            quality = "SD 480p";
            break;
          case '2':
            quality = "HD 720p";
            break;
          case '3':
            quality = "FHD 1080p";
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

        // Fetch the direct download link for the selected quality
        const downloadLink = episode.download_links[quality];
        if (downloadLink) {
          // Provide download option
          await messageHandler.sendMessage(from, {
            document: {
              url: downloadLink
            },
            mimetype: 'video/mp4',
            fileName: `${episode.title} - ${episode.episode}.mp4`,
            caption: `${episode.title} - ${episode.episode}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
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
