const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

let currentSearchResults = {};  // Store search results for each user

// Search Command
cmd({
    pattern: "tiktoksearch",
    alias: ["tiks"],
    use: '.tiktoksearch <query>',
    react: "🍟",
    desc: "Search TikTok videos",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please provide search terms*');

        // Fetch TikTok search results
        let response = await fetchJson(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(q)}`);
        let data = response.data;

        if (!data || data.length === 0) {
            return await conn.sendMessage(from, { text: "🚩 *No results found :(*" }, { quoted: mek });
        }

        // Create the numbered list
        let msg = "🎬 *TikTok Search Results:*\n\n";
        data.slice(0, 5).forEach((video, index) => {
            msg += `${index + 1}. *${video.title}*\nCreator: ${video.creator}\nRegion: ${video.region}\n\n`;
        });
        msg += "Reply with a number (1-5) to download a video.";

        currentSearchResults[from] = data;  // Store search results by user

        await conn.sendMessage(from, { text: msg }, { quoted: mek });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: "🚩 *Error occurred while searching.*" }, { quoted: mek });
    }
});

// Download Command (responds to a number from the user)
cmd({
    pattern: "",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, reply }) => {
    try {
        const userSelection = parseInt(body.trim(), 10) - 1;
        if (isNaN(userSelection) || userSelection < 0 || !currentSearchResults[from] || userSelection >= currentSearchResults[from].length) {
            return;
        }

        const selectedVideo = currentSearchResults[from][userSelection];
        const videoUrl = selectedVideo.nowm;
        const wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;

        // Send the video to the user
        await conn.sendMessage(from, { video: { url: videoUrl }, caption: wm }, { quoted: mek });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: "*Error occurred while downloading the video.*" }, { quoted: mek });
    }
});
