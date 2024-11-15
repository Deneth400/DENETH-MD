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

        // Add debugging information
        console.log('API Response:', JSON.stringify(result, null, 2));

        // Check if the result and the results array exist
        if (!result.status || !result.result || !result.result.data || result.result.data.length === 0) {
            return reply("No results found.");
        }

        let message = "*Search Results:*\n\n";
        result.result.data.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nYear: ${item.year}\nLink: ${item.url}\n\n`;
        });

        // Step 2: Send the search results to the user
        await conn.sendMessage(from, {
            text: message, // Changed from caption to text
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

    } catch (e) {
        console.error('Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`❗ Error: ${e.message}`);
    }
});
