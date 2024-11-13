const {
  cmd
} = require('../command');
const {
  fetchJson
} = require('../lib/functions');
cmd({
  'pattern': "song",
  'desc': "download songs.",
  'category': "download",
  'react': '🎧',
  'filename': __filename
}, async (_0xeaf511, _0x573124, _0x2c135b, {
  from: _0x5e067c,
  reply: _0x51b22b,
  q: _0x28e446
}) => {
  try {
    if (!_0x28e446) {
      return _0x51b22b("Give me song name or url !");
    }
    const _0x4c953e = await fetchJson("https://dark-yasiya-api-new.vercel.app/search/yt?q=" + _0x28e446);
    const _0x4267b3 = _0x4c953e.result.data[0x0];
    const _0x4ea786 = await fetchJson("https://dark-yasiya-api-new.vercel.app/download/ytmp3?url=" + _0x4267b3.url);
    let _0x21bf98 = "‎‎𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗔𝗨𝗗𝗜𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n\n✒ ᴛɪᴛʟᴇ : " + _0x4267b3.title + "\n💭 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ : " + _0x4267b3.description + "\n👀 ᴠɪᴇᴡꜱ : " + _0x4267b3.views + "\n⏳ ᴅᴜʀᴀᴛɪᴏɴ : " + _0x4267b3.timestamp + "\n📅 ᴜᴘʟᴏᴀᴅᴇᴅ ᴏɴ : " + _0x4267b3.ago + "\n🎬 ᴄʜᴀɴɴᴇʟ : " + _0x4267b3.author.name + "\n📎 ᴜʀʟ : " + _0x4267b3.url + "\n\n*👉 REPLY THE DOWNLOAD OPTION*  \n\n*1️⃣  𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 : 𝖠𝗎𝖽𝗂𝗈 𝖳𝗒𝗉𝖾*\n*2️⃣  𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 : 𝖣𝗈𝖼𝗎𝗆𝖾𝗇𝗍 𝖳𝗒𝗉𝖾*\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®";
    const _0x493454 = await _0xeaf511.sendMessage(_0x5e067c, {
      'image': _0x4267b3.thumbnail,
      'caption': _0x21bf98,
      'contextInfo': {
        'forwardingScore': 0x3e7,
        'isForwarded': true,
      }
    }, {
      'quoted': _0x573124
    });
    _0xeaf511.ev.on("messages.upsert", async _0x49e43f => {
      const _0xfc5b33 = _0x49e43f.messages[0x0];
      if (!_0xfc5b33.message || !_0xfc5b33.message.extendedTextMessage) {
        return;
      }
      const _0x2a874d = _0xfc5b33.message.extendedTextMessage.text.trim();
      if (_0xfc5b33.message.extendedTextMessage.contextInfo && _0xfc5b33.message.extendedTextMessage.contextInfo.stanzaId === _0x493454.key.id) {
        switch (_0x2a874d) {
          case '1':
            await _0xeaf511.sendMessage(_0x5e067c, {
              'audio': {
                'url': _0x4ea786.result.dl_link
              },
              'mimetype': "audio/mpeg"
            }, {
              'quoted': _0x573124
            });
            break;
          case '2':
            await _0xeaf511.sendMessage(_0x5e067c, {
              'document': {
                'url': _0x4ea786.result.dl_link
              },
              'mimetype': 'audio/mpeg',
              'fileName': _0x4267b3.title + ".mp3",
              'caption': _0x4267b3.title + "\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*"
            }, {
              'quoted': _0x573124
            });
            await _0xeaf511.sendMessage(_0x5e067c, {
              'react': {
                'text': '✅',
                'key': _0x573124.key
              }
            });
            break;
          default:
            _0x51b22b("Invalid option. Please select a valid option🔴");
        }
      }
    });
  } catch (_0x24e14d) {
    console.error(_0x24e14d);
    await _0xeaf511.sendMessage(_0x5e067c, {
      'react': {
        'text': '❌',
        'key': _0x573124.key
      }
    });
    _0x51b22b("An error occurred while processing your request.");
  }
});
