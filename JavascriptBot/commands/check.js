const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
const ln = require('nodejs-linenumber');
module.exports = {
    name: 'check',
    description: '[server] Role check',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const args = message.content.slice(prefix.length + 6).split(" ");
            const cargs = message.content.slice(prefix.length + 10);
            if (!args) return message.reply("Provide 2 more args not/yes + idrole namerole");
            if (args[0] == 'not') {
                let array = await message.guild.members.map(m => m);
                let str = "";
                for (let i of array) {
                    if (!i.roles.find(r => r.name === cargs) || i.roles.find(r => r.id === cargs)) {
                        str += i + '\n';
                    }
                }
                let role = message.guild.roles.find(r => r.id === cargs) || message.guild.roles.find(r => r.name === cargs);
                try {
                    const check = new Discord.RichEmbed()
                        .setTitle('RoleCheck')
                        .setColor('RANDOM')
                        .addField('These users do not have ' + role, str)
                        .setTimestamp();
                    return message.channel.send({
                        embed: check
                    })
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': Check.js:' + Math.floor(ln() - 4));
                }
            }
            if (args[0] == 'yes') {
                let array = await message.guild.members.map(m => m);
                let str = "";
                for (let i of array) {
                    if (i.roles.find(r => r.name === cargs) || i.roles.find(r => r.id === cargs)) {
                        str += i + '\n';
                    }
                }
                let role = message.guild.roles.find(r => r.id === cargs) || message.guild.roles.find(r => r.name === cargs);
                try {
                    const check = new Discord.RichEmbed()
                        .setTitle('RoleCheck')
                        .setColor('RANDOM')
                        .addField('These users have ' + role, str)
                        .setTimestamp();
                    return message.channel.send({
                        embed: check
                    })
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': Check.js:' + Math.floor(ln() - 4));
                }
            }
        }
    },
};