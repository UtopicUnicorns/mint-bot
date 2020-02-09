const search = require('node-ddg').default;
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'search',
    description: '[general] Search the internet!',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        if (message.content === `${prefix}search`) {
            return message.channel.send(`Feel free to give me some search terms.`);
        }
        let args = message.content.slice(7).split(' ');
        search({
                query: `${args}`,
                maxResults: 1
            })
            .then((results) => {
                for (i = 0; i < results.length; i++) {
                    message.channel.send(`>>> ` + results[i].title + `\n` + results[i].body + results[i].url + `\n`);
                }
            })
    },
};