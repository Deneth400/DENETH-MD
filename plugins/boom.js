const { cmd } = require('../command');
const { reply } = require('../lib/functions');  // Assuming 'reply' function sends a message.

cmd({
    pattern: 'boomtext',
    alias: ['boom'],
    use: '.boomtext hello',
    react: '💥',
    desc: 'Create a BoomText effect',
    category: 'fun',
    filename: __filename
}, 

async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply('❌ Please enter the text to make it boom! Example: `.boomtext hello`');

        // Here, we're adding an explosion emoji around the text to make it "boomy"
        let boomText = `💥💥💥 *${q}* 💥💥💥`;

        // You can add further transformations, for example, alternating uppercase and lowercase letters
        boomText = boomText.split('')
            .map((char, i) => i % 2 === 0 ? char.toUpperCase() : char.toLowerCase())
            .join('');

        // Send the transformed "BoomText"
        await reply(boomText);

    } catch (e) {
        console.log(e);
        await reply('❌ Error occurred while processing your BoomText.');
    }
});
