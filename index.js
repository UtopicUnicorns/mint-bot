const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();

const queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', () => {
	 console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

client.user.setActivity(`!help`, { type: 'LISTENING'});

//var generalChannel = client.channels.get("628984660298563584") // Replace with known channel ID
   // generalChannel.send("Let's brew some *Minty* tea!") 

});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

	client.on("guildMemberAdd", (guildMember) => {
        var ReBeL = guildMember.user.username;
        var bel = ["@ just started brewing some minty tea!", "Smells like debian in here, oh it's just @ !", "@ is using Arch BTW!"]
        var moon = bel[Math.floor(Math.random() * bel.length)];
        moon = moon.replace('@', ReBeL)
		client.channels.get('628984660298563584').send(moon)
        guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Member"));
	  });


client.on('message', async message => {
	const args = message.content.slice(1).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;



	try {
		command.execute(message);
	} catch (error) {
		//console.error(error);
        //sentMessage.react(':x:');
		//message.reply('+:x:');
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		message.reply(`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`);
	}




});

client.login(token);
