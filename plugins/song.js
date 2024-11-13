const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const apiLink = "https://dark-yasiya-api-new.vercel.app";

cmd({
  pattern: "song",
  desc: "Download songs.",
  category: "download",
  react: '🎧',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    // Check if the user provided a query
    if (!q) return reply("Please provide a song name or URL!");

    // Fetch song search results from the API
    const searchResult = await fetchJson(apiLink + '/search/yt?q=' + q);
    
    // Ensure that search results contain the necessary data
    if (!searchResult || !searchResult.result || searchResult.result.length === 0) {
      return reply("No results found for the given query.");
    }

    const songData = searchResult.result[0];

    // Ensure that songData contains a valid URL
    if (!songData || !songData.url) {
      return reply("Failed to retrieve the song URL.");
    }

    // Fetch download link for the song
    const downloadData = await fetchJson(apiLink + '/download/ytmp3?url=' + songData.url);

    // Ensure that downloadData contains a valid download link
    if (!downloadData || !downloadData.result || !downloadData.result.dl_link) {
      return reply("Failed to retrieve the download link.");
    }

    const downloadLink = downloadData.result.dl_link;

    // Prepare the message with song details
    let songMessage = "*SAHAS-MD SONG DOWNLOADER*\n\n";
    songMessage += `*⚙️ TITLE*: ${songData.title}\n`;
    songMessage += `*📃 DESCRIPTION*: ${songData.description}\n`;
    songMessage += `*🚀 VIEWS*: ${songData.views}\n`;
    songMessage += `*⏰ DURATION*: ${songData.timestamp}\n`;
    songMessage += `*📆 UPLOADED ON*: ${songData.ago}\n`;
    songMessage += `*🎬 CHANNEL*: ${songData.author.name}\n`;
    songMessage += `*🖇️ URL*: ${songData.url}\n\n`;
    songMessage += `> *REPLY THE DOWNLOAD OPTION*\n\n`;
    songMessage += `*1️⃣ Download: Audio Type*\n*2️⃣ Download: Document Type*\n\n`;
    songMessage += `> *© Powered by SAHAS-MD Song Information Search Engine*`;

    // Send the song details message
    const sentMessage = await messageHandler.sendMessage(from, {
      text: songMessage,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: quotedMessage });

    // Handle the user's response to the download options
    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();
      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        switch (userReply) {
          case '1':
            // Send audio download link
            await messageHandler.sendMessage(from, {
              audio: { url: downloadLink },
              mimetype: 'audio/mpeg'
            }, { quoted: quotedMessage });
            break;
          case '2':
            // Send document (mp3) download link
            await messageHandler.sendMessage(from, {
              document: { url: downloadLink },
              mimetype: 'audio/mpeg',
              fileName: `${songData.title}.mp3`,
              caption: `${songData.title}\n\n> *© Powered by SAHAS-MD Song Information Search Engine*`
            }, { quoted: quotedMessage });
            break;
          default:
            reply("Invalid option. Please select a valid option🔴");
            break;
        }
      }
    });

  } catch (error) {
    console.error(error);
    await messageHandler.sendMessage(from, {
      react: { text: '❌', key: quotedMessage.key }
    });
    reply("An error occurred while processing your request.");
  }
});

