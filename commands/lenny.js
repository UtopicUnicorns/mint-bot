const Discord = require('discord.js');
const request = require("request");
const db = require('better-sqlite3')('./scores.sqlite');
const htmlToText = require('html-to-text');
module.exports = {
    name: 'lenny',
    description: '[fun] ( ͡° ͜ʖ ͡°)',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.channel.id === '629019515740487691' || message.channel.id === '666776795047002132') {
            let baseurl = "https://aranym.com/ecchi/";
            request(baseurl, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const text = htmlToText.fromString(body, {
                    wordwrap: 130,
                });
                var s = text;
                var arrStr = s.split(']');
                STR = [];
                for (let i of arrStr) {
                    if (i.includes('.jpg')) {
                        STR.push(i);
                    }
                }
                let num = Math.floor((Math.random() * STR.length) + 1);
                const embed = new Discord.RichEmbed()
                    .setImage('https://aranym.com/ecchi/' + num + '.jpg')
                message.channel.send({
                    embed: embed
                });
            });
        }
    }
};