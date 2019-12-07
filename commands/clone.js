module.exports = {
    name: 'clone',
    description: '[admin] Clone the bot',
    execute(message) {
        let user = message.author;
        message.guild.channels.get('650035857788764160').send(`${user} I am fetching the package now...`);
        message.guild.channels.get('650035857788764160').send({
            files: ['./clone.tar']
        });
    },
};