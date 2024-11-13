const { SinhalaSub } = require('@sl-code-lords/movie-api');
const { cmd, commands } = require('../command');
const { PixaldrainDL } = require("pixaldrain-sinhalasub");
const path = require('path');
const fs = require('fs');

// Command to search for a movie or TV show
cmd({
    pattern: "slsub",
    desc: "Get movie download links.",
    category: "movie",
    react: "🍿",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const link = q.trim();
        
        // Assuming SinhalaSub.movie() is a function that fetches movie details from the provided link
        const result = await SinhalaSub.movie(link);
        if (!result.status) return reply("Movie details not found.");

        const movie = result.result;
        let msg = `*${movie.title}*\n\n`;
        msg += `Release Date: ${movie.release_date}\n`;
        msg += `Country: ${movie.country}\n\n`;
        msg += `Duration: ${movie.duration}\n\n`;
        msg += `Genres: ${movie.genres}\n\n`;
        msg += `IMDb Rating: ${movie.IMDb_Rating}\n`;
        msg += `Director: ${movie.director.name}\n\n`;
        msg += `Select The Number For Download Movie\n\n`;
        msg += "Available formats:\n 1. 𝗦𝗗 𝟰𝟴𝟬\n\n";
        msg += "Use `.mv <Quality Number> <movie_link>` to download.\n\n";
        msg += `MEDZ MD MOVIE TIME`;

        const imageUrl = movie.images && movie.images.length > 0 ? movie.images[0] : null;

        const sentMessage = await conn.sendMessage(from, {
            image: { url: imageUrl },  // Assuming movie has a thumbnail image
            caption: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });

        // Listening for the user's reply to download options
        conn.on('message', async (message) => {
            if (!message.message || !message.message.extendedTextMessage) return;

            const userReply = message.message.extendedTextMessage.text.trim();

            // Ensure the user replied to the correct message
            if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
                switch (userReply) {
                    case '1':
                        const quality = "HD 720p"; // Assuming quality option is 'HD 720p'
                        const directLink = await PixaldrainDL(link, quality, "direct"); // Pass the correct movie link

                        if (directLink) {
                            // Send the download link to the specified JID
                            await conn.sendMessage(from, {
                                document: { url: directLink },
                                mimetype: 'video/mp4',
                                fileName: `🎬MOVIE DOWNLOADER.mp4`,
                                caption: `${movie.title}\n*ᴍᴏᴠɪᴇ ᴜᴘʟᴏᴀᴅ ʙʏ ᴍᴏᴠɪᴇ ᴡᴀʙᴏᴛ*\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ • ɴᴇᴛʜᴍɪᴋᴀᴛᴇᴄʜ*`
                            }, { quoted: mek });
                        }
                        break;

                    default:
                        reply("Invalid choice. Please choose a valid download option.");
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply('*Error !! Please try again later.*');
    }
});
