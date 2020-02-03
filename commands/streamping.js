const Discord = module.require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'streamping',
    description: `[stream][mod] Turn on or off stream notification @here pings!`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const args = message.content.slice(prefix.length + 11).split(" ");
        if (args[0] == `on`) {
            let streamnotif = getGuild.get(message.guild.id);
            if (streamnotif.streamHere != `2`) {
                streamnotif.streamHere = `2`;
                setGuild.run(streamnotif);
                return message.reply("You turned ON @ here pings for stream notifications!");
            } else {
                return message.reply("Stream pings already have been enabled!");
            }

        }
        if (args[0] == `off`) {
            let streamnotif = getGuild.get(message.guild.id);
            if (streamnotif.streamHere != `1`) {
                streamnotif.streamHere = `1`;
                setGuild.run(streamnotif);
                return message.reply("You turned OFF @ here pings for stream notifications!");
            } else {
                return message.reply("Stream pings are already disabled!");
            }
        }
        let streamnotif = getGuild.get(message.guild.id);
        if (streamnotif.streamHere == `2`) {
            var optstatus = `Your streamchannel notifications pings are ON!`
        } else {
            var optstatus = `Your streamchannel notifications pings are OFF!`
        }
        message.reply(prefix + "streamping on/off\n" + optstatus);
    },
};