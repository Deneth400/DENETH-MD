const { cmd } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

let ayo = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

// Step 1: Searching for a song based on a query
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
        if (!q) return reply('🚩 *Please provide a search query.*');

        // Fetching the search results
        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
        const data = res.result;

        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

        // Build the message with search results and numbers for selection
        let message = `乂 S P O T I F Y - D L \n\n*Search Results for*: ${q}\n\n`;
        data.forEach((v, index) => {
            message += `*${index + 1}* - ${v.name} by ${v.artists} (${v.duration_ms}ms)\n`;
        });

        message += `\n\n*Reply with the number of the song you want to download (1, 2, etc.)*`;

        // Send the list of songs
        return await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log('Error in search:', e);
        return await conn.sendMessage(from, { text: '🚩 *Error occurred while processing your request!*' }, { quoted: mek });
    }
});

// Step 2: User selects the song
cmd({
    pattern: "spotifyselect",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply, body }) => {
    try {
        const selected = parseInt(q);  // The user's number selection for the song
        if (isNaN(selected) || selected < 1) return reply('🚩 *Please provide a valid number (e.g., 1, 2, 3, etc.).*');

        // Assuming the song URL is passed in 'body' from the previous step
        let songUrl = body;  // Ensure body contains the valid song URL from the previous search
        if (!songUrl) return reply('🚩 *No song URL found. Please try again.*');

        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/downloader/spotify?url=${songUrl}`);
        const song = res.result[selected - 1]; // Get the song corresponding to the selected number

        if (!song) return reply('🚩 *Invalid selection. Please try again.*');

        const downloadLink = song.download; // Assuming the response contains a download URL

        // Inform the user about the selection and ask for the download type
        const msg = `*Selected Song:*\n*Title:* ${song.title}\n*Artist:* ${song.artist}\n\n*Choose the download type:*\n\n1 - Audio\n2 - Document`;

        // Send the message asking for the download type
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
}, async (conn, mek, m, { from, q, reply, body }) => {
    try {
        const selectedType = parseInt(q); // Get the number for the selected download type
        if (isNaN(selectedType) || ![1, 2].includes(selectedType)) return reply('🚩 *Please select a valid option: 1 for Audio or 2 for Document.*');

        let songUrl = body;  // Make sure the song URL is passed correctly
        if (!songUrl) return reply('🚩 *No song URL found. Please try again.*');

        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/downloader/spotify?url=${songUrl}`);
        const song = res.result[selected - 1]; // Get song details from the API response

        if (!song) return reply('🚩 *Song not found. Please try again.*');

        const downloadLink = song.download; // Get the download link

        if (selectedType === 1) {
            // If user selects "Audio"
            const audioBuffer = await getBuffer(downloadLink); // Get audio buffer from URL
            await conn.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: mek });
            return reply('*Sending the audio file...*');
        } else if (selectedType === 2) {
            // If user selects "Document"
            const docBuffer = await getBuffer(downloadLink); // Get document buffer from URL
            await conn.sendMessage(from, { document: docBuffer, mimetype: 'audio/mpeg', fileName: `${song.title}.mp3`, caption: ayo }, { quoted: mek });
            return reply('*Sending the document (MP3) file...*');
        }
    } catch (e) {
        console.log('Error in downloading:', e);
        return reply('🚩 *Error occurred while processing your download request.*');
    }
});
