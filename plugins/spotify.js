const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, fetchJson } = require('../lib/functions')
const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

let ayo = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`

// Search for Spotify content
cmd({
    pattern: "spotify",
    alias: ["spot"],
    use: '.spotify <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD content from Spotify.",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {from, q, reply}) => {
    try {
        if (!q) return reply('🚩 *Please Give Me Words To Search*');
        
        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${q}`);
        let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ®`;
        const msg = `S P O T I F Y - D L\n\n*Entered Name:* ${q}`;

        const data = res.result;
        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I Couldn't Find Anything ☹*" }, { quoted: mek });

        let response = msg + '\n\nChoose a song number to download:';
        data.forEach((v, index) => {
            response += `\n${index + 1}. ${v.name} - ${v.artists}`;
        });

        response += `\n\n*Reply with the number of the song to proceed with the download.*`;

        return conn.sendMessage(from, { text: response }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error Occurred!*' }, { quoted: mek });
    }
});

// Download the selected Spotify content based on the user's choice
cmd({
    pattern: "spotifydl",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, body, reply}) => {
    try {
        const index = parseInt(body.trim()) - 1; // Get the index of the selected song (user input)
        if (isNaN(index)) return reply("🚩 *Please enter a valid number.*");

        let res = await fetchJson(`https://manaxu-seven.vercel.app/api/internet/spotify?query=${body.trim()}`);
        let song = res.result[index];

        if (!song) return reply("🚩 *Song not found. Please check your input.*");

        let songDetails = `S P O T I F Y - D L\n\n*Title:* ${song.name}\n*Artist:* ${song.artists}\n*Duration:* ${song.duration_ms} ms\n\nChoose the download type:`;

        let downloadLink = song.link; // Spotify URL for the download
        return conn.sendMessage(from, { text: songDetails + `\n\nSend *1* for audio or *2* for document download.`, quoted: mek });
    } catch (e) {
        console.log(e);
        reply('*Error Occurred!*');
    }
});

// Handle document download (mp3)
cmd({
    pattern: "spodoc",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, body, reply}) => {
    try {
        if (!body) return reply('*Please provide the download link!*');
        
        await conn.sendMessage(from, { react: { text: '⬇', key: mek.key } });
        conn.sendMessage(from, { document: await getBuffer(body), mimetype: 'audio/mpeg', fileName: `${body}.mp3`, caption: ayo }, { quoted: mek });
    } catch (e) {
        reply('*Error Occurred!*');
        console.log(e);
    }
});

// Handle audio download
cmd({
    pattern: "spoaud",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, {from, body, reply}) => {
    try {
        if (!body) return reply('*Please provide the download link!*');
        
        await conn.sendMessage(from, { react: { text: '⬇', key: mek.key } });
        conn.sendMessage(from, { audio: await getBuffer(body), mimetype: 'audio/mpeg' }, { quoted: mek });
    } catch (e) {
        reply('*Error Occurred!*');
        console.log(e);
    }
});
