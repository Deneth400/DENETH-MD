const yts = require('yt-search');
const axios = require('axios');
const { cmd, commands } = require('../command');

// Command to search YouTube videos by title and allow quality selection for download
cmd({
    pattern: "ytdl",
    desc: "Search and download YouTube video",
    category: "download",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const searchQuery = q.trim();
        if (!searchQuery) return reply("Please provide a video title to search for.");

        // Search YouTube using yt-search by title
        const searchResults = await yts(searchQuery);

        // Check if results are returned
        if (searchResults && searchResults.videos.length > 0) {
            let msg = `*YouTube Search Results for:* "${searchQuery}"\n\n`;
            searchResults.videos.slice(0, 5).forEach((video, index) => {
                msg += `${index + 1}. *${video.title}*\nDuration: ${video.timestamp}\nLink: ${video.url}\n\n`;
            });
            msg += "*Reply with a number (1-5) to select a video for download.*";

            // Send list of search results
            await conn.sendMessage(from, { text: msg }, { quoted: mek });

            // Wait for user to select a video by number
            conn.on('message-new', async (msg) => {
                const selection = parseInt(msg.body.trim());
                if (isNaN(selection) || selection < 1 || selection > 5) {
                    return reply("Invalid selection. Please reply with a number between 1 and 5.");
                }

                // Get the selected video’s details
                const selectedVideo = searchResults.videos[selection - 1];
                const selectedUrl = selectedVideo.url;

                // Message prompting for quality selection
                let qualityMsg = "*Select Quality:*\n";
                qualityMsg += "1. SD (420p)\n";
                qualityMsg += "2. HD (720p)\n";
                qualityMsg += "3. FHD (1080p)\n";
                qualityMsg += "4. Audio Only (128 kbps)\n";
                qualityMsg += "Reply with a number (1-4) to choose a quality.";

                // Send quality selection prompt
                await conn.sendMessage(from, { text: qualityMsg }, { quoted: mek });

                // Wait for user to select a quality
                conn.on('message-new', async (msg) => {
                    const qualitySelection = parseInt(msg.body.trim());
                    let quality;
                    switch (qualitySelection) {
                        case 1:
                            quality = 'videos/420';
                            break;
                        case 2:
                            quality = 'videos/720';
                            break;
                        case 3:
                            quality = 'videos/1080';
                            break;
                        case 4:
                            quality = 'audios/128';
                            break;
                        default:
                            return reply("Invalid quality selection. Please reply with a number between 1 and 4.");
                    }

                    // Call the API to get the download link based on the selected quality
                    const downloadEndpoint = `https://prabath-md-youtube-dl.vercel.app/api/ytdlnew?q=${encodeURIComponent(selectedUrl)}&quality=${quality}`;
                    const downloadResponse = await axios.get(downloadEndpoint);
                    const downloadData = downloadResponse.data;

                    if (downloadData && downloadData.url) {
                        const downloadMsg = `*Download Link for ${selectedVideo.title}*\n\nQuality: ${qualitySelection === 4 ? 'Audio (128 kbps)' : `${qualitySelection === 1 ? '420p' : qualitySelection === 2 ? '720p' : '1080p'}`}\nLink: ${downloadData.url}\n\n*ᴍᴇᴅᴢ-ᴍᴅ ʙʏ ɴᴇᴛʜᴍɪᴋᴀᴛᴇᴄʜ*`;
                        await conn.sendMessage(from, { text: downloadMsg }, { quoted: mek });
                    } else {
                        reply("Failed to retrieve the download link. Please try again.");
                    }
                });
            });
        } else {
            reply("No results found. Please try a different search term.");
        }
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});
