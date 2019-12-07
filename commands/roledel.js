const {
        verynicefilter2,
    } = require('../config.json');
    module.exports = {
        name: 'roledel',
        description: '[mod] Delete a role',
        execute(message) {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let user = message.author;
                let args = message.content.slice().split(' ');
                let filter = verynicefilter2;
                let rankdel = message.guild.roles.find(r => r.name === `${args[1]}`);
                if (message.content === "!roledel") {
                    return message.channel.send(`${user}, it's simple really...\n!roledel RANK`);
                }
                let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
                if (!checking) {
                    return message.channel.send(`${user}\n**${args[1]}** is not a role!`);
                }
                if (filter.includes(rankdel.id)) {
                    return message.channel.send(`${user}\n**${args[1]}** is a forbidden role!`);
                }
                rankdel.delete();
                return message.channel.send(`${user}\nYou have deleted rank: **${args[1]}**!`);
            }
        },
    };