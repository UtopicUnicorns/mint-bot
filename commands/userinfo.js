const Discord = module.require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'userinfo',
	description: 'userinfo here ',
	execute(message) {

	let user = message.mentions.users.first() || message.author;

let member = message.guild.member(user);
    let embed = new Discord.RichEmbed()
        .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL)
        .setDescription(`${user}`)
        .setColor(`RANDOM`)
        .setThumbnail(`${user.displayAvatarURL}`)
        .addField('Joined at:', `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField('Status:', user.presence.status, true)
		.addField('Created at:', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField('Roles:', member.roles.map(r => `${r}`).join(' | '), true)
		.addField('Last Message: ', `${user.lastMessage}`, true)
        .setFooter(`ID: ${user.id}`)
        .setTimestamp();

    message.channel.send({ embed: embed });
    return;


	},
};
