const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'react',
    description: '[mod] Add reactions to a message',
    execute(message) {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        if (message.content == prefix + 'react') return message.reply(prefix + "react MessageID EmoteName EmoteName EmoteName...");
        let args = message.content.slice(7).split(" ");
        let array = [];
        for (let i of args) {
            if (i !== args[0]) {
                array.push(i);
            }
        }
        message.channel.fetchMessage(args[0])
            .then(messages => {
                for (let n in array) {
                    if (n > 19) return;
                    if(message.guild.emojis.find(r => r.name == array[n])) {
                    var emoji = [message.guild.emojis.find(r => r.name == array[n])];
                    for (let i in emoji) {
                        messages.react(emoji[i]);
                    }
                }
                }
            })
            .catch(error =>
                {
                    message.reply("Message ID does not exist");
                }
            );
    },
};