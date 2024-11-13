const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const { reply, conn } = require('../lib/functions');  // Assuming reply and conn are pre-defined helper functions.

let wm = 'Your Footer Message Here';  // Footer or watermark

// Command to search and download YouTube song
cmd({
    pattern: "song",
    alias: ["ytmp3", "downloadaudio"],
    use: '.song <search term>',
    react: "🎵",
    desc: 'Download audio from YouTube as MP3',
    category: "download",
    filename: __filename
},
    async (conn, m, mek, { from, q, reply }) => {
        try {
            if (!q) return await reply('Please enter a search term or YouTube URL!'); // Ensure there's a search term or URL
            
            // Search for YouTube videos using yt-search
            const results = await yts(q);
            const result = results.videos[0]; // Get the first video in the search result
            
            // If no results found
            if (!result) return await reply('No results found for your query.');
            
            // Prepare the caption with video details
            let caption = `🎶 YT - AUDIO DOWNLOAD\n\n`;
            caption += `• Title: ${result.title}\n`;
            caption += `• Views: ${result.views}\n`;
            caption += `• Duration: ${result.duration}\n`;
            caption += `• URL: ${result.url}\n\n`;

            // Send the video details and thumbnail image
            await conn.sendMessage(from, { 
                image: { url: result.thumbnail },
                caption: caption 
            });
            
            // Ask user if they want to download the audio
            reply('To download the audio in MP3 format, please reply with: "Download Audio".');
            
            // Wait for the user to reply with "Download Audio"
            conn.on('message', async (message) => {
                if (message.from === from && message.body && message.body.toLowerCase() === 'download audio') {
                    try {
                        // Call the Zazie API to get audio download URL
                        const apiUrl = `https://zazie-ytdl-api.vercel.app/api/ytaudio?url=${encodeURIComponent(result.url)}`;
                        const response = await axios.get(apiUrl);

                        // Check if the response contains the download link
                        if (response.data && response.data.url) {
                            // Send the audio download link
                            await conn.sendMessage(from, { 
                                audio: { url: response.data.url }, 
                                mimetype: 'audio/mp4', 
                                caption: '🎶 Here is your song download!' 
                            }, { quoted: mek });
                        } else {
                            reply('Sorry, something went wrong while fetching the audio download link.');
                        }
                    } catch (error) {
                        console.log(error);
                        reply('Error fetching audio download link.');
                    }
                }
            });
            
        } catch (e) {
            console.log(e);
            reply('Error occurred while searching for the video!');
        }
    }
);
