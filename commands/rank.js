const Discord = module.require('discord.js');
const {
    verynicefilter2,
} = require('../config.json');
module.exports = {
    name: 'rank',
    description: '[general] Shows amount of users in a rank',
    async execute(message) {
        if (message.channel.id === '628992550836895744') {
            let user = message.author;
            let args = message.content.slice().split(' ');
            let filter = verynicefilter2;
            let rolerank = message.guild.roles.find(r => r.name === `${args[1]}`);
            let member = message.member;
            let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
            let str = "";
            for (let i of array) {
                if (!filter.includes(i.id))
                    str += message.guild.roles.find(r => r.name === (i.name)) + "/" + i.name + ": " + message.guild.roles.find(r => r.name === (i.name)).members.size + "\n";
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                .setTitle('Usercount for all the roles')
                .addField('Set your own ranks in <#643176341079851019> ', `${str}`, true)
            return message.channel.send({
                embed: embed
            });
            //}
            let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
            if (!checking) {
                return message.channel.send(`${user}\n**${args[1]}** is not a role!`);
            }
            if (filter.includes(rolerank.id)) {
                return message.channel.send(`${user}\n**${rolerank}** is a forbidden role!`);
            }
            let checking2 = message.member.roles.find(r => r.name === `${args[1]}`);
            if (checking2) {
                member.removeRole(rolerank).catch(console.error);
                return message.channel.send(`${user}\nYou already had the role **${rolerank}**, so I removed it for you.`);
            }
            message.channel.send(`${user}\nYou have joined the **${rolerank}** rank!`);
            member.addRole(rolerank).catch(console.error);
        } else {
            message.reply("You may use this command in <#628992550836895744>");
        }
    },
};