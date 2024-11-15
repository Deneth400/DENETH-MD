// NEW ADDED NEWS SITE [ BBC , LANKADEEPA ]

const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://dark-yasiya-news-apis.vercel.app/api' // API LINK ( DO NOT CHANGE THIS!! )


// ================================LANKADEEPA NEWS========================================

cmd({
    pattern: "lankadeepanews",
    alias: ["lankadeepa","news1"],
    react: "📰",
    desc: "",
    category: "news",
    use: '.lankadeepanews',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply }) => {
try{

const news = await fetchJson(`${apilink}/lankadeepa`)
  
const msg = `
*LANKADEEPA NEWS DENETH-MD*
       
* Title - ${news.result.title}

* News - ${news.result.desc}

* Date - ${news.result.date}

* Link - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`


await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
} catch (e) {
console.log(e)
reply(e)
}
})

// ================================BBC NEWS========================================

cmd({
    pattern: "bbcnews",
    alias: ["bbc","news2"],
    react: "🌍",
    desc: "",
    category: "news",
    use: '.bbcnews',
    filename: __filename
},
async(conn, mek, m,{from, quoted, reply }) => {
try{

const news = await fetchJson(`${apilink}/bbc`)
  
const msg = `
*BBC NEWS DENTH-MD*

       
* Title - ${news.result.title}

* News - ${news.result.desc}

* Link - ${news.result.url} 

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
} catch (e) {
console.log(e)
reply(e)
}
})

// ================================HIRU NEWS========================================
cmd({
    pattern: "hirunews",
    alias: ["hiru","news3"],
    react: "☀",
    desc: "",
    category: "news",
    use: '.hirunews',
    filename: __filename
},
async(conn, mek, m,{from, quoted }) => {
try{

const news = await fetchJson(`${apilink}/hiru`)
  
const msg = `
*HIRU NEWS DENETH-MD*

       
• *Title* - ${news.result.title}

• *News* - ${news.result.desc}

• *Link* - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
} catch (e) {
console.log(e)
reply(e)
}
})

// ================================SIRASA NEWS========================================

cmd({
    pattern: "sirasanews",
    alias: ["sirasa","news4"],
    react: "🔺",
    desc: "",
    category: "news",
    use: '.sirasa',
    filename: __filename
},
async(conn, mek, m,{from, quoted }) => {
try{

const news = await fetchJson(`${apilink}/sirasa`)
  
const msg = `
*SIRASA NEWS DENETH-MD*
 
• *Title* - ${news.result.title}

• *News* - ${news.result.desc}

• *Link* - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
} catch (e) {
console.log(e)
reply(e)
}
})

// ================================DERANA NEWS========================================

cmd({
    pattern: "derananews",
    alias: ["derana","news5"],
    react: "🟥",
    desc: "",
    category: "news",
    use: '.derana',
    filename: __filename
},
async(conn, mek, m,{from, quoted }) => {
try{

const news = await fetchJson(`${apilink}/derana`)
  
const msg = `
*DERANA NEWS DENETH-MD*
       
• *Title* - ${news.result.title}

• *News* - ${news.result.desc}

• *Date* - ${news.result.date}

• *Link* - ${news.result.url} 

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
} catch (e) {
console.log(e)
reply(e)
}
})

// NEW ADDED NEWS SITE [ DAILY MIRROR ]
const apilink = 'https://dark-yasiya-api-new.vercel.app/news/dailymirror' // API LINK FOR DAILY MIRROR

// ================================DAILY MIRROR NEWS========================================

cmd({
    pattern: "dailymirrornews",
    alias: ["dailymirror", "news6"],
    react: "🗞️",
    desc: "Fetches the latest news from Daily Mirror",
    category: "news",
    use: '.dailymirrornews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch news from the Daily Mirror API
        const news = await fetchJson(apilink)

        // Format the message to be sent
        const msg = `
*DAILY MIRROR NEWS*

*Title* - ${news.result.title}

*News* - ${news.result.desc}

*Date* - ${news.result.date}

*Link* - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

        // Send the message with an image if available
        await conn.sendMessage(from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply("Error fetching news. Please try again later.")
    }
})
// New API link for GAGANA News ( DO NOT CHANGE THIS!! )
const apilink = 'https://dark-yasiya-api-new.vercel.app/news/gagana';

// ================================ GAGANA NEWS =====================================

cmd({
    pattern: "gagananews", // Command for fetching news
    alias: ["gagana", "news5"], // Aliases for the command
    react: "📰", // Emoji reaction to indicate news
    desc: "Fetch the latest news from GAGANA",
    category: "news", // Category of the command
    use: '.gagananews', // How to use the command
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest GAGANA news from the API
        const news = await fetchJson(apilink);
        
        // Safely handle missing or empty image URL
        const imageUrl = news.result.image ? news.result.image : 'https://via.placeholder.com/150'; // Placeholder if no image
        
        // Ensure that desc is a string
        const desc = news.result.desc ? news.result.desc.toString() : 'No description available';
        
        // Prepare the message with relevant details
        const msg = `
            *GAGANA NEWS FROM DARK YASIYA API*\n\n
            *Title:* ${news.result.title}\n
            *News:* ${desc}\n
            *Date:* ${news.result.date}\n
            *Link:* ${news.result.url}\n\n
            > ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ
        `;

        // Send message with image (if available) and caption
        await conn.sendMessage(from, { image: { url: imageUrl }, caption: msg }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred while fetching the news: ${e.message}`);
    }
});
