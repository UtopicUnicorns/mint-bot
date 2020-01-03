const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'rolemanage',
    description: '[admin] Manage self assignable roles',
    execute(message) {
        const getRoles = db.prepare("SELECT * FROM roles WHERE roles = ?");
        const setRoles = db.prepare("INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);");
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        const args = message.content.slice(12).split(" ");
        const rolechecker = message.guild.roles.find(r => r.name === (`${args}`));
        if (!rolechecker) {
            return console.log(args + ' is not a role.');
        }
        let rolecheck = getRoles.get(rolechecker.id);
        if (!rolecheck) {
            rolecheck = {
                guild: message.guild.id,
                roles: rolechecker.id
            }
            message.channel.send('+ ' + message.guild.id + ' ' + rolechecker);
        } else {
            db.prepare(`DELETE FROM roles WHERE roles = ${rolechecker.id}`).run();
            return message.channel.send('- ' + message.guild.id + ' ' + rolechecker);
        }
        setRoles.run(rolecheck);

    }
};