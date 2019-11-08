const Discord = require('discord.js');
const request = require("request");

module.exports = {
    name: 'dog',
    description: 'Random dog picture',
        execute(message) {

        let baseurl = "https://some-random-api.ml/img/dog";
        let url = baseurl;
        request(url, { json: true }, (err, res, body) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
            .setImage(body.link)
            message.channel.send({ embed: embed });
        });
    }
};
