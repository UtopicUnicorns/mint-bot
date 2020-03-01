const fs = require('fs');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'specs',
    description: '[linux] Add your hardware specifications to !userinfo',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.content == `${prefix}specs`) {
            return message.channel.send(`use neofetch --stdout in your console.\nThen paste it here using:\n${prefix}specs [neofetch output]\n\nYou can check if you have your specifications setup with ${prefix}userinfo`);
        }
        let user = message.author.id;
        fs.writeFile(`./specs/${user}.txt`, message.content.slice(prefix.length + 6), function (err) {
            message.delete(2000);
            message.reply(`Specs updated!`);
            if (err) throw err;
        })
    }
};