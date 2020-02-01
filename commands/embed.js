const Discord = module.require('discord.js');
const fs = require('fs');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'embed',
    description: '[mod] generate an embed',
    execute(message) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
            let args = message.content.slice(prefix.length + 6).split('\n');
            message.delete();
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setTitle(args[0])
                .setDescription(args)
            return message.channel.send({
                embed
            });
    },
};