const { cmd } = require('../command');
const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");

// Movie search command
cmd({
    pattern: "hi",
    desc: "Search for a movie and get details and download options.",
    category: "movie",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");
        
        // Step 1: Search for the movie
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        let message = "*Search Results:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        // Step 2: Send the search results to the user
        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/SinhalaSub.jpg?raw=true` },
            caption: message,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

        // Wait for the user to select a movie by number
        const movieSelectionListener = async (update) => {
            const message = update.messages[0];

            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;

            // Ensure the user has selected a valid movie index
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.results.length) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ Invalid selection. Please choose a valid number from the search results.");
            }

            const selectedMovie = result.results[selectedMovieIndex];
            const link = selectedMovie.link;

            // Step 3: Fetch movie details from the selected movie's link
            const movieDetails = await SinhalaSub.movie(link);
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                return reply("❗ Movie details not found.");
            }

            const movie = movieDetails.result;
            let movieMessage = `*${movie.title}*\n\n`;
            movieMessage += `📅 Release Date: ${movie.release_date}\n`;
            movieMessage += `🗺 Country: ${movie.country}\n`;
            movieMessage += `⏰ Duration: ${movie.duration}\n`;

            // Handling genres properly
            const genres = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;
            movieMessage += `🎭 Genres: ${genres}\n`;

            movieMessage += `⭐ IMDb Rating: ${movie.IMDb_Rating}\n`;
            movieMessage += `🎬 Director: ${movie.director.name}\n\n`;
            movieMessage += `🔢 Reply with one of the following to select quality:\n\n`;
            movieMessage += `*SD | SD 480p*\n`;
            movieMessage += `*HD | HD 720p*\n`;
            movieMessage += `*FHD | FHD 1080p*\n\n`;
            movieMessage += `> Powered by Deneth-xD Tech®`;

            const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

            // Step 4: Send movie details with download options
            const movieDetailsMessage = await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: movieMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Listen for the user's reply to select the download quality
            const qualityListener = async (update) => {
                const message = update.messages[0];

                if (!message.message || !message.message.extendedTextMessage) return;

                const userReply = message.message.extendedTextMessage.text.trim();

                // Ensure the user is responding to the right message
                if (message.message.extendedTextMessage.contextInfo.stanzaId === movieDetailsMessage.key.id) {
                    let quality;
                    switch (userReply) {
                        case 'SD':
                            quality = "SD 480p";
                            break;
                        case 'HD':
                            quality = "HD 720p";
                            break;
                        case 'FHD':
                            quality = "FHD 1080p";
                            break;
                        default:
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply("❗ Invalid option. Please select SD, HD, or FHD.");
                    }

                    try {
                        // Fetch the direct download link for the selected quality
                        const directLink = await PixaldrainDL(link, quality, "direct");
                        if (directLink) {
                            // Provide download option
                            await conn.sendMessage(from, {
                                document: {
                                    url: directLink
                                },
                                mimetype: 'video/mp4',
                                fileName: `Deneth-MD Movies(${movie.title}).mp4`,
                                caption: `${movie.title}\n\n> Powered by Deneth-xD Tech®`
                            }, { quoted: mek });

                            // React with success
                            await conn.sendMessage(from, {
                                react: { text: '✅', key: mek.key }
                            });
                        } else {
                            await conn.sendMessage(from, {
                                react: { text: '❌', key: mek.key }
                            });
                            return reply(`❗ Could not find the ${quality} download link. Please check the URL or try another quality.`);
                        }
                    } catch (err) {
                        console.error('Error in PixaldrainDL function:', err);
                        await conn.sendMessage(from, {
                            react: { text: '❌', key: mek.key }
                        });
                        return reply("❗ An error occurred while processing your download request.");
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
        conn.ev.on("messages.upsert", movieSelectionListener);

        // Clean up the listener after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off("messages.upsert", movieSelectionListener);
        }, 60000);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});

// JID Share Command (share)
cmd({
    pattern: "share",
    desc: "Share movie details and download link with a JID (group or contact).",
    category: "movie",
    react: "🔗",
    use: "<JID> <movie title>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.trim().split(" ");
        const jid = args[0]; // JID of the group or contact
        const movieTitle = args.slice(1).join(" ");

        if (!jid || !movieTitle) return reply("Please provide both the JID and the movie title.");
        
        // Step 1: Search for the movie by title
        const result = await SinhalaSub.get_list.by_search(movieTitle);
        if (!result.status || result.results.length === 0) return reply("No results found for the specified movie.");

        const selectedMovie = result.results[0]; // Take the first result
        const link = selectedMovie.link;

        // Step 2: Fetch movie details from the selected movie's link
        const movieDetails = await SinhalaSub.movie(link);
        if (!movieDetails || !movieDetails.status || !movieDetails.result) {
            return reply("❗ Movie details not found.");
        }

        const movie = movieDetails.result;
        let movieMessage = `*${movie.title}*\n\n`;
        movieMessage += `📅 Release Date: ${movie.release_date}\n`;
        movieMessage += `🗺 Country: ${movie.country}\n`;
        movieMessage += `⏰ Duration: ${movie.duration}\n`;
        movieMessage += `⭐ IMDb Rating: ${movie.IMDb_Rating}\n`;
        movieMessage += `🎬 Director: ${movie.director.name}\n\n`;
        movieMessage += `🔗 Download Link: ${link}`;

        const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

        // Step 3: Share the movie details and download link with the JID
        await conn.sendMessage(jid, {
            image: { url: imageUrl },
            caption: movieMessage
        });

        return reply(`Movie details and download link have been shared with ${jid}`);
    } catch (err) {
        console.log(err);
        return reply(`❗ Error: ${err.message}`);
    }
});
