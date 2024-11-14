// Function to handle rate limit error (exponential backoff)
async function handleRateLimitError() {
  const retryAfter = 60 * 1000;  // Retry after 1 minute (adjust if necessary)
  console.log(`Rate limit exceeded. Retrying after ${retryAfter / 1000} seconds.`);
  await sleep(retryAfter);
}

// Sleep function (delay in milliseconds)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Example retry logic in your command handler
cmd({
  pattern: "xnxx",
  alias: ["xnxxs"],
  use: '.xnxx <query>',
  react: "🍟",
  desc: "Search and DOWNLOAD VIDEOS from xnxx.",
  category: "search",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply('🚩 *Please give me words to search*');
    let res = await xnxxs(q);
    const data = res.result;

    if (data.length < 1) return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything :(*" }, { quoted: mek });

    // Create a numbered list for the user to choose from
    let response = '乂 X N X X - D O W N L O A D E R\n\nChoose a video by number:\n';
    data.forEach((v, index) => {
      response += `${index + 1}. ${v.title} - Info: ${v.info}\n`;
    });

    response += '\n*Reply with the number of the video you want to download.*';
    await conn.sendMessage(from, { text: response }, { quoted: mek });

    // Listen for the user's reply
    conn.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      const userReply = message.message.extendedTextMessage.text.trim();
      const videoIndex = parseInt(userReply) - 1;

      if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= data.length) {
        return reply("🚩 *Please reply with a valid number from the list.*");
      }

      const selectedVideo = data[videoIndex];
      let videoUrl = selectedVideo.link; 

      try {
        // Download and send the selected video
        let videoRes = await xdl(videoUrl);
        let title = videoRes.result.title;

        await conn.sendMessage(from, { video: { url: videoRes.result.files.high }, caption: title }, { quoted: mek });
      } catch (e) {
        console.log(e);
        await reply('🚩 *Error occurred while fetching the video!*');
      }
    });

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching videos!*' }, { quoted: mek });
  }
});
