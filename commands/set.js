const Discord = module.require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'set',
    description: `[mod] \nset mute MENTION\nset unmute MENTION\nset prefix prefix`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        if (message.member.hasPermission('KICK_MEMBERS')) {
            //
            let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
            let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
            usage = getUsage.get('set');
            usage.number++;
            setUsage.run(usage);
            //
            const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
            const guildChannels = getGuild.get(message.guild.id);
            var muteChannel1 = message.guild.channels.get(guildChannels.muteChannel);
            let args = message.content.split(` `);
            //mute
            if (args[1] == `mute`) {
                const member = message.mentions.members.first();
                if (!member) return message.channel.send(`Mention a user!`);
                if (message.author.id == member.id) {
                    return message.channel.send(`You can't mute yourself`);
                }
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(member, {
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        READ_MESSAGE_HISTORY: false,
                        ADD_REACTIONS: false
                    });
                })
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                member.removeRole(memberrole).catch(console.error);
                member.addRole(mutedrole).catch(console.error);
                const user = message.mentions.users.first();
                let userscore = getScore.get(user.id, message.guild.id);
                if (!userscore) {
                    userscore = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        points: 0,
                        level: 1,
                        warning: 0,
                        muted: 1,
                        translate: 0,
                        stream: 0,
                        notes: 0
                    }
                }
                userscore.muted = `1`;
                setScore.run(userscore);
                //LOGS
                const guildChannels = getGuild.get(message.guild.id);
                var logger = message.guild.channels.get(guildChannels.logsChannel);
                if (!logger) {
                    var logger = '0';
                }
                if (logger == '0') {} else {
                    const logsmessage = new Discord.RichEmbed()
                        .setTitle(prefix + 'set mute')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription("Used by: " + message.author)
                        .setURL(message.url)
                        .setColor('RANDOM')
                        .addField('Usage:\n', message.content, true)
                        .addField('Channel', message.channel, true)
                        .setFooter("Message ID: " + message.id)
                        .setTimestamp();
                    logger.send({
                        embed: logsmessage
                    }).catch(error =>
                        console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + Math.floor(ln() - 4))
                    );
                }
                //
                muteChannel1.send(user + ', You have been muted!');
                setTimeout(() => {
                    muteChannel1.overwritePermissions(member, {
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ATTACH_FILES: false
                    })
                }, 2000);
            }
            //unmute
            if (args[1] == `unmute`) {
                const member = message.mentions.members.first();
                if (!member) return message.channel.send(`Mention a user!`);
                let member2 = member.id;
                message.guild.channels.forEach(async (channel, id) => {
                    if (id == muteChannel1) return;
                    if (channel.permissionOverwrites.get(member2)) {
                        await channel.permissionOverwrites.get(member2).delete()
                    }
                });
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                member.addRole(memberrole).catch(console.error);
                member.removeRole(mutedrole).catch(console.error);
                const user = message.mentions.users.first();
                const pointsToAdd = parseInt(0, 10);
                let userscore = getScore.get(user.id, message.guild.id);
                if (!userscore) {
                    userscore = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        points: 0,
                        level: 1,
                        warning: 0,
                        muted: 0,
                        translate: 0,
                        stream: 0,
                        notes: 0
                    }
                }
                if (userscore.muted == `0`) return message.channel.send(user + ' Is not muted!');
                userscore.muted = `0`;
                userscore.warning = pointsToAdd;
                setScore.run(userscore);
                //LOGS
                const guildChannels = getGuild.get(message.guild.id);
                var logger = message.guild.channels.get(guildChannels.logsChannel);
                if (!logger) {
                    var logger = '0';
                }
                if (logger == '0') {} else {
                    const logsmessage = new Discord.RichEmbed()
                        .setTitle(prefix + 'set unmute')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription("Used by: " + message.author)
                        .setURL(message.url)
                        .setColor('RANDOM')
                        .addField('Usage:\n', message.content, true)
                        .addField('Channel', message.channel, true)
                        .setFooter("Message ID: " + message.id)
                        .setTimestamp();
                    logger.send({
                        embed: logsmessage
                    }).catch(error =>
                        console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + Math.floor(ln() - 4))
                    );
                }
                //
            }
            //prefix
            if (args[1] == `prefix`) {
                if (!args[2]) return message.channel.send(`Specify a prefix!!`);
                let zwargs = message.content.slice(prefix.length + 11);
                prefixstart.prefix = zwargs;
                setGuild.run(prefixstart);
                message.channel.send('Prefix set to ' + zwargs);
                //LOGS
                const guildChannels = getGuild.get(message.guild.id);
                var logger = message.guild.channels.get(guildChannels.logsChannel);
                if (!logger) {
                    var logger = '0';
                }
                if (logger == '0') {} else {
                    const logsmessage = new Discord.RichEmbed()
                        .setTitle(prefix + 'set prefix')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription("Used by: " + message.author)
                        .setURL(message.url)
                        .setColor('RANDOM')
                        .addField('Usage:\n', message.content, true)
                        .addField('Channel', message.channel, true)
                        .setFooter("Message ID: " + message.id)
                        .setTimestamp();
                    logger.send({
                        embed: logsmessage
                    }).catch(error =>
                        console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + Math.floor(ln() - 4))
                    );
                }
                //
            }
            //
        }
    },
};