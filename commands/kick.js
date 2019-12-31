const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'kick',
    description: '[mod] Kick a user from the server',
    execute(message) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
            const member = message.mentions.members.first();
            if (!member) {
                return message.reply('You need to mention the member you want to kick');
            }
            if (!member.kickable) {
                return message.reply('I can\'t kick this user.');
            }
            return member
                .kick()
                .then(() => message.reply(`${member.user.tag} was kicked.`))
                .catch(error => message.reply('Sorry, an error occured.'));
        
    },
};