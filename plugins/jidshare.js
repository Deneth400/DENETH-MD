const config = require('../config')
const {cmd , commands} = require('../command')


cmd({
    pattern: "f",
    desc: "Send a message to a specific JID",
    category: "main",
    use: '',
},
   async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!args[0]) return reply("Please provide the JID.");
        if (args.length < 2) return reply("Please provide the message to send.");

        const targetJid = args[0]; 
        const message = args.slice(1).join(' '); 
        await conn.sendMessage(targetJid, { text: message });
        reply(Message successfully sent to ${targetJid}. ✅);
    } catch (e) {
        reply("An error occurred while sending the message.");
        console.error(e);
    }
});
