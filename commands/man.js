const Discord = module.require('discord.js');
const curl = require('curl');
const htmlToText = require('html-to-text');
module.exports = {
    name: 'man',
    description: 'Man pages basically',
    execute(message) {
        
        if(message.content === "!man") {
            return message.channel.send("!man ARGS");
        }

        let args = message.content.slice(5);
        let baseurl = "https://cheat.sh/";
        let search = args;
        let url = baseurl + search;
        curl.get(url, function (error, response, body) {
            const text = htmlToText.fromString(body, {
                wordwrap: 130
              });
              let text2 = text.slice(16, -152);
              let embed = new Discord.RichEmbed()
              .setTitle(args)
              .setDescription(text2)
              .setColor('RANDOM')
              message.channel.send({ embed });
              return
            })
    }
};
