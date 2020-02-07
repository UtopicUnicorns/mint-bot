const Discord = require('discord.js');
const fs = require('fs');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'warnings',
    description: '[mod] Look up user warning',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const user = message.mentions.users.first();
        if (!user) {
            const getstuff = db.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY warning DESC LIMIT 24;").all(message.guild.id);
            const embed = new Discord.RichEmbed()
                .setColor('RANDOM');
            for (const data of getstuff) {
                if (message.guild.members.get(data.user) && data.warning > 0) {
                    let user = message.guild.members.get(data.user);
                    embed.addField(user.user.username, `Warnings: ${data.warning} | Reason: ${data.notes})`);
                }
            }
            message.channel.send({
                embed
            });
        }
        const userscore = getScore.get(user.id, message.guild.id);
        if (!userscore) return message.reply("This user has no entry!");
        if (userscore.muted == `1`) {
            var isMuted = 'yes';
        } else {
            var isMuted = 'no'
        }
        if (message.content.includes("reset")) {
            userscore.warning = 0;
            setScore.run(userscore);
            message.channel.send("Warnings for this user have been reset to 0!");
        }
        const embeds = new Discord.RichEmbed()
            .setAuthor(user.username, user.displayAvatarURL)
            .setDescription(user)
            .setColor('RANDOM')
            .addField('Warnings: ', userscore.warning)
            .addField('Latest reason: ', userscore.notes)
            .addField('Muted? ', isMuted)
            .setFooter(user.id)
        message.channel.send({
            embed: embeds
        });

    }
};