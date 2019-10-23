const search = require('node-ddg').default;
module.exports = {
	name: 'search',
	description: 'Search the internet!',
	execute(message) {

        if(message.content === "!search") {
            return message.channel.send("Feel free to give me some search terms.");
        }
        let args = message.content.slice(7).split(' ');

       search({query: `${args}`, maxResults: 1})
        .then((results) => { 
        for (i=0;i<results.length;i++) {
        message.channel.send(">>> " + results[i].title + "\n" + results[i].body + results[i].url + "\n");
        }
    })

	},
};
