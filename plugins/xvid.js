const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "xvideo",
    alias: ["xvid"],
    use: '.xvid <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from xvideos.",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isGroup }) => {
    try {
        if (!q) return reply('🚩 *Please provide search terms.*');
        let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/search?query=' + q);
        const wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

        const data = res.result;
        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

        let msg = `乂 X V I D - D O W N L O A D E R\n\n*Search results for:* ${q}\n\nSelect a video by typing its number:\n`;
        data.forEach((v, index) => {
            msg += `\n${index + 1}. *${v.title}*\n   Info: ${v.duration}\n`;
        });
        msg += `\n\n${wm}`;

        await conn.sendMessage(from, { text: msg }, { quoted: mek });

        // Wait for the user to select a video by typing the number.
        const filter = (m) => m.key.remoteJid === from && m.message && m.message.conversation;
        const messages = await conn.waitForMessages({ filter, timeout: 60000 });

        if (messages.length > 0) {
            const message = messages[0];
            const choice = parseInt(message.message.conversation.trim()) - 1;

            if (isNaN(choice) || choice < 0 || choice >= data.length) {
                return reply("🚩 Invalid choice. Please reply with a valid number.");
            }

            const selectedVideo = data[choice];
            const downloadMessage = `*Downloading:* ${selectedVideo.title}\nPlease wait...`;

            await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

            // Proceed with video download
            let downloadRes = await fetchJson('https://raganork-network.vercel.app/api/xvideos/download?url=' + selectedVideo.url);
            const downloadUrl = downloadRes.url;

            await conn.sendMessage(from, { video: { url: downloadUrl }, caption: wm }, { quoted: mek });
        } else {
            await reply("🚩 No response received. Please try again.");
        }
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error!*' }, { quoted: mek });
    }
});

//------------------------dl---------------
cmd({
    pattern: "xvideodown",
    alias: ["xviddl", "xvideodl"],
    react: '🍟',
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide a valid video URL!*');
        let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/download?url=' + q);
        const wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

        await conn.sendMessage(from, { video: { url: res.url }, caption: wm }, { quoted: mek });
    } catch (e) {
        reply('*Error!*');
        console.log(e);
    }
});
