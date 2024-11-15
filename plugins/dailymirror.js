// NEW ADDED NEWS SITE [ DAILY MIRROR ]

const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')
const { fetchJson } = require('../lib/functions')

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
