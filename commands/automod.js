const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'automod',
    description: `[server] Turn on or off automod!`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const args = message.content.slice(prefix.length + 8).split(" ");
        if (args[0] == `on`) {
            let automodNotif = getGuild.get(message.guild.id);
            if (automodNotif.autoMod != `2`) {
                automodNotif.autoMod = `2`;
                setGuild.run(automodNotif);
                return message.reply("AutoMod is turned ON!");
            } else {
                return message.reply("AutoMod is already ON!");
            }

        }
        if (args[0] == `off`) {
            let automodNotif = getGuild.get(message.guild.id);
            if (automodNotif.autoMod != `1`) {
                automodNotif.autoMod = `1`;
                setGuild.run(automodNotif);
                return message.reply("AutoMod is turned OFF!");
            } else {
                return message.reply("AutoMod is already OFF!");
            }
        }
        let automodNotif = getGuild.get(message.guild.id);
        if (automodNotif.autoMod == `2`) {
            var optstatus = `AutMmod is ON!`
        } else {
            var optstatus = `AutoMod is OFF!`
        }
        message.reply(prefix + "automod on/off\n" + optstatus);
    },
};