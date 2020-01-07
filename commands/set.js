const Discord = module.require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'set',
    description: `[mod] \n${prefix}set mute MENTION\n${prefix}set unmute MENTION\n${prefix}set uwu chanID\n${prefix}set unuwu chanID\n${prefix}set gif chanID\n${prefix}set ungif chanID`,
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
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
                    await channel.permissionOverwrites.get(member2).delete()
                });
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                member.addRole(memberrole).catch(console.error);
                member.removeRole(mutedrole).catch(console.error);
                const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
                        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted) VALUES (@id, @user, @guild, @points, @level, @warning, @muted);");
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
                                muted: 0
                            }
                        }
                        userscore.warning = pointsToAdd;
                        setScore.run(userscore);
            }
            //uwu
            if (args[1] == `uwu`) {
                if (!args[2]) return message.channel.send(`Specify a channel name!`);
                let element = args[2];
                let filter = fs.readFileSync('./set/uwu.txt').toString().split(`\n`);
                if (!filter.includes(element)) {
                    fs.appendFile('./set/uwu.txt', '\n' + element, function(err) {
                        if (err) throw err;
                    })
                    return message.channel.send(element + ` is now UwU!`);
                } else {
                    message.channel.send(args[2] + ` is already UwU`);
                }
            }
            //un-uwu
            if (args[1] == `unuwu`) {
                if (!args[2]) return message.channel.send(`Specify a channel name!`);
                let filter = fs.readFileSync('./set/uwu.txt').toString().split(`\n`);
                if (filter.includes(args[2])) {
                    let array = fs.readFileSync('./set/uwu.txt').toString().split(`\n`);
                    let element = args[2];
                    let str = ``;
                    for (let i of array) {
                        if (i != element)
                            str += i + '\n';
                    }
                    fs.writeFile(`./set/uwu.txt`, str, (error) => {
                        if (error) throw error;
                    })
                    return message.channel.send(element + ` is now not UwU!`);
                } else {
                    message.channel.send(args[2] + ` is not UwU`);
                }
            }
            //gif
            if (args[1] == `gif`) {
                if (!args[2]) return message.channel.send(`Specify a channel name!`);
                let element = args[2];
                let filter = fs.readFileSync('./set/gif.txt').toString().split(`\n`);
                if (!filter.includes(element)) {
                    fs.appendFile('./set/gif.txt', '\n' + element, function(err) {
                        if (err) throw err;
                    })
                    return message.channel.send(element + ` now has a gif filter!`);
                } else {
                    message.channel.send(args[2] + ` already has a gif filter in place!`);
                }
            }
            //ungif
            if (args[1] == `ungif`) {
                if (!args[2]) return message.channel.send(`Specify a channel name!`);
                let filter = fs.readFileSync('./set/gif.txt').toString().split(`\n`);
                if (filter.includes(args[2])) {
                    let array = fs.readFileSync('./set/gif.txt').toString().split(`\n`);
                    let element = args[2];
                    let str = ``;
                    for (let i of array) {
                        if (i != element)
                            str += i + '\n';
                    }
                    fs.writeFile(`./set/gif.txt`, str, (error) => {
                        if (error) throw error;
                    })
                    return message.channel.send(element + ` has no gif filter now!`);
                } else {
                    message.channel.send(args[2] + ` does not have a gif filter!`);
                }
            }
            //prefix
            if (args[1] == `prefix`) {
                if (message.author.id !== '127708549118689280') return;
                if (!args[2]) return message.channel.send(`Specify a prefix!!`);
                let element = args[2];
                fs.writeFile(`./set/prefix.txt`, element, (error) => {
                    if (error) throw error;
                })
                message.channel.send('Prefix set to ' + element + '\nUse the following command:\n' + element + 'reload');
            }
            //
        }
    },
};