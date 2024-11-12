const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { cmd, commands } = require('../command');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");
const path = require('path');
const fs = require('fs');

// Command to search for a movie or TV show
cmd({
    pattern: "movie",
    desc: "Search for a movie",
    category: "movie",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const input = q.trim();
        if (!input) return reply("Please provide a movie or TV show name to search.");
        
        const result = await SinhalaSub.get_list.by_search(input);
        if (!result.status || result.results.length === 0) return reply("No results found.");

        let message = "*Search Results:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nType: ${item.type}\nLink: ${item.link}\n\n`;
        });
        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`Error: ${e.message}`);
    }
});

// Command to get movie details and download links without buttons
cmd({
    pattern: "slsub",
    desc: "Get movie download links.",
    category: "movie",
    react: "🍿",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const link = q.trim();
        
        const result = await SinhalaSub.movie(link);
        if (!result.status) return reply("Movie details not found.");

        const movie = result.result;
        let msg = `*${movie.title}*\n\n`;
        msg += `Release Date: ${movie.release_date}\n`;
        msg += `IMDb Rating: ${movie.IMDb_Rating}\n`;
        msg += `Director: ${movie.director.name}\n\n`;
        msg += `ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ\n\n`;
        msg += "Available formats:\n 🔰 𝗦𝗗 𝟰𝟴𝟬\n 🔰 𝗛𝗗 𝟳𝟮𝟬\n 🔰 𝗙𝗛𝗗 𝟭𝟬𝟴𝟬\n\n";
        msg += "Use `.mv <quality> <movie_link>` to download.";

         const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

        await conn.sendMessage(from, {image: {url: imageUrl}, text: msg }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply('*Error !!*');
    }
});

// Command to handle downloading the movie in specified format without buttons
cmd({
    pattern: "mv",
    react: "🎬",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const [format, url] = q.split(' ');
        const result = await SinhalaSub.movie(url);
        const movie = result.result;

        let quality;
        if (format === '480') {
            quality = "SD 480p";
        } else if (format === '720') {
            quality = "HD 720p";
        } else if (format === '1080') {
            quality = "FHD 1080p";
        } else {
            return reply("Invalid format. Please choose from 480, 720, or 1080.");
        }

        const directLink = await PixaldrainDL(url, quality, "direct");
        if (directLink) {
            await conn.sendMessage(from, {
                document: { url: directLink },
                mimetype: 'video/mp4',
                fileName: `${movie.title}.mp4`,
                caption: "*ᴍᴇᴅᴢ-ᴍᴅ ʙʏ ɴᴇᴛʜᴍɪᴋᴀᴛᴇᴄʜ*"
            }, { quoted: mek });
        } else {
            reply(`Could not find the ${format}p download link. Please check the URL or try a different movie.`);
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message} ❌`);
    }
});

// Command to get recently added movies without buttons
cmd({
    pattern: "serchmovies",
    alias: ["smv"],
    desc: "Get recently added movies.",
    category: "movie",
    react: "🆕",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const page = 1;
        const result = await SinhalaSub.get_list.by_recent_movies(page);
        if (!result.status || result.results.length === 0) return reply("No recent movies found.");

        let message = "*Recently Added Movies:*\n\n";
        result.results.forEach((item, index) => {
            message += `${index + 1}. ${item.title}\nLink: ${item.link}\n\n`;
        });

        message += "*ᴍᴇᴅᴢ-ᴍᴅ ʙʏ ɴᴇᴛʜᴍɪᴋᴀᴛᴇᴄʜ*";

        await conn.sendMessage(from, { text: message }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        return reply(`Error: ${e.message}`);
    }
});
