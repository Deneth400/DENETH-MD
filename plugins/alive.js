const config = require('../config')
const {cmd , commands} = require('../command')

cmd({
    pattern: "alive",
    react: "👋",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let desc = `👋 Hey ${pushnam}, I Aᴍ Aʟɪᴠᴇ Nᴏᴡ

𝗜 𝗮𝗺 *𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗* 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗕𝗼𝘁

> ʙᴏᴛ ɴᴀᴍᴇ : ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1
> ᴜᴘᴛɪᴍᴇ : ${runtime(process.uptime())}
> ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
> ʜᴏꜱᴛ ɴᴀᴍᴇ : ${os.hostname()}
> ᴏᴡɴᴇʀ : ᴅᴇɴᴇᴛʜ-xᴅ

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
    
return await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

