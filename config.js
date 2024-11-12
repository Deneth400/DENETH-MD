const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "zmRzRDzb#xi4lLyEZ1DAmnl3z58X16TvmmWkMn3ulRzmM-xgSxPM",
ALIVE_IMG: process.env.ALIVE_IMG || "https://telegra.ph/file/900435c6d3157c98c3c88.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "Ado Thota Puluwannam Mata Kochchara Puluwanda",
};
