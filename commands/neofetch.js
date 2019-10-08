const fs = require('fs')

module.exports = {
	name: 'neofetch',
	description: 'system info',
	execute(message) {
		
        var contents = fs.readFileSync('neofetch.txt', 'utf8');

		message.channel.send(contents);
	},
};
