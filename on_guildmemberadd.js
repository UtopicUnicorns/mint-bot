npm = require("./NPM.js");
npm.npm();
dbinit = require("./dbinit.js");
dbinit.dbinit();
module.exports = {
  onGuildMemberAdd: async function (guildMember) {
    //ignoredbl
    if (guildMember.guild.id == "264445053596991498") return;
    //load shit
    let nowtime = new Date();
    const guildChannels = getGuild.get(guildMember.guild.id);
    if (guildChannels) {
      var thisguild = guildMember.client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
      var generalChannel1 = guildMember.client.channels.get(
        guildChannels.generalChannel
      );
      if (!generalChannel1) {
        var generalChannel1 = "0";
      }
      var muteChannel1 = guildMember.client.channels.get(
        guildChannels.muteChannel
      );
      if (!muteChannel1) {
        var muteChannel1 = "0";
      }
      var logsChannel1 = guildMember.client.channels.get(
        guildChannels.logsChannel
      );
      if (!logsChannel1) {
        var logsChannel1 = "0";
      }
    } else {
      var generalChannel1 = "0";
      var muteChannel1 = "0";
      var logsChannel1 = "0";
    }
    if (guildMember.guild.id == "628978428019736619") {
      rolearray = [
        "674208095626592266",
        "674208167437139979",
        "674207678347608064",
        "674207950822440970",
      ];
      for (let i of rolearray) {
        let role = guildMember.guild.roles.find((r) => r.id === `${i}`);
        guildMember.addRole(role);
      }
    }
    //account age check
    let roleadd1 = guildMember.guild.roles.find((r) => r.name === "~/Members");
    let roledel1 = guildMember.guild.roles.find((r) => r.name === "Muted");
    let user = guildMember.user;
    let userscore2 = getScore.get(user.id, guildMember.guild.id);
    if (!userscore2) {
      userscore2 = {
        id: `${guildMember.guild.id}-${user.id}`,
        user: user.id,
        guild: guildMember.guild.id,
        points: 0,
        level: 1,
        warning: 0,
        muted: 0,
        translate: 0,
        stream: 0,
        notes: 0,
      };
      setScore.run(userscore2);
    } else {
      if (userscore2.muted == "1") {
        guildMember.addRole(roledel1);
        if (muteChannel1 == "0") {
        } else {
          return muteChannel1.send(
            user +
              ", You have been muted by our system due to breaking rules, trying to leave and rejoin will not work!"
          );
        }
      }
    }
    var cdate = moment.utc(user.createdAt).format("YYYYMMDD");
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");
    //logs
    if (logsChannel1 == `0`) {
    } else {
      try {
        const embed = new Discord.RichEmbed()
          .setTitle(`User joined`)
          .setColor(`RANDOM`)
          .setDescription(guildMember.user)
          .addField(
            `This user has joined us.`,
            "\n" +
              guildMember.user.username +
              "\n" +
              guildMember.user.id +
              "\nAccount age: " +
              ageA
          )
          .setTimestamp();
        logsChannel1.send({
          embed,
        });
      } catch {
        let nowtime = new Date();
        console.log(
          nowtime + "\n" + guildMember.guild.id + ": index.js:" + ln()
        );
      }
    }
    if (muteChannel1 == `0`) {
    } else {
      if (guildChannels.autoMod == "strict") {
        guildMember.addRole(roledel1);
        try {
          return muteChannel1.send(
            ageA +
              " " +
              guildMember.user +
              "\nAutomod Strict is on!\nThis means that every user gets dumped into this channel.\nAutomod strict is usually enabled if there is a raid going on."
          );
        } catch {
          let nowtime = new Date();
          console.log(
            nowtime + "\n" + guildMember.guild.id + ": index.js:" + ln()
          );
        }
      }
      if (ageA[1] == "hours" || ageA[1] == "day" || ageA[1] == "days") {
        guildMember.addRole(roledel1);
        try {
          return muteChannel1.send(
            ageA +
              " " +
              guildMember.user +
              "\nYou have a rather new account so you have to verify!\nType your username(case sensitive) and attach 1337 to the end.\nExample: UtopicUnicorn1337"
          );
        } catch {
          let nowtime = new Date();
          console.log(
            nowtime + "\n" + guildMember.guild.id + ": index.js:" + ln()
          );
        }
      }
    }
    //make nice image for welcoming
    guildMember.addRole(roleadd1).catch((error) => {});
    if (generalChannel1 == "0") {
    } else {
      try {
        var ReBeL = guildMember.user.username;
        var bel = [
          "\njust started brewing some minty tea!",
          "\nis using Arch BTW!",
          "\necho 'is here!'",
          "\nis sipping minty tea!",
          "\nuseradd -m -g users /bin/sh @",
        ];
        var moon = bel[~~(Math.random() * bel.length)];
        moon = moon.replace("@", ReBeL);
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage("./mintwelcome.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px Zelda";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(ReBeL, canvas.width / 3.0, canvas.height / 2.0);
        ctx.font = "21px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
        const avatar = await Canvas.loadImage(
          guildMember.user.displayAvatarURL
        );
        ctx.drawImage(avatar, 600, 25, 50, 50);
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const guildlogo = await Canvas.loadImage(guildMember.guild.iconURL);
        ctx.drawImage(guildlogo, 25, 25, 200, 200);
        const attachment = new Discord.Attachment(
          canvas.toBuffer(),
          "welcome-image.png"
        );
        await generalChannel1.send(attachment);
      } catch {
        let nowtime = new Date();
        console.log(
          nowtime + "\n" + guildMember.guild.id + ": index.js:" + ln()
        );
      }
    }
  },
};
