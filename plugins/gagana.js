const { cmd } = require('../command');  // Adjust this import depending on your bot framework
const axios = require('axios');  // For making API requests

const apilink = 'https://dark-yasiya-api-new.vercel.app/news/gagana'; // Gagana API link

// ================================GAGANA NEWS========================================

cmd({
    pattern: "gaganews",  // Command to trigger the news fetch
    alias: ["gagana", "news6"],  // Aliases for easier access
    react: "📰",  // Reaction to show
    desc: "Fetches the latest Gagana News",  // Description of the command
    category: "news",  // Category of the command
    use: '.gaganews',  // Usage pattern
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest Gagana news from the API
        const news = await axios.get(apilink);
        
        // Ensure the response is valid
        if (!news.data || !news.data.result) {
            return reply("Failed to fetch Gagana news.");
        }

        // Prepare the message with news details
        const msg = `
*GAGANA NEWS - DENETH-MD*

• *Title:* ${news.data.result.title}
• *Description:* ${news.data.result.desc}
• *Date:* ${news.data.result.date}
• *Link:* ${news.data.result.url}

> Powered by Deneth-MD WA-Bot
        `;

        // Send the news message with an image, if available
        await conn.sendMessage(from, {
            image: { url: news.data.result.image || '' },
            caption: msg
        }, { quoted: mek });

    } catch (e) {
        // Log and report any errors
        console.log(e);
        return reply("An error occurred while fetching the Gagana news.");
    }
});
