const { cmd } = require("../command");
const { fetchJson } = require('../lib/functions');
const config = require('../config')

async function sendMessage(handler, from, url, caption, mimetype, fileName) {
    try {
        const message = {
            document: { url },
            caption,
            mimetype,
            fileName
        };
        await handler.sendMessage(from, message);
    } catch (error) {
        console.error("Error sending message:", error);
        handler.reply("❗ Error: " + error);
    }
}

// Command configuration for movie upload commands
const commands = [
    {
        pattern: "uploadme",
        alias: ["upme"],
        desc: "Upload a movie",
        use: ".activate_18+",
        action: async (handler, from, quoted, body) => {
            if (!quoted) return handler.reply("*.uploademe jid & Fast X (2024)*");
            const [url, mimetype, fileName] = body.split(" | ");
            await sendMessage(handler, from, url, url, mimetype, "DOWNLOADED." + fileName);
        }
    },
    {
        pattern: "uploadmovie",
        alias: ["upmv"],
        desc: "Upload a movie",
        use: ".activate_18+",
        action: async (handler, from, quoted, body) => {
            if (!quoted) return handler.reply("*ℹ .uploadmovie jid & Fast X (2024)*");
            const [jid, title] = body.split(" & ");
            const url = quoted.msg.url;
            await sendMessage(handler, jid, url, title, "video/mp4", `${title}.mp4`);
        }
    },
    {
        pattern: "uploadtvm",
        alias: ["uptvm"],
        desc: "Upload a TV movie",
        use: ".activate_18+",
        action: async (handler, from, quoted, body) => {
            if (!quoted) return handler.reply("*ℹ .uploadtvm jid & Fast X (2024)*");
            const [jid, title] = body.split(" & ");
            const url = quoted.msg.url;
            await sendMessage(handler, jid, url, title, "video/mkv", `${title}.mkv`);
        }
    },
    {
        pattern: "uploadzip",
        alias: ["upzip"],
        desc: "Upload a zip file",
        use: ".activate_18+",
        action: async (handler, from, quoted, body) => {
            if (!quoted) return handler.reply("*ℹ .uploadzip jid & Fast X (2024)*");
            const [jid, title] = body.split(" & ");
            const url = quoted.msg.url;
            await sendMessage(handler, jid, url, title, "application/zip", `${title}.zip`);
        }
    }
];

// Register commands
commands.forEach(({ pattern, alias, desc, use, action }) => {
    cmd({ pattern, alias, desc, use }, action);
});
