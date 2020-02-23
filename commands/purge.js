const Discord = module.require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'purge',
    description: '[mod] Purge a mentioned user or a specified ammount',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
            const user = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            message.delete();
            message.channel.fetchMessages({
                limit: 100,
            }).then((messages) => {
                if (user) {
                    const filterBy = user ? user.id : Client.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                } else {
                    messages = messages.array().slice(0, amount);
                }
                message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            });
    },
};