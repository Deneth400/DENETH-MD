const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');

// Store session information for ongoing interactions
let session = {};

cmd({
    pattern: "xvid",
    alias: ["xvideo"],
    use: '.xvid <query>',
    react: "🔞",
    desc: "Search and DOWNLOAD VIDEOS from xvideos.",
    category: "search",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide Search Terms.*');

        // Fetch xvideos search results from the API
        let res = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/search?query=${q}`);

        // Get the search results
        const data = res.result;
        if (data.length < 1) return await messageHandler.sendMessage(from, { text: "⭕ *I Couldn't Find Anything 🙄*" }, { quoted: quotedMessage });

        let message = `𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗫-𝗩𝗜𝗗𝗘𝗢𝗦 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n_Search Results For_ "${q}":\n\n`;
        let options = '';

        // Create a list of video results
        data.forEach((v, index) => {
            options += `${index + 1}. ${v.title}\n`;
        });

        message += options;
        message += `\n❗ *You Can Reply To A Single Number From This Command And Take The Video You Want.(Example:1)*`;
        message += `\n\n❗ *You Can Reply A Few Numbers From This Command And Take The Videos You Want.(Example:1,2,3)*`; 
        message += `\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;
        // Send the list of search results to the user
        const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/X-Videos.jpg?raw=true`},  // Assuming the movie has a poster or thumbnail
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: quotedMessage });

        // Store session for the user in session object
        session[from] = {
            searchResults: data,
            messageId: sentMessage.key.id,  // Store message ID for future reference
        };

        // Function to handle the user reply
        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];

            // Ensure this message is a reply to the original prompt
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const videoIndexes = userReply.split(',').map(x => parseInt(x.trim()) - 1); // Convert reply to an array of indexes

            // Check if all selected indexes are valid
            for (let index of videoIndexes) {
                if (isNaN(index) || index < 0 || index >= data.length) {
                    return reply("⭕ *Please Enter Valid Numbers From The List.*");
                }
            }

            // Fetch and send videos for each valid index
            for (let index of videoIndexes) {
                const selectedVideo = data[index];

                try {
                    // Fetch the download URL for the selected video
                    let downloadRes = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/download?url=${selectedVideo.url}`);
                    let videoUrl = downloadRes.url;

                    if (!videoUrl) {
                        return reply(`⭕ *Failed To Fetch Video* for "${selectedVideo.title}".`);
                    }

                    // Send the selected video to the user
                    await messageHandler.sendMessage(from, {
                        video: { url: videoUrl },
                        caption: `${selectedVideo.title}\nDuration: ${selectedVideo.duration}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`,
                    }, { quoted: quotedMessage });

                } catch (err) {
                    console.error(err);
                    return reply(`⭕ *An Error Occurred While Downloading "${selectedVideo.title}".*`);
                }
            }

            // After a selection, clear the session for that user (this is important to prevent unwanted interactions)
            delete session[from]; 
        };

        // Attach the listener for user replies
        messageHandler.ev.on("messages.upsert", handleUserReply);

    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '⭕ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});
