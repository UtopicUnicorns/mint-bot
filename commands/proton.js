const Discord = require('discord.js');
const request = require(`request`);
const steam = require('steam-searcher');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'proton',
    description: '[linux] Search the ProtonDB',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('proton');
        usage.number++;
        setUsage.run(usage);
        //
        const args = message.content.slice(prefix.length + 7);
        if (!args) return message.reply("Please provide a game name!");
        steam.find({
            search: `${args}`
        }, function (err, game) {
            if (err) return message.reply("Failed to get gameID");
            let baseurl = `https://www.protondb.com/api/v1/reports/summaries/`;
            let parsedtext = game.steam_appid;
            let end = `.json`;
            let url = baseurl + parsedtext + end;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.RichEmbed()
                    .setTitle(game.name)
                    .setURL('https://www.protondb.com/app/' + parsedtext)
                    .setThumbnail(game.screenshots[0].path_thumbnail)
                    .setDescription('Native: ' + game.platforms.linux)
                    .addField('Rating confidence: ', body.confidence)
                    .addField('Tier: ', body.tier)
                    .addField('Trending Tier: ', body.trendingTier)
                    .addField('Best rating given', body.bestReportedTier)
                    .addField('Steam Link', 'https://store.steampowered.com/app/' + parsedtext)
                    .addField('ProtonDB Link: ', 'https://www.protondb.com/app/' + parsedtext)
                    .setFooter('Price: ' + game.price_overview.final_formatted)
                    .setColor('#RANDOM')
                message.channel.send({
                    embed: embed
                });
            });
        });
    }
};