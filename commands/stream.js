const Discord = module.require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'stream',
    description: `[stream] turn your own stream notifications on or off`,
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
        const args = message.content.slice(prefix.length + 7).split(" ");
        if (args[0] == `on`) {
            let stream = getScore.get(message.author.id, message.guild.id);
            if (stream.stream != `1`) {
                stream.stream = `1`;
                setScore.run(stream);
                return message.reply("You turned on your own stream notifications!");
            } else {
                return message.reply("You already turned on your stream notifications!");
            }

        }
        if (args[0] == `off`) {
            let stream = getScore.get(message.author.id, message.guild.id);
            if (stream.stream != `2`) {
                stream.stream = `2`;
                setScore.run(stream);
                return message.reply("You turned off your own stream notifications!");
            } else {
                return message.reply("You already turned off your stream notifications!");
            }
        }
        let stream = getScore.get(message.author.id, message.guild.id);
        if (stream.stream == `2`) {
            var optstatus = `Your stream notifications are OFF!`
        } else {
            var optstatus = `Your stream notifications are ON!`
        }
        message.reply(prefix + "stream on/off\n" + optstatus);
    },
};