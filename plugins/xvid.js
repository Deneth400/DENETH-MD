const {
  cmd
} = require('../command');
const {
  fetchJson
} = require("../lib/functions");
cmd({
  'pattern': "xvideo",
  'alias': ['xvdl', "xvdown"],
  'react': '🔞',
  'desc': "Download xvideo.com porn video",
  'category': "download",
  'use': ".xvideo < text >",
  'filename': __filename
}, async (_0x1b23f8, _0x2cd187, _0x3322b6, {
  from: _0x2c4aa9,
  quoted: _0x4493ed,
  reply: _0x4b50c0,
  q: _0x24c1e5
}) => {
  try {
    if (!_0x24c1e5) {
      return await _0x4b50c0("𝖯𝗅𝖾𝖺𝗌𝖾 𝖦𝗂𝗏𝖾 𝗆𝖾 𝖥𝖾𝗐 𝖶𝗈𝗋𝖽 !");
    }
    const _0x1dc9b4 = await fetchJson("https://dark-yasiya-api-new.vercel.app/search/xvideo?q=" + _0x24c1e5);
    if (_0x1dc9b4.result.length < 0x0) {
      return await _0x4b50c0("Not results found !");
    }
    const _0x15e250 = await fetchJson("https://dark-yasiya-api-new.vercel.app/download/xvideo?url=" + _0x1dc9b4.result[0x0].url);
    await _0x1b23f8.sendMessage(_0x2c4aa9, {
      'document': {
        'url': _0x15e250.result.dl_link
      },
      'mimetype': "video/mp4",
      'fileName': _0x15e250.result.title,
      'caption': _0x15e250.result.title
    }, {
      'quoted': _0x2cd187
    });
  } catch (_0x525b7a) {
    console.log(_0x525b7a);
    _0x4b50c0(_0x525b7a);
  }
});
