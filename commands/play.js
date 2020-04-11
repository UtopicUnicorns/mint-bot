const npm = require("../NPM.js");
npm.npm();
module.exports = {
  name: "play",
  description: "[music] Play a song!",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("play");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 5)
      .split(" ");
    if (!args[0]) return message.reply("Add a song");
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
      );
    }
    let openmusicurl2 = await youtube.searchVideos(`${args}`, 4);
    let openmusicurl = openmusicurl2[0].url;
    const id = openmusicurl2[0].id;
    const file = "./music/" + openmusicurl2[0].title + ".mp3";
    message.delete();
    const embed = new Discord.RichEmbed()
      .setTitle(openmusicurl2[0].title)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setThumbnail(openmusicurl2[0].thumbnails.default.url)
      .setColor("RANDOM")
      .setDescription("Downloading......")
      .addField(
        openmusicurl2[0].title,
        "https://www.youtube.com/watch?v=" + openmusicurl2[0].id
      );
    message.channel.send({
      embed: embed,
    });
    yas.downloader
      .onSuccess(async ({ id, file }) => {
        var song = {
          title: openmusicurl2[0].title,
          thumb: openmusicurl2[0].thumbnails.default.url,
          webs: "https://www.youtube.com/watch?v=" + openmusicurl2[0].id,
          url: file,
        };
        if (!song) {
          return message.reply("No song found!");
        }
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
          };
          queue.set(message.guild.id, queueContruct);
          queueContruct.songs.push(song);
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0]);
            message.delete();
            const rembed = new Discord.RichEmbed()
              .setTitle(song.title)
              .setAuthor(message.author.username, message.author.avatarURL)
              .setThumbnail(song.thumb)
              .setColor("RANDOM")
              .setDescription("Started playing: ")
              .addField(song.title, song.webs);
            return message.channel.send(rembed);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            message.delete();
            return message.channel.send("error");
          }
        } else {
          serverQueue.songs.push(song);
          const rembed = new Discord.RichEmbed()
            .setTitle(song.title)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail(song.thumb)
            .setColor("RANDOM")
            .setDescription("Song was added to the queue")
            .addField(song.title, song.webs);
          return message.channel.send(rembed);
        }
      })
      .onError(({ id, file, error }) => {
        console.error(
          `Sorry, an error ocurred when trying to download ${id}`,
          error
        );
      })
      .download({ id, file });
  },
  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    const dispatcher = serverQueue.connection
      .playFile(song.url)
      .on("end", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", (error) => {
        console.error(error);
      });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  },
};
