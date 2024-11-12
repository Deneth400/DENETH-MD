const { cmd } = require('../command');
const fetch = require('node-fetch');  // You can use axios or another HTTP library
const fs = require('fs');
const { getBuffer } = require('../lib/functions');

cmd({
    pattern: 'logo',
    alias: ['logogen', 'createlogo'],
    use: '.logo MyBrandName',
    react: '🎨',
    desc: 'Generate a logo for a brand',
    category: 'tools',
    filename: __filename
}, 

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please provide a name for the logo. Example: `.logo MyBrandName`');

        // API URL for logo generation (replace with actual API)
        const logoApiUrl = `https://api.logo.com/generate?text=${encodeURIComponent(q)}`;

        // Fetch the logo from the API
        const res = await fetch(logoApiUrl);
        const json = await res.json();

        if (json.success && json.imageUrl) {
            // Download the image (assuming the API returns an image URL)
            const logoBuffer = await getBuffer(json.imageUrl);

            // Send the logo as a WhatsApp message
            await conn.sendMessage(from, { image: { url: json.imageUrl }, caption: `Here is your logo for: *${q}*` }, { quoted: mek });

            reply('🎨 Logo has been created and sent!');
        } else {
            reply('❌ Sorry, there was an issue generating the logo.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Error occurred while generating the logo.');
    }
});
