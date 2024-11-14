const { cmd } = require('../command');

cmd({
    pattern: "groupjid",  // The command to trigger the bot
    desc: "Get the Group JID",
    category: "group",
    use: '',
},
async (conn, mek, m, { from, isGroup, groupMetadata, reply }) => {
    try {
        // Check if the message was sent in a group
        if (!isGroup) return reply('This command can only be used in groups.');

        // Extract the Group JID
        const groupJid = groupMetadata.id;

        // Reply with the Group JID
        reply(`Group JID is: ${groupJid}`);
    } catch (e) {
        console.error(e);
        reply('An error occurred while retrieving the Group JID.');
    }
});
