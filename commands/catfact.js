const request = require("request");

module.exports = {
    name: 'catfact',
    description: 'Random cat fact',
        execute(message) {

        let baseurl = "https://some-random-api.ml/facts/cat";
        let url = baseurl;
        request(url, { json: true }, (err, res, body) => {
            //console.log(args);
            //console.log(JSON.stringify(body));
            if (err) return message.channel.send(err);
            message.channel.send(body.fact);
            //message.channel.send(JSON.stringify(body));
        });
    }
};
