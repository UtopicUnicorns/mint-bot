const npm = require('../NPM.js');
npm.npm();
module.exports = {
  name: "lenny",
  description: "[fun] ( ͡° ͜ʖ ͡°)",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("lenny");
    usage.number++;
    setUsage.run(usage);
    //
    if (
      message.channel.id === "629019515740487691" ||
      message.channel.id === "666776795047002132"
    ) {
      let args = message.content.slice(prefix.length + 6).split(" ");
      if (!args[0]) {
        let num = Math.floor(Math.random() * 611 + 1);
        const embed = new Discord.RichEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      } else {
        let num = args[0];
        const embed = new Discord.RichEmbed().setImage(
          "https://aranym.com/ecchi/" + num + ".jpg"
        );
        return message.channel.send({
          embed: embed,
        });
      }
    } else {
      message.reply("( ͡° ͜ʖ ͡°)");
    }
  },
};
