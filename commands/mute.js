const Discord = module.require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'mute',
    description: '[mod] Mute a member',
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const member = message.mentions.members.first();
            if (message.author.id == member.id) {
                return message.channel.send("You can't mute yourself");
            }
            let filter = fs.readFileSync('mute.txt').toString().split("\n");
            let member2 = member.id;
            if (!filter.includes(member2)) {
                fs.appendFile('mute.txt', '\n' + member2, function(err) {
                    if (err) throw err;
                    let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                    let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                    member.removeRole(memberrole).catch(console.error);
                    member.addRole(mutedrole).catch(console.error);
                    message.guild.channels.get('641301287144521728').send(member.user + "\nYou have been muted!\nYou may mention ONE Mod OR Admin to change their mind and unmute you.\n\nGoodluck!");
                    const modembed1 = new Discord.RichEmbed()
                        .setTitle("The command !approve was used")
                        .setColor('RANDOM')
                        .addField(`${message.author.tag} muted: \n`, `${member.user.username}`, true)
                    message.guild.channels.get('646672806033227797').send({
                        embed: modembed1
                    });
                    return message.channel.send(member.user.username + " was muted"); //console.log('done! added');
                });
            } else {
                let array = fs.readFileSync('mute.txt').toString().split("\n");
                let element = member2;
                let str = "";
                for (let i of array) {
                    if (i != element)
                        str += i + '\n';
                }
                fs.writeFile("mute.txt", str, (error) => {
                    if (error) throw error;
                    let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                    let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                    member.addRole(memberrole).catch(console.error);
                    member.removeRole(mutedrole).catch(console.error);
                    const modembed = new Discord.RichEmbed()
                        .setTitle("The command !approve was used")
                        .setColor('RANDOM')
                        .addField(`${message.author.tag} unmuted: \n`, `${member.user.username}`, true)
                    message.guild.channels.get('646672806033227797').send({
                        embed: modembed
                    });
                    return message.channel.send(member.user.username + " was unmuted"); //console.log('done! removed');
                });
            }
        }
    },
};