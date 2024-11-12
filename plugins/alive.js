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
let documentMessage = {
            url: 'https://mmg.whatsapp.net/v/t62.7119-24/32511132_500473132560305_5925723291063172577_n.enc?ccb=11-4&oh=01_Q5AaIKnXNmUWgmxyNn_1uxfEnGyiI-eCZ-BMRZdX3O2jhQq2&oe=66BE7A32&_nc_sid=5e03e0&mms3=true',
            mimetype: "application/pdf",
            fileSha256: 'FikZgFEcHv5jpyU1PhL10sPCmtsmcqnWUKaxot10tUU=',
            fileLength: 1e14,
            mediaKey: 'RZ3iF3NexfIjD1MB9EfJhMo/xcBZnbEZ/gVSuxlrHWE=',
            fileName: "𝐃𝐄𝐍𝐄𝐓𝐇-𝐌𝐃 𝐕𝟏",
            fileEncSha256: 'K+Bkh4AGLJTffSvs63DuMZumwquU014W8XsaWvfakPM=',
            directPath: '/v/t62.7119-24/32511132_500473132560305_5925723291063172577_n.enc?ccb=11-4&oh=01_Q5AaIKnXNmUWgmxyNn_1uxfEnGyiI-eCZ-BMRZdX3O2jhQq2&oe=66BE7A32&_nc_sid=5e03e0',
        };
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
    
let message = {
        image: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/DENETH-MD.jpg?raw=true`,
      header: 'documentMessage',
      

      body: desc
    
    }
return await conn.sendMessage(from, m, message)
}catch(e){
console.log(e)
reply(`${e}`)
}
})

