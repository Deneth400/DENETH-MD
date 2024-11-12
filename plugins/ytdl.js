const { cmd } = require('../command');
const { fetchJson, reply } = require('../lib/functions');
const yts = require('yt-search');  // YouTube search package

const wm = 'Your Footer Text';  // Customize footer text

cmd({
    pattern: 'ytdl',
    alias: ['ytvideo', 'download'],
    use: '.ytdl video_name',
    react: '🎥',
    desc: 'Download YouTube videos',
    category: 'download',
    filename: __filename
},

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please enter a search query or YouTube URL.');

        // Search YouTube for the video
        const results = await yts(q);
        const result = results.videos[0];  // Get the first video result

        if (!result) return await reply('❌ No results found for the given query.');

        let caption = `🎬 *YouTube Video Download*\n\n`;
        caption += `• Title: ${result.title}\n`;
        caption += `• Duration: ${result.duration}\n`;
        caption += `• Views: ${result.views}\n`;
        caption += `• URL: ${result.url}\n\n`;
        caption += 'Please choose a download quality:\n';
        caption += '1. *Audio (MP3)*\n';
        caption += '2. *Video (720p)*\n';
        caption += '3. *Video (1080p)*\n';

        // Send the search result and options as a message
        await reply(caption);

        // Wait for the user to reply with a choice
        conn.on('message', async (msg) => {
            const userChoice = msg.body;

            let quality = '';
            if (userChoice === '1') quality = 'audio';
            if (userChoice === '2') quality = 'video/720p';
            if (userChoice === '3') quality = 'video/1080p';

            if (!quality) return await reply('❌ Invalid choice. Please select a valid quality.');

            // Call an external API (replace with your actual API endpoint) to get the download link based on selected quality
            const downloadUrl = `https://api-pink-venom.vercel.app/api/ytdlnew?q=${result.url}&quality=${quality}`;

            // Fetch the download link
            const response = await fetchJson(downloadUrl);
            if (response && response.result && response.result.download_url) {
                const downloadLink = response.result.download_url;

                // Send the download link or media to the user
                if (quality === 'audio') {
                    await conn.sendMessage(from, { audio: { url: downloadLink }, mimetype: 'audio/mp3' }, { quoted: mek });
                } else {
                    await conn.sendMessage(from, { video: { url: downloadLink }, caption: wm }, { quoted: mek });
                }

                reply(`🎥 Downloading your video/audio in ${quality} quality...`);
            } else {
                await reply('❌ Could not fetch the download link.');
            }
        });
    } catch (e) {
        console.log(e);
        reply('❌ An error occurred while processing your request.');
    }
});
