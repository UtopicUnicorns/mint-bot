const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'kick',
    description: '[mod] Kick a user from the server',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
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