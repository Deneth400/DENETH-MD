const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "zmRzRDzb#xi4lLyEZ1DAmnl3z58X16TvmmWkMn3ulRzmM-xgSxPM",
AUTO_READ_CMD: process.env.AUTO_READ_CMD || "true",
MONGODB: process.env.MONGODB || "mongodb://mongo:yndAufzWqfHPOJWqEhyerJubJkjcjuZC@autorack.proxy.rlwy.net:16382",
};
