const Discord = module.require('discord.js');
module.exports = {
    name: 'check',
    description: '[admin] Role check',
    async execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let array = await message.guild.members.map(m => m);
            let str = "";
            for (let i of array) {
                if (!i.roles.find(r => r.name === '~/Members')) {
                    str += i + '\n';
                }
            }
            const check = new Discord.RichEmbed()
                .setTitle('RoleCheck')
                .setColor('RANDOM')
                .addField('These users do not have ~/Members', str)
                .setTimestamp();
            return message.channel.send({
                embed: check
            });
        }
    },
};