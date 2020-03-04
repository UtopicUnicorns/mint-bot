const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'board',
    description: '[level] Show leaderboard',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const top10 = db.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
        const embed = new Discord.RichEmbed()
            .setTitle("Leaderboard")
            .setDescription("Full leaderboard on https://artemisbot.eu/")
            .setColor('RANDOM');
        for (const data of top10) {
            if (message.guild.members.get(data.user)) {
                let user = message.guild.members.get(data.user);
                embed.addField(user.user.username, `${data.points} points (level ${data.level})`);
            }
        }
        message.channel.send({
            embed
        });
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('board');
        usage.number++;
        setUsage.run(usage);
        //
    }
};