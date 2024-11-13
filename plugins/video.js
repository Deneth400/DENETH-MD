const config = require('../config');
const dl = require('@bochilteam/scraper');
const fs = require('fs');
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    getsize,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions');
const {
    cmd,
    commands
} = require('../command');
const yts = require("yt-search");

let wm = config.FOOTER;
let newsize = config.MAX_SIZE * 1024 * 1024;

// Command to search and download YouTube videos
cmd({
    pattern: "video",
    alias: ["ytmp4", "downloadvideo"],
    use: '.video <search or url>',
    react: "🎬",
    desc: 'Download videos from YouTube',
    category: "download",
    filename: __filename
},
    async (conn, m, mek, { from, q, reply }) => {
        try {
            if (!q) return await reply('Please enter a query or a URL!');
            
            const url = q.replace(/\?si=[^&]*/, ''); // Clean the URL
            const results = await yts(url); // Search YouTube using yt-search
            const result = results.videos[0]; // Get the first video from the search results

            // Prepare the caption with video details
            let caption = `🎥 Y T - V I D E O\n\n`;
            caption += `• Title: ${result.title}\n`;
            caption += `• Views: ${result.views}\n`;
            caption += `• Duration: ${result.duration}\n`;
            caption += `◦ URL: ${result.url}\n\n`;

            // Send the video details and the thumbnail
            await conn.sendMessage(from, { 
                image: { url: result.thumbnail }, 
                caption: caption 
            });

            // Ask for the quality of the video
            reply('Please select a quality to download: 360p, 480p, 720p, or 1080p.');

        } catch (e) {
            console.log(e);
            reply('Error occurred while searching for the video!');
        }
    }
);

// Command to download the video based on quality
cmd({
    pattern: "ytvdl",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
},
    async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return await reply('Need a YouTube URL and quality!');
            
            const [link, quality] = q.split(" "); // Split the input into link and quality
            if (!link || !quality) return await reply('Please provide a valid YouTube URL and quality!');
            
            const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytdl?url=${link}&quality=${quality}`);
            
            // Send the video download link
            if (prog.result && prog.result.download_url) {
                await conn.sendMessage(from, { 
                    video: { url: prog.result.download_url }, 
                    mimetype: 'video/mp4', 
                    caption: `🎬 Downloading ${quality} quality video` 
                }, { quoted: mek });
            } else {
                reply('Could not fetch the download link. Please try again later.');
            }
        } catch (e) {
            console.log(e);
            reply('Error occurred while fetching the download link!');
        }
    }
);
