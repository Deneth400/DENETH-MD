const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

cmd({
    pattern: "movie",
    desc: "Fetch movie details and provide download options",
    category: "movie",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("🚩 *Please provide a movie name.*");

        // Fetch movie details directly without showing search results
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("🚩 *No movie found with that name.*");

        const selectedMovie = result.results[0]; // Assuming we fetch the first result if there are multiple
        const movieLink = selectedMovie.link;

        // Fetch detailed movie information
        const movieDetails = await SinhalaSub.movie(movieLink);
        if (!movieDetails.status) return reply("🚩 *Could not fetch movie details.*");

        const movie = movieDetails.result;
        let message = `*${movie.title}*\n\n`;
        message += `📅 *Release Date*: ${movie.release_date}\n`;
        message += `🗺️ *Country*: ${movie.country}\n`;
        message += `⏰ *Duration*: ${movie.duration}\n`;
        message += `🎭 *Genres*: ${movie.genres.join(', ')}\n`;
        message += `⭐ *IMDb Rating*: ${movie.IMDb_Rating}\n`;
        message += `🎬 *Director*: ${movie.director.name}\n\n`;
        message += `🔢 *Reply with the number below to select the download quality*\n\n`;
        message += `*1 | SD 480p*\n`;
        message += `*2 | HD 720p*\n`;
        message += `*3 | FHD 1080p*\n\n`;
        message += `> Powered by DENETH-xD Tech®`;

        // Use the movie's first image as the poster (if available)
        const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

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
                        fileName: `${movie.title}.mp4`,
                        caption: `${movie.title}\n\n> Powered by DENETH-xD Tech®`
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
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`🚩 *Error: ${e.message}*`);
    }
});
