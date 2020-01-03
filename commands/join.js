const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'join',
    description: '[general] Join a self assignable role',
    execute(message) {
        const args = message.content.slice(6);
        const member = message.member;
        const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        let array2 = [];
        for (const data of allroles) {
            array2.push(message.guild.roles.find(r => r.id == data.roles).name);
        }
        if (array2.includes(args)) {
            const role = message.guild.roles.find(r => r.name === args);
            let checking = message.member.roles.find(r => r.name === args);
            if (checking) return message.reply("You already have this role.");
            member.addRole(role).catch(console.error);
            const embed = new Discord.RichEmbed()
                .setDescription(message.author)
                .setColor('RANDOM')
                .addField('Joined: ', role);
            return message.channel.send({
                embed
            });
        }
        message.reply("Invalid role!");
    }
};