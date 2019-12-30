const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'level',
    description: '[general] Show your points and level',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted) VALUES (@id, @user, @guild, @points, @level, @warning, @muted);");       
        const user = message.mentions.users.first() || message.author;
       let userscore = getScore.get(user.id, message.guild.id);
       if (!userscore) return message.reply("This user does not have a database index yet.");
       let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
       userscore.level = userLevel;
       setScore.run(userscore);
       const pointemb = new Discord.RichEmbed()
       .setColor('RANDOM')
       .addField('Name: ', user)
       .addField('Points: ', userscore.points)
       .addField('Level: ', userscore.level)
       .addField('Warning points: ', userscore.warning)
       .setTimestamp()
   return message.channel.send({
       embed: pointemb
   });
    }
};