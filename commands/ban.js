module.exports = {
	name: 'ban',
	description: 'Ban a player',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
		const member = message.mentions.members.first();

		if (!member) {
			return message.reply('You need to mention the member you want to ban him');
		}

		if (!member.banable) {
			return message.reply('I can\'t ban this user.');
		}

		return member
			.ban()
			.then(() => message.reply(`${member.user.tag} was banned.`))
			.catch(error => message.reply('Sorry, an error occured.'));
        }
	},
};
