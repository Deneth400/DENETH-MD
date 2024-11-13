const { cmd } = require('../command');
const { fetchJson } = require('../DATABASE/functions');
const apilink = 'https://dark-yasiya-api-new.vercel.app';

cmd({
    pattern: 'song',
    desc: 'Fetch song information and provide download links.',
    category: 'music',
    react: '🎧',
    filename: __filename
}, async (_0xeaf511, _0x573124, _0x2c135b, { from, reply, q }) => {
    try {
        if (!q) {
            return reply('Give me song name or URL!');
        }
        
        // Fetch song info based on user input
        const songData = await fetchJson(`${apilink}/search/yt?q=${q}`);
        const songDetails = songData.result[0];

        // Fetch additional data for the song
        const downloadData = await fetchJson(`${apilink}/download/ytmp3?url=${songDetails.url}`);

        // Constructing the message to be sent
        let message = `*🎬 Channel*: ${songDetails.author}
                        *📆 Uploaded On*: ${songDetails.published_date}
                        *🎶 Title*: ${songDetails.title}
                        *📃 Description*: ${songDetails.description}
                        *⏰ Duration*: ${songDetails.duration}
                        *📈 Views*: ${songDetails.views}
                        *🖇️ URL*: ${songDetails.url}`;

        // Send song details to the user
        const sentMessage = await _0xeaf511.sendMessage(from, { text: message });

        // Handle download selection
        _0xeaf511.ev.on('messages.upsert', async (messageUpdate) => {
            const selectedOption = messageUpdate.message.text.trim();
            if (selectedOption === '1') {
                await _0xeaf511.sendMessage(from, { audio: { url: downloadData.result.audio_url }, mimetype: 'audio/mpeg' });
            } else if (selectedOption === '2') {
                await _0xeaf511.sendMessage(from, { document: { url: downloadData.result.document_url }, mimetype: 'audio/mpeg', fileName: `${songDetails.title}.mp3` });
            } else {
                reply('Invalid option. Please select a valid option.');
            }
        });
    } catch (error) {
        console.error(error);
        await _0xeaf511.sendMessage(from, { react: { text: '❌', key: _0x573124.key } });
        reply('An error occurred while processing your request.');
    }
});
