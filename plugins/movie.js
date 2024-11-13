const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

cmd({
  pattern: "slsub",
  desc: "Get movie details and download options.",
  category: "movie",
  react: "🍿",
  filename: __filename
},
async (messageHandler, context, quotedMessage, { from, q, reply }) => {
  try {
    const link = q.trim();
    if (!link) return reply("Please provide a movie link!");

    // Fetch movie details from SinhalaSub API
    const result = await SinhalaSub.movie(link);
    if (!result.status) return reply("Movie details not found.");

    const movie = result.result;
    let message = `*${movie.title}*\n\n`;
    message += `Release Date: ${movie.release_date}\n`;
    message += `Country: ${movie.country}\n\n`;
    message += `Duration: ${movie.duration}\n`;
    message += `Genres: ${movie.genres}\n\n`;
    message += `IMDb Rating: ${movie.IMDb_Rating}\n`;
    message += `Director: ${movie.director.name}\n\n`;
    message += `*Select the number for download movie*\n\n`;
    message += `1. 𝗦𝗗 𝟰𝟴𝟬\n`;
    message += `2. 𝗛𝗗 𝟳𝟮𝟬\n`;
    message += `3. 𝗙𝗛𝗗 𝟭𝟬𝟴𝟬\n\n`;
    message += `Use .mv <Quality Number> <movie_link> to download.\n\n`;
    message += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

    const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

    // Send movie details along with download options
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: imageUrl },  // Assuming the movie has a poster or thumbnail
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

      // If the reply matches the sent options, download the movie
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
        const directLink = await PixaldrainDL(link, quality, "direct");
        if (directLink) {
          // Provide download option
          await messageHandler.sendMessage(from, {
            document: {
              url: directLink
            },
            mimetype: 'video/mp4',
            fileName: `${movie.title}.mp4`,
            caption: `${movie.title}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
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
