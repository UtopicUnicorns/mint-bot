const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: `rolegive`,
    description: `[mod] Give a role to a member. rolegive @USER ROLENAME`,
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (!message.member.hasPermission(`KICK_MEMBERS`)) return;
        let args = message.content.slice().split(` `);
        let rolegive = message.guild.roles.find(r => r.name === `${args[2]}`);
        let member = message.mentions.members.first();
        let check = message.mentions.members.first().roles.some(r => [`${args[2]}`].includes(r.name));
        if (!check) {
            member.addRole(rolegive).catch(console.error);
            return message.channel.send(`Gave ${member} the following role: **${args[2]}**!`);
        }
        member.removeRole(rolegive).catch(console.error);
        message.channel.send(`Took the following role: **${args[2]}** from: ${member}!`);
    },
};