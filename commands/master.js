const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
const request = require('request');
module.exports = {
    name: 'master',
    description: '[admin] Download and insert scripts',
    execute(message) {
        if (message.author.id !== '127708549118689280') return;
        if (message.content == `${prefix}master`) return message.channel.send(`${prefix}master read ${prefix}master commands/script.js / OR /commands/ script.EXTention`);
        if (message.content == `${prefix}master read`) {
            let readingthis = fs.readdirSync('./commands');
            let readingthis2 = fs.readdirSync('./');
            const readingthisout = new Discord.RichEmbed()
                .setTitle('Read')
                .setColor('RANDOM')
                .addField('./', readingthis2, true)
                .addField('./commands', readingthis, true)
                .setTimestamp()
            return message.channel.send({
                embed: readingthisout
            });
        }
        let args = message.content.split(` `);
        if (!args[1]) return message.reply(`Provide your URL!\ncommands/script.js OR command.js`);
        if (!args[2]) return message.reply(`Provide a save folder / OR /commands/`);
        if (!args[3]) return message.reply(`Provide a script file name.extention`);
        let baseurl = `https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/`;
        let url = baseurl + args[1];
        request(url, function(error, response, body) {
            if (error) return console.log('error:', error);
            fs.writeFile(`.${args[2]}${args[3]}`, body, function(err) {
                if (err) throw err;
                return message.reply(`Looks like we are done here!`);
            })
        });
    }
};