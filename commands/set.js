const npm = require("../NPM.js");
npm.npm();
module.exports = {
  name: "set",
  description:
    "[mod] set mute MENTION" +
    "\n[mod] set mute time 10 s/m/h MENTION" +
    "\n[mod] set unmute MENTION" +
    "\n[mod] set prefix prefix",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const setGuild = db.prepare(
      "INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);"
    );
    const getScore = db.prepare(
      "SELECT * FROM scores WHERE user = ? AND guild = ?"
    );
    const setScore = db.prepare(
      "INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);"
    );
    if (message.member.hasPermission("KICK_MEMBERS")) {
      //
      let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
      let setUsage = db.prepare(
        "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
      );
      usage = getUsage.get("set");
      usage.number++;
      setUsage.run(usage);
      //
      const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
      const guildChannels = getGuild.get(message.guild.id);
      const muteChannel1 = message.guild.channels.get(
        guildChannels.muteChannel
      );
      let args = message.content.slice(prefix.length + 4).split(" ");
      //start func
      var logger = message.guild.channels.get(guildChannels.logsChannel);
      let memberrole = message.guild.roles.find((r) => r.name === `~/Members`);
      const member = message.mentions.members.first();
      function logMe() {
        if (logger) {
          const logsmessage = new Discord.RichEmbed()
            .setTitle(prefix + "set")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("Used by: " + message.author)
            .setURL(message.url)
            .setColor("RANDOM")
            .addField("Usage:\n", message.content, true)
            .addField("Channel", message.channel, true)
            .setFooter("Message ID: " + message.id)
            .setTimestamp();
          logger.send({
            embed: logsmessage,
          });
        }
      }
      async function HitOrMiss(isMuted, isTime) {
        if (!member) return message.channel.send("Mention a user!");
        if (message.author.id == member.id)
          return message.reply("You can not mute yourself");
        if (isMuted == true) {
          let userscore = getScore.get(member.id, message.guild.id);
          if (userscore.muted == `1`) {
            return message.reply(member + " is already muted!");
          } else {
            if (memberrole) {
              setTimeout(() => {
                member.removeRole(memberrole).catch(console.log());
              }, 2500);
            }
            message.guild.channels.forEach((channel, id) => {
              setTimeout(() => {
                channel.overwritePermissions(member, {
                  VIEW_CHANNEL: false,
                  READ_MESSAGES: false,
                  SEND_MESSAGES: false,
                  READ_MESSAGE_HISTORY: false,
                  ADD_REACTIONS: false,
                });
              }, 200);
            });
            if (muteChannel1) {
              setTimeout(() => {
                message.guild.channels.forEach((channel, id) => {
                  if (channel.id == muteChannel1.id) {
                    channel.overwritePermissions(member, {
                      VIEW_CHANNEL: true,
                      READ_MESSAGES: true,
                      SEND_MESSAGES: true,
                      READ_MESSAGE_HISTORY: true,
                      ATTACH_FILES: false,
                    });
                  }
                });
              }, 2000);
            }
            let userscore = getScore.get(member.id, message.guild.id);
            if (!userscore) {
              userscore = {
                id: `${message.guild.id}-${member.id}`,
                user: member.id,
                guild: message.guild.id,
                points: 0,
                level: 1,
                warning: 0,
                muted: 1,
                translate: 0,
                stream: 0,
                notes: 0,
              };
            }
            userscore.muted = `1`;
            setScore.run(userscore);
            if (isTime) {
              mutedtime.add(member.id + message.guild.id);
              setTimeout(async () => {
                mutedtime.delete(member.id + message.guild.id);
                HitOrMiss(false);
              }, isTime);
              if (muteChannel1) {
                try {
                  message.reply(member + " is temp muted!");
                  muteChannel1.send(member + ", You have been temp muted!");
                  return logMe();
                } catch {
                  return logMe();
                }
              }
            }
            logMe();
            try {
              message.channel.send(member + " has been muted!");
              return logMe();
            } catch {
              return logMe();
            }
          }
        } else {
          let userscore = getScore.get(member.id, message.guild.id);
          if (userscore.muted == `0`)
            return message.channel.send(member + " Is not muted!");
          member.addRole(memberrole).catch(console.error);
          message.guild.channels.forEach((channel, id) => {
            if (channel.permissionOverwrites.get(member.id)) {
              setTimeout(() => {
                channel.permissionOverwrites.get(member.id).delete();
              }, 200);
            }
          });
          userscore.muted = `0`;
          userscore.warning = `0`;
          setScore.run(userscore);
          try {
            message.reply(member + " has been unmuted!");
          } catch {
            message.reply(member + " has been unmuted!");
          }
        }
      }
      //mute
      if (args[0] == `mute`) {
        if (!member) {
          const logsmessage2 = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor("RANDOM")
            .setTitle("Usage")
            .addField(prefix + "set mute @mention\n", "Mute a user")
            .addField(
              prefix + "set mute time X Y @mention\n",
              "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours"
            )
            .addField(
              prefix + "set mute time 10 m @mention\n",
              "example time usage"
            )
            .addField(prefix + "set unmute @mention", "Unmutes the target");
          return message.channel.send({
            embed: logsmessage2,
          });
        }
        if (message.author.id == member.id)
          return message.reply("You can not mute yourself");
        //mute set time
        if (args[1] == `time`) {
          if (!args[2]) {
            const logsmessage2 = new Discord.RichEmbed()
              .setAuthor(message.author.username, message.author.avatarURL)
              .setColor("RANDOM")
              .setTitle("Usage")
              .addField(prefix + "set mute @mention\n", "Mute a user")
              .addField(
                prefix + "set mute time X Y @mention\n",
                "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours"
              )
              .addField(
                prefix + "set mute time 10 m @mention\n",
                "example time usage"
              )
              .addField(prefix + "set unmute @mention", "Unmutes the target");
            return message.channel.send({
              embed: logsmessage2,
            });
          }
          if (!args[3]) {
            const logsmessage2 = new Discord.RichEmbed()
              .setAuthor(message.author.username, message.author.avatarURL)
              .setColor("RANDOM")
              .setTitle("Usage")
              .addField(prefix + "set mute @mention\n", "Mute a user")
              .addField(
                prefix + "set mute time X Y @mention\n",
                "Where X = time => 10\nWhere Y = format => s/seconds m/minutes h/hours"
              )
              .addField(
                prefix + "set mute time 10 m @mention\n",
                "example time usage"
              )
              .addField(prefix + "set unmute @mention", "Unmutes the target");
            return message.channel.send({
              embed: logsmessage2,
            });
          }
          if (args[3] == "s" || args[3] == "sec" || args[3] == "seconds") {
            let settime = Math.floor(args[2] * 1000);
            return HitOrMiss(true, settime);
          }
          if (args[3] == "m" || args[3] == "min" || args[3] == "minutes") {
            let settime = Math.floor(args[2] * 60000);
            return HitOrMiss(true, settime);
          }
          if (args[3] == "h" || args[3] == "hour" || args[3] == "hours") {
            let settime = Math.floor(args[2] * 3600000);
            return HitOrMiss(true, settime);
          }
        }
        return HitOrMiss(true);
      }
      //unmute
      if (args[0] == `unmute`) {
        return HitOrMiss(false);
      }
      //prefix
      if (args[0] == `prefix`) {
        if (!args[1]) return message.channel.send(`Specify a prefix!!`);
        let zwargs = message.content.slice(prefix.length + 11);
        prefixstart.prefix = zwargs;
        setGuild.run(prefixstart);
        message.channel.send("Prefix set to " + zwargs);
        //LOGS
        if (logger == "0") {
        } else {
          logMe();
        }
      }
    }
  },
};
