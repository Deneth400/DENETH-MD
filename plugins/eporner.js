const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
    pattern: 'eporn',
    desc: 'Search for videos on Eporner',
    category: 'nsfw',
    react: '🔞',
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    try {
        const searchTerm = q.trim();
        if (!searchTerm) return reply("Please provide a search term.");

        // API request to search for videos on Eporner
        const response = await axios.get(`https://nsfw-pink-venom.vercel.app/api/eporner/search?query=${encodeURIComponent(searchTerm)}`);
        const searchResults = response.data.results;

        // Check if searchResults is an array
        if (!Array.isArray(searchResults) || searchResults.length === 0) {
            return reply("No results found for your search.");
        }

        // Format the search results into a numbered list
        let message = `*Eporner Search Results for:* "${searchTerm}"\n\n`;
        searchResults.slice(0, 5).forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nLink: ${item.url}\n\n`;
        });

        // Send the list of results as a message
        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});

// Additional command to download a video by URL and quality
cmd({
    pattern: 'eporndownload',
    desc: 'Download video from Eporner',
    category: 'nsfw',
    react: '🔞',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const [url, quality] = q.trim().split(" ");
        if (!url || !quality) return reply("Please provide a valid URL and quality (e.g., 480, 720, 1080).");

        // API request to download video from Eporner
        const downloadResponse = await axios.get(`https://nsfw-pink-venom.vercel.app/api/eporner/download?url=${encodeURIComponent(url)}&quality=${quality}`);
        const videoUrl = downloadResponse.data.download_url;

        if (!videoUrl) return reply("Download link not available for the specified quality.");

        // Send the video as a document
        await conn.sendMessage(from, {
            document: { url: videoUrl },
            mimetype: 'video/mp4',
            fileName: `Eporner-Video-${quality}p.mp4`,
            caption: `*Downloaded from Eporner*`
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});
