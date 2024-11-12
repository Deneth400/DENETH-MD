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
let desc = `👋 Hey ${pushname}, I Aᴍ Aʟɪᴠᴇ Nᴏᴡ

ɪ ᴀᴍ ᴀɴ ᴀᴜᴛᴏᴍᴀᴛᴇᴅ ꜱʏꜱᴛᴇᴍ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴛʜᴀᴛ ᴄᴀɴ ʜᴇʟᴘ ᴛᴏ ᴅᴏ ꜱᴏᴍᴇᴛʜɪɴɢ,ꜱᴇᴀʀᴄʜ ᴀɴᴅ ɢᴇᴛ ᴅᴀᴛᴀ / ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ᴏɴʟʏ ᴛʜᴏᴜɢʜ ᴡʜᴀᴛꜱᴀᴘᴘ

> ʙᴏᴛ ɴᴀᴍᴇ : ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1
> ᴛᴏᴛᴀʟ ʀᴀᴍ : ${totalStorage}
> ꜰʀᴇᴇ ʀᴀᴍ : ${freeStorage}
> ᴏᴡɴᴇʀ : ᴅᴇɴᴇᴛʜ-xᴅ

🥰 𝗛𝗮𝘃𝗲 𝗮 𝗡𝗶𝗰𝗲 𝗗𝗮𝘆 🥰

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
    
return await conn.sendMessage(from,{image: {url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/Connect.jpg?raw=true`},caption: desc},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

