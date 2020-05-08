const npm = require("../modules/NPM.js");
npm.npm();
dbinit = require("../modules/dbinit.js");
dbinit.dbinit();
module.exports = {
  name: "userinfo",
  description: "[general] Displays your own or mentioned user info",
  execute(message) {
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix.toString();
    //
    usage = getUsage.get("userinfo");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content.slice(prefix.length + 9).split(" ");
    if (!args[0]) {
      var user = message.guild.members.get(message.author.id);
    }
    if (message.guild.members.get(args[0])) {
      var user = message.guild.members.get(args[0]);
    }
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      var user = message.guild.members.get(message.mentions.users.first().id);
    }
    let entryYes = getSpecs.get(user.user.id);

    let embed = new Discord.RichEmbed()
      .setAuthor(
        user.user.username + "#" + user.user.discriminator,
        user.user.displayAvatarURL
      )
      .setDescription(
        "User ID: " +
          user.user.id +
          "\nUser: " +
          user +
          "\nNickname: " +
          message.guild.member(user).nickname +
          "\nIs bot: " +
          user.user.bot
      )
      .setColor(`RANDOM`)
      .setThumbnail(user.user.displayAvatarURL)
      .addField(
        "Joined at: ",
        moment
          .utc(message.guild.member(user).joinedAt)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField("Status:", user.user.presence.status)
      .addField(
        "Created at: ",
        moment
          .utc(user.user.createdTimestamp)
          .format("dddd, MMMM Do YYYY, HH:mm:ss")
      )
      .addField(
        "Roles:",
        message.guild
          .member(user)
          .roles.map((r) => r)
          .join(" ")
      );
    if (entryYes) {
      embed.addField("Specifications:\n", `${getSpecs.get(user.user.id).spec}`);
    } else {
      embed.addField(
        "Specifications:\n",
        `User has not added their specifications.\nTo add your own specs use ${prefix}specs`
      );
    }
    message.channel.send({
      embed: embed,
    });
    return;
  },
};
