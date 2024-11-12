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
    
        let opts = {
            image: `https://8030.us.kg/file/mKXIMtf1PF1i.jpg`,
            header: '',
            body: desc
        }

return await conn.sendButtonMessage(from, m, opts)
}catch(e){
console.log(e)
reply(`${e}`)
}
})

