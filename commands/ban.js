const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'ban',
    description: '[mod] Ban a user',
    execute(message) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
            const member = message.mentions.members.first();
            if (!member) {
                return message.reply('You need to mention the member you want to ban him');
            }
            return member
                .ban()
                .then(() => message.reply(`${member.user.tag} was banned.`))
                .catch(error => message.reply('Sorry, an error occured.'));
    },
};