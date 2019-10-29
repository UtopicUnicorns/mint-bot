const fs = require('fs')

module.exports = {
	name: 'neofetch',
	description: 'system info',
	execute(message) {
                let user = message.author;
        message.guild.channels.get('628992550836895744').send(`${user} Here are my specs`);
		
        var contents = fs.readFileSync('neofetch.txt', 'utf8');

		message.guild.channels.get('628992550836895744').send(contents);
	},
};
