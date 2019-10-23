module.exports = {
	name: 'install',
	description: 'Ask an install guide',
	execute(message) {
		let user = message.author;

                message.channel.send(`${user} Coming soon`);

        },
};
