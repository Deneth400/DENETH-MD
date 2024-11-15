const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');
const apkdl = require('../lib/apkdl');
const ufs = require('../lib/ufs');

let newsize = config.MAX_SIZE * 1024 * 1024;
let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`;

var N_FOUND = "🚩 *I couldn't find anything :(*";
var urlneed = "🚩 *It downloads apps from playstore.*";  // Ensure this line exists
var imgmsg = "🚩 ``*Please write a few words*";

cmd({
    pattern: "apk",
    react: "🍟",
    alias: ["app", "playstore"],
    desc: urlneed,  // Reference to urlneed
    category: "download",
    use: '.apk whatsapp',
    filename: __filename,
}, async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    // ...your existing code, unchanged
});
        if (!q) return await conn.sendMessage(from, { text: imgmsg }, { quoted: mek });
        
        // Fetch search results from Play Store
        const data2 = await apkdl.search(q);
        const data = data2;

        if (data.length < 1) return await conn.sendMessage(from, { text: N_FOUND }, { quoted: mek });

        // List the apps with numbers
        let message = `ジ A P K - D O W N L O A D E R\n\nChoose the number of the app you want to download:\n`;
        data.forEach((v, index) => {
            message += `${index + 1}. ${v.name} (ID: ${v.id})\n`;
        });
        
        // Prompt user to select an app number
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Await user reply using a custom message collector function
        const selectedAppIndex = await collectUserResponse(conn, from, mek, 30000);
        
        if (isNaN(selectedAppIndex) || selectedAppIndex < 0 || selectedAppIndex >= data.length) {
            return await conn.sendMessage(from, { text: '🚩 *Invalid selection. Please reply with a valid number.*' }, { quoted: mek });
        }

        const selectedApp = data[selectedAppIndex];

        // Fetch download details
        const downloadData = await apkdl.download(selectedApp.id);
        let listdata = `ジ A P K - D O W N L O A D E R\n
        ┌ ◦ *Name :* ${downloadData.name}
        │ ◦ *Developer :* ${downloadData.package}
        │ ◦ *Last update :* ${downloadData.lastup}
        └ ◦ *Size :* ${downloadData.size}`;

        // Send APK details
        await conn.sendMessage(from, { image: { url: downloadData.icon }, caption: listdata }, { quoted: mek });

        let sizeb = await ufs(downloadData.dllink);
        if (sizeb > newsize) return await conn.sendMessage(from, { text: '*File size is too big...*' }, { quoted: mek });

        // Send APK file
        await conn.sendMessage(from, { document: { url: downloadData.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${downloadData.name}.apk`, caption: '' }, { quoted: mek });

        // React with success
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key } });

    } catch (e) {
        console.log(e);
        reply('*ERROR !!*');
    }
});

// Custom function to collect user response
async function collectUserResponse(conn, from, mek, timeout) {
    const filter = response => response.key.remoteJid === from && response.message.text;
    const collected = [];

    const collector = setTimeout(() => {
        conn.removeListener('message', listener); // Stop listening after timeout
    }, timeout);

    const listener = async (response) => {
        if(filter(response)) {
            clearTimeout(collector); // If response is valid, clear the timeout
            collected.push(response.message.text.trim());
        }
    };

    conn.on('message', listener);

    // Wait until the collector finishes
    await new Promise(resolve => {
        collected.length ? resolve(collected[0]) : setTimeout(() => resolve(null), timeout);
    });

    conn.removeListener('message', listener); // Clean up listener
    return collected.length ? parseInt(collected[0]) - 1 : null; // Return the index or null if no valid response
}
