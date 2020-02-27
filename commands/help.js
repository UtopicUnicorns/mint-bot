const Discord = module.require('discord.js');
const fs = require('fs')
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'help',
    description: '[general] Displays all available commands',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.content === `${prefix}help admin`) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes(`[admin]`))
                        str += `${prefix}${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                    .setColor(`RANDOM`)
                    .setThumbnail(message.guild.iconURL)
                    .setDescription(`${str}${prefix}restart, [admin] well restart the bot\n${prefix}channel, [admin] Display sentient channelname\n${prefix}set, [admin] Set sentient channel ID\n${prefix}join, [admin] simulate a guildmemberjoin`)
                    .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === `${prefix}help mod`) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes(`[mod]`))
                        str += `${prefix}${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                    .setColor(`RANDOM`)
                    .setThumbnail(message.guild.iconURL)
                    .setDescription(`${str}`)
                    .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === `${prefix}help server`) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes(`[server]`))
                        str += `${prefix}${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                    .setColor(`RANDOM`)
                    .setThumbnail(message.guild.iconURL)
                    .setDescription(`${str}`)
                    .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === `${prefix}help mscore`) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let str = '';
                const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./${file}`);
                    if (command.description.includes(`[mscore]`))
                        str += `${prefix}${command.name}, ${command.description} \n`;
                }
                let embed = new Discord.RichEmbed()
                    .setColor(`RANDOM`)
                    .setThumbnail(message.guild.iconURL)
                    .setDescription(`${str}`)
                    .setTimestamp();
                return message.channel.send({
                    embed: embed
                });
            }
        }
        if (message.content === `${prefix}help general`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[general]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}` + prefix + `ping,[general] display bot/server ping\n` + prefix + `tr,[general] Translate your sentence to English`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === `${prefix}help level`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[level]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === `${prefix}help linux`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[linux]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === `${prefix}help fun`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[fun]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === `${prefix}help stream`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[stream]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        if (message.content === `${prefix}help music`) {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                if (command.description.includes(`[music]`))
                    str += `${prefix}${command.name}, ${command.description} \n`;
            }
            let embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .setDescription(`${str}`)
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
        let embed2 = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(message.guild.iconURL)
            .setTitle('Pick a category')
            .setDescription('When Artemis replies with an Arrow up emote, you leveled up!\nYou can report a message by reaction to it with :x: \nhaving 3 :tea: reactions to a message will highlight it!\n')
            .addField(`${prefix}help general`, 'Display General help\n')
            .addField(`${prefix}help linux`, 'Display linux based commands\n')
            .addField(`${prefix}help level`, 'Display level/score/role commands\n')
            .addField(`${prefix}help fun`, 'Display Fun commands\n')
            .addField(`${prefix}help stream`, 'Display stream related commands\n')
            .addField(`${prefix}help music`, 'Display music help\n')
        if (message.member.hasPermission('KICK_MEMBERS')) {
            embed2.addField(`${prefix}help mod`, 'Display Mod commands\n')
            embed2.addField(`${prefix}help admin`, 'Display Admin commands\n')
            embed2.addField(`${prefix}help server`, 'Display server commands\n')
            embed2.addField(`${prefix}help mscore`, 'Display score/level commands\n')
        }
        return message.channel.send({
            embed: embed2
        });
    },
};