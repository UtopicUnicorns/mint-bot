const Discord = require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'update',
    description: '[TESTadmin] Send updates to EVERY logs channel',
    execute(message) {
        const args = message.content.slice(8).split(" ");
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel);");
        if (message.author.id !== '127708549118689280') return;
        const logslist = db.prepare("SELECT * FROM guildhub").all();
        const logschannels = []
        for (const data of logslist) {
            logschannels.push(data.logsChannel);
        }
        console.log(logschannels);
        for (let i of logschannels) {

        }
    }
};