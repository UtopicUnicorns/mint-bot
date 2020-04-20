const npm = require("./modules/NPM.js");
npm.npm();
const client = new Client();
var originalLog = console.log;

console.log = function (str) {
  originalLog(str);
  if (str.length > 1500) {
    client.channels.get("701764606053580870").send(str, {
      split: true,
    });
  } else {
    client.channels.get("701764606053580870").send(str);
  }
};
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const { FeedEmitter } = require("rss-emitter-ts");
const emitter = new FeedEmitter();
const oAuth = Discord.OAuth2Application;
require("dotenv").config();
let getUsage1 = db.prepare("SELECT * FROM usage WHERE command = ?");
let setUsage1 = db.prepare(
  "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
);
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  let usagecheck = getUsage1.get(command.name);
  if (!usagecheck) {
    usagecheck = {
      command: command.name,
      number: `0`,
    };
    setUsage1.run(usagecheck);
  }
  client.commands.set(command.name, command);
}
client.once("ready", () => {
  console.log(
    moment().format("MMMM Do YYYY, HH:mm:ss") +
      "\n" +
      __filename +
      ":" +
      ln() +
      `\nBot has started, with ${client.users.size} users.\nI am in ${client.guilds.size} guilds:\n` +
      client.guilds
        .filter((guild) => guild.owner !== undefined)
        .map(
          (guild) =>
            guild.name +
            " \nUsers: " +
            guild.memberCount +
            " \nOwner: " +
            guild.owner.user.username
        )
        .join("\n\n") +
      "\n\n"
  );
  //Start Database
  const dbinit = require("./modules/dbinit.js");
  dbinit.dbinit();
  //change bot Status
  setInterval(() => {
    var RAN = [`https://artemisbot.eu`, `${client.guilds.size} servers`];
    client.user.setActivity(RAN[~~(Math.random() * RAN.length)], {
      type: "LISTENING",
    });
  }, 60000);
  //Wipe music
  const musicf = fs.readdirSync("./music");
  for (const file of musicf) {
    fs.unlink("./music/" + file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
  //
  //Reminder run
  setInterval(() => {
    const remindersdb = db
      .prepare("SELECT * FROM remind ORDER BY time DESC;")
      .all();
    for (const data of remindersdb) {
      let timenow = moment().format("YYYYMMDDHHmmss");
      if (timenow > data.time) {
        let gettheguild = client.guilds.get(data.gid);
        let reminduser = gettheguild.members.get(data.uid);
        if (!reminduser) {
          return db
            .prepare(
              `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
            )
            .run();
        }
        client.channels.get(data.cid).send("<@" + data.uid + "> PING!");
        const reminderemb2 = new Discord.RichEmbed()
          .setTitle("REMIND ALERT")
          .setAuthor(
            reminduser.user.username + "#" + reminduser.user.discriminator,
            reminduser.user.displayAvatarURL
          )
          .setDescription(reminduser)
          .addField("Reminder: ", data.reminder + "!")
          .setColor("RANDOM");
        client.channels.get(data.cid).send({
          embed: reminderemb2,
        });
        db.prepare(
          `DELETE FROM remind WHERE mid = ${data.mid} AND uid = ${data.uid}`
        ).run();
      }
    }
  }, 5000);
  //preload messages on reconnect
  const fetch2 = db.prepare("SELECT * FROM guildhub").all();
  let array4 = [];
  for (const data of fetch2) {
    if (data.reactionChannel > 1) {
      array4.push(data.reactionChannel);
      if (client.channels.get(data.reactionChannel)) {
        client.channels.get(data.reactionChannel).fetchMessages();
      }
    }
  }
  //start Website
  dashboard.run(
    client,
    {
      port: 80,
      clientSecret: configfile.CLIENT_SECRET,
      redirectURI: configfile.REDIRECT_URI,
    },
    oAuth
  );
});
client.once("reconnecting", () => {
  //Wipe music
  const musicf = fs.readdirSync("./music");
  for (const file of musicf) {
    fs.unlink("./music/" + file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
  //
  console.log(
    moment().format("MMMM Do YYYY, HH:mm:ss") +
      "\n" +
      __filename +
      ":" +
      ln() +
      `\nBot has reconnected, with ${client.users.size} users.\nI am in ${client.guilds.size} guilds:\n` +
      client.guilds
        .filter((guild) => guild.owner !== undefined)
        .map(
          (guild) =>
            guild.name +
            " \nUsers: " +
            guild.memberCount +
            " \nOwner: " +
            guild.owner.user.username
        )
        .join("\n\n") +
      "\n\n"
  );
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});
client.on("guildMemberAdd", async (guildMember) => {
  const onGuildMemberAdd = require("./modules/on_guildmemberadd.js");
  onGuildMemberAdd.onGuildMemberAdd(guildMember);
});
client.on("guildMemberRemove", async (guildMember) => {
  const onGuildMemberRemove = require("./modules/on_guildmemberremove.js");
  onGuildMemberRemove.onGuildMemberRemove(guildMember);
});
client.on("guildCreate", (guild) => {
  console.log(
    "Joined a new guild: " +
      guild.name +
      " Users: " +
      guild.memberCount +
      " Owner: " +
      guild.owner.user.username
  );
  newGuild1 = getGuild.get(guild.id);
  if (!newGuild1) {
    newGuild = getGuild.get(guild.id);
    if (!newGuild) {
      if (!guild.roles.find((r) => r.name === `Muted`)) {
        guild.createRole({
          name: `Muted`,
        });
      }
      if (!guild.roles.find((r) => r.name === `~/Members`)) {
        guild.createRole({
          name: `~/Members`,
        });
      }
      newGuild = {
        guild: guild.id,
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
      setGuild.run(newGuild);
    }
  }
});
client.on("guildDelete", (guild) => {
  console.log(
    "Left a guild: " +
      guild.name +
      " Users: " +
      guild.memberCount +
      " Owner: " +
      guild.owner.user.username
  );
});
client.on("guildMemberUpdate", (oldMember, newMember) => {
  const onMemberUpdate = require("./modules/on_member_update.js");
  onMemberUpdate.onMemberUpdate(oldMember, newMember);
});
client.on("presenceUpdate", (oldMember, newMember) => {
  const onMemberPrupdate = require("./modules/on_member_prupdate.js");
  onMemberPrupdate.onMemberPrupdate(oldMember, newMember);
});
//reddit
emitter.add({
  url: "https://www.reddit.com/r/linuxmint/new.rss",
  refresh: 10000,
  ignoreFirst: true,
});
emitter.on("item:new", (item) => {
  const reddittext = htmlToText.fromString(item.description, {
    wordwrap: false,
    ignoreHref: true,
    noLinkBrackets: true,
    preserveNewlines: true,
  });
  let reddittext2 = reddittext.replace("[link]", "").replace("[comments]", "");
  let reddittext3 = reddittext2.substr(0, 1000);
  try {
    const redditmessage = new Discord.RichEmbed()
      .setTitle(item.title.substr(0, 100))
      .setURL(item.link)
      .setColor("RANDOM")
      .setDescription(reddittext3)
      .addField(item.link + "\n", "https://www.reddit.com" + item.author, true)
      .setTimestamp();
    return client.channels.get("656194923107713024").send({
      embed: redditmessage,
    });
  } catch {
    if (spamRecently.has("REDDIT")) {
    } else {
      spamRecently.add("REDDIT");
      setTimeout(() => {
        spamRecently.delete("REDDIT");
      }, 1000);

      console.log(
        moment().format("MMMM Do YYYY, HH:mm:ss") +
          "\n" +
          __filename +
          ":" +
          ln()
      );
    }
  }
});
emitter.on("feed:error", (error) => {
  //console.error(error.message)
});
client.on("messageDelete", async (message) => {
  const onMessageDelete = require("./modules/on_message_delete.js");
  onMessageDelete.onMessageDelete(message);
});
client.on("guildBanAdd", async (guild, user) => {
  const onGuildBanAdd = require("./modules/on_guildbanadd.js");
  onGuildBanAdd.onGuildBanAdd(guild, user);
});
client.on("messageUpdate", (oldMessage, newMessage) => {
  const onMsgUpdate = require("./modules/on_message_update.js");
  onMsgUpdate.onMsgUpdate(oldMessage, newMessage);
});
client.on("message", async (message) => {
  const onMessage = require("./modules/on_message.js");
  onMessage.onMessage(message);
});
client.on("messageReactionAdd", async (reaction, user) => {
  const onReaction = require("./modules/on_reaction.js");
  onReaction.onReaction(reaction, user);
});
client.on("error", (e) => {});
client.on("warn", (e) => {});
client.on("debug", (e) => {});
client.login(configfile.token);
