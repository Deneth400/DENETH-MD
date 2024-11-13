const config = require('../config');
const dl = require('@bochilteam/scraper');
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, getsize, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const { cmd, commands } = require('../command');
const yts = require("yt-search");

let wm = config.FOOTER;
let newsize = config.MAX_SIZE * 1024 * 1024;
let searchResults = {};  // Store search results to handle user selection

cmd({
    pattern: "song",
    alias: ["ytmp3", "play"],
    use: '.song <query>',
    react: "🎧",
    desc: 'Download audio from YouTube',
    category: "download",
    filename: __filename
},

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('Please enter a query or a URL!');
        const url = q.replace(/\?si=[^&]*/, '');
        const results = await yts(url);
        const result = results.videos[0];

        let caption = `🪔 *Y T - S O N G*\n\n`;
        caption += `• Title: ${result.title}\n`;
        caption += `• Views: ${result.views}\n`;
        caption += `• Duration: ${result.duration}\n`;
        caption += `• URL: ${result.url}\n\n`;
        caption += `Reply with:\n1️⃣ for Audio (Direct)\n2️⃣ for Document Format\n`;

        // Store results for the user
        searchResults[from] = result;

        await conn.sendMessage(from, { text: caption });
    } catch (e) {
        console.log(e);
        reply('Error!');
    }
});

// Handler for user replies to select download format
cmd({
    pattern: "1|2",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const selection = q.trim();
        const result = searchResults[from];  // Retrieve stored search result for the user

        if (!result) return await reply('Please search for a song first with `.song <query>`');

        // Fetch audio download link from API
        const apiResponse = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${result.url}`);
        const downloadUrl = apiResponse?.result?.download_url;

        if (selection === '1') {
            // Send as audio
            await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: mek });
        } else if (selection === '2') {
            // Send as document
            const title = result.title || 'Audio';
            await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: 'audio/mpeg', caption: wm, fileName: `${title}.mp3` }, { quoted: mek });
        }

        // Clear the search result for the user after they make a selection
        delete searchResults[from];
    } catch (e) {
        console.log(e);
        reply('Error while downloading!');
    }
});
