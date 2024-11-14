const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

let movieResults = [];  // Store the search results for later use

cmd({
    pattern: "movie",
    desc: "Search for a movie",
    category: "movie",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("🚩 *Please provide a movie or TV show name to search.*");

        // Fetch search results for the movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("🚩 *No results found.*");

        movieResults = result.results;  // Store the search results for later use

        let message = "*Search Results:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        // Send search results to the user
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/SinhalaSub.jpg?raw=true`},
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });

        // Now, wait for the user to reply with a movie number
        conn.ev.on("messages.upsert", async (update) => {
            const message = update.messages[0];
            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();

            // Check if the user replied with a valid movie number
            const movieIndex = parseInt(userReply) - 1;
            if (movieIndex >= 0 && movieIndex < movieResults.length) {
                const selectedMovie = movieResults[movieIndex];
                await showMovieDetails(conn, mek, from, selectedMovie);
            } else {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("🚩 *Invalid movie number. Please reply with a valid number from the search results.*");
            }
        });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`🚩 *Error: ${e.message}*`);
    }
});

// Function to display movie details and download options
async function showMovieDetails(conn, mek, from, movie) {
    try {
        const movieLink = movie.link;
        
        // Fetch detailed movie information from SinhalaSub API
        const result = await SinhalaSub.movie(movieLink);
        if (!result.status) return reply("🚩 *Movie details not found.*");

        const movieDetails = result.result;
        let message = `*${movieDetails.title}*\n\n`;
        message += `📅 *Release Date*: ${movieDetails.release_date}\n`;
        message += `🗺️ *Country*: ${movieDetails.country}\n`;
        message += `⏰ *Duration*: ${movieDetails.duration}\n`;
        message += `🎭 *Genres*: ${movieDetails.genres.join(', ')}\n`;
        message += `⭐ *IMDb Rating*: ${movieDetails.IMDb_Rating}\n`;
        message += `🎬 *Director*: ${movieDetails.director.name}\n\n`;
        message += `🔢 *Reply with the number below to select the download quality*\n\n`;
        message += `*480 | SD 480p*\n`;
        message += `*720 | HD 720p*\n`;
        message += `*1080 | FHD 1080p*\n\n`;
        message += `> Powered by DENETH-xD Tech®`;

        const imageUrl = movieDetails.images && movieDetails.images.length > 0 ? movieDetails.images[0] : null;

        // Send movie details along with download options
        const sentMessage = await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });

        // Listen for the user's reply to the download options (1, 2, or 3)
        conn.ev.on("messages.upsert", async (update) => {
            const message = update.messages[0];
            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();

            // Only process replies for the sentMessage (to avoid multiple responses for different messages)
            if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
                let quality;
                switch (userReply) {
                    case '480':
                        quality = "SD 480p";
                        break;
                    case '720':
                        quality = "HD 720p";
                        break;
                    case '1080':
                        quality = "FHD 1080p";
                        break;
                    default:
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("🚩 *Invalid option. Please select from 1, 2, or 3.*");
                }

                // Fetch the direct download link for the selected quality
                const directLink = await PixaldrainDL(movieLink, quality, "direct");
                if (directLink) {
                    // Provide download option
                    await conn.sendMessage(from, {
                        document: {
                            url: directLink
                        },
                        mimetype: 'video/mp4',
                        fileName: `${movieDetails.title}.mp4`,
                        caption: `${movieDetails.title}\n\n> Powered by DENETH-xD Tech®`
                    }, { quoted: mek });

                    // React with success
                    await conn.sendMessage(from, {
                        react: { text: '✅', key: mek.key }
                    });
                } else {
                    await conn.sendMessage(from, {
                        react: { text: '❌', key: mek.key }
                    });
                    return reply(`🚩 *Could not find the ${quality} download link. Please check the URL or try another quality.*`);
                }
            }
        });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });
        reply("🚩 *An error occurred while processing your request.*");
    }
}
