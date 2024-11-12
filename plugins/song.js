const config = require('../config');
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, getsize, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const { cmd, commands } = require('../command');
const yts = require('yt-search'); // Use yt-search for searching YouTube videos

let wm = config.FOOTER;

let resultsList = []; // Array to store search results for later use

cmd({
    pattern: 'song',
    alias: ['ytmp3', 'play'],
    use: '.song lelena',
    react: '🎧',
    desc: 'Download audios from youtube',
    category: 'download',
    filename: __filename
}, 

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please enter a query or a URL!');
        const url = q.replace(/\?si=[^&]*/, ''); // Remove any additional parameters from URL
        var results = await yts(url); // Use yt-search to search for the video
        resultsList = results.videos.slice(0, 5); // Limit to the first 5 search results

        let caption = `🪔 Y T - S O N G Search Results:\n\n`;
        resultsList.forEach((result, index) => {
            caption += `${index + 1}. *${result.title}*\n`;
            caption += `  • Views: ${result.views}\n`;
            caption += `  • Duration: ${result.duration}\n`;
            caption += `  • URL: ${result.url}\n\n`;
        });
        caption += `\nReply with the number of the song you want to download (e.g., 1, 2, etc.)`;

        // Send search result and instructions
        await reply(caption);
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the song.');
    }
});

// Listen for a user's reply to download the song automatically after selecting a number
cmd({
    pattern: '^[1-5]$', // Match numbers 1 to 5
    react: '📥',
    dontAddCommandList: true,
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {
    try {
        const songIndex = parseInt(q) - 1; // Convert the user input to an index (1 becomes 0, 2 becomes 1, etc.)
        if (songIndex < 0 || songIndex >= 5) return await reply('❌ Invalid selection. Please choose a valid number from the list.');

        const video = resultsList[songIndex]; // Get the selected video
        const videoUrl = video.url; // Get the YouTube URL

        let caption = `🎶 You have selected: *${video.title}*\n\nReply with:\n1. *audio* to download as audio\n2. *document* to download as document`;

        // Ask user to choose download format
        await reply(caption);

        // Wait for the user to reply with "audio" or "document"
        const response = await conn.waitForMessage(from, '^[audio|document]$', 10000); // 10 seconds timeout

        if (!response) return await reply('❌ No valid response. Please try again.');

        if (response.text === 'audio') {
            // Fetch audio URL
            const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${videoUrl}`);
            if (prog && prog.result && prog.result.download_url) {
                const audioUrl = prog.result.download_url; // Get the audio download URL
                await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: mek });
                reply(`🎶 Audio download started for *${video.title}*.`);
            } else {
                await reply('❌ Error: Could not fetch the audio URL.');
            }
        } else if (response.text === 'document') {
            // Fetch audio as document
            const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${videoUrl}`);
            if (prog && prog.result && prog.result.download_url) {
                const audioUrl = prog.result.download_url; // Get the audio download URL
                await conn.sendMessage(from, {
                    document: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    caption: wm,
                    fileName: `${video.title}.mp3`
                }, { quoted: mek });
                reply(`📄 Document download started for *${video.title}*.`);
            } else {
                await reply('❌ Error: Could not fetch the audio document.');
            }
        } else {
            await reply('❌ Invalid option. Please choose either *audio* or *document*.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while processing the download.');
    }
});

