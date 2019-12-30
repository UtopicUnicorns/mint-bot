const Discord = require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'warn',
    description: '[mod] Warn a user',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted) VALUES (@id, @user, @guild, @points, @level, @warning, @muted);");
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
                warning: 0,
                muted: 0
            }
        }
        userscore.warning += pointsToAdd;
        if (userscore.warning > 3) {
            const member = message.mentions.members.first();
            message.guild.channels.forEach(async (channel, id) => {
                if (id == '641301287144521728') return;
                await channel.overwritePermissions(member, {
                    VIEW_CHANNEL: false,
                    READ_MESSAGES: false,
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    ADD_REACTIONS: false
                });
            })
            let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
            let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
            member.removeRole(memberrole).catch(console.error);
            member.addRole(mutedrole).catch(console.error);
            message.guild.channels.id('641301287144521728')
                   .overwritePermissions(member, {
                    VIEW_CHANNEL: true,
                    READ_MESSAGES: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: false
                });
        }
        setScore.run(userscore);
        return message.channel.send(`${user} has been warned!\nYou have ${userscore.warning} warning(s)`);
    }
};