const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
const ln = require('nodejs-linenumber');
module.exports = {
    name: 'nick',
    description: '[mod] Change a user nickname',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const user = message.mentions.users.first();
        if (!user) return message.reply("You must mention someone!");
        const args = message.content.slice(prefix.length + user.id.length + 10);
        if (!args) return message.reply("You must give a new nickname!");
        let nowtime = new Date();
        message.guild.members.get(user.id).setNickname(args).catch(console.log(nowtime + '\n' + message.guild.id + ': Nick.js:' + ln()));
        return message.reply(user + ' nickname changed to: ' + args);
    }
};