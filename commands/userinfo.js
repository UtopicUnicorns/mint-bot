const npm = require('../NPM.js');
npm.npm();
module.exports = {
  name: "userinfo",
  description: "[general] Displays your own or mentioned user info",
  execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix.toString();
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
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
    if (args[0].startsWith('<@') && args[0].endsWith('>')) {
      var user = message.guild.members.get(message.mentions.users.first().id);
    }
    fs.stat(`./specs/${user.id}.txt`, function(err, fileStat) {
      if (err) {
        if (err.code == "ENOENT") {
          let embed = new Discord.RichEmbed()
            .setAuthor(user.user.username + '#' + user.user.discriminator, user.user.displayAvatarURL)
            .setDescription('User ID: ' + user.user.id + '\nUser: ' + user + '\nNickname: ' + message.guild.member(user).nickname + '\nIs bot: ' + user.user.bot)
            .setColor(`RANDOM`)
            .setThumbnail(user.user.displayAvatarURL)
            .addField('Joined at: ', moment.utc(message.guild.member(user).joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"))
            .addField("Status:", user.user.presence.status)
            .addField('Created at: ', moment.utc(user.user.createdTimestamp).format("dddd, MMMM Do YYYY, HH:mm:ss"))
            .addField("Roles:", message.guild.member(user).roles.map(r => r).join(" "))
            .addField(
              "Specifications:\n",
              `User has not added their specifications.\nTo add your own specs use ${prefix}specs`
            )
            .setTimestamp();
          message.channel.send({
            embed: embed
          });
          return;
        }
      } else {
        openfile = fs.readFileSync(`./specs/${user.user.id}.txt`).toString();
        let embed = new Discord.RichEmbed()
          .setAuthor(user.user.username + '#' + user.user.discriminator, user.user.displayAvatarURL)
            .setDescription('User ID: ' + user.user.id + '\nUser: ' + user + '\nNickname: ' + message.guild.member(user).nickname + '\nIs bot: ' + user.user.bot)
            .setColor(`RANDOM`)
            .setThumbnail(user.user.displayAvatarURL)
            .addField('Joined at: ', moment.utc(message.guild.member(user).joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"))
            .addField("Status:", user.user.presence.status)
            .addField('Created at: ', moment.utc(user.user.createdTimestamp).format("dddd, MMMM Do YYYY, HH:mm:ss"))
            .addField("Roles:", message.guild.member(user).roles.map(r => r).join(" "))
          .addField("Specifications:\n", `.\n${openfile}`)
          .setTimestamp();
        message.channel.send({
          embed: embed
        });
        return;
      }
    });
  }
};
