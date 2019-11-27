const Discord = module.require('discord.js');
module.exports = {
    name: 'purge',
    description: 'Purge a mentioned user or a specified ammount',
    async execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            const user = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            const modembed = new Discord.RichEmbed()
                .setTitle("The command !purge was used")
                .setColor('RANDOM')
                .addField(`${message.author.tag} purged: \n`, `${message.content}`, true)
            message.guild.channels.get('646672806033227797').send({
                embed: modembed
            });
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
        }
    },
};