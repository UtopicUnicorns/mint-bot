const request = require("request");
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'catfact',
    description: '[fun] Random cat fact',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        let baseurl = "https://some-random-api.ml/facts/cat";
        let url = baseurl;
        request(url, {
            json: true
        }, (err, res, body) => {
            if (err) return message.channel.send(err);
            message.channel.send(body.fact);
        });
    }
};