const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const cheerio = require('cheerio');

// Store session information for ongoing interactions
let session = {};

// Function to search for videos on XNXX
async function xnxxs(query) {
    return new Promise((resolve, reject) => {
        const baseurl = 'https://www.xnxx.com';
        axios.get(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`)
            .then((res) => {
                const $ = cheerio.load(res.data);
                const title = [];
                const url = [];
                const desc = [];
                const results = [];

                // Scrape video details
                $('div.mozaique').each(function(a, b) {
                    $(b).find('div.thumb').each(function(c, d) {
                        url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
                    });
                });

                $('div.mozaique').each(function(a, b) {
                    $(b).find('div.thumb-under').each(function(c, d) {
                        desc.push($(d).find('p.metadata').text());
                        $(d).find('a').each(function(e, f) {
                            title.push($(f).attr('title'));
                        });
                    });
                });

                // Prepare results
                for (let i = 0; i < title.length; i++) {
                    results.push({ title: title[i], info: desc[i], link: url[i] });
                }
                resolve({ status: true, result: results });
            }).catch((err) => reject({ status: false, result: err }));
    });
}

// Search command for XNXX videos
cmd({
    pattern: "xnxx",
    alias: ["xnxxs"],
    use: '.xnxx <query>',
    react: "🍟",
    desc: "Search and DOWNLOAD VIDEOS from xnxx.",
    category: "search",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('🚩 *Please provide search terms.*');

        // Fetch search results for XNXX
        let res = await xnxxs(q);
        let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

        const msg = `乂 X N X X - D O W N L O A D E R`;

        const data = res.result;
        if (data.length < 1) return await messageHandler.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: quotedMessage });

        let message = `Search Results for "${q}":\n\n`;
        let options = '';

        // Create list of video options for user
        data.forEach((v, index) => {
            options += `${index + 1}. ${v.title} (Info: ${v.info})\n`;
        });

        message += options;
        message += `\nPlease reply with the number(s) of the video(s) you want to download, separated by commas (e.g., 1, 3, 5).`;

        // Send message to user with video options
        const sentMessage = await messageHandler.sendMessage(from, { text: message, image: { url: `https://1000logos.net/wp-content/uploads/2021/04/XNXX-logo.png` } }, { quoted: quotedMessage });

        // Store session information for future reference
        session[from] = {
            searchResults: data,
            messageId: sentMessage.key.id,  // Store message ID for future reference
        };

        // Handle user reply for video selection
        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];

            // Ensure this message is a reply to the original search prompt
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const videoIndexes = userReply.split(',').map(x => parseInt(x.trim()) - 1); // Convert reply to an array of indexes

            // Validate the selected indexes
            for (let index of videoIndexes) {
                if (isNaN(index) || index < 0 || index >= data.length) {
                    return reply("🚩 *Please enter valid numbers from the list.*");
                }
            }

            // Fetch and send the selected videos
            for (let index of videoIndexes) {
                const selectedVideo = data[index];

                try {
                    // Fetch the download URL for the selected video
                    let downloadRes = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/download?url=${selectedVideo.link}`);
                    let videoUrl = downloadRes.url;

                    if (!videoUrl) {
                        return reply(`🚩 *Failed to fetch video* for "${selectedVideo.title}".`);
                    }

                    // Send the video to the user
                    await messageHandler.sendMessage(from, {
                        video: { url: videoUrl },
                        caption: `> Downloaded via Bot\n${selectedVideo.title}\nInfo: ${selectedVideo.info}`,
                    }, { quoted: quotedMessage });

                } catch (err) {
                    console.error(err);
                    return reply(`🚩 *An error occurred while downloading "${selectedVideo.title}".*`);
                }
            }

            // Clear the session after handling the download
            delete session[from];
        };

        // Attach the listener for user replies
        messageHandler.ev.on("messages.upsert", handleUserReply);

    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '🚩 *Error occurred during the process!*' }, { quoted: quotedMessage });
    }
});

// Video download command for XNXX videos
cmd({
    pattern: "xnxxdown",
    alias: ["dlxnxx", "xnxxdl"],
    react: '🍟',
    dontAddCommandList: true,
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please provide a video URL!*');
        
        // Fetch the download link for the provided URL
        let res = await fetchJson(`https://raganork-network.vercel.app/api/xvideos/download?url=${q}`);
        let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

        // Send the video to the user
        await messageHandler.sendMessage(from, {
            video: { url: res.url },
            caption: wm
        }, { quoted: quotedMessage });

    } catch (error) {
        reply('*Error !!*');
        console.log(error);
    }
});
