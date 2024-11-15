const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://dark-yasiya-news-apis.vercel.app/api' // API LINK ( DO NOT CHANGE THIS!! )


// ================================LANKADEEPA NEWS========================================

cmd({
    pattern: "lankadeepanews",
    alias: ["lankadeepa","news4"],
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
    alias: ["bbc", "news5"],
    react: "🌍",
    desc: "Fetch the latest news from BBC.",
    category: "news",
    use: '.bbcnews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest news from BBC API
        const news = await fetchJson(apilink);

        // Check if the API returns the expected result
        if (!news || !news.result) {
            return reply("❗ Failed to fetch news. Please try again later.");
        }

        // Structure the news message
        const msg = `
*BBC NEWS DENETH-MD*

* Title - ${news.result.title}

* News - ${news.result.desc}

* Link - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`;

        // Send the message with news details
        await conn.sendMessage(from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply("❗ An error occurred while fetching BBC News. Please try again later.");
    }
});

// ================================HIRU NEWS========================================
cmd({
    pattern: "hirunews",
    alias: ["hiru","news1"],
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
    alias: ["sirasa","news2"],
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
    alias: ["derana","news3"],
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

//================ADA NEWS=========================
cmd({
    pattern: "adanews",
    alias: ["ada", "news6"],
    react: "📰",
    desc: "Fetch the latest news from Ada News.",
    category: "news",
    use: '.adanews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest news from Ada News API
        const news = await fetchJson(apilink);

        // Check if the API returns the expected result
        if (!news || !news.result) {
            return reply("❗ Failed to fetch news. Please try again later.");
        }

        // Structure the news message
        const msg = `
*ADA NEWS DENETH-MD*

* Title - ${news.result.title}

* News - ${news.result.desc}

* Date - ${news.result.date}

* Link - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`;

        // Send the message with news details
        await conn.sendMessage(from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply("❗ An error occurred while fetching Ada News. Please try again later.");
    }
});

//================NEWS WRITE======================================
cmd({
    pattern: "newswritenews",
    alias: ["newswrite", "news7"],
    react: "📰",
    desc: "Fetch the latest news from NewsWrite.",
    category: "news",
    use: '.newswritenews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest news from NewsWrite API
        const news = await fetchJson(apilink);

        // Check if the API returns the expected result
        if (!news || !news.result) {
            return reply("❗ Failed to fetch news. Please try again later.");
        }

        // Structure the news message
        const msg = `
*NEWSWRITE NEWS DENETH-MD*

* Title - ${news.result.title}

* News - ${news.result.desc}

* Date - ${news.result.date}

* Link - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`;

        // Send the message with news details
        await conn.sendMessage(from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply("❗ An error occurred while fetching NewsWrite News. Please try again later.");
    }
});

//=========================DAILY MIRROR=======================================
cmd({
    pattern: "dailymirrornews",
    alias: ["dailymirror", "news8"],
    react: "📰",
    desc: "Fetch the latest news from Daily Mirror.",
    category: "news",
    use: '.dailymirrornews',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Fetch the latest news from Daily Mirror API
        const news = await fetchJson(apilink);

        // Check if the API returns the expected result
        if (!news || !news.result) {
            return reply("❗ Failed to fetch news. Please try again later.");
        }

        // Structure the news message
        const msg = `
*DAILY MIRROR NEWS DENETH-MD*

* Title - ${news.result.title}

* News - ${news.result.desc}

* Date - ${news.result.date}

* Link - ${news.result.url}

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴡᴀ-ʙᴏᴛ`;

        // Send the message with news details
        await conn.sendMessage(from, { image: { url: news.result.image || '' }, caption: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply("❗ An error occurred while fetching Daily Mirror News. Please try again later.");
    }
});
