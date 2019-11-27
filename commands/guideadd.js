const Discord = module.require('discord.js');
const fs = require("fs");
module.exports = {
    name: 'guideadd',
    description: 'Guides add',
    execute(message) {
        if (message.channel.id === '648911771624538112') {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let args = message.content.slice(10).split(' ');
                fs.stat(`./guide/${args[0]}/${args[1]}.txt`, function(err, fileStat) {
                    if (err) {
                        if (err.code == 'ENOENT') {
                            fs.writeFile(`./guide/${args[0]}/${args[1]}.txt`, message.content.slice(10), (err) => {
                                if (err) throw err;
                            });
                            console.log(args[0] + ' ' + args[1] + ' made!');
                            message.delete();
                            return;
                        }
                    } else {
                        openfile = fs.readFileSync(`./guide/${args[0]}/${args[1]}.txt`).toString();
                        let embed = new Discord.RichEmbed()
                            .setDescription(`Guide already exists!`)
                            .setColor(`RANDOM`)
                            .setTimestamp();
                        message.author.send({
                            embed: embed
                        });
                        message.delete();
                        return;
                    }
                });
            } else {
                message.delete();
                message.reply("You may use this command in <#648911771624538112>");
            }
        }
    },
};