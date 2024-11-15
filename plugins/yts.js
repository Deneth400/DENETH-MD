const { cmd } = require('../command');
const fetch = require('node-fetch');

// Movie search command
cmd({
    pattern: "yts",
    desc: "Search for a movie and get details.",
    category: "movie",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie name to search.");

        // Step 1: Search for the movie
        const response = await fetch(`https://www.dark-yasiya-api.site/movie/ytsmx/search?text=${encodeURIComponent(input)}`);
        const result = await response.json();

        // Check if the result and the results array exist
        if (!result.status || !result.result || !result.result.data || result.result.data.length === 0) {
            return reply("No results found.");
        }

        let message = "*Search Results:*\n\n";
        result.result.data.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nYear: ${item.year}\n\n`;
        });

        // Step 2: Send the search results to the user
        const sentMsg = await conn.sendMessage(from, {
            text: message,
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
            if (selectedMovieIndex < 0 || selectedMovieIndex >= result.result.data.length) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ Invalid selection. Please choose a valid number from the search results.");
            }

            const selectedMovie = result.result.data[selectedMovieIndex];
            if (!selectedMovie || !selectedMovie.url) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ Invalid selection. Unable to retrieve movie details.");
            }
            const movieId = selectedMovie.url.split('/').pop();

            // Step 3: Fetch movie details from the selected movie's ID
            const movieResponse = await fetch(`https://www.dark-yasiya-api.site/movie/ytsmx/movie?id=${movieId}`);
            const movieDetails = await movieResponse.json();
            if (!movieDetails || !movieDetails.status || !movieDetails.result) {
                await conn.sendMessage(from, {
                    react: { text: '❌', key: mek.key }
                });
                return reply("❗ Movie details not found.");
            }

            const movie = movieDetails.result;
            let movieMessage = `*${movie.title}*\n\n`;
            movieMessage += `📅 Release Date: ${movie.year}\n`;
            movieMessage += `⏰ Duration: ${movie.runtime} minutes\n`;
            movieMessage += `🎭 Genres: ${movie.genres.join(', ')}\n`;
            movieMessage += `⭐ IMDb Rating: ${movie.rating}\n\n`;
            movieMessage += `🎬 Director: ${movie.director}\n`;
            movieMessage += `📋 Description: ${movie.description_full}\n\n`;

            movie.torrents.forEach((torrent, idx) => {
                movieMessage += `Torrent ${idx + 1}:\nQuality: ${torrent.quality}\nSize: ${torrent.size}\nLink: ${torrent.url}\n\n`;
            });

            // Step 4: Send movie details with download options
            await conn.sendMessage(from, {
                text: movieMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Clean up the listener to prevent the issue of multiple messages
            conn.ev.off("messages.upsert", movieSelectionListener);
        };

        // Register the movie selection listener
        conn.ev.on("messages.upsert", movieSelectionListener);

        // Clean up the listener after 60 seconds to prevent memory leaks
        setTimeout(() => {
            conn.ev.off("messages.upsert", movieSelectionListener);
        }, 60000);

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});
