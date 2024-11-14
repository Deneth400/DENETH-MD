const config = require('../config');
const yts = require("ytsearch-venom");
const { cmd } = require('../command');
const fetch = require('node-fetch');

const foot = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;

cmd({
    pattern: "ytv",
    alias: ["video", "ytmp4"],
    use: '.ytv <video name or URL>',
    react: "📺",
    desc: 'Download videos from YouTube',
    category: "download",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please enter a video name or URL!*');
        
        // Fetch video info using ytsearch-venom if it's a query
        let videoInfo;
        if (q.startsWith("http")) {
            videoInfo = { url: q };
        } else {
            const results = await yts(q);
            if (!results || !results.videos.length) return reply('No results found.');
            videoInfo = results.videos[0];
        }

        let caption = `*Y T - V I D E O*\n\n`;
        caption += `➻ *Title*: ${videoInfo.title || 'Unknown'}\n`;
        caption += `➻ *Views*: ${videoInfo.views || 'Unknown'}\n`;
        caption += `➻ *Duration*: ${videoInfo.duration || 'Unknown'}\n`;
        caption += `➻ *URL*: ${videoInfo.url}\n\n`;

        const buttons = [
            { name: 'single_select', buttonParamsJson: JSON.stringify({
                title: 'Choose Quality',
                sections: [
                    { rows: [
                        { title: '144p', description: 'Download in 144p', id: `.yt144 ${videoInfo.url}` },
                        { title: '240p', description: 'Download in 240p', id: `.yt240 ${videoInfo.url}` },
                        { title: '360p', description: 'Download in 360p', id: `.yt360 ${videoInfo.url}` },
                        { title: '480p', description: 'Download in 480p', id: `.yt480 ${videoInfo.url}` },
                        { title: '720p', description: 'Download in 720p', id: `.yt720 ${videoInfo.url}` },
                        { title: '1080p', description: 'Download in 1080p', id: `.yt1080 ${videoInfo.url}` }
                    ]}
                ]
            })}
        ];

        const message = {
            image: videoInfo.thumbnail,
            header: '',
            footer: foot,
            body: caption
        };

        await messageHandler.sendButtonMessage(from, buttons, context, message);
    } catch (error) {
        console.error(error);
        reply('*Error occurred while processing your request!*');
    }
});

// Handle download based on user quality selection
const qualityCmds = ["yt144", "yt240", "yt360", "yt480", "yt720", "yt1080"];
qualityCmds.forEach(quality => {
    cmd({
        pattern: quality,
        desc: `Download YouTube video in ${quality.toUpperCase()}`,
        category: "download",
        filename: __filename
    }, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
        try {
            const url = q.trim();
            if (!url) return reply("Please provide a valid YouTube URL.");

            const apiUrl = `https://api-pink-venom.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`;
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.status && result.data) {
                const downloadLink = result.data.url;
                await messageHandler.sendMessage(from, {
                    document: { url: downloadLink },
                    mimetype: 'video/mp4',
                    fileName: `${result.data.title}.mp4`,
                    caption: `${result.data.title}\n\n${foot}`
                }, { quoted: quotedMessage });

                await messageHandler.sendMessage(from, {
                    react: { text: '✅', key: quotedMessage.key }
                });
            } else {
                reply("Failed to retrieve download link. Please try another quality or check the video URL.");
            }
        } catch (error) {
            console.error(error);
            reply('*Error occurred while processing your request!*');
        }
    });
});
