npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onMessage: async function (message) {
    //Disboard
    if (message.author.id == "302050872383242240") {
      if (message.embeds[0].description.includes("Bump done")) {
        let guildChannels2 = getGuild.get(message.guild.id);
        if (guildChannels2) {
          if (guildChannels2.leveling == "2") {
            message.channel.fetchMessages().then((messages) => {
              let dbumper = messages
                .filter((msg) =>
                  msg.content.toLowerCase().startsWith("!d bump")
                )
                .map((msg) => msg.author.id);
              message.channel.send(
                "You bumped!\nand we will ping you in 2 hours for your next bump.\n<@" +
                  dbumper[0] +
                  ">"
              );
              //
              let settime = 7200000;
              let remindtext = "Time for your next `!d bump`";
              let datefor = moment()
                .add(settime, "ms")
                .format("YYYYMMDDHHmmss");
              timerset = {
                mid: message.id,
                cid: message.channel.id,
                gid: message.guild.id,
                uid: dbumper[0],
                time: datefor,
                reminder: remindtext,
              };
              setRemind.run(timerset);
              //
            });
          } else {
            message.channel.fetchMessages().then((messages) => {
              let dbumper = messages
                .filter((msg) =>
                  msg.content.toLowerCase().startsWith("!d bump")
                )
                .map((msg) => msg.author.id);
              message.channel.send(
                "You bumped!\nThis action gave you 20 points, and we will ping you in 2 hours for your next bump.\n<@" +
                  dbumper[0] +
                  ">"
              );
              const pointsToAdd = parseInt(20, 10);
              let userscore = getScore.get(dbumper[0], message.guild.id);
              if (!userscore) return;
              userscore.points += pointsToAdd;
              let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
              userscore.level = userLevel;
              setScore.run(userscore);
              //
              let settime = 7200000;
              let remindtext = "Time for your next `!d bump`";
              let datefor = moment()
                .add(settime, "ms")
                .format("YYYYMMDDHHmmss");
              timerset = {
                mid: message.id,
                cid: message.channel.id,
                gid: message.guild.id,
                uid: dbumper[0],
                time: datefor,
                reminder: remindtext,
              };
              setRemind.run(timerset);
              //
            });
          }
        }
      }
    }
    //ignore bots
    if (message.author.bot) return;
    //Direct Message handle
    if (message.channel.type == "dm") {
      console.log(
        moment().format("MMMM Do YYYY, HH:mm:ss") +
          "\n" +
          message.author.username +
          "\n" +
          message.content
      );
      const whoartemis = new Discord.RichEmbed()
        .setTitle("Invite")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("RANDOM")
        .setDescription("Hello, I am Artemis!")
        .addField("Main discord server: ", "https://discord.gg/EVVtPpw")
        .addField("Bot Website: ", "https://artemisbot.eu")
        .addField("Bot Github: ", "https://github.com/UtopicUnicorns/mint-bot")
        .addField(
          "Bot Invite: ",
          "https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=2147483127&scope=bot"
        )
        .setFooter("Bot owner: <@127708549118689280> | UtopicUnicorn#0383");
      return message.channel.send({
        embed: whoartemis,
      });
    }
    //ignoredbl
    if (message.guild) {
      if (message.guild.id == "264445053596991498") return;
    } else {
      return;
    }
    //Failsafes
    //userfailsafe
    userfailsafe = getScore.get(message.author.id, message.guild.id);
    if (!userfailsafe) {
      userfailsafe = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
      setScore.run(userfailsafe);
    }
    //Guild safe
    guildfailsafe = getGuild.get(message.guild.id);
    if (!guildfailsafe) {
      guildfailsafe = {
        guild: message.guild.id,
        generalChannel: `0`,
        highlightChannel: `0`,
        muteChannel: `0`,
        logsChannel: `0`,
        streamChannel: `0`,
        reactionChannel: `0`,
        streamHere: `0`,
        autoMod: `0`,
        prefix: `!`,
        leveling: `1`,
      };
      setGuild.run(guildfailsafe);
    }
    //Level failsafe
    newLevel = getLevel.get(message.guild.id);
    if (!newLevel) {
      newLevel = {
        guild: message.guild.id,
        lvl5: `0`,
        lvl10: `0`,
        lvl15: `0`,
        lvl20: `0`,
        lvl30: `0`,
        lvl50: `0`,
        lvl85: `0`,
      };
      setLevel.run(newLevel);
    }
    //load shit
    const guildChannels = getGuild.get(message.guild.id);
    if (guildChannels) {
      var thisguild = message.client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
      var generalChannel1 = message.guild.channels.get(
        guildChannels.generalChannel
      );
      if (!generalChannel1) {
        var generalChannel1 = "0";
      }
      var muteChannel1 = message.guild.channels.get(guildChannels.muteChannel);
      if (!muteChannel1) {
        var muteChannel1 = "0";
      }
      var logsChannel1 = message.guild.channels.get(guildChannels.logsChannel);
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var generalChannel1 = "0";
      var muteChannel1 = "0";
      var logsChannel1 = "0";
    }
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);
    //non-prefix help
    if (
      message.isMemberMentioned(message.client.user) &&
      message.content.toLowerCase().includes("help")
    ) {
      const nonprefix = new Discord.RichEmbed()
        .setTitle("Non prefix help menu")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setDescription(
          "This message was triggered by mentioning me with the help argument"
        )
        .setColor("RANDOM")
        .addField("My prefix for this server:\n", prefix)
        .addField("Example command usage: \n", prefix + "help")
        .addField(
          "Support my work: ",
          "https://www.patreon.com/utopicunicorn\nhttps://artemisbot.eu"
        )
        .setTimestamp();
      message.channel.send({
        embed: nonprefix,
      });
    }
    //autoMod START
    if (message.member && message.member.hasPermission("KICK_MEMBERS")) {
    } else {
      if (guildChannels.autoMod == "strict" || guildChannels.autoMod == "2") {
        const automod = require("./automod.js");
        automod.automod("wordFilter", message);
        automod.automod("noSpam", message);
        automod.automod("noInvites", message);
        automod.automod("antiMention", message);
      }
    }
    //AutoMod END
    //Mute filter
    if (muteChannel1 == "0") {
    } else {
      if (message.channel.id === muteChannel1.id) {
        if (message.content == message.author.username + "1337") {
          if (guildChannels.autoMod == "strict") {
            return message.reply(
              "Our sincere apologies, Automod Strict is ON\nWhich means that people have to be manually approved!"
            );
          } else {
            if (message.member.hasPermission("KICK_MEMBERS"))
              return message.reply(
                "So I fixed this, beecause you lot cannot behave yourselves..."
              );
            let userscore1 = getScore.get(message.author.id, message.guild.id);
            if (!userscore1) {
            } else {
              if (userscore1.muted == "1")
                return message.reply(
                  "You have been muted by our system due to breaking rules, the verification system is not for you!"
                );
            }
            let roleadd = message.guild.roles.find(
              (r) => r.name === "~/Members"
            );
            let roledel = message.guild.roles.find((r) => r.name === "Muted");
            let member = message.member;
            message.member.addRole(roleadd).catch(console.error);
            message.member.removeRole(roledel).catch(console.error);
            var ReBeL = member;
            var bel = [
              "\njust started brewing some minty tea!",
              "\nis using Arch BTW!",
              "\necho 'is here!'",
              "\nis sipping minty tea!",
              "\nuseradd -m -g users /bin/sh @",
            ];
            var moon = bel[~~(Math.random() * bel.length)];
            moon = moon.replace("@", message.author.username);
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext("2d");
            const background = await Canvas.loadImage("./mintwelcome.png");
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.font = "30px Zelda";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(
              message.author.username,
              canvas.width / 3.0,
              canvas.height / 2.0
            );
            const avatar = await Canvas.loadImage(
              message.author.displayAvatarURL
            );
            ctx.drawImage(avatar, 600, 25, 50, 50);
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const guildlogo = await Canvas.loadImage(message.guild.iconURL);
            ctx.drawImage(guildlogo, 25, 25, 200, 200);
            ctx.font = "21px sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
            const attachment = new Discord.Attachment(
              canvas.toBuffer(),
              "welcome-image.png"
            );
            await generalChannel1
              .send(attachment)
              .catch((error) =>
                console.log(
                  moment().format("MMMM Do YYYY, HH:mm:ss") +
                    "\n" +
                    __filename +
                    ":" +
                    ln()
                )
              );
            return message.channel.send(`${member} has been approved.`);
          }
        }
      }
    }
    //Topic
    //For mint server only
    if (message.guild.id == "628978428019736619") {
      if (message.member && message.member.hasPermission("KICK_MEMBERS")) {
        if (message.content.startsWith(prefix + "topic")) {
          let selectthis = [
            "Which Linux distribution did you first user,\nand why did you start using it?",
            "Do you have a favourite Linux/UNIX command?\nUse `" +
              prefix +
              "man command` to know what a command does, never use commands you do not know.",
            "Are you currently dual booting another OS or distribution,\nwhy do you dual boot, or why do you not?",
            "Do you know any programming languages,\nand which one is your favourite?",
            "Which games do you usually play,\nand are they available on Linux?",
            "Do you have any safety tips for others to know regarding the Corona virus?",
            "What made you interested in Linux Mint?",
          ];
          let selectedthis = selectthis[~~(Math.random() * selectthis.length)];
          message.client.channels
            .get("695182849476657223")
            .setTopic(selectedthis);
          const topicstart = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor("RANDOM")
            .setDescription(
              "For the next 30 minutes this will be the topic!\nTrying to go off-topic may have consequences."
            )
            .addField(
              "The topic that I have selected for you is: \n",
              selectedthis
            )
            .setFooter("Behave properly, and respect each others opinions.\n")
            .setTimestamp();
          message.channel.send({
            embed: topicstart,
          });
        }
      }
    }
    //Secret adult role
    if (message.guild.id == "628978428019736619") {
      let amember = message.guild.members.get(message.author.id);
      if (
        message.content
          .toLowerCase()
          .startsWith("i want to enter the dark side, i accept the risk") &&
        amember.roles.has("629020299261902889")
      ) {
        let haverole = amember.roles.has("701396956009857083");
        if (haverole) {
          return message.reply("You already have access to the dark side!");
        } else {
          let arole = message.guild.roles.find(
            (r) => r.id == "701396956009857083"
          );
          amember.addRole(arole).catch(console.error);
          return message.reply("You have been granted access!");
        }
      }
    }
    /*   //EVENT
  if (message.guild.id == "628978428019736619") {
    let eventnumber = 25;
    let eventnumber2 = Math.floor(Math.random() * 50);
    if (eventnumber2 == eventnumber) {
      let eventcheck = message.member.roles.find(r => r.name === `512Mb`);
      if (!eventcheck) {
        let eventr = message.guild.roles.find(r => r.name === `512Mb`);
        if (!eventr) return;
        message.member.addRole(eventr);
        const eventembed = new Discord.RichEmbed()
          .setTitle("EVENT")
          .setColor("RANDOM")
          .setDescription(
            message.author +
              "\n earned the event title:\n512Mb\nCongratulations!"
          )
          .setTimestamp();
        message.client.channels.get(`628984660298563584`).send({
          embed: eventembed
        });
      }
    }
  } */
    //Artemis Talk
    if (message.channel.id === "642882039372185609") {
      if (message.author.id !== "440892659264126997") {
        let cargs = message.content.slice(5);
        if (message.content.startsWith(prefix + "channel")) {
          let readname = fs
            .readFileSync("channelset.txt")
            .toString()
            .split("\n");
          let channelname = message.client.channels.get(`${readname}`);
          return message.channel.send(channelname.name);
        }
        if (message.content.startsWith(prefix + "set")) {
          fs.writeFile("channelset.txt", cargs, function (err) {
            if (err) throw err;
          });
          return message.channel.send(
            "Set channel id to: " + message.client.channels.get(`${cargs}`)
          );
        }
        let channelcheck = fs
          .readFileSync("channelset.txt")
          .toString()
          .split("\n");
        if (!message.client.channels.get(`${channelcheck}`)) {
          return message.channel.send(
            "Enter a valid channel ID first!\n!set ChannelID"
          );
        }
        try {
          message.client.channels.get(`${channelcheck}`).send(message.content);
        } catch {
          console.log(
            moment().format("MMMM Do YYYY, HH:mm:ss") +
              "\n" +
              __filename +
              ":" +
              ln()
          );
        }
        return;
      }
    }
    //Simulate guild member join
    if (message.content === prefix + "guildmemberadd") {
      if (
        message.author.id === "127708549118689280" ||
        message.author.id == message.guild.owner.id
      ) {
        message.client.emit(
          "guildMemberAdd",
          message.member || (await message.guild.fetchMember(message.author))
        );
      }
    }
    //Simulate guild member leave
    if (message.content === prefix + "guildmemberremove") {
      if (
        message.author.id === "127708549118689280" ||
        message.author.id == message.guild.owner.id
      ) {
        message.client.emit(
          "guildMemberRemove",
          message.member || (await message.guild.fetchMember(message.author))
        );
      }
    }
    //translate
    //Start db for opt
    translateopt = getScore.get(message.author.id, message.guild.id);
    if (
      translateopt.translate == `2` ||
      message.content.startsWith(prefix + "tr")
    ) {
      //commence translate if opt
      let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
      let key = configfile.yandex;
      if (message.content.startsWith(prefix + "tr")) {
        var text = message.content.slice(prefix.length + 3);
      } else {
        var text = message.content;
      }
      let url =
        baseurl +
        "?key=" +
        key +
        "&hint=en,de,nl,fr,tr&lang=en" +
        "&text=" +
        encodeURIComponent(text) +
        "&format=plain";
      request(
        url,
        {
          json: true,
        },
        (err, res, body) => {
          if (!body) return;
          if (!body.text) {
            return;
          }
          if (message.content.startsWith(prefix + "tr")) {
          } else {
            if (JSON.stringify(body).startsWith('{"code":200,"lang":"en-en"')) {
              return;
            }
          }
          translate(text, {
            to: "en",
          })
            .then((res) => {
              if (message.content.includes("ツ")) return;
              if (res == message.content) return;
              try {
                const translationtext = new Discord.RichEmbed()
                  .setAuthor(message.author.username, message.author.avatarURL)
                  .setColor("RANDOM")
                  .setDescription(res)
                  .setFooter("Translated from: " + body.lang)
                  .setTimestamp();
                message.channel.send({
                  embed: translationtext,
                });
              } catch {
                console.log(
                  moment().format("MMMM Do YYYY, HH:mm:ss") +
                    "\n" +
                    __filename +
                    ":" +
                    ln()
                );
              }
            })
            .catch((err) => {
              console.error(err);
            });
          if (err) return message.channel.send(err);
        }
      );
    }
    //set points
    let score;
    if (message.guild) {
      score = getScore.get(message.author.id, message.guild.id);
      if (
        guildChannels.leveling == "2" ||
        message.author.id == "121723489014120448"
      ) {
      } else {
        score.points++;
        const curLevel = Math.floor(0.5 * Math.sqrt(score.points));
        if (score.level < curLevel) {
          score.level++;
        }
        setScore.run(score);
      }
    }
    //start level rewards
    const levelups = getLevel.get(message.guild.id);
    let levelers = [
      levelups.lvl5,
      levelups.lvl10,
      levelups.lvl15,
      levelups.lvl20,
      levelups.lvl30,
      levelups.lvl50,
      levelups.lvl85,
    ];
    let levelerstxt = ["5", "10", "15", "20", "30", "50", "85", "1000"];
    let count = -1;
    for (let i of levelers) {
      count++;
      if (
        score.level >= levelerstxt[count] &&
        score.level < levelerstxt[count + 1]
      ) {
        const level = message.guild.roles.find((r) => r.id === i);
        if (level) {
          let checking = message.member.roles.find((r) => r.id === i);
          if (!checking) {
            let remove = [
              levelups.lvl5,
              levelups.lvl10,
              levelups.lvl15,
              levelups.lvl20,
              levelups.lvl30,
              levelups.lvl50,
              levelups.lvl85,
            ];
            for (let n of remove) {
              const level2 = message.guild.roles.find((r) => r.id === n);
              if (level2) {
                if (message.member.roles.find((r) => r.id === n)) {
                  message.member.removeRole(level2).catch((error) => {
                    console.log(
                      moment().format("MMMM Do YYYY, HH:mm:ss") +
                        "\n" +
                        __filename +
                        ":" +
                        ln()
                    );
                  });
                }
              }
            }
            message.member.addRole(level).catch((error) => {
              console.log(
                moment().format("MMMM Do YYYY, HH:mm:ss") +
                  "\n" +
                  __filename +
                  ":" +
                  ln()
              );
            });
            const embed = new Discord.RichEmbed()
              .setTitle("Level Role get!")
              .setAuthor(message.author.username, message.author.avatarURL)
              .setColor("RANDOM")
              .addField("Gained the title: ", level, true)
              .setTimestamp();
            message.channel.send(embed);
          }
        }
      }
    }
    //console.log(message.member.roles.map(role => role.id));
    //welp ok
    if (guildChannels.leveling == "2") {
    } else {
      //thanks
      if (message.content.toLowerCase().includes("thank")) {
        const user =
          message.mentions.users.first() || message.client.users.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (thankedRecently.has(message.author.id)) {
          return message.reply("You are thanking too much!");
        } else {
          thankedRecently.add(message.author.id);
          setTimeout(() => {
            thankedRecently.delete(message.author.id);
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore)
            return message.reply(
              "This user does not have a database index yet."
            );
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "thanked " +
              user.username +
              "\n" +
              user.username +
              " has gotten 20 points for their effort!"
          );
        }
      }
      //love
      if (message.content.toLowerCase().includes("love")) {
        const user =
          message.mentions.users.first() || message.client.users.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (lovedRecently.has(message.author.id)) {
          return message.reply("I love you too!");
        } else {
          lovedRecently.add(message.author.id);
          setTimeout(() => {
            lovedRecently.delete(message.author.id);
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore)
            return message.reply(
              "This user does not have a database index yet."
            );
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "Gave love to " +
              user.username +
              "\n" +
              user.username +
              " gets 20 points!"
          );
        }
      }
      //Congratulations
      if (message.content.toLowerCase().includes("congrat")) {
        const user =
          message.mentions.users.first() || message.client.users.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (congratulationsRecently.has(message.author.id)) {
          return;
        } else {
          congratulationsRecently.add(message.author.id);
          setTimeout(() => {
            congratulationsRecently.delete(message.author.id);
          }, 600000);
          const pointsToAdd = parseInt(20, 10);
          let userscore = getScore.get(user.id, message.guild.id);
          if (!userscore)
            return message.reply(
              "This user does not have a database index yet."
            );
          userscore.points += pointsToAdd;
          let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
          userscore.level = userLevel;
          setScore.run(userscore);
          return message.reply(
            "Congratulated " +
              user.username +
              "\n" +
              user.username +
              " gets 20 points!"
          );
        }
      }
    }
    //require prefix
    if (!message.content.startsWith(prefix)) return;
    try {
      command.execute(message);
    } catch (error) {
      //console.error(error);
    }
  },
};
