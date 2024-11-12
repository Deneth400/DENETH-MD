const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: 'tvshow',
    desc: 'Get TV Show information and episode links',
    category: 'movie',
    react: '📺',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const url = q.trim();
        if (!url) return reply("Please provide a valid TV Show URL.");

        // API request to get TV show data
        const response = await axios.get(`https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/tvshow`, {
            params: { url: url }
        });

        // Check if the response is valid
        if (!response.data || !response.data.result) {
            return reply("Sorry, I couldn't fetch the TV show data. Please try again.");
        }

        const tvShow = response.data.result;
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
