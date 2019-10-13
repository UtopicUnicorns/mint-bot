module.exports = {
	name: 'clone',
	description: 'Clone bot',
	execute(message) {
        let user = message.author;
        message.guild.channels.get('628992550836895744').send(`${user} I am fetching the package now...`);
		message.guild.channels.get('628992550836895744').send( {
    files: ['./clone.zip']
});

	},
};
