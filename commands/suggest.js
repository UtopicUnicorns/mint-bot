const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'suggest',
    description: '[general] Suggest an idea',
    execute(message) {
        if (message.content === `${prefix}suggest`) {
            return message.channel.send(`!suggest <suggestion>`);
        }
        const embed = new Discord.RichEmbed()
            .setDescription('Your suggestion')
            .setImage('https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/SUGGESTIONS.gif')
            message.channel.send({
                embed: embed
            });
    },
};