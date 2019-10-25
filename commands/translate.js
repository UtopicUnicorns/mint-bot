const request = require("request");
const {
    yandex,
} = require('../config.json');
module.exports = {
    name: 'translate',
    description: 'usage: !translate langfrom, langto, text to translate\nformat for languages: en, de, tr, ...',
    execute(message) {
        if(message.content === "!translate") {
            return message.channel.send("What do I need to translate?");
        }

        if(message.content.startsWith("!translate ,")) {
            return message.channel.send("Feel free to provide a language to translate to.");
        }

        let args = message.content.slice(10).split(',');
        let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
        let key = yandex;
        let langto = args[0];
        let text = args[1];
        let url = baseurl + "?key=" + key + "&hint=en,de,nl,fr,tr&lang=" + langto + "&text=" + encodeURIComponent(text) + "&format=plain";
        request(url, { json: true }, (err, res, body) => {
            //console.log(args);
            console.log(JSON.stringify(body));
            if (err) return message.channel.send(err);
            message.channel.send(body.text);
            //message.channel.send(JSON.stringify(body));
        });
    }
};
