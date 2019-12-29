const Discord = module.require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'set',
    description: `[mod] ${prefix}set mute MENTION\n${prefix}set unmute MENTION\n${prefix}set uwu chanID\n${prefix}set unuwu chanID\n${prefix}set gif chanID\n${prefix}set ungif chanID`,
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let args = message.content.split(` `);
            //mute
            if (args[1] == `mute`) {
                const member = message.mentions.members.first();
                if (!member) return message.channel.send(`Mention a user!`);
                if (message.author.id == member.id) {
                    return message.channel.send(`You can't mute yourself`);
                }
                let filter = fs.readFileSync('./set/mute.txt').toString().split(`\n`);
                let member2 = member.id;
                if (!filter.includes(member2)) {
                    fs.appendFile('./set/mute.txt', '\n' + member2, function(err) {
                        if (err) throw err;
                        let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                        let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                        member.removeRole(memberrole).catch(console.error);
                        member.addRole(mutedrole).catch(console.error);
                        message.guild.channels.get('641301287144521728').send(member.user + `\nYou have been muted!\nYou may mention ONE Mod OR Admin to change their mind and unmute you.\n\nGoodluck!`);
                        const modembed1 = new Discord.RichEmbed()
                            .setTitle(`The command ${prefix}set mute was used`)
                            .setColor('RANDOM')
                            .addField(`${message.author.tag} muted: \n`, `${member.user.username}`, true)
                        message.guild.channels.get('646672806033227797').send({
                            embed: modembed1
                        })
                        return message.channel.send(member.user.username + ` was muted`);
                    })
                } else {
                    message.channel.send(member.user.username + ` is already muted!`);
                }
            }
            //unmute
            if (args[1] == `unmute`) {
                const member = message.mentions.members.first();
                if (!member) return message.channel.send(`Mention a user!`);
                let filter = fs.readFileSync('./set/mute.txt').toString().split(`\n`);
                let member2 = member.id;
                if (filter.includes(member2)) {
                    let array = fs.readFileSync('./set/mute.txt').toString().split(`\n`);
                    let element = member2;
                    let str = ``;
                    for (let i of array) {
                        if (i != element)
                            str += i + '\n';
                    }
                    fs.writeFile(`./set/mute.txt`, str, (error) => {
                        if (error) throw error;
                        let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                        let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                        member.addRole(memberrole).catch(console.error);
                        member.removeRole(mutedrole).catch(console.error);
                        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
                        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning) VALUES (@id, @user, @guild, @points, @level, @warning);");
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
                                warning: 0
                            }
                        }
                        userscore.warning = pointsToAdd;
                        setScore.run(userscore);
                        const modembed = new Discord.RichEmbed()
                            .setTitle(`The command ${prefix}set unmute was used`)
                            .setColor('RANDOM')
                            .addField(`${message.author.tag} unmuted: \n`, `${member.user.username}`, true)
                        message.guild.channels.get('646672806033227797').send({
                            embed: modembed
                        })
                        return message.channel.send(member.user.username + ` was unmuted`);
                    })
                } else {
                    message.channel.send(member.user.username + ` is not muted!`);
                }
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