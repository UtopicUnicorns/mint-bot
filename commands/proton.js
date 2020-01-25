const Discord = require('discord.js');
const request = require(`request`);
const fs = require('fs');
const curl = require('curl');
const htmlToText = require('html-to-text');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'proton',
    description: '[general] Search the ProtonDB',
    execute(message) {
        let baselink = `https://www.startpage.com/do/dsearch?query=protondb.com ` + message.content.slice(8);
        request(baselink, {

        }, (err, res, body) => {
            const text = htmlToText.fromString(body, {
                wordwrap: 130,
                tables: []
            });
            let text2 = text.split(/\[(.*?)\]/);
            if (text2[30].includes(`Sorry, there are no results for this search.`)) return message.reply("Found nothing.");
            let parse1 = text2[31].split("/");
            let baseurl = `https://www.protondb.com/api/v1/reports/summaries/`;
            let parsedtext = parse1[4];
            let linktitle = text2[30].replace('WEB', '').replace('RESULTS', '');
            let end = `.json`;
            let url = baseurl + parsedtext + end;
            request(url, {
                json: true
            }, (err, res, body) => {
                if (err) return message.channel.send(err);
                const embed = new Discord.RichEmbed()
                    .setTitle(linktitle)
                    .setURL(text2[31])
                    .setThumbnail('https://www.protondb.com/sites/protondb/images/site-logo.svg')
                    .addField('Rating confidence: ', body.confidence)
                    .addField('Tier: ', body.tier)
                    .addField('Trending Tier: ', body.trendingTier)
                    .addField('Best rating given', body.bestReportedTier)
                    .addField('Steam Link', 'https://store.steampowered.com/app/' + parsedtext)
                    .addField('ProtonDB Link: ', text2[31])
                    .setColor('#RANDOM')
                message.channel.send({
                    embed: embed
                });
            });
        });
    }
};