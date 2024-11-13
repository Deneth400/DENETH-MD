const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys');
const { state, saveState } = useSingleFileAuthState('./auth_info.json');
const fetch = require('node-fetch');

const startBot = async () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveState);

    let currentSearchResults = {};  // Store search results per user

    sock.ev.on('messages.upsert', async (messageUpdate) => {
        const message = messageUpdate.messages[0];
        if (!message.message) return;
        const from = message.key.remoteJid;
        const text = message.message.conversation || message.message.extendedTextMessage?.text;

        // Check if the message starts with "!sinhalasub"
        if (text.startsWith("!sinhalasub")) {
            const query = text.slice(12).trim();  // Extract the search query after "!sinhalasub"
            if (!query) return await sock.sendMessage(from, { text: "🚩 *Please provide a movie name to search.*" });

            // Fetch movie search results from the API
            try {
                const response = await fetch(`https://dark-yasiya-api-new.vercel.app/movie/sinhalasub/search?text=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data?.results?.length > 0) {
                    // Store the search results for the user
                    currentSearchResults[from] = data.results;

                    // Generate a numbered list of movie titles
                    let movieList = "🎬 *SinhalaSub Movie Search Results:*\n\n";
                    data.results.slice(0, 5).forEach((movie, index) => {
                        movieList += `${index + 1}. *${movie.title}*\nYear: ${movie.year}\n\n`;
                    });
                    movieList += "Reply with the number to get more details about a specific movie.";

                    await sock.sendMessage(from, { text: movieList });
                } else {
                    await sock.sendMessage(from, { text: "🚩 *No movies found for your query.*" });
                }
            } catch (error) {
                console.error(error);
                await sock.sendMessage(from, { text: "🚩 *Error fetching movie data.*" });
            }
        }

        // Handle number replies to provide movie details
        else if (!isNaN(text) && Number(text) > 0 && currentSearchResults[from]) {
            const selectedIndex = Number(text) - 1;
            const selectedMovie = currentSearchResults[from][selectedIndex];

            if (selectedMovie) {
                const movieDetails = `
🎬 *Movie Details*
⚙️ *Title*: ${selectedMovie.title}
📅 *Year*: ${selectedMovie.year}
⏰ *Duration*: ${selectedMovie.runtime}
🌟 *Rating*: ${selectedMovie.rating}
📜 *Description*: ${selectedMovie.description}
🎥 *Genre*: ${selectedMovie.genres?.join(", ") || "N/A"}
🖇️ *URL*: ${selectedMovie.url}

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ
                `;

                await sock.sendMessage(from, { text: movieDetails });
            } else {
                await sock.sendMessage(from, { text: "🚩 *Invalid selection. Please try again.*" });
            }

            // Clear search results after user selects a movie
            delete currentSearchResults[from];
        }
    });
};

startBot();
