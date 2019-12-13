const fs = require("fs");
module.exports = {
    name: 'specs',
    description: '[general] Add your hardware specifications to !userinfo',
    execute(message) {
            if (message.content == "!specs") {
                return message.channel.send("use `neofetch --stdout` in your console.\nThen paste it here using:\n!specs [neofetch output]\n\nYou can check if you have your specifications setup with !userinfo");
            }
            let user = message.author.id;
            fs.writeFile(`./specs/${user}.txt`, message.content.slice(7), function(err) {
                message.delete(2000);
                message.reply("Specs updated!");
                if (err) throw err;
            })
    }
};