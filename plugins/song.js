const config = require('../config');
const dl = require('@bochilteam/scraper');
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, getsize, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const { cmd, commands } = require('../command');
const yts = require('yt-search');

let wm = config.FOOTER;
let newsize = config.MAX_SIZE * 1024 * 1024;

cmd({
    pattern: 'song',
    alias: ['ytmp3', 'play'],
    use: '.song lelena',
    react: '🎧',
    desc: 'Download audios from youtube',
    category: 'download',
    filename: __filename
},

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please enter a query or a URL!');
        const url = q.replace(/\?si=[^&]*/, '');
        var results = await yts(url);
        var result = results.videos[0];

        let caption = ` 🪔 Y T - S O N G\n\n`;
        caption += `  •  Title: ${result.title}\n`;
        caption += `  •  Views: ${result.views}\n`;
        caption += `  •  Duration: ${result.duration}\n`;
        caption += `  ◦  URL: ${result.url}\n\n`;
        caption += `Reply with: \n`;
        caption += `1. *audio* to download the audio file \n`;
        caption += `2. *document* to download the audio as a document`;

        // Send search result and options
        await reply(caption);
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the song.');
    }
});

cmd({
    pattern: 'audio',
    react: '📥',
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please provide a YouTube URL!');
        const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${q}`);
        if (prog && prog.result && prog.result.download_url) {
            await conn.sendMessage(from, { audio: { url: prog.result.download_url }, mimetype: 'audio/mpeg' }, { quoted: mek });
            reply('🎶 Audio download started.');
        } else {
            await reply('❌ Error: Could not fetch the audio URL.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the audio.');
    }
});

cmd({
    pattern: 'document',
    react: '📥',
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please provide a YouTube URL!');
        const link = q.split("|")[0];
        const title = q.split("|")[1] || 'null';
        const prog = await fetchJson(`https://api-pink-venom.vercel.app/api/ytmp3?url=${link}`);
        if (prog && prog.result && prog.result.download_url) {
            const fileName = title ? `${title}.mp3` : 'audio.mp3';
            await conn.sendMessage(from, {
                document: { url: prog.result.download_url },
                mimetype: 'audio/mpeg',
                caption: wm,
                fileName: fileName
            }, { quoted: mek });
            reply('📄 Document download started.');
        } else {
            await reply('❌ Error: Could not fetch the audio document.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while fetching the audio document.');
    }
});
