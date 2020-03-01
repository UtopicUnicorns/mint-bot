const Discord = require('discord.js');
const request = require("request");
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'cat',
    description: '[fun] Random cat picture',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let baseurl = "https://some-random-api.ml/img/cat";
        let url = baseurl;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
                .setImage(body.link)
            message.channel.send({
                embed: embed
            });
        });
    }
};