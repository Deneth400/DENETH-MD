const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ginisisila",
    desc: "Search for Ginisisila cartoons",
    category: "cartoon",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // Trim the query to remove unnecessary spaces
        const searchText = q.trim();
        if (!searchText) {
            return reply("Please provide a cartoon name or keyword to search.");
        }

        // Make sure the search text is a valid string and not a full URL
        if (searchText.startsWith('http')) {
            return reply("Please provide a valid search term (not a URL).");
        }

        // Make a request to the Ginisisila search API with the search text
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/search/ginisisila?text=${encodeURIComponent(searchText)}&page=1`;
        const response = await axios.get(apiUrl);
        
        // Check if the API returned any results
        const { data } = response;
        if (!data || !data.results || data.results.length === 0) {
            return reply("No Ginisisila cartoons found for your search.");
        }

        // Prepare the message to display results
        let message = "*Ginisisila Cartoon Search Results:*\n\n";
        data.results.forEach((item, index) => {
            message += `${index + 1}. *${item.title}*\n`;
            message += `🎥 *Link*: ${item.url}\n`;  // Assuming each item has a URL for more details
            message += `🖼️ *Image*: ${item.image}\n\n`;  // Assuming each item has an image URL
        });

        // Send the results to the user
        await conn.sendMessage(from, {
            image: { url: data.results[0].image || 'https://placehold.it/500x750' },  // Fallback image if no image is available
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });
        
    } catch (error) {
        console.error(error);

        // Log the error response from the API to understand what went wrong
        if (error.response) {
            console.error('API Response Error:', error.response.data);
        } else {
            console.error('Request Error:', error.message);
        }

        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply("An error occurred while processing your request. Please try again later.");
    }
});
