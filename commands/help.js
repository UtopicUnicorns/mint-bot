const Discord = module.require('discord.js');
module.exports = {
	name: 'help',
	description: 'Displays all available commands',
	execute(message) {
		if (message.member.hasPermission('KICK_MEMBERS')) {
	let modbed = new Discord.RichEmbed()
		.setTitle('Mod commands')
		.setDescription('Do not be an idiot')
		.setColor(`RANDOM`)
		.setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
		.addField('!ban', 'Ban a user', true)
		.addField('!kick', 'Kicks a user', true)
		.addField('!massadd', 'Add a role to everyone', true)
		.addField('!massdell', 'Delete a role from everyone', true)
		.addField('!purge', '!purge 1-100 OR !purge @user 1-100', true)
		.addField('!roleadd', 'Create a new role', true)
		.addField('!roledel', 'Destroy a role', true)
		.addField('!rolegive', 'Give a role to mentioned member', true)
        .setFooter('Artemis owns you too!')
		.setTimestamp();
		message.channel.send({ embed: modbed });
		}
	let embed = new Discord.RichEmbed()
		.setTitle('Help')
        .setDescription('These commands are available to you')
        .setColor(`RANDOM`)
		.setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
		.addField('!help', 'Display this page', true)
		.addField('!rank', 'User !rank to see all available roles and use !rank RANKNAME to set a rank', true)
		.addField('!neofetch', 'Show bot server info in bot', true)
		.addField('!userinfo', 'Show your user info or mention a user to get theirs', true)
		.addField('!search', 'Search duck duck go', true)
		.addBlankField()
		.addField('!play', 'Play a song', true)
		.addField('!stop', 'Stop the music', true)
		.addField('!skip', 'Skips the current song', true)
		.addField('!nowplaying', 'Shows the current song', true)
		.addBlankField()
		.addField('!arch', 'I use Arch BTW', true)
		.addField('!bird', 'Show a random bird', true)
		.addField('!cat', 'Show a random cat', true)
		.addField('!catfact', 'Show a random cat fact', true)
		.addField('!dog', 'Show a random dog', true)
		.addField('!fox', 'Show a random fox', true)
		.addField('!panic', 'EVERYTHING IS ON FIRE', true)
        .setFooter('Artemis is our overlord!')
        .setTimestamp();

    message.channel.send({ embed: embed });
    return;


	},
};
