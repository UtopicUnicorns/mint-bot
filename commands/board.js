const Discord = require('discord.js');
const db = require('better-sqlite3')('../scores.sqlite');
module.exports = {
    name: 'board',
    description: '[general] Show leaderboard',
    execute(message) {
        const top10 = db.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
        const embed = new Discord.RichEmbed()
            .setTitle("Leaderboard")
            .setDescription("Top 10 chatters")
            .setColor('RANDOM');
        for (const data of top10) {
            if (message.users.get(data.user)) {
                embed.addField(message.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
            }
        }
        message.channel.send({
            embed
        });
    }
};