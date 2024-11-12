const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: 'ginisisila',
    desc: 'Search on Ginisisila for movies or shows',
    category: 'movie',
    react: '🎬',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const searchText = q.trim();
        if (!searchText) return reply("Please provide a search term.");

        // Send request to Ginisisila API
        const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/search/ginisisila?text=${encodeURIComponent(searchText)}&page=1`);
        const searchResults = response.data.results;

        // Check if results are returned and format them
        if (!Array.isArray(searchResults) || searchResults.length === 0) {
            return reply("No results found for your search.");
        }

        // Prepare message with search results
        let message = `*Ginisisila Search Results for:* "${searchText}"\n\n`;
        searchResults.slice(0, 5).forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nURL: ${item.url}\n\n`;
        });

        // Send the formatted message
        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});
