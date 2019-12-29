const Discord = require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'warn',
    description: '[mod] Warn a user',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning) VALUES (@id, @user, @guild, @points, @level, @warning);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const user = message.mentions.users.first();
        if (!user) return message.reply("You must mention someone!");
        const pointsToAdd = parseInt(1, 10);
        let userscore = getScore.get(user.id, message.guild.id);
        if (!userscore) {
            userscore = {
                id: `${message.guild.id}-${user.id}`,
                user: user.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                warning: 0
            }
        }
        userscore.warning += pointsToAdd;
        if (userscore.warning > 3) {
            fs.appendFile('./set/mute.txt', '\n' + user.id, function(err) {
                const member = message.mentions.members.first();
                if (err) throw err;
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                member.removeRole(memberrole).catch(console.error);
                member.addRole(mutedrole).catch(console.error);
                message.guild.channels.get('641301287144521728').send(member.user + `\nYou collected 3 warning points, so\nyou have been muted!\nYou may mention ONE Mod OR Admin to change their mind and unmute you.\n\nGoodluck!`);
            });
        }
        setScore.run(userscore);
        return message.channel.send(`${user} has been warned!\nYou have ${userscore.warning} warning(s)`);
    }
};