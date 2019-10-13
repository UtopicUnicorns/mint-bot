module.exports = {
	name: 'install',
	description: 'Guide to install Linux Mint',
	execute(message) {
        let user = message.author;
        message.channel.send(`${user}, I have send you a PM`);
        message.author.send("Test");
        message.author.send("Test");
        message.author.send("Test");

	},
};
