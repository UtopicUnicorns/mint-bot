const Discord = module.require('discord.js');
const {
    verynicefilter2,
} = require('../config.json');
module.exports = {
    name: 'rank',
    description: '[general] Shows amount of users in a rank',
    async execute(message) {
            let filter = verynicefilter2;
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
    },
};