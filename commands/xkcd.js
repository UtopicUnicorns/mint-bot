const Discord = require('discord.js');
const request = require(`request`);
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'xkcd',
    description: '[fun] Xkcd images',
    execute(message) {
        if (message.content == `${prefix}xkcd random`) {
            let baseurl = `https://xkcd.com/`;
            let num = Math.floor(Math.random() * 2200) + 1;
            let end = `/info.0.json`;
            let url = baseurl + num + end;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.RichEmbed()
                    .setTitle(body.safe_title)
                    .setURL(`https://xkcd.com/${body.num}/`)
                    .setColor('#RANDOM')
                    .setImage(body.img)
                    .setFooter(body.alt)
                message.channel.send({
                    embed: embed
                });
            });
            return
        }
        let args = message.content.slice().split(` `);
        if (!args[1]) {
            let url = `https://xkcd.com/info.0.json`;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.RichEmbed()
                    .setTitle(body.safe_title)
                    .setURL(`https://xkcd.com/${body.num}/`)
                    .setColor('#RANDOM')
                    .setImage(body.img)
                    .setFooter(body.alt)
                message.channel.send({
                    embed: embed
                });
            });
        }
        let baseurl = `https://xkcd.com/`;
        let num = args[1];
        let end = `/info.0.json`;
        let url = baseurl + num + end;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
                .setTitle(body.safe_title)
                .setURL(`https://xkcd.com/${body.num}/`)
                .setColor('#RANDOM')
                .setImage(body.img)
                .setFooter(body.alt)
            message.channel.send({
                embed: embed
            });
        });
    }
};