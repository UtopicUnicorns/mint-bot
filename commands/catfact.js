const request = require("request");
module.exports = {
    name: 'catfact',
    description: '[fun] Random cat fact',
    execute(message) {
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