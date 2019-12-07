const Discord = module.require('discord.js');
const fs = require('fs')
module.exports = {
    name: 'help',
    description: '[general] Displays all available commands',
    execute(message) {
        if (message.content === "!help admin") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes("[admin]"))
                    str += `!${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                .setDescription(`${str}\n!add, Give a user X points or take them\n!restart, well restart the bot\n!channel, Display sentient channelname\n!set, Set sentient channel ID\n!join, simulate a guildmemberjoin`)
                .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === "!help mod") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes("[mod]"))
                    str += `!${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                .setDescription(`${str}`)
                .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === "!help general") {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes("[general]"))
                str += `!${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
            .setDescription(`${str}\n!points, Display your own points\n!top, Show the point leaderboard\n!ping, display bot/server ping`)
            .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === "!help fun") {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes("[fun]"))
                str += `!${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
            .setDescription(`${str}\n!gamble, Get rid of those points`)
            .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === "!help music") {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes("[music]"))
                str += `!${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
            .setDescription(`${str}`)
            .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        let embed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
        .setTitle('Pick a category')
        .setDescription(`!help general\n!help fun\n!help music\n!help mod\n!help admin`)
        .setTimestamp();
        return message.channel.send({
            embed: embed
        });
    },
};