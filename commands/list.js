const npm = require("../modules/NPM.js");
npm.npm();
module.exports = {
  name: "list",
  description: "[music] Play a premade playlist!",
  async execute(message) {
    const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
    const prefixstart = getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    //
    let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
    let setUsage = db.prepare(
      "INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);"
    );
    usage = getUsage.get("list");
    usage.number++;
    setUsage.run(usage);
    //
    let args = message.content
      .toLowerCase()
      .slice(prefix.length + 5)
      .split(" ");
      let playlistlist = [];
    if (args[0]) {
      if (args[0] == "1") {
        let playlistlistsel1 = [
          "./playlist/lovebites/01 - Addicted.mp3",
          "./playlist/lovebites/01 The Crusade.mp3",
          "./playlist/lovebites/02 - Pledge Of The Saviour.mp3",
          "./playlist/lovebites/02 The Hammer of Wrath.mp3",
          "./playlist/lovebites/03 - Rising.mp3",
          "./playlist/lovebites/04 - Empty Daydream.mp3",
          "./playlist/lovebites/05 - Mastermind 01.mp3",
          "./playlist/lovebites/06 - M.D.O..mp3",
          "./playlist/lovebites/07 - Journey To The Otherside.mp3",
          "./playlist/lovebites/08 The Apocalypse (Awakened Version).mp3",
          "./playlist/lovebites/08 - The Final Collision.mp3",
          "./playlist/lovebites/09 - We The United.mp3",
          "./playlist/lovebites/11 Edge of the World.mp3",
        ];
        for (let i of playlistlistsel1) {
            playlistlist.push(i);
        }
      }
      if (args[0] == "2") {
        let playlistlistsel = [
          "./playlist/iosys/Bright red sailing.mp3",
          "./playlist/iosys/Capricious waltz.mp3",
          "./playlist/iosys/Ghost fun k tion.mp3",
          "./playlist/iosys/Jam from memories of winter.mp3",
          "./playlist/iosys/Meta dream.mp3",
          "./playlist/iosys/Never snow falling town -Two years ago.mp3",
          "./playlist/iosys/Oakwood.mp3",
          "./playlist/iosys/Osprey.mp3",
          "./playlist/iosys/Phantom night story.mp3",
          "./playlist/iosys/Sumizone.mp3",
          "./playlist/iosys/The second princess.mp3",
          "./playlist/iosys/Twilight haze.mp3",
          "./playlist/iosys/Un fiore rosa.mp3",
          "./playlist/iosys/Waltz for devil.mp3",
          "./playlist/iosys/Well-defined.mp3",
        ];
        for (let i of playlistlistsel) {
            playlistlist.push(i);
        }
      }
    } else {
      const embed = new Discord.RichEmbed()
        .setTitle("Available playlists")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("RANDOM")
        .addField(prefix + "list 1", "lovebites")
        .addField(prefix + "list 2", "iosys");
      return message.channel.send(embed);
    }
    if (playlistlist < 1) {
      const embed = new Discord.RichEmbed()
        .setTitle("Available playlists")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("RANDOM")
        .addField(prefix + "list 1", "lovebites")
        .addField(prefix + "list 2", "iosys");
      return message.channel.send(embed);
    }
    const voiceChannel1 = message.member.voiceChannel;
    if (!voiceChannel1) return message.reply("Join a voicechannel first!");
    const permissions1 = voiceChannel1.permissionsFor(message.client.user);
    if (!permissions1.has("CONNECT") || !permissions1.has("SPEAK"))
      return message.reply(
        "It looks like I have no permission to talk in the channel you are in."
      );
    for (let i of playlistlist) {
      setTimeout(async () => {
        const queue = message.client.queue;
        const serverQueue = message.client.queue.get(message.guild.id);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return;
        //
        let thumb =
          "https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png";
        var song = {
          title: i,
          thumb: thumb,
          webs: "This is local you silly.",
          url: i,
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
            volume: 10,
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
              .addField(song.title, song.webs)
              .setFooter("You can use `!np` to see the playlist!");
            return message.channel.send(rembed);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            message.delete();
            return message.channel.send("error");
          }
        } else {
          return serverQueue.songs.push(song);
        }
        //
      }, 500);
    }
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
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 50);
  },
};
