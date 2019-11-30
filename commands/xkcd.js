const Discord = require('discord.js');
const request = require("request");
module.exports = {
    name: 'xkcd',
    description: 'Xkcd images',
    execute(message) {
        if (message.content == "!xkcd random") {
            let baseurl = "https://xkcd.com/";
            let num = Math.floor(Math.random() * 2200) + 1;
            let end = "/info.0.json";
            let url = baseurl + num + end;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.RichEmbed()
                    .setDescription(body.safe_title)
                    .setColor('#RANDOM')
                    .setImage(body.img)
                    .setFooter(body.alt)
                message.channel.send({
                    embed: embed
                });
            });
            return
        }
        let url = "https://xkcd.com/info.0.json";
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
                .setDescription(body.safe_title)
                .setColor('#RANDOM')
                .setImage(body.img)
                .setFooter(body.alt)
            message.channel.send({
                embed: embed
            });
        });
    }
};