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
            message += `${index + 1}. ${item.title}\nYear: ${item.year}\nID: ${item.id}\n\n`;
        });

        // Step 2: Send the search results to the user with instructions to reply with the number
        message += "Please reply with the number or ID of the movie you want details for.";
        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});

// Movie details command (handles the selection)
cmd({
    pattern: "ytss",
    desc: "Get details of a selected movie.",
    category: "movie",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const movieId = q.trim();
        if (!movieId) return reply("Please provide the movie ID.");

        // Fetch movie details using the provided movie ID
        const response = await fetch(`https://www.dark-yasiya-api.site/movie/ytsmx/movie?id=${movieId}`);
        const result = await response.json();

        if (!result.status || !result.result) {
            return reply("No details found for the selected movie.");
        }

        // Construct the message with movie details
        const movie = result.result;
        const message = `*Movie Details:*\n\n` +
            `Title: ${movie.title}\n` +
            `Year: ${movie.year}\n` +
            `Rating: ${movie.rating}\n` +
            `Summary: ${movie.summary}\n` +
            `Link: ${movie.url}`;

        await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});
