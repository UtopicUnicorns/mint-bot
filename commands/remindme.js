const Discord = module.require('discord.js');
const reminder = new Set();
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'remindme',
    description: '[general] set a reminder',
    execute(message) {
        //check reminder
        if (reminder.has(message.author.id, message.guild.id)) {
            const reminderemb = new Discord.RichEmbed()
                .setTitle('Reminder already set')
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription(message.author)
                .setColor('RANDOM')
                .setFooter('Reminder already set!')
           return message.channel.send({
                embed: reminderemb
            });
        } else {
            const args = message.content.slice(prefix.length + 9).split(" ");
            if (!args) return message.reply("!remind me 2 m reason why");
            if (!args[1]) return message.reply("!remind me 2 m reason why");
            if (args[1] == 's' || args[1] == 'sec' || args[1] == 'seconds') {
                var settime = Math.floor(args[0] * 1000)
            }
            if (args[1] == 'm' || args[1] == 'min' || args[1] == 'minutes') {
                var settime = Math.floor(args[0] * 60000)
            }
            if (args[1] == 'h' || args[1] == 'hour' || args[1] == 'hours') {
                var settime = Math.floor(args[0] * 3600000)
            }
            reminder.add(message.author.id, message.guild.id);
            message.reply("Reminder has been set!");
            setTimeout(() => {
                reminder.delete(message.author.id, message.guild.id);
                message.reply("PING!");
                    const reminderemb2 = new Discord.RichEmbed()
                        .setTitle('REMIND ALERT')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(message.author)
                        .addField('Reminder: ', message.content.slice(10))
                        .setColor('RANDOM')
                        .setFooter('Reminder already set!')
                    message.channel.send({
                        embed: reminderemb2
                    });
            }, settime);

        }


    },
};