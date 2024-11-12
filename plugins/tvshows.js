const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: 'tvshow',
    desc: 'Search for TV Show info by title',
    category: 'movie',
    react: '📺',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const title = q.trim();
        if (!title) return reply("Please provide a TV show title to search.");

        // API request to search for TV show info by title
        const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/tvshow/search`, {
            params: { text: title }
        });

        // Check if the response is valid and contains results
        if (!response.data || !response.data.result || response.data.result.length === 0) {
            return reply("Sorry, I couldn't find any TV show matching that title. Please try again.");
        }

        const tvShow = response.data.result[0]; // Get the first matching result
        let message = `*TV Show Info:*\n\n`;
        message += `Title: ${tvShow.title}\n`;
        message += `Release Date: ${tvShow.release_date}\n`;
        message += `Genre: ${tvShow.genre}\n`;
        message += `Language: ${tvShow.language}\n`;
        message += `Description: ${tvShow.description}\n\n`;

        // List episodes
        if (tvShow.episodes && tvShow.episodes.length > 0) {
            message += `*Episodes:*\n\n`;
            tvShow.episodes.forEach((episode, index) => {
                message += `${index + 1}. ${episode.title} - [Watch Now](${episode.link})\n`;
            });
        } else {
            message += "No episodes found for this TV show.\n";
        }

        // Send the formatted message with TV show info and episodes
        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (error) {
        console.error("Error fetching from TV Show API:", error.message);
        reply(`❌ Error: Unable to fetch TV show info. Please try again later.`);
    }
});
