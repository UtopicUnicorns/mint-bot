const Discord = module.require('discord.js');
const moment = require('moment');
const fs = require("fs");
module.exports = {
	name: 'userinfo',
	description: 'userinfo here ',
	execute(message) {
        if (message.channel.id === '628992550836895744') {

        let user = message.mentions.users.first() || message.author;
            fs.stat(`./specs/${user.id}.txt`, function(err, fileStat) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        let member = message.guild.member(user);
                        let embed = new Discord.RichEmbed()
                            .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                            .setDescription(`${user}`)
                            .setColor(`RANDOM`)
                            .setThumbnail(`${user.displayAvatarURL}`)
                            .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                            .addField('Status:', user.presence.status, true)
                            .addField('Created at:', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                            .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
                            .addField('Last Message: ', `${user.lastMessage}\n`, true)
                            .addField('Specifications:\n', 'User has not added their specifications.\nTo add your own specs use !specs', true)
                            .setFooter(`ID: ${user.id}`)
                            .setTimestamp();
                    
                        message.channel.send({ embed: embed });
                        return;
                    }
                } else {
                   
                    openfile = fs.readFileSync(`./specs/${user.id}.txt`).toString();
    
                    let member = message.guild.member(user);
                        let embed = new Discord.RichEmbed()
                            .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
                            .setDescription(`${user}`)
                            .setColor(`RANDOM`)
                            .setThumbnail(`${user.displayAvatarURL}`)
                            .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                            .addField('Status:', user.presence.status, true)
                            .addField('Created at:', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
                            .addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
                            .addField('Last Message: ', `${user.lastMessage}\n`, true)
                            .addField('Specifications:\n', `${openfile}`, true)
                            .setFooter(`ID: ${user.id}`)
                            .setTimestamp();
                    
                        message.channel.send({ embed: embed });
                        return;

                }
            });

    


        }
        else {
            message.reply("You may use this command in <#628992550836895744>");
            }
	},
};
