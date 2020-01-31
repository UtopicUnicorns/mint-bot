const Discord = require('discord.js');
const request = require(`request`);
const fs = require('fs');
let prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'ask',
    description: '[general] Ask Ubuntu api',
    execute(message) {
        //https://api.stackexchange.com/2.2/search/advanced?pagesize=1&order=desc&sort=relevance&q=install%20xfce&site=askubuntu&key=LhoJe7Q*b6SrcQKrgfAnjg((
        let baseurl = "https://api.stackexchange.com/2.2/search/advanced?pagesize=1&order=desc&sort=relevance&q=";
        let q = message.content.slice(prefix.length + 3);
        let key = 'LhoJe7Q*b6SrcQKrgfAnjg((';
        let url = baseurl + q + key;
        request(url, {
            json: true
        }, (err, res, items) => {
            if (err) return message.channel.send(err);
            const embed = new Discord.RichEmbed()
                .setAuthor(items[0].owner.display_name, items[0].owner.profile_image)
                .setThumbnail()
                .setURL(message.url)
                .setColor('RANDOM')
                .setDescription()
                .addField('', '')
                .setFooter()
                .setTimestamp()
            message.channel.send({
                embed: embed
            });
        });

    }
};