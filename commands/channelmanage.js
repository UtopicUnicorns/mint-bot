const Discord = require('discord.js');
const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'channelmanage',
    description: '[admin] Manage preset channels',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        if (message.content === `${prefix}channelmanage`) {
            let channelget = getGuild.get(message.guild.id);
            const hellothereguilde = new Discord.RichEmbed()
                .setTitle('Manage Channels')
                .setColor('RANDOM')
                .addField('Command usage:\n', `${prefix}channelmanage mute/general/highlight/logs/stream chanID/chanNAME`)
                .addField('General Channel: ', message.guild.channels.find(channel => channel.id === channelget.generalChannel))
                .addField('Mute Channel: ', message.guild.channels.find(channel => channel.id === channelget.muteChannel))
                .addField('Logs Channel: ', message.guild.channels.find(channel => channel.id === channelget.logsChannel))
                .addField('Highlight Channel: ', message.guild.channels.find(channel => channel.id === channelget.highlightChannel))
                .addField('Reaction Roles Channel: ', message.guild.channels.find(channel => channel.id === channelget.reactionChannel))
                .addField('Stream Notification Channel: ', message.guild.channels.find(channel => channel.id === channelget.streamChannel))
                .setTimestamp();
            return message.channel.send({
                embed: hellothereguilde
            });
        }
        const args = message.content.slice(15).split(" ");
        if (args[0] == 'mute') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.muteChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Mute channel has been changed to " + channelcheck);
        }
        if (args[0] == 'general') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.generalChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("General channel has been changed to " + channelcheck);
        }
        if (args[0] == 'highlight') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.hightlightChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Highlight channel has been changed to " + channelcheck);
        }
        if (args[0] == 'logs') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.logsChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Logs channel has been changed to " + channelcheck);
        }
        if (args[0] == 'stream') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.streamChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Stream channel has been changed to " + channelcheck);
        }
        if (args[0] == 'reaction') {
            let channelget = getGuild.get(message.guild.id);
            if (!channelget) return message.channel.send("You do not have set me up yet.\nSay the words: `setup auto`");
            let channelcheck = message.guild.channels.find(channel => channel.id === args[1]) || message.guild.channels.find(channel => channel.name === args[1]);
            if (!channelcheck) return message.channel.send(args[1] + " is not a valid channel!");
            channelget.reactionChannel = channelcheck.id;
            setGuild.run(channelget);
            return message.channel.send("Reaction Roles channel has been changed to " + channelcheck);
        }
    }
};