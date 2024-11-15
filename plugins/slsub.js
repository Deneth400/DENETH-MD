const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

// Movie search and details handler
cmd({
    pattern: "movie",
    desc: "Search for a movie and get details and download options.",
    category: "movie",
    react: "🍿",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("❗ *Please Provide A Movie Name To Search.*");
        
        // Step 1: Search for the movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        let message = "𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗠𝗢𝗩𝗜𝗘 𝗦𝗘𝗔𝗥𝗖𝗛\n\n_Search Results :_\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        // Step 2: Send search results (No forwarding)
        await conn.sendMessage(from, {
            image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/SinhalaSub.jpg?raw=true` },
            caption: message,
        }, { quoted: mek });

        // Wait for the user to select a movie by number
        const messageListener = async (update) => {
            const message = update.messages[0];
            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;

            // Ensure the user has selected a valid movie index
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.results.length) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ *Invalid Selection. Please Choose A Valid Number From The Search Results.*");
            }

            const selectedMovie = result.results[selectedMovieIndex];
            const link = selectedMovie.link;

            // Step 3: Fetch movie details from the selected movie's link
            const movieDetails = await SinhalaSub.movie(link);
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                return reply("❗ *Movie Details Not Found Or Invalid Link Provided.*");
            }

            const movie = movieDetails.result;
            let message = `*${movie.title}*\n\n`;
            message += `📅 Rᴇʟᴇᴀꜱᴇ ᴅᴀᴛᴇ: ${movie.release_date}\n`;
            message += `🗺 Cᴏᴜɴᴛʀʏ: ${movie.country}\n`;
            message += `⏰ Dᴜʀᴀᴛɪᴏɴ: ${movie.duration}\n`;

            // Fixing genre formatting
            const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;
            message += `🎭 Gᴇɴʀᴇꜱ: ${genres}\n`;

            message += `⭐ Iᴍᴅʙ Rᴀᴛɪɴɢ: ${movie.IMDb_Rating}\n`;
            message += `🎬 Dɪʀᴇᴄᴛᴏʀ: ${movie.director.name}\n\n`;
            message += "🔢 ʀᴇᴘʟʏ ᴛʜᴇ Qᴜᴀʟɪᴛʏ ʙᴇʟᴏᴡ\n\n";
            message += "*480 - SD 480p*\n";
            message += "*720 - HD 720p*\n";
            message += "*1080 - FHD 1080p*\n\n";
            message += "> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®";

            const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : '';

            // Step 4: Send movie details with download options
            const movieDetailsMessage = await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: message
            });

            let userSelectedQuality = null;  // Track if a quality has already been selected

            // Listener for the user's quality selection
            const qualityListener = async (update) => {
                const message = update.messages[0];
                if (!message.message || !message.message.extendedTextMessage) return;

                const userReply = message.message.extendedTextMessage.text.trim();

                // Ensure the user is responding to the right message
                if (message.message.extendedTextMessage.contextInfo.stanzaId === movieDetailsMessage.key.id) {
                    if (userSelectedQuality) {
                        // If quality was already selected, stop the process
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("❗ *You Have Already Selected A Quality Option.*");
                    }

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
                            return reply("Invalid option. Please select from 1, 2, or 3.");
                    }

                    try {
                        // Assuming PixaldrainDL is a function that you have defined elsewhere
                        const directLink = await PixaldrainDL(link, quality, "direct");
                        if (directLink) {
                            // Provide download option
                            await conn.sendMessage(from, {
                                document: { url: directLink },
                                mimetype: 'video/mp4',
                                fileName: `ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴍᴏᴠɪᴇꜱ(${movie.title}).mp4`,
                                caption: `${movie.title}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
                            });

                            // React with success
                            await conn.sendMessage(from, {
                                react: { text: '✅', key: mek.key }
                            });

                            // Mark quality as selected
                            userSelectedQuality = userReply;

                            // Unregister the quality listener after selection
                            conn.ev.off("messages.upsert", qualityListener);

                        } else {
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply(`Could Not Find The ${quality} Download Link. Please Check The URL Or Try Another Quality.`);
                        }
                    } catch (err) {
                        console.error('Error in PixaldrainDL function:', err);
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("❗ *An Error Occurred While Processing Your Download Request.*");
                    }
                }
            };

            // Register the quality listener for this movie
            conn.ev.on("messages.upsert", qualityListener);

            // Clean up the listener after 60 seconds to prevent memory leaks
            setTimeout(() => {
                conn.ev.off("messages.upsert", qualityListener);
            }, 60000);
        };

        // Register the movie selection listener
        conn.ev.on("messages.upsert", messageListener);

        // Clean up after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off("messages.upsert", messageListener);
        }, 60000);

    } catch (error) {
        console.error('Error in movie search or details:', error);
        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });
        reply("An error occurred while fetching the movie search or details.");
    }
});
