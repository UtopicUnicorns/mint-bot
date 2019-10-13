module.exports = {
	name: 'userinfo',
	description: 'userinfo here ',
	execute(message) {

    let user = message.mentions.users.first() || message.author;
        message.channel.send(`>>> Username: ${user.username} \nUser ID: ${user.id} \nCreated at: ${user.createdAt} \nLast message: ${user.lastMessage} \nAvatar: ${user.displayAvatarURL}`);



	},
};
