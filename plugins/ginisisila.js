const { cmd } = require('../command');  // Adjust this import depending on your bot framework
const axios = require('axios');  // For making API requests

// Command for searching cartoons and downloading
cmd({
    pattern: "ginisisila",  // The command to trigger the bot
    desc: "Search for a Ginisisila cartoon and download options.",
    category: "cartoon",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const query = q.trim();  // Extract the search query
        if (!query) return reply("Please provide a search term for the cartoon (e.g., !ginisisila keko).");

        // Fetch search results from Ginisisila API
        const searchUrl = `https://dark-yasiya-api-new.vercel.app/search/ginisisila?text=${encodeURIComponent(query)}&page=1`;
        const searchResponse = await axios.get(searchUrl);
        
        // Log the entire response for debugging
        console.log('Search Response:', searchResponse.data);

        if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
            return reply("No results found for the given search term.");
        }

        let message = "*Search Results:*\n\n";
        searchResponse.data.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\n`;
            message += `   *Link*: ${item.url}\n\n`;
        });

        // Send the search results to the user
        const sentMsg = await conn.sendMessage(from, {
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true },
        }, { quoted: mek });

        // Now, wait for the user to reply with the selected cartoon number
        conn.ev.on('messages.upsert', async (update) => {
            const message = update.messages[0];
            const userReply = message.message?.extendedTextMessage?.text?.trim();

            if (!userReply) return;

            const selectedNumber = parseInt(userReply, 10);
            if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > searchResponse.data.results.length) {
                await conn.sendMessage(from, { react: { text: '❌', key: message.key } });
                return reply("Invalid selection. Please select a valid number from the search results.");
            }

            // Get the URL of the selected cartoon
            const selectedCartoon = searchResponse.data.results[selectedNumber - 1];
            const cartoonUrl = selectedCartoon.url;

            // Fetch the download link from the download API
            const downloadUrl = `https://dark-yasiya-api-new.vercel.app/download/ginisisila?url=${encodeURIComponent(cartoonUrl)}`;
            const downloadResponse = await axios.get(downloadUrl);

            if (!downloadResponse.data || !downloadResponse.data.download_url) {
                await conn.sendMessage(from, { react: { text: '❌', key: message.key } });
                return reply("Sorry, we couldn't find the download link. Please try again later.");
            }

            // Send the download link to the user
            const downloadLink = downloadResponse.data.download_url;
            await conn.sendMessage(from, {
                document: { url: downloadLink },
                mimetype: 'video/mp4',
                fileName: `${selectedCartoon.title}.mp4`,
                caption: `Here is your download link for ${selectedCartoon.title}\n\n> Powered by Ginisisila API`
            }, { quoted: message });

            // React to confirm the process
            await conn.sendMessage(from, { react: { text: '✅', key: message.key } });
        });

    } catch (error) {
        console.error("Error occurred while processing the request:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply("An error occurred while processing your request. Please try again later.");
    }
});
