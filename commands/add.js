const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'add',
    description: '[mscore] Give a user points or take them',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
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
                muted: 0,
                translate: 0,
                stream: 0,
                notes: 0
            }
        }
        userscore.points += pointsToAdd;
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        setScore.run(userscore);
        //LOGS
        const guildChannels = getGuild.get(message.guild.id);
        var logger = message.guild.channels.get(guildChannels.logsChannel);
        if (!logger) {
            var logger = '0';
        }
        if (logger == '0') {} else {
            const logsmessage = new Discord.RichEmbed()
                .setTitle(prefix + 'add')
                .setAuthor(message.author.username, message.author.avatarURL)
                .setDescription("Used by: " + message.author)
                .setURL(message.url)
                .setColor('RANDOM')
                .addField('Usage:\n', message.content, true)
                .addField('Channel', message.channel, true)
                .setFooter("Message ID: " + message.id)
                .setTimestamp();
            logger.send({
                embed: logsmessage
            }).catch(error =>
                console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + Math.floor(ln() - 4))
            );
        }
        //
        return message.channel.send(`${user} has gotten: ${pointsToAdd} Points.\nYou have ${userscore.points} points now.\nAnd your level is ${userscore.level}`);
    }
};