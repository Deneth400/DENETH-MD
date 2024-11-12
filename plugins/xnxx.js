const { cmd, commands } = require('../command');
const xnxx = require('../lib/functions');
const { fetchJson, getBuffer } = require('../lib/functions');

cmd({
  pattern: 'xnxx-dl',
  desc: 'Downloads a video from XNXX',
  use: '.xnxx <search_term>',
  react: '🤤',
  category: 'download',
  filename: __filename
}, async (_0x2f27a4, _0x31e59d, _0x51f097, { from: _0x4c9dc4, quoted: _0xc5fd, body: _0x1d8011, q: _0xf6796b, reply: _0x262e08 }) => {
  const searchQuery = _0xf6796b.trim();
  if (!searchQuery) return _0x262e08('Please provide a search term');

  _0x262e08('Searching...');
  try {
    const searchResult = await xnxx.download(searchQuery);
    if (!searchResult || !searchResult.link_dl) {
      await _0x2f27a4.sendMessage(_0x4c9dc4, {
        react: { text: '❌', key: _0x31e59d.key }
      });
      return;
    }
    _0x262e08('Downloading Video Please Wait ➤...');
    const videoUrl = searchResult.link_dl;
    await _0x2f27a4.sendMessage(_0x4c9dc4, {
      video: { url: videoUrl },
      caption: '> ᴘᴏᴡᴇʀᴇᴅ ʙʏ  ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®',
      mimetype: 'video/mp4'
    }, { quoted: _0x31e59d });
    await _0x2f27a4.sendMessage(_0x4c9dc4, {
      react: { text: '✅', key: _0x31e59d.key }
    });
  } catch (error) {
    console.log(error);
    await _0x2f27a4.sendMessage(_0x4c9dc4, {
      react: { text: '❌', key: _0x31e59d.key }
    });
    _0x262e08('Error: ' + error.message);
  }
});
