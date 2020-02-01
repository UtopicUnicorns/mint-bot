const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
const fs = require('fs');
const prefix = fs.readFileSync('./set/prefix.txt').toString();
module.exports = {
    name: 'rolemanage',
    description: '[admin] Manage self assignable roles',
    execute(message) {
        const getRoles = db.prepare("SELECT * FROM roles WHERE roles = ?");
        const setRoles = db.prepare("INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        if (message.content === `${prefix}rolemanage`) {
            const allroles = db.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
            let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
            let array2 = [];
            let str = "";
            for (const data of allroles) {
                array2.push(data.roles);
            }
            for (let i of array) {
                if (array2.includes(i.id))
                    str += message.guild.roles.find(r => r.name === (i.name)) + "\n";
            }
            const embed = new Discord.RichEmbed()
                .setTitle("Manage self assignable roles")
                .setColor('RANDOM')
                .addField('Command usage: ', prefix + 'rolemanage roleNAME/roleID')
                .addField('Current self assignable roles: ', `${str}`);
           return message.channel.send({
                embed
            });
        }
        const args = message.content.slice(prefix.length + 11).split(" ");
        const rolechecker = message.guild.roles.find(r => r.name === (`${args}`)) || message.guild.roles.find(r => r.id === (`${args}`));
        if (!rolechecker) {
            return console.log(args + ' is not a role.');
        }
        let rolecheck = getRoles.get(rolechecker.id);
        if (!rolecheck) {
            rolecheck = {
                guild: message.guild.id,
                roles: rolechecker.id
            }
            message.channel.send('+Added role to self assignable list ' + message.guild.id + ' ' + rolechecker);
        } else {
            db.prepare(`DELETE FROM roles WHERE roles = ${rolechecker.id}`).run();
            return message.channel.send('-Removed role from self assignable list ' + message.guild.id + ' ' + rolechecker);
        }
        setRoles.run(rolecheck);

    }
};