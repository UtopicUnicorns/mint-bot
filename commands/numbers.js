const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
const {
    rolenameconf
} = require('../config.json');
module.exports = {
    name: 'numbers',
    description: '[general] Display role sizes',
    execute(message) {
        const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        console.log(allroles);
        let array2 = rolenameconf;
        let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
        let str = "";
        for (let i of array) {
           if(array2.includes(i.name))
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