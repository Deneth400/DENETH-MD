const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

cmd({
    pattern: "movie",
    desc: "Search for a movie",
    category: "movie",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");
        
        // Fetch the movie search results from the SinhalaSub API
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        // Create a message containing search results
        let message = "*Search Results:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });
        
        // Send the search results with an image and caption
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/SinhalaSub.jpg?raw=true` },
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`Error: ${e.message}`);
    }
});

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
    message += `📅 Release Date: ${movie.release_date}\n`;
    message += `🗺 Country: ${movie.country}\n`;
    message += `⏰ Duration: ${movie.duration}\n`;
    message += `🎭 Genres: ${movie.genres}\n`;
    message += `⭐ IMDb Rating: ${movie.IMDb_Rating}\n`;
    message += `🎬 Director: ${movie.director.name}\n\n`;
    message += `🔢 Reply with the number below to select quality:\n\n`;
    message += `*1 | SD 480p*\n`;
    message += `*2 | HD 720p*\n`;
    message += `*3 | FHD 1080p*\n\n`;
    message += `> Powered by Deneth-xD Tech®`;

    const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

    // Send movie details with quality options
    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: imageUrl || 'https://placehold.it/500x750' },  // Fallback image if no movie image
      caption: message,
      contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted: quotedMessage });

    // Listen for the user's reply to download options
    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();

      // If the reply matches the sent options, proceed with the download
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
              react: { text: '❌', key: quotedMessage.key }
            });
            return reply("Invalid option. Please select from 1, 2, or 3.");
        }

        // Fetch the direct download link for the selected quality
        const directLink = await PixaldrainDL(link, quality, "direct");
        if (directLink) {
          // Send the download link as a document
          await messageHandler.sendMessage(from, {
            document: { url: directLink },
            mimetype: 'video/mp4',
            fileName: `${movie.title}.mp4`,
            caption: `${movie.title}\n\n> Powered by Deneth-xD Tech®`
          }, { quoted: quotedMessage });

          // React with success
          await messageHandler.sendMessage(from, {
            react: { text: '✅', key: quotedMessage.key }
          });
        } else {
          await messageHandler.sendMessage(from, {
            react: { text: '❌', key: quotedMessage.key }
          });
          return reply(`Could not find the ${quality} download link. Please check the URL or try another quality.`);
        }
      }
    });
  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, {
      react: { text: '❌', key: quotedMessage.key }
    });
    reply("An error occurred while processing your request.");
  }
});
