const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'massadd',
    description: '[admin] Mass add a role',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let array = await message.guild.members.map(m => m);
            let args = message.content.slice(9);
            let role = message.guild.roles.find(r => r.name === `${args}`);
            console.log(args);
            if (!role) {
                return message.channel.send(`${args} does not exist!`);
            }
            message.channel.send(`Adding ${args} to everyone. This may take a while.`);
            let str = "";
            for (let i of array) {
                   await i.addRole(role).catch(console.error);
            }
            message.channel.send(`Done! Added ${args} to everyone!`);
            console.log("done");
        }
    },
};