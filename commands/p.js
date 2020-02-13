const Discord = require('discord.js');
const request = require("request");
const db = require('better-sqlite3')('./scores.sqlite');
const ping = new Set();
module.exports = {
    name: 'p',
    description: '[fun] Ping a website',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (ping.has(message.guild.id)) {

        } else {
            ping.add(message.guild.id);
            setTimeout(() => {
                ping.delete(message.guild.id);
            }, 1000);
            if (message.content.includes('http://') || message.content.includes('https://')) {
                var args = message.content.slice(prefix.length + 2);
            } else {
                var args = 'http://' + message.content.slice(prefix.length + 2);
            }
            var time1 = Date.now();
            request(args, {
                json: true
            }, (err, res, body) => {
                var time2 = Date.now();
                var calctime = time2 - time1;
                if (res) {
                    var status = res.statusCode;
                } else {
                    var status = 'Website not found!';
                }
                const embed = new Discord.RichEmbed()
                    .setTitle(args)
                    .setDescription('Status code: ' + status + '\nPage loaded in: ' + calctime + ' ms')
                message.channel.send({
                    embed: embed
                });
            });

        }
    }
};