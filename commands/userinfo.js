const Discord = module.require('discord.js');
const moment = require('moment');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'userinfo',
    description: '[general] Displays your own or mentioned user info',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix.toString();
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('userinfo');
        usage.number++;
        setUsage.run(usage);
        //
        let args = message.content.slice(prefix.length + 9).split(' ');
        let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;
        let target = message.mentions.users.first() || message.author;
        fs.stat(`./specs/${user.id}.txt`, function (err, fileStat) {
            if (err) {
                if (err.code == 'ENOENT') {
                    let member = message.guild.member(user);
                    let embed = new Discord.RichEmbed()
                        .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                        .setDescription(`${user}`)
                        .setColor(`RANDOM`)
                        .setThumbnail(`${target.displayAvatarURL}`)
                        .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                        .addField('Status:', user.presence.status, true)
                        .addField('Created at:', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                        .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
                        .addField('Specifications:\n', `User has not added their specifications.\nTo add your own specs use ${prefix}specs`)
                        .setFooter(`ID: ${user.id}`)
                        .setTimestamp();
                    message.channel.send({
                        embed: embed
                    });
                    return;
                }
            } else {
                openfile = fs.readFileSync(`./specs/${user.id}.txt`).toString();
                let member = message.guild.member(user);
                let embed = new Discord.RichEmbed()
                    .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                    .setDescription(`${user}`)
                    .setColor(`RANDOM`)
                    .setThumbnail(`${target.displayAvatarURL}`)
                    .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                    .addField('Status:', user.presence.status, true)
                    .addField('Created at:', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                    .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
                    .addField('Specifications:\n', `${openfile}`)
                    .setFooter(`ID: ${user.id}`)
                    .setTimestamp();
                message.channel.send({
                    embed: embed
                });
                return;
            }
        });
    },
};