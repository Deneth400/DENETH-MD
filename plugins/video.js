const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const { reply, conn } = require('../lib/functions');  // Assuming reply and conn are pre-defined helper functions.

let wm = 'Your Footer Message Here';  // Footer or watermark

// Command to search and download YouTube video
cmd({
    pattern: "video",
    alias: ["ytmp4", "downloadvideo"],
    use: '.video <search term>',
    react: "🎬",
    desc: 'Download video from YouTube with quality options',
    category: "download",
    filename: __filename
},
    async (conn, m, mek, { from, q, reply }) => {
        try {
            if (!q) return await reply('Please enter a search term or YouTube URL!');  // Ensure there's a search term or URL
            
            // Search for YouTube videos using yt-search
            const results = await yts(q);
            const result = results.videos[0]; // Get the first video in the search result
            
            // If no results found
            if (!result) return await reply('No results found for your query.');
            
            // Prepare the caption with video details
            let caption = `🎬 YT - VIDEO DOWNLOAD\n\n`;
            caption += `• Title: ${result.title}\n`;
            caption += `• Views: ${result.views}\n`;
            caption += `• Duration: ${result.duration}\n`;
            caption += `• URL: ${result.url}\n\n`;

            // Send the video details and thumbnail image
            await conn.sendMessage(from, { 
                image: { url: result.thumbnail },
                caption: caption 
            });
            
            // Ask user for the desired quality
            reply('To download the video, reply with the quality you prefer (e.g., 360p, 480p, 720p, 1080p).');

            // Wait for the user to reply with the quality
            conn.on('message', async (message) => {
                if (message.from === from && message.body) {
                    const quality = message.body.toLowerCase().trim();

                    // Check if the quality is one of the available options
                    const validQualities = ['360p', '480p', '720p', '1080p'];
                    if (validQualities.includes(quality)) {
                        try {
                            // Call the Pink Venom API to get the download link for the selected quality
                            const apiUrl = `https://api-pink-venom.vercel.app/api/ytmp4?url=${encodeURIComponent(result.url)}&quality=${quality}`;
                            const response = await axios.get(apiUrl);

                            // If the response contains a valid download URL
                            if (response.data && response.data.url) {
                                // Send the video download link
                                await conn.sendMessage(from, { 
                                    video: { url: response.data.url }, 
                                    mimetype: 'video/mp4', 
                                    caption: `🎬 Here is your ${quality} video download!` 
                                }, { quoted: mek });
                            } else {
                                reply('Sorry, I couldn\'t fetch the download link for the selected quality.');
                            }
                        } catch (error) {
                            console.log(error);
                            reply('Error fetching video download link.');
                        }
                    } else {
                        reply('Invalid quality selected. Please reply with one of the following options: 360p, 480p, 720p, or 1080p.');
                    }
                }
            });
            
        } catch (e) {
            console.log(e);
            reply('Error occurred while searching for the video!');
        }
    }
);
