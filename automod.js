npm = require("./NPM.js");
npm.npm();
module.exports = {
  automod: function (autoexec, message) {
    sql = require("better-sqlite3")("./scores.sqlite");
    if (autoexec == "wordFilter") {
      //Word/sentence filter
      let allwords = sql
        .prepare("SELECT * FROM words WHERE guild = ?;")
        .all(message.guild.id);
      let wargs = message.content.toLowerCase().split(" ");
      for (i in wargs) {
        for (const data of allwords) {
          if (wargs.includes(data.words)) {
            return message.delete();
          }
        }
      }
    }
    if (autoexec == "noSpam") {
      //No Spam
      if (spamRecently.has(message.author.id + message.guild.id)) {
        message.delete();
      } else {
        spamRecently.add(message.author.id + message.guild.id);
        setTimeout(() => {
          spamRecently.delete(message.author.id + message.guild.id);
        }, 1000);
      }
    }
    if (autoexec == "noInvites") {
      //No discord invites
      if (
        message.content.toLowerCase().includes("discord.gg/") ||
        message.content.toLowerCase().includes("discordapp.com/invite/")
      ) {
        message.delete();
      }
    }
    if (autoexec == "antiMention") {
      //Anti-mention
      if (message.mentions.users.size > 3) {
        message.delete();
      }
    }
  },
};
