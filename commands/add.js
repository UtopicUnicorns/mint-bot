const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'add',
    description: '[admin] Give a user points or take them',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const user = message.mentions.users.first();
        if (!user) return message.reply("You must mention someone or give their ID!");
        let args = message.content.slice(5).split(' ');
        const pointsToAdd = parseInt(args[1], 10);
        if (!pointsToAdd) return message.reply("You didn't tell me how many points to give...")
        let userscore = getScore.get(user.id, message.guild.id);
        if (!userscore) {
            userscore = {
                id: `${message.guild.id}-${user.id}`,
                user: user.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                warning: 0,
                muted: 0
            }
        }
        userscore.points += pointsToAdd;
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        setScore.run(userscore);
        return message.channel.send(`${user} has gotten: ${pointsToAdd} Points.\nYou have ${userscore.points} points now.\nAnd your level is ${userscore.level}`);
    }
};