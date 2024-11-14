const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "xvid",
    alias: ["xvideo"],
    use: '.xvid <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from xvideos.",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please provide search terms.*');

        // Fetch search results from API
        let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/search?query=' + q);
        let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;
        const msg = `乂 X V I D - D O W N L O A D E R`;

        const data = res.result;
        if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

        // Build the search results message
        let message = `Search Results for "${q}":\n\n`;
        let options = '';

        // Create a list of video results
        data.forEach((v, index) => {
            options += `${index + 1}. ${v.title} (Duration: ${v.duration})\n`;
        });

        message += options;
        message += `\nPlease reply with the number of the video you want to download.`;

        // Send search results message
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Handle the user's reply to select a video
        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];

            // Ensure that the message is a reply to the original search message
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== mek.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const videoIndex = parseInt(userReply) - 1; // Convert the user's reply to an index

            // Validate the input
            if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= data.length) {
                return reply("🚩 *Please enter a valid number from the list.*");
            }

            const selectedVideo = data[videoIndex];

            // Fetch the download URL for the selected video
            let downloadRes = await fetchJson('https://raganork-network.vercel.app/api/xvideos/download?url=' + selectedVideo.url);
            let videoUrl = downloadRes.url;

            if (!videoUrl) {
                return reply("🚩 *Failed to fetch video. Try a different selection.*");
            }

            // Send the video to the user
            await conn.sendMessage(from, { 
                video: { url: videoUrl },
                caption: `> Downloaded via DENETH-MD Bot\n${selectedVideo.title}\nDuration: ${selectedVideo.duration}`,
            }, { quoted: mek });

            // Stop listening to the user's messages once the download link has been sent
            conn.ev.off("messages.upsert", handleUserReply);
        };

        // Attach the listener for user replies
        conn.ev.on("messages.upsert", handleUserReply);

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred during the process!*' }, { quoted: mek });
    }
});

//------------------------xvideodown (downloading video)------------------------------
cmd({
    pattern: "xvideodown",
    alias: ["xviddl", "xvideodl"],
    react: '🍟',
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide a video URL!*');
        
        // Fetch the download link for the provided URL
        let res = await fetchJson('https://raganork-network.vercel.app/api/xvideos/download?url=' + q);
        let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

        // Send the video to the user
        await conn.sendMessage(from, { 
            video: { url: res.url },
            caption: wm
        }, { quoted: mek });

    } catch (e) {
        reply('*Error !!*');
        console.log(e);
    }
});
