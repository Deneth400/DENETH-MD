const config = require('../config');
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, getsize, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const { cmd, commands } = require('../command');
const yts = require('yt-search'); // Use yt-search for searching YouTube videos

let wm = config.FOOTER;

cmd({
    pattern: 'song',
    alias: ['ytmp3', 'play'],
    use: '.song lelena',
    react: '🎧',
    desc: 'Search for songs and download audios from YouTube',
    category: 'download',
    filename: __filename
},

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please enter a query or a URL!');
        const url = q.replace(/\?si=[^&]*/, ''); // Remove any additional parameters from URL
        var results = await yts(url); // Use yt-search to search for the song
        var resultsList = results.videos.slice(0, 5); // Limit to the first 5 search results

        let caption = `🪔 Y T - S O N G Search Results:\n\n`;
        resultsList.forEach((result, index) => {
            caption += `${index + 1}. *${result.title}*\n`;
            caption += `  • Views: ${result.views}\n`;
            caption += `  • Duration: ${result.duration}\n`;
            caption += `  • URL: ${result.url}\n\n`;
        });
        caption += `\nReply with the number of the song you want to download (e.g., 1, 2, etc.)`;

        // Send the search results as a message
        await reply(caption);
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the song.');
    }
});

cmd({
    pattern: 'downloadaudio',
    react: '📥',
    dontAddCommandList: true,
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || isNaN(q)) return await reply('❌ Please reply with the number of the song you want to download.');
        
        // Get the video from the previous search results
        const songIndex = parseInt(q) - 1;
        if (songIndex < 0 || songIndex >= 5) return await reply('❌ Invalid selection. Please choose a valid number from the list.');

        const video = results.videos[songIndex]; // Get the selected video
        const videoUrl = video.url; // Get the YouTube URL

        // Fetch the audio URL from the external API
        const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${videoUrl}`);
        
        if (prog && prog.result && prog.result.download_url) {
            const audioUrl = prog.result.download_url; // Get the audio download URL
            await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: mek });
            reply(`🎶 Audio download started for *${video.title}*.`);
        } else {
            await reply('❌ Error: Could not fetch the audio URL.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the audio.');
    }
});
