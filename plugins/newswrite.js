// NEW ADDED NEWS SITE [ NEWSWRITE ]

const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://dark-yasiya-api-new.vercel.app/news/NewsWrite' // API LINK FOR NEWSWRITE


// ================================NEWSWRITE NEWS========================================

cmd({
    pattern: "newswritenews",
    alias: ["newswrite", "news7"],
    react: "📜",
    desc: "Fetches the latest news from NewsWrite",
    category: "news",
    use: '.newswritenews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch news from the NewsWrite API
        const news = await fetchJson(apilink)

        // Format the message to be sent
        const msg = `
*NEWSWRITE NEWS*

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
