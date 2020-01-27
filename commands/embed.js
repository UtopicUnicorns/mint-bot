const Discord = module.require('discord.js');
module.exports = {
    name: 'embed',
    description: '[mod] generate an embed',
    execute(message) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
            let args = message.content.slice(7).split('\n');
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