const Discord = module.require('discord.js');
const curl = require('curl');
const htmlToText = require('html-to-text');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'man',
    description: '[linux] Shows linux manual pages',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('man');
        usage.number++;
        setUsage.run(usage);
        //
        if (message.content === `${prefix}man`) {
            return message.channel.send(`${prefix}man ARGS`);
        }
        let args = message.content.slice(prefix.length + 4);
        let baseurl = `https://cheat.sh/`;
        let search = args;
        let url = baseurl + search;
        curl.get(url, function(error, response, body) {
            const text = htmlToText.fromString(body, {
                wordwrap: 130
            });
            let text2 = text.replace('$ curl cheat.sh/', '').replace('Follow @igor_chubin [https://twitter.com/igor_chubin]cheat.sh [https://github.com/chubin/cheat.sh]tldr', '').replace('[https://github.com/tldr-pages/tldr]', '');
            if (text2.length > 2000) {
                return message.channel.send(`>>> ${text2}`, {
                    split: true
                });
            }
            let embed = new Discord.RichEmbed()
                .setTitle(args)
                .setDescription(text2)
                .setColor('RANDOM')
            message.channel.send({
                embed
            });
            return
        })
    }
};