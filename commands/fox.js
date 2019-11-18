const Discord = require('discord.js');
const request = require("request");

module.exports = {
    name: 'fox',
    description: 'Random fox picture',
        execute(message) {

        let baseurl = "https://some-random-api.ml/img/fox";
        let url = baseurl;
        request(url, { json: true }, (err, res, body) => {
             if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
            .setImage(body.link)
            message.channel.send({ embed: embed });
        });
    }
};
