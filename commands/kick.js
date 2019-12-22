const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'kick',
    description: '[mod] Kick a user from the server',
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.mentions.members.first();
            if (!member) {
                return message.reply('You need to mention the member you want to kick');
            }
            if (!member.kickable) {
                return message.reply('I can\'t kick this user.');
            }
            const modembed = new Discord.RichEmbed()
                .setTitle(`The command ${prefix}kick was used`)
                .setColor('RANDOM')
                .addField(`${message.author.tag} kicked: \n`, `${member.user.tag}`, true)
            message.guild.channels.get('646672806033227797').send({
                embed: modembed
            });
            return member
                .kick()
                .then(() => message.reply(`${member.user.tag} was kicked.`))
                .catch(error => message.reply('Sorry, an error occured.'));
        }
    },
};