const { cmd } = require('../command');
const fetch = require('node-fetch');  // Ensure node-fetch is installed

// Command 1: Search Movie/TV Show
cmd({
    pattern: "search",
    desc: "Search for a movie or TV show",
    category: "movie",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");

        // Step 1: Use the search API to search for the movie/TV show
        const searchUrl = `https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/search?text=${encodeURIComponent(input)}`;
        const searchResponse = await fetch(searchUrl);
        const searchResult = await searchResponse.json();

        if (!searchResult.status || searchResult.results.length === 0) {
            return reply("No results found.");
        }

        // Step 2: Display search results and ask the user to select a movie/TV show
        let message = "*Search Results:*\n\n";
        searchResult.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });

        await conn.sendMessage(from, {
            caption: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

        // Step 3: Listen for the user's reply to select a movie/TV show
        conn.ev.on("messages.upsert", async (update) => {
            const message = update.messages[0];
            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();
            const selectedMovieIndex = parseInt(userReply) - 1;
            if (isNaN(selectedMovieIndex) || selectedMovieIndex < 0 || selectedMovieIndex >= searchResult.results.length) {
                return reply("Invalid selection. Please select a valid number from the search results.");
            }

            const selectedItem = searchResult.results[selectedMovieIndex];
            const selectedUrl = selectedItem.link;

            // Step 4: Offer the user more options (movie info, TV show info, etc.)
            const optionsMessage = `You selected: ${selectedItem.title}\n\nWhat do you want to do next? Choose a number:\n1. Get Movie Info and Download Links\n2. Get TV Show Info and Episodes`;
            await conn.sendMessage(from, {
                caption: optionsMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            conn.ev.on("messages.upsert", async (update) => {
                const message = update.messages[0];
                if (!message.message || !message.message.extendedTextMessage) return;

                const userChoice = message.message.extendedTextMessage.text.trim();

                switch (userChoice) {
                    case '1':
                        // Get Movie Info and Download Links
                        const movieInfoUrl = `https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/movie?url=${encodeURIComponent(selectedUrl)}`;
                        const movieInfoResponse = await fetch(movieInfoUrl);
                        const movieInfoData = await movieInfoResponse.json();

                        if (!movieInfoData.status) return reply("Could not fetch movie details.");

                        const movie = movieInfoData.result;
                        let movieMessage = `*${movie.title}*\n\n`;
                        movieMessage += `📅 Release Date: ${movie.release_date}\n`;
                        movieMessage += `🗺 Country: ${movie.country}\n`;
                        movieMessage += `⏰ Duration: ${movie.duration}\n`;
                        movieMessage += `🎭 Genres: ${movie.genres}\n`;
                        movieMessage += `⭐ IMDb Rating: ${movie.IMDb_Rating}\n`;
                        movieMessage += `🎬 Director: ${movie.director.name}\n\n`;
                        movieMessage += `🔢 Choose download options:\n*1 | SD 480p*\n*2 | HD 720p*\n*3 | FHD 1080p*\n`;

                        await conn.sendMessage(from, {
                            caption: movieMessage,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                            }
                        }, { quoted: mek });

                        // Step 5: Handle the user's selection for download quality
                        conn.ev.on("messages.upsert", async (update) => {
                            const message = update.messages[0];
                            if (!message.message || !message.message.extendedTextMessage) return;

                            const qualityChoice = message.message.extendedTextMessage.text.trim();
                            let quality = "";
                            let downloadUrl = "";

                            switch (qualityChoice) {
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
                                    return reply("Invalid choice. Please select from 1, 2, or 3.");
                            }

                            // Fetch the download link for the selected quality
                            const downloadLink = movie.download_links[quality];
                            if (!downloadLink) {
                                return reply(`Could not find the ${quality} download link.`);
                            }

                            // Provide download link
                            await conn.sendMessage(from, {
                                document: {
                                    url: downloadLink
                                },
                                mimetype: 'video/mp4',
                                fileName: `${movie.title} - ${quality}.mp4`,
                                caption: `${movie.title}\nDownload Link for ${quality}: ${downloadLink}\n> Powered by DENETH-xD Tech®`
                            }, { quoted: mek });
                        });
                        break;

                    case '2':
                        // Get TV Show Info and Episodes
                        const tvShowUrl = `https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/tvshow?url=${encodeURIComponent(selectedUrl)}`;
                        const tvShowResponse = await fetch(tvShowUrl);
                        const tvShowData = await tvShowResponse.json();

                        if (!tvShowData.status) return reply("Could not fetch TV show details.");

                        const tvShow = tvShowData.result;
                        let tvShowMessage = `*${tvShow.title}*\n\n`;
                        tvShowMessage += `📅 Release Date: ${tvShow.release_date}\n`;
                        tvShowMessage += `🗺 Country: ${tvShow.country}\n`;
                        tvShowMessage += `⏰ Duration: ${tvShow.duration}\n`;
                        tvShowMessage += `🎭 Genres: ${tvShow.genres}\n\n`;

                        await conn.sendMessage(from, {
                            caption: tvShowMessage,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                            }
                        }, { quoted: mek });
                        break;

                    default:
                        return reply("Invalid choice. Please choose a valid option from the menu.");
                }
            });
        });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, {
            react: { text: '❌', key: mek.key }
        });
        return reply(`Error: ${e.message}`);
    }
});
