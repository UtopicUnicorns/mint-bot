module.exports = {
	name: 'clone',
	description: 'Clone bot',
	execute(message) {
		message.channel.send({
    files: ['./clone.zip']
});

	},
};
