const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'suggest',
    description: '[general] Suggest an idea',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.content === `${prefix}suggest`) {
            return message.channel.send(prefix + `suggest <suggestion>`);
        }
        const embed = new Discord.RichEmbed()
            .setDescription('Your suggestion')
            .setImage('https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/SUGGESTIONS.gif')
        message.channel.send({
            embed: embed
        });
    },
};