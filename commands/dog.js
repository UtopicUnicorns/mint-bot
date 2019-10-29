const request = require("request");

module.exports = {
    name: 'dog',
    description: 'Random dog picture',
        execute(message) {

        let baseurl = "https://some-random-api.ml/img/dog";
        let url = baseurl;
        request(url, { json: true }, (err, res, body) => {
            //console.log(args);
            //console.log(JSON.stringify(body));
            if (err) return message.channel.send(err);
            message.channel.send(body.link);
            //message.channel.send(JSON.stringify(body));
        });
    }
};
