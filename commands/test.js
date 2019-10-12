const fs = require('fs');
module.exports = {
	name: 'test',
	description: 'Go away',
	execute(message) {
        let user = message.author;
        message.channel.send(`${user}, these are the ranks available and the amount of users in them!`);
                      let array = fs.readFileSync('ranks.txt').toString().split("\n");
            let ranks = array.length - 1;
            string = "";
            for (i = 0; i < ranks; i++) {
                //message.channel.send
                //message.channel.send(array[i] + ": " + message.guild.roles.find(r => r.name === array[i]).members.size);
                string += array[i] + ": " + message.guild.roles.find(r => r.name === array[i]).members.size + "\n";
            }
            //console.log(string);
            message.channel.send(string);
    	},
};
