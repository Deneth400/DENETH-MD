const axios = require('axios');
const { cmd, commands } = require('../command');

// Command to search for videos on Eporner and handle download based on quality
cmd({
    pattern: "epsearch",
    desc: "Search and download videos from Eporner",
    category: "nsfw",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const searchQuery = q.trim();
        if (!searchQuery) return reply("Please provide a keyword to search.");

        // Search for videos using the Eporner search API
        const searchEndpoint = `https://nsfw-pink-venom.vercel.app/api/eporner/search?query=${encodeURIComponent(searchQuery)}`;
        const searchResponse = await axios.get(searchEndpoint);
        const searchResults = searchResponse.data;

        // Check if any results were returned
        if (!searchResults || searchResults.length === 0) {
            return reply("No results found. Try a different search term.");
        }

        // Prepare a message with the list of search results
        let msg = `*Eporner Search Results for:* "${searchQuery}"\n\n`;
        searchResults.slice(0, 5).forEach((video, index) => {
            msg += `${index + 1}. *${video.title}*\nDuration: ${video.duration}\nViews: ${video.views}\nLink: ${video.url}\n\n`;
        });
        msg += "*Reply with a number (1-5) to select a video for download.*";

        // Send the search results message
        await conn.sendMessage(from, { text: msg }, { quoted: mek });

        // Listen for user selection to choose a video
        conn.on('message-new', async (msg) => {
            const selection = parseInt(msg.body.trim());
            if (isNaN(selection) || selection < 1 || selection > 5) {
                return reply("Invalid selection. Please reply with a number between 1 and 5.");
            }

            // Get the selected video's URL
            const selectedVideo = searchResults[selection - 1];
            const selectedUrl = selectedVideo.url;

            // Prompt for quality selection
            let qualityMsg = "*Select Download Quality:*\n";
            qualityMsg += "1. Low Quality\n";
            qualityMsg += "2. Medium Quality\n";
            qualityMsg += "3. High Quality\n";
            qualityMsg += "Reply with a number (1-3) to choose a quality.";

            await conn.sendMessage(from, { text: qualityMsg }, { quoted: mek });

            // Listen for quality selection
            conn.on('message-new', async (msg) => {
                const qualitySelection = parseInt(msg.body.trim());
                let quality;
                switch (qualitySelection) {
                    case 1:
                        quality = 'low';
                        break;
                    case 2:
                        quality = 'medium';
                        break;
                    case 3:
                        quality = 'high';
                        break;
                    default:
                        return reply("Invalid quality selection. Please reply with a number between 1 and 3.");
                }

                // Call the API to get the download link based on quality
                const downloadEndpoint = `https://nsfw-pink-venom.vercel.app/api/eporner/download?url=${encodeURIComponent(selectedUrl)}&quality=${quality}`;
                const downloadResponse = await axios.get(downloadEndpoint);
                const downloadData = downloadResponse.data;

                if (downloadData && downloadData.url) {
                    const downloadMsg = `*Download Link for ${selectedVideo.title}*\n\nQuality: ${quality.toUpperCase()}\nLink: ${downloadData.url}`;
                    await conn.sendMessage(from, { text: downloadMsg }, { quoted: mek });
                } else {
                    reply("Failed to retrieve the download link. Please try again.");
                }
            });
        });
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});
