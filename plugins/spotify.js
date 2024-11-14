const { cmd } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions');
let ayo = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

cmd({
    pattern: "spotify",
    alias: ["spot"],
    use: '.spotify <query>',
    react: "🍟",
    desc: "Search for songs on Spotify and get download options",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please provide a song name or artist to search*');

        // Fetch search results from Spotify API
        let res = await fetchJson('https://manaxu-seven.vercel.app/api/internet/spotify?query=' + q);
        
        // Handling no search results
        if (!res.result || res.result.length < 1) {
            return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });
        }

        // Prepare the message with search results and number menu
        const msg = `乂 S P O T I F Y - D L\n\n*Search Query:* ${q}\n\nPlease reply with the number of the song you want to download:`;
        
        let songList = res.result.map((v, index) => {
            return `${index + 1}. ${v.name} | Artist: ${v.artists} | Duration: ${v.duration_ms} ms`;
        }).join("\n");

        let fullMessage = `${msg}\n\n${songList}\n\nReply with the number to select the song.`;

        // Send the message with song options
        await conn.sendMessage(from, { text: fullMessage }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while searching!*' }, { quoted: mek });
    }
});

//----------------------------------- DOWNLOAD HANDLER ------------------------------------

cmd({
    pattern: "spotifydl",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide the Spotify URL!*');

        // Fetch download link from Spotify API
        let res = await fetchJson('https://manaxu-seven.vercel.app/api/downloader/spotify?url=' + q);
        let song = res.result;

        if (!song) return reply('*Error! Could not retrieve song details.*');

        let msg = `乂 S P O T I F Y - D L\n\n*Title:* ${song.title}\n*Artist:* ${song.artist}\n*Type:* ${song.type}\n\n*Select Download Type (Reply with the number)*\n\n1. Download as Document\n2. Download as Audio`;

        // Send the download options
        await conn.sendMessage(from, { text: msg }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('*Error occurred while fetching song details.*');
    }
});

//----------------------------------- AUDIO DOWNLOAD HANDLER ------------------------------------

cmd({
    pattern: "spoaud",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: '*Please provide the download link!*' }, { quoted: mek });

        // Download and send audio
        conn.sendMessage(from, { audio: await getBuffer(q), mimetype: 'audio/mpeg' }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('*ERROR !! Could not download audio.*');
    }
});

//----------------------------------- DOCUMENT DOWNLOAD HANDLER ------------------------------------

cmd({
    pattern: "spodoc",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: '*Please provide the download link!*' }, { quoted: mek });

        // Download and send document
        conn.sendMessage(from, { document: await getBuffer(q), mimetype: 'audio/mpeg', fileName: q + '.mp3', caption: ayo }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('*ERROR !! Could not download document.*');
    }
});

//----------------------------------- HANDLING REPLIES TO NUMBERED MENU ------------------------------------

cmd({
    pattern: "reply",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        let number = parseInt(q.trim());
        if (isNaN(number)) return reply("Please reply with a valid number.");

        // Handle song selection for spotify search
        if (m.text.includes("Please reply with the number")) {
            // Select the song based on the reply number
            let res = await fetchJson('https://manaxu-seven.vercel.app/api/internet/spotify?query=' + q); // Use the same query
            let song = res.result[number - 1];

            if (!song) return reply("🚩 Invalid selection!");

            // Send download options for the selected song
            const downloadMessage = `You selected *${song.name}*\n\nArtist: ${song.artists}\nDuration: ${song.duration_ms} ms\n\nNow reply with:\n\n1. Download as Document\n2. Download as Audio`;
            await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

        } else if (m.text.includes("Select Download Type")) {
            // Handle download selection
            if (number === 1) {
                // Handle Document download
                await conn.sendMessage(from, { document: await getBuffer(q), mimetype: 'audio/mpeg', fileName: q + '.mp3', caption: ayo }, { quoted: mek });
            } else if (number === 2) {
                // Handle Audio download
                await conn.sendMessage(from, { audio: await getBuffer(q), mimetype: 'audio/mpeg' }, { quoted: mek });
            } else {
                return reply("Invalid selection! Please choose 1 for Document or 2 for Audio.");
            }
        } else {
            reply("Invalid reply. Please follow the instructions carefully.");
        }

    } catch (e) {
        console.error(e);
        reply("An error occurred while processing your request.");
    }
});
