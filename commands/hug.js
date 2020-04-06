const npm = require("../NPM.js");
npm.npm();
module.exports = {
  name: "hug",
  description: "[fun] Hug someone",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    let user = message.mentions.users.first();
    if (!user) return;
    const embed = new Discord.RichEmbed()
      .setTitle(message.author.username + " hugs " + user.username)
      .setImage("https://media.giphy.com/media/HZzrAS6wkvcVW/giphy.gif");
    message.channel.send({
      embed: embed,
    });
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("hug");
    usage.number++;
    setUsage.run(usage);
    //
  },
};
