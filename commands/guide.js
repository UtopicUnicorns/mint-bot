const Discord = module.require('discord.js');
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'guide',
    description: '[general] Request a guide',
    async execute(message) {
        if (message.channel.id === '648911771624538112') {
            let args = message.content.slice(7).split(' ');

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            if (message.content == `${prefix}guide mint`) {
                array = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`];
                for (let i in array) {
                    await sleep(1000);
                    let g1 = fs.readFileSync(`./guide/6/${i}.txt`).toString();
                    let embed = new Discord.RichEmbed()
                        .setDescription(`${g1}`)
                        .setColor(`RANDOM`)
                        .setTimestamp();
                    message.author.send({
                        embed: embed
                    });
                }
                return 
            }
            fs.stat(`./guide/${args[0]}/${args[1]}.txt`, function(err, fileStat) {
                if (err) {
                    if (err.code == 'ENOENT') {
                        let embed = new Discord.RichEmbed()
                            .setDescription(`Guide not found!`)
                            .setColor(`RANDOM`)
                            .setTimestamp();
                        message.author.send({
                            embed: embed
                        });
                        return;
                    }
                } else {
                    openfile = fs.readFileSync(`./guide/${args[0]}/${args[1]}.txt`).toString();
                    let embed = new Discord.RichEmbed()
                        .setDescription(`${openfile}`)
                        .setColor(`RANDOM`)
                        .setTimestamp();
                    message.author.send({
                        embed: embed
                    });
                    return;
                }
            });
        } else {
            message.delete();
            message.reply(`You may use this command in <#648911771624538112>`);
        }
    },
};