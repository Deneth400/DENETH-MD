const { cmd, commands } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

let searchResults = {}; // Store search results for the user temporarily
let ayo = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

cmd({
    pattern: "spotify",
    alias: ["spot"],
    use: '.spotify <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from Spotify.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please give me words to search*');
        
        // Fetching the search results from the API
        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
        const data = res.result;

        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

        // Store the search results temporarily for later use
        searchResults[from] = data;

        // Build the message with search results and numbers for selection
        let message = `乂 S P O T I F Y - D L \n\n*Search Results for*: ${q}\n\n`;
        data.forEach((v, index) => {
            message += `*${index + 1}* - ${v.name} by ${v.artists} (${v.duration_ms}ms)\n`;
        });

        message += `\n\n*Reply with the number of the song you want to download (1, 2, etc.)*`;

        // Send the list of songs
        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log('Error in search:', e);
        return await conn.sendMessage(from, { text: '🚩 *Error occurred while processing your request!*' }, { quoted: mek });
    }
});

// Step 2: User selects the song from the list
cmd({
    pattern: "spotifyselect",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const selected = parseInt(q);  // Get the user's number selection for the song
        if (isNaN(selected) || selected < 1) return reply('🚩 *Please provide a valid number (e.g., 1, 2, 3, etc.).*');

        // Ensure the search results are available
        const data = searchResults[from];
        if (!data) return reply('🚩 *No search results found. Please search first using .spotify <query>.*');

        // Check if the selected song exists in the search results
        const song = data[selected - 1];
        if (!song) return reply('🚩 *Invalid song selection. Please try again.*');

        // Build the message for song details and download type selection
        const msg = `*Selected Song:*\n*Title:* ${song.name}\n*Artist:* ${song.artists}\n*Duration:* ${song.duration_ms}ms\n*Link:* ${song.link}\n\n*Choose the download type:*\n\n1 - Audio (MP3)\n2 - Document (MP3)\n\n*Reply with 1 or 2 to select your preferred download type.*`;

        // Send the message to choose the download type
        await conn.sendMessage(from, { text: msg }, { quoted: mek });
    } catch (e) {
        console.log('Error in selecting song:', e);
        return reply('🚩 *Error occurred while processing your selection.*');
    }
});

// Step 3: User selects the download type (Audio or Document)
cmd({
    pattern: "spotifydownload",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const selectedType = parseInt(q); // Get the number for the selected download type
        if (isNaN(selectedType) || ![1, 2].includes(selectedType)) return reply('🚩 *Please select a valid option: 1 for Audio or 2 for Document.*');

        // Ensure the search results are available
        const data = searchResults[from];
        if (!data) return reply('🚩 *No search results found. Please search first using .spotify <query>.*');

        // Get the selected song
        const song = data[0]; // Assuming we are selecting the first song
        if (!song) return reply('🚩 *Song not found. Please try again.*');

        const downloadLink = song.link; // Use the song's download link (assuming it's in the response)

        // Handle download options based on user choice
        if (selectedType === 1) {
            // Download as Audio (MP3)
            let audioUrl = song.link;  // Assuming the download link is a URL
            let audioBuffer = await getBuffer(audioUrl);
            conn.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg', caption: ayo }, { quoted: mek });
        } else if (selectedType === 2) {
            // Download as Document (MP3)
            let docUrl = song.link;  // Assuming the download link is a URL
            let docBuffer = await getBuffer(docUrl);
            conn.sendMessage(from, { document: docBuffer, mimetype: 'audio/mpeg', fileName: `${song.name}.mp3`, caption: ayo }, { quoted: mek });
        }
    } catch (e) {
        console.log('Error in download:', e);
        return reply('🚩 *Error occurred while processing your download request.*');
    }
});

