const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'numbers',
    description: '[general] Display role sizes',
    execute(message) {
        const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
        let array2 = [];
        let str = "";
        for (const data of allroles) {
            array2.push(data.roles);
        }
        for (let i of array) {
           if(array2.includes(i.id))
            str += message.guild.roles.find(r => r.name === (i.name)) + ": " + message.guild.roles.find(r => r.name === (i.name)).members.size + "\n";
        }
        const embed = new Discord.RichEmbed()
            .setTitle("Role Sizes")
            .setColor('RANDOM')
            .addField('Roles', `${str}`);
        message.channel.send({
            embed
        });
    }
};