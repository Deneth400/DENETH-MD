const {cmd} = require('../command');  // Importing the command handler
const {fetchJson} = require('../lib/functions');  // Importing the function to fetch JSON data from an API

// The API link to fetch song data
const apilink = "https://dark-yasiya-api-new.vercel.app";

// Define the command pattern (e.g., "song") and its description
cmd({
  pattern: 'song',  // Command to search for a song
  desc: 'Download songs',  // Description of the command
  category: 'media',  // Category of the command
  react: '🎧',  // Emoji that the bot will react with
  filename: __filename  // Filename of the script
}, async (_0xeaf511, _0x573124, _0x2c135b, { from: _0x5e067c, reply: _0x51b22b, q: _0x28e446 }) => {
  try {
    // If no song name is provided, reply with an error message
    if (!_0x28e446) return _0x51b22b("Give me song name or URL!");

    // Fetch the search result for the song
    const songData = await fetchJson(apilink + '/search/yt?q=' + _0x28e446);
    const song = songData.result[0];  // Get the first song result
    const songDetails = song.url;  // Get the URL of the song

    // Fetch additional data for the song (e.g., download link)
    const downloadData = await fetchJson(apilink + '/download/ytmp3?url=' + song.url);

    // Prepare the song information to display to the user
    let message = `
      *🎬 Channel*: ${song.channel}
      *🚀 Views*: ${song.views}
      *⏰ Duration*: ${song.duration}
      *📆 Uploaded On*: ${song.uploaded}
      *📃 Description*: ${song.description}
      *🖇️ URL*: ${songDetails}
    
    > ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;
    
    // Send the message with song information and a prompt for downloading
    const response = await _0xeaf511.sendMessage(_0x5e067c, {
      text: message,
      contextInfo: {
        forwardingScore: 100,
        isForwarded: true,
    });

    // Wait for the user to select download option
    _0xeaf511.ev.on('message', async (msg) => {
      const userChoice = msg.text;
      if (userChoice === '1') {
        // Send the audio file (MP3)
        await _0xeaf511.sendMessage(_0x5e067c, { 
          audio: { url: downloadData.result.audio_url }, 
          mimetype: 'audio/mpeg'
        });
      } else if (userChoice === '2') {
        // Send the song as a document (likely MP3 file as document)
        await _0xeaf511.sendMessage(_0x5e067c, {
          document: { url: downloadData.result.document_url },
          mimetype: 'audio/mpeg',
          fileName: song.title + '.mp3',
          caption: song.description
        });
      } else {
        // Invalid option
        _0x51b22b("Invalid option. Please select a valid option🔴");
      }
    });
  } catch (error) {
    console.error(error);  // Log the error
    _0xeaf511.sendMessage(_0x5e067c, { react: { text: '❌', key: _0x573124.key } });  // React with error emoji
    _0x51b22b("An error occurred while processing your request.");
  }
});
