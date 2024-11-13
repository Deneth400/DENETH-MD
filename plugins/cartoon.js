const axios = require('axios');
const {cmd} = require('../command');
const {fetchJson} = require('../lib/functions');

// Define the command
cmd({
    pattern: "cartoon",
    react: "📥",
    alias: ["cartoonDownload", "cartoonSearch"],
    desc: "Search and download cartoons",
    category: "entertainment",
    use: '.cartoonDL <cartoon_name>',
    filename: __filename
}, async (message, match) => {
    const query = match[1] || 'ben10';  // Use provided query or fallback to 'ben10'
    const url = `https://dark-yasiya-api-new.vercel.app/search/ginisisila?text=${query}&page=1`;

    try {
        // Search for cartoons using the API
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const cartoonData = response.data;  // Get the list of results
            let msg = `Found cartoons for: *${query}*.\n\nPlease reply with the number of the cartoon you want to download:\n`;

            // Create a numbered list of cartoons
            cartoonData.forEach((cartoon, index) => {
                msg += `${index + 1}. *${cartoon.title}*\n`;
            });

            msg += `\nReply with the number to start the download.`;

            // Send the numbered list to the user
            await message.reply(msg);

            // Wait for the user to reply with a number
            message.on('message', async (userMessage) => {
                const selectedNumber = parseInt(userMessage.text.trim()) - 1;

                if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber >= cartoonData.length) {
                    return message.reply("🚩 Invalid choice. Please reply with a valid number.");
                }

                const selectedCartoon = cartoonData[selectedNumber];
                const downloadUrl = selectedCartoon.url;

                // Start downloading the selected cartoon
                await downloadCartoon(downloadUrl);
                message.reply(`Download started for: *${selectedCartoon.title}*`);
            });
        } else {
            message.reply("🚩 No cartoons found for the query.");
        }
    } catch (error) {
        console.error('Error fetching cartoons:', error);
        message.reply('🚩 An error occurred while fetching cartoons.');
    }
});

// Placeholder function for downloading cartoon
async function downloadCartoon(url) {
    try {
        console.log(`Downloading cartoon from: ${url}`);
        // Add actual download logic here (for example, download the file and send it)
        return "Download complete!";
    } catch (error) {
        console.error('Error downloading cartoon:', error);
        throw new Error('Failed to download cartoon.');
    }
}
