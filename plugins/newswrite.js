const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://dark-yasiya-api-new.vercel.app/news/NewsWrite' // API LINK ( DO NOT CHANGE THIS!! )

// ================================NEW ADDED NEWS SITE========================================

cmd({
    pattern: "news",
    alias: ["latestnews", "newswrite"],
    react: "📰",
    desc: "Fetch latest news from Dark Yasiya API",
    category: "news",
    use: '.news',
    filename: __filename
},
async(conn, mek, m, {from, quoted, reply }) => {
    try {
        // Fetch the latest news from the API
        const news = await fetchJson(`${apilink}`)
        
        const msg = 
        `*LATEST NEWS FROM DARK YASIYA API*\n\n
        *Title:* ${news.result.title}\n
        *News:* ${news.result.desc}\n
        *Date:* ${news.result.date}\n
        *Link:* ${news.result.url}\n\n
        > ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`

        await conn.sendMessage( from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek })
    } catch (e) {
        console.log(e)
        reply(e)
    }
})
