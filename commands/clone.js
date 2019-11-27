module.exports = {
    name: 'clone',
    description: 'Clone bot',
    execute(message) {
        let user = message.author;
        message.guild.channels.get('642882039372185609').send(`${user} I am fetching the package now...`);
        message.guild.channels.get('642882039372185609').send({
            files: ['./clone.tar']
        });
    },
};