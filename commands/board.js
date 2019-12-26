const SQLite = require("better-sqlite3");
const sql = new SQLite('../scores.sqlite');
module.exports = {
    name: 'board',
    description: '[general] Display the server point leaderboard!',
    execute(message) {
        const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
        const embed = new Discord.RichEmbed()
            .setTitle("Leaderboard")
            .setDescription("Top 10 chatters")
            .setColor(0x00AE86);
        for (const data of top10) {
            if (client.users.get(data.user)) {
                embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
            }
        }
        message.channel.send({
            embed
        });
            },
};