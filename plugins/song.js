const { cmd } = require('../command');
const { fetchJson, getBuffer } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

let ayo = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

cmd({
    pattern: "spotify",
    alias: ["spot"],
    use: '.spotify <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from xvideos.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please provide a search query.*');
        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
        const data = res.result;
        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

        let message = `乂 S P O T I F Y - D L \n\n*Search Results for*: ${q}\n\n`;
        data.forEach((v, index) => {
            message += `*${index + 1}* - ${v.name} by ${v.artists} (${v.duration_ms}ms)\n`;
        });

        message += `\n\n*Reply with the number of the song you want to download (1, 2, etc.)*`;

        return await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log(e);
        return await conn.sendMessage(from, { text: '🚩 *Error occurred while processing your request!*' }, { quoted: mek });
    }
});

cmd({
    pattern: "spotifydl",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide the Spotify URL!*');
        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/downloader/spotify?url=${q}`);
        let x = res.result;
        let dat = `乂 S P O T I F Y - D L \n\n*Title:* ${x.title}\n*Type:* ${x.type}\n*Artist:* ${x.artist}\n\n*Reply with the number to select download type*\n\n1 - Audio\n2 - Document`;

        return await conn.sendMessage(from, { text: dat }, { quoted: mek });
    } catch (e) {
        reply('🚩 *Error! Could not fetch the download data.*');
        console.log(e);
    }
});

cmd({
    pattern: "spodoc",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: '*Please provide the download link...*' }, { quoted: mek });
        const docBuffer = await getBuffer(q); // Assuming q is a URL for a document
        return await conn.sendMessage(from, { document: docBuffer, mimetype: 'audio/mpeg', fileName: q + '.mp3', caption: ayo }, { quoted: mek });
    } catch (e) {
        reply('*ERROR!! Could not send document*');
        console.log(e);
    }
});

cmd({
    pattern: "spoaud",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: '*Please provide the download link...*' }, { quoted: mek });
        const audioBuffer = await getBuffer(q); // Assuming q is a URL for an audio file
        return await conn.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: mek });
    } catch (e) {
        reply('*ERROR!! Could not send audio*');
        console.log(e);
    }
});

// This command listens for the user's response after they choose a number for download type.
cmd({
    pattern: "spotifyselect",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply, body }) => {
    try {
        const selected = parseInt(q);  // Assuming q contains the number selected by the user
        if (isNaN(selected) || selected < 1) return reply('🚩 *Please provide a valid number.*');

        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/downloader/spotify?url=${body}`);  // Assuming 'body' contains the URL sent previously.
        let song = res.result[selected - 1];  // Get the song corresponding to the selected number

        if (!song) return reply('🚩 *Invalid selection.*');
        
        const downloadLink = song.download;
        const msg = `*Selected Song:*\n*Title:* ${song.title}\n*Artist:* ${song.artist}\n\n*Sending Download...*`;

        await conn.sendMessage(from, { text: msg }, { quoted: mek });

        if (body === "1") {
            // Send audio file
            return await conn.sendMessage(from, { audio: { url: downloadLink }, mimetype: "audio/mpeg" }, { quoted: mek });
        } else if (body === "2") {
            // Send document (mp3 file)
            return await conn.sendMessage(from, { document: { url: downloadLink }, mimetype: "audio/mpeg", fileName: `${song.title}.mp3`, caption: msg }, { quoted: mek });
        } else {
            return reply('🚩 *Invalid option. Please select 1 for audio or 2 for document.*');
        }
    } catch (e) {
        console.log(e);
        return reply('🚩 *Error occurred during the download process.*');
    }
});
