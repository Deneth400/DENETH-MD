const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")

cmd({
    pattern: "alive",
    react: "👋",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let totalStorage = Math.floor(os.totalmem() / 1024 / 1024) + 'MB'
let freeStorage = Math.floor(os.freemem() / 1024 / 1024) + 'MB'
let cpuModel = os.cpus()[0].model
let cpuSpeed = os.cpus()[0].speed / 1000
let cpuCount = os.cpus().length
let desc = `👋 Hey ${pushname}, I Aᴍ Aʟɪᴠᴇ Nᴏᴡ

𝗜 𝗮𝗺 *𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗* 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗕𝗼𝘁

> ʙᴏᴛ ɴᴀᴍᴇ : ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1
> ᴛᴏᴛᴀʟ ʀᴀᴍ : ${totalStorage}
> ꜰʀᴇᴇ ʀᴀᴍ : ${freeStorage}
> ᴄᴘᴜ ꜱᴘᴇᴇᴅ : ${cpuSpeed} GHz
> ᴏᴡɴᴇʀ : ᴅᴇɴᴇᴛʜ-xᴅ

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
    
return await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: desc},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

