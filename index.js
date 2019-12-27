const fs = require('fs')
const Discord = require('discord.js');
const Canvas = require('canvas');
const request = require("request");
const translate = require('translate-google');
const moment = require('moment');
const Client = require('./client/Client');
const {
    token,
    yandex,
    rolemoteconf,
    rolenameconf,
    dadjokes
} = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const talkedRecently = new Set();
const thankedRecently = new Set();
const queue = new Map();
const {
    FeedEmitter
} = require("rss-emitter-ts");
const emitter = new FeedEmitter();
const htmlToText = require('html-to-text');
let emojiname = rolemoteconf;
let rolename = rolenameconf;
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.once('ready', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has started, with ${client.users.size} users.\n\n`);
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    //Linux tips, no longer dad jokes
    setInterval(() => {
        const dadembed = new Discord.RichEmbed()
            .setTitle("Hint:")
            .setColor('RANDOM')
            .setDescription(dadjokes[~~(Math.random() * dadjokes.length)])
        client.channels.get('628984660298563584').send({
            embed: dadembed
        });
    }, 21600000);
    //change bot Status
    setInterval(() => {
        let prefixstatus = fs.readFileSync('./set/prefix.txt').toString();
        var RAN = [
            `${prefixstatus}help`,
            `${client.users.size} total users`
        ];
        client.user.setActivity(RAN[~~(Math.random() * RAN.length)], {
            type: 'LISTENING'
        });
    }, 60000);
    //preload messages on reconnect
    let testchannel = client.channels.get('645033708860211206');
    testchannel.fetchMessage('645034653652090880');
    testchannel.fetchMessage('645035108306255883');
    testchannel.fetchMessage('645035668447297568');
});
client.once('reconnecting', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has reconnected, with ${client.users.size} users.\n\n`);
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});
client.on("guildMemberAdd", async (guildMember) => {
    if (!client.guilds.get('628978428019736619')) return;
    //account age check
    let user = guildMember.user;
    var cdate = moment.utc(user.createdAt).format('YYYYMMDD');
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");
    if (ageA[1] == "hours") {
        guildMember.addRole(guildMember.guild.roles.get("640535533457637386"));
        return client.channels.get('641301287144521728').send(ageA + ' ' + guildMember.user + "\nYour account is younger than 30 days!\nTo prevent spammers and ban evaders we have temporarely muted you.\nWrite your own username with 1337 at the end to gain access.\nExample utopicunicorn1337");
    }
    if (ageA[1] == "day") {
        guildMember.addRole(guildMember.guild.roles.get("640535533457637386"));
        return client.channels.get('641301287144521728').send(ageA + ' ' + guildMember.user + "\nYour account is younger than 30 days!\nTo prevent spammers and ban evaders we have temporarely muted you.\nWrite your own username with 1337 at the end to gain access.\nExample utopicunicorn1337");
    }
    if (ageA[1] == "days") {
        guildMember.addRole(guildMember.guild.roles.get("640535533457637386"));
        return client.channels.get('641301287144521728').send(ageA + ' ' + guildMember.user + "\nYour account is younger than 30 days!\nTo prevent spammers and ban evaders we have temporarely muted you.\nWrite your own username with 1337 at the end to gain access.\nExample utopicunicorn1337");
    }
    let muteevade = fs.readFileSync('./set/mute.txt').toString().split("\n");
    if (muteevade.includes(guildMember.id)) {
        guildMember.addRole(guildMember.guild.roles.get("640535533457637386"));
        return client.channels.get('641301287144521728').send(guildMember.user + "\nYou succesfully evaded your mute!\nSYKE!\nMUTED!");
    }
    //make nice image for welcoming
    var ReBeL = guildMember.user.username;
    var bel = ["\njust started brewing some minty tea!", "\nis using Arch BTW!", "\necho 'is here!'", "\nis sipping minty tea!", "\nuseradd -m -g users /bin/sh @"];
    var moon = bel[~~(Math.random() * bel.length)];
    moon = moon.replace('@', ReBeL)
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./mintwelcome.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Zelda';
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(ReBeL, canvas.width / 3.0, canvas.height / 2.0);
    ctx.font = '21px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
    const avatar = await Canvas.loadImage(guildMember.user.displayAvatarURL);
    ctx.drawImage(avatar, 600, 25, 50, 50);
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    client.channels.get('628984660298563584').send(attachment);
    guildMember.addRole(guildMember.guild.roles.get("628979872466993153"));
});
client.on("guildMemberRemove", async (guildMember) => {
    if (!client.guilds.get('628978428019736619')) return;
    client.channels.get('646672806033227797').send(guildMember.user.username + ' left the server!');
});
client.on("presenceUpdate", (oldMember, newMember) => {
    //Twitch notifications
    if (oldMember.presence.game !== newMember.presence.game) {
        if (!newMember.presence.game) {
            return;
        }
        if (!newMember.presence.game.url) {
            return;
        }
        if (newMember.presence.game.url.includes("twitch")) {
            //mint
            if (client.guilds.get('628978428019736619')) {
                request('https://api.rawg.io/api/games?page_size=5&search=' + newMember.presence.game.state, {
                    json: true
                }, function(err, res, body) {
                    if (!body.results[0].background_image) {
                        const embed = new Discord.RichEmbed()
                            .setTitle(newMember.presence.game.state)
                            .setColor(`RANDOM`)
                            .setURL(newMember.presence.game.url)
                            .setDescription('@everyone ' + newMember.user.username + ' went live!')
                            .addField(newMember.presence.game.details + '\n' + newMember.presence.game.url)
                            .setTimestamp();
                        return client.channels.get('650822971996241970').send({
                            embed
                        });
                    }
                    const embed = new Discord.RichEmbed()
                        .setTitle(newMember.presence.game.state)
                        .setColor(`RANDOM`)
                        .setURL(newMember.presence.game.url)
                        .setThumbnail(`${body.results[0].background_image}`)
                        .setDescription(newMember.user.username + ' went live!')
                        .addField(newMember.presence.game.details + '\n' + newMember.presence.game.url)
                        .setTimestamp();
                    client.channels.get('650822971996241970').send({
                        embed
                    });
                });
            }
        }
    }
    //Change topic based on user activity
    if (oldMember.presence.status !== newMember.presence.status) {
        if (`${newMember.user.username}` === "UtopicUnicorn") {
            if (`${newMember.presence.status}` === "dnd") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
            }
        }
        if (`${newMember.presence.status}` === "online") {
            client.channels.get('628984660298563584').setTopic(`${newMember.user.username} just came online!`);
        }
    }
});
//reddit
emitter.add({
    url: "https://www.reddit.com/r/linuxmint/new.rss",
    refresh: 10000,
    ignoreFirst: true
});
emitter.on("item:new", (item) => {
    const reddittext = htmlToText.fromString(item.description, {
        wordwrap: false,
        ignoreHref: true,
        noLinkBrackets: true,
        preserveNewlines: true
    });
    let reddittext2 = reddittext.replace('[link]', '').replace('[comments]', '');
    let reddittext3 = reddittext2.substr(0, 1000);
    const redditmessage = new Discord.RichEmbed()
        .setTitle(item.title)
        .setURL(item.link)
        .setColor('RANDOM')
        .setDescription(reddittext3)
        .addField(item.link + '\n', 'https://www.reddit.com' + item.author, true)
        .setTimestamp();
    return client.channels.get('656194923107713024').send({
        embed: redditmessage
    });
});
emitter.on("feed:error", (error) => console.error(error.message));
client.on('message', async message => {
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    let prefix = fs.readFileSync('./set/prefix.txt').toString();
    //Reaction roles
    if (message.content.startsWith(prefix + "reaction")) {
        if (!message.channel.guild) return;
        for (let n in emojiname) {
            var emoji = [message.guild.emojis.find(r => r.name == emojiname[n])];
            for (let i in emoji) {
                message.react(emoji[i]);
            }
        }
    }
    //ignore bots
    if (message.author.bot) return;
    //Mute filter
    let filtermute = fs.readFileSync('./set/mute.txt').toString().split("\n");
    if (filtermute.includes(message.author.id)) {
        if (message.channel.id === '641301287144521728') {
            return
        }
        message.delete()
        return
    }
    if (message.channel.id === '641301287144521728') {
        if (filtermute.includes(message.author.id)) return;
        if (message.content == message.author.username + "1337") {
            let roleadd = message.guild.roles.find(r => r.name === "~/Members");
            let roledel = message.guild.roles.find(r => r.name === "Muted");
            let member = message.member;
            message.member.addRole(roleadd).catch(console.error);
            message.member.removeRole(roledel).catch(console.error);
            var ReBeL = member;
            var bel = ["\njust started brewing some minty tea!", "\nis using Arch BTW!", "\necho 'is here!'", "\nis sipping minty tea!", "\nuseradd -m -g users /bin/sh @"];
            var moon = bel[~~(Math.random() * bel.length)];
            moon = moon.replace('@', message.author.username)
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('./mintwelcome.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Zelda';
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(message.author.username, canvas.width / 3.0, canvas.height / 2.0);
            ctx.font = '21px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
            const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
            message.guild.channels.get('628984660298563584').send(attachment);
            return message.channel.send(`${member} has been approved.`);
        }
    }
    //restart
    if (message.content === prefix + 'restart') {
        if (message.author.id !== '127708549118689280') return;
        message.channel.send('Restarting').then(() => {
            process.exit(1);
        })
    };
    //reload commands
    if (message.content === prefix + 'reload') {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        let commandFiless = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (let file of commandFiless) {
            delete require.cache[require.resolve(`./commands/${file}`)];
            try {
                let newCommand = require(`./commands/${file}`);
                message.client.commands.set(newCommand.name, newCommand);
            } catch (error) {
                console.log(error);
                message.channel.send(`${file}:\n${error.message}`);
            }
        }
        message.channel.send("Done");
    };
    //reloadprefix
    if (message.content === "forceprefix") {
        if (!message.member.hasPermission('KICK_MEMBERS')) return;
        fs.writeFile(`./set/prefix.txt`, '!', (error) => {
            if (error) throw error;
        })
        message.channel.send("Forced prefix back to !");
    }
    //WhoIsArtemis?
    if (message.content.toLowerCase().includes("who is artemis")) {
        const whoartemis = new Discord.RichEmbed()
            .setTitle('Artemis')
            .setColor('RANDOM')
            .setDescription('Hello, I am Artemis!\nMy master is UtopicUnicorn#0383\n\nI am open-source: https://github.com/UtopicUnicorns/mint-bot\nMy main discord server is: https://discord.gg/EVVtPpw')
            .setTimestamp()
        return message.channel.send({
            embed: whoartemis
        });
    }
    if (message.content === prefix + "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    //memes
    let uwufilter = fs.readFileSync('./set/uwu.txt').toString().split("\n");
    if (uwufilter.includes(message.channel.id)) {
        var faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];
        v = message.content;
        if (!message.content) return;
        if (message.content.startsWith("http")) return;
        v = v.replace(/(?:r|l)/g, "w");
        v = v.replace(/(?:R|L)/g, "W");
        v = v.replace(/n([aeiou])/g, 'ny$1');
        v = v.replace(/N([aeiou])/g, 'Ny$1');
        v = v.replace(/N([AEIOU])/g, 'Ny$1');
        v = v.replace(/ove/g, "uv");
        v = v.replace(/\!+/g, " " + faces[Math.floor(Math.random() * faces.length)] + " ");
        message.delete();
        const uwutext = new Discord.RichEmbed()
            .setTitle(message.author.username)
            .setColor('RANDOM')
            .setDescription(v)
            .setTimestamp()
        return message.channel.send({
            embed: uwutext
        });
    }
    //Artemis Talk
    if (message.channel.id === '642882039372185609') {
        if (message.author.id !== "440892659264126997") {
            let cargs = message.content.slice(5);
            if (message.content.startsWith(prefix + "channel")) {
                let readname = fs.readFileSync('channelset.txt').toString().split("\n");
                let channelname = client.channels.get(`${readname}`);
                return message.channel.send(channelname.name);
            }
            if (message.content.startsWith(prefix + "set")) {
                fs.writeFile('channelset.txt', cargs, function(err) {
                    if (err) throw err;
                });
                return message.channel.send('Set channel id to: ' + client.channels.get(`${cargs}`));
            }
            let channelcheck = fs.readFileSync('channelset.txt').toString().split("\n");
            if (!client.channels.get(`${channelcheck}`)) {
                return message.channel.send("Enter a valid channel ID first!\n!set ChannelID");
            }
            //herewego
            aaa = message.content;
            aaa = aaa.replace(/a/g, "₳");
            aaa = aaa.replace(/b/g, "฿");
            aaa = aaa.replace(/c/g, "₵");
            aaa = aaa.replace(/d/g, "Đ");
            aaa = aaa.replace(/e/g, "Ɇ");
            aaa = aaa.replace(/f/g, "₣");
            aaa = aaa.replace(/g/g, "₲");
            aaa = aaa.replace(/h/g, "Ⱨ");
            aaa = aaa.replace(/i/g, "ł");
            aaa = aaa.replace(/j/g, "J");
            aaa = aaa.replace(/k/g, "₭");
            aaa = aaa.replace(/l/g, "Ⱡ");
            aaa = aaa.replace(/m/g, "₥");
            aaa = aaa.replace(/n/g, "₦");
            aaa = aaa.replace(/o/g, "Ø");
            aaa = aaa.replace(/p/g, "₱");
            aaa = aaa.replace(/q/g, "Q");
            aaa = aaa.replace(/r/g, "Ɽ");
            aaa = aaa.replace(/s/g, "₴");
            aaa = aaa.replace(/t/g, "₮");
            aaa = aaa.replace(/u/g, "Ʉ");
            aaa = aaa.replace(/v/g, "V");
            aaa = aaa.replace(/w/g, "₩");
            aaa = aaa.replace(/x/g, "Ӿ");
            aaa = aaa.replace(/y/g, "Ɏ");
            aaa = aaa.replace(/z/g, "Ⱬ");
            aaa = aaa.replace(/A/g, "₳");
            aaa = aaa.replace(/B/g, "฿");
            aaa = aaa.replace(/C/g, "₵");
            aaa = aaa.replace(/D/g, "Đ");
            aaa = aaa.replace(/E/g, "Ɇ");
            aaa = aaa.replace(/F/g, "₣");
            aaa = aaa.replace(/G/g, "₲");
            aaa = aaa.replace(/H/g, "Ⱨ");
            aaa = aaa.replace(/I/g, "ł");
            aaa = aaa.replace(/J/g, "J");
            aaa = aaa.replace(/K/g, "₭");
            aaa = aaa.replace(/L/g, "Ⱡ");
            aaa = aaa.replace(/M/g, "₥");
            aaa = aaa.replace(/N/g, "₦");
            aaa = aaa.replace(/O/g, "Ø");
            aaa = aaa.replace(/P/g, "₱");
            aaa = aaa.replace(/Q/g, "Q");
            aaa = aaa.replace(/R/g, "Ɽ");
            aaa = aaa.replace(/S/g, "₴");
            aaa = aaa.replace(/T/g, "₮");
            aaa = aaa.replace(/U/g, "Ʉ");
            aaa = aaa.replace(/V/g, "V");
            aaa = aaa.replace(/W/g, "₩");
            aaa = aaa.replace(/X/g, "Ӿ");
            aaa = aaa.replace(/Y/g, "Ɏ");
            aaa = aaa.replace(/Z/g, "Ⱬ");
            client.channels.get(`${channelcheck}`).send(aaa);
            return;
        }
    }
    //chatgiffilter
    let giffilter = fs.readFileSync('./set/gif.txt').toString().split("\n");
    if (giffilter.includes(message.channel.id)) {
        if (message.content.includes("https://tenor.com")) {
            message.delete();
        }
        if (message.content.includes(".gif")) {
            message.delete();
        }
    }
    //guide channel
    if (message.channel.id === '648911771624538112') {
        message.delete();
    }
    //Direct Message handle
    if (message.channel.type == "dm") {
        console.log(message.author.username + '\n' + message.content + '\n');
        return
    }
    //Simulate guild member join
    if (message.content === prefix + 'join') {
        if (message.author.id === "127708549118689280") {
            client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
        }
    }
    //bot reactions
    if (message.content.includes("Artemis")) {
        message.react("👀");
    }
    //translate
    if (message.channel.id !== '637373805844496434') {
        let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
        let key = yandex;
        let text = message.content;
        let url = baseurl + "?key=" + key + "&hint=en,de,nl,fr,tr&lang=en" + "&text=" + encodeURIComponent(text) + "&format=plain";
        request(url, {
            json: true
        }, (err, res, body) => {
            if (!body.text) {
                return
            }
            if (JSON.stringify(body).startsWith('{"code":200,"lang":"en-en"')) {
                return;
            }
            translate(text, {
                to: 'en'
            }).then(res => {
                if (message.content.includes("ツ")) return;
                if (res == message.content) return;
                message.channel.send(res);
            }).catch(err => {
                console.error(err);
            });
            if (err) return message.channel.send(err);
        });
    }
    //agree
    if (message.content == "^") {
        message.channel.send("I agree!");
    }
    //set points
    let score;
    if (message.guild) {
        score = client.getScore.get(message.author.id, message.guild.id);
        if (!score) {
            score = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                points: 0,
                level: 1
            };
        }
        score.points++;
        const curLevel = Math.floor(0.5 * Math.sqrt(score.points));
        if (score.level < curLevel) {
            score.level++;
            message.react("⬆");
        }
        client.setScore.run(score);
    }
    //start level rewards
    const lvl5 = message.guild.roles.find(r => r.name === `Minty Messenger`);
    const lvl10 = message.guild.roles.find(r => r.name === `Ruler of Messages`);
    const lvl15 = message.guild.roles.find(r => r.name === `Fresh Messenger`);
    const lvl20 = message.guild.roles.find(r => r.name === `Red Hot Keyboard Warrior`);
    const lvl30 = message.guild.roles.find(r => r.name === `Basically a Cheater`);
    const lvl50 = message.guild.roles.find(r => r.name === `Sage of Messages`);
    const lvl85 = message.guild.roles.find(r => r.name === `Godlike Messenger`);
    //lvl5
    if (score.level > 4 && score.level < 9) {
        let checking = message.member.roles.find(r => r.name === lvl5.name);
        if (!checking) {
            if(!lvl5) return;
            message.member.addRole(lvl5);
            message.reply("You earned the title " + lvl5);
        }
    }
    //lvl10
    if (score.level > 9 && score.level < 14) {
        let checking = message.member.roles.find(r => r.name === lvl10.name);
        if (!checking) {
            if(!lvl10) return;
            message.member.addRole(lvl10);
            message.member.removeRole(lvl5);
            message.reply("You earned the title " + lvl10);
        }
    }
    //lvl15
    if (score.level > 14 && score.level < 19) {
        let checking = message.member.roles.find(r => r.name === lvl15.name);
        if (!checking) {
            if(!lvl15) return;
            message.member.addRole(lvl15);
            message.member.removeRole(lvl10);
            message.reply("You earned the title " + lvl15);
        }
    }
    //lvl20
    if (score.level > 19 && score.level < 29) {
        let checking = message.member.roles.find(r => r.name === lvl20.name);
        if (!checking) {
            if(!lvl20) return;
            message.member.addRole(lvl20);
            message.member.removeRole(lvl15);
            message.reply("You earned the title " + lvl20);
        }
    }
    //lvl30
    if (score.level > 29 && score.level < 49) {
        let checking = message.member.roles.find(r => r.name === lvl30.name);
        if (!checking) {
            if(!lvl30) return;
            message.member.addRole(lvl30);
            message.member.removeRole(lvl20);
            message.reply("You earned the title " + lvl30);
        }
    }
    //lvl50
    if (score.level > 49 && score.level < 84) {
        let checking = message.member.roles.find(r => r.name === lvl50.name);
        if (!checking) {
            if(!lvl50) return;
            message.member.addRole(lvl50);
            message.member.removeRole(lvl30);
            message.reply("You earned the title " + lvl50);
        }
    }
    //lvl85
    if (score.level > 84 && score.level < 99) {
        let checking = message.member.roles.find(r => r.name === lvl85.name);
        if (!checking) {
            if(!lvl85) return;
            message.member.addRole(lvl85);
            message.member.removeRole(lvl50);
            message.reply("You earned the title " + lvl85);
        }
    }
    //Show user points
    if (message.content.startsWith(prefix + "points")) {
        const user = message.mentions.users.first() || message.author;
        let userscore = client.getScore.get(user.id, message.guild.id);
        if (!userscore) return message.reply("This user does not have a database index yet.");
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        client.setScore.run(userscore);
        const pointemb = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField('Name: ', user)
        .addField('Points: ', userscore.points)
        .addField('Level: ', userscore.level)
        .setTimestamp()
    return message.channel.send({
        embed: pointemb
    });
    }
    //Point give command
    if (message.content.startsWith(prefix + "add")) {
        if (message.author.id !== '127708549118689280') return;
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if (!user) return message.reply("You must mention someone or give their ID!");
        const pointsToAdd = parseInt(args[1], 10);
        if (!pointsToAdd) return message.reply("You didn't tell me how many points to give...")
        let userscore = client.getScore.get(user.id, message.guild.id);
        if (!userscore) {
            userscore = {
                id: `${message.guild.id}-${user.id}`,
                user: user.id,
                guild: message.guild.id,
                points: 0,
                level: 1
            }
        }
        userscore.points += pointsToAdd;
        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
        userscore.level = userLevel;
        client.setScore.run(userscore);
        return message.channel.send(`${user.tag} has gotten: ${pointsToAdd} Points.\nYou have ${userscore.points} points now.\nAnd your level is ${userscore.level}`);
    }
    //thanks
    if (message.content.toLowerCase().includes("thank")) {
        const user = message.mentions.users.first() || client.users.get(args[0]);
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
            let userscore = client.getScore.get(user.id, message.guild.id);
            if (!userscore) return message.reply("This user does not have a database index yet.");
            userscore.points += pointsToAdd;
            let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
            userscore.level = userLevel;
            client.setScore.run(userscore);
            return message.reply("thanked " + user.username + "\n" + user.username + " has gotten 20 points for their effort!");
        }
    }
    //show top10 points
    if (message.content.startsWith(prefix + "top")) {
        const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
        const embed = new Discord.RichEmbed()
            .setTitle("Leaderboard")
            .setDescription("Top 10 chatters")
            .setColor('RANDOM');
        for (const data of top10) {
            if (client.users.get(data.user)) {
                embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
            }
        }
        message.channel.send({
            embed
        });
    }
    //Clean Database
    if (message.content.startsWith(prefix + "clean")) {
        if (message.author.id !== '127708549118689280') return;
        let guildlist = client.guilds.get("628978428019736619");
        let guildlistcollect = [];
        guildlist.members.forEach(member => guildlistcollect.push(member.user.id));
        let databaselist = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC ;").all(message.guild.id);
        let databaselistcollect = [];
        for (const data of databaselist) {
            databaselistcollect.push(data.user);
        }
        for (let i of databaselistcollect) {
            if (guildlistcollect.includes(i)) {} else {
                sql.prepare(`DELETE FROM scores WHERE user = ${i}`).run();
            }
        }
        message.channel.send("Done!");
    }
    //game
    if (message.content.startsWith(prefix + "gamble")) {
        if (talkedRecently.has(message.author.id)) {
            message.reply("You may only gamble once every 30 seconds!");
        } else {
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 30000);
            let number1 = 5;
            message.reply("\nBetween (0-9)\nWill the next number be Higher or Lower than: " + number1 + "?\nhigher/lower Amount_to_bet");
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 20000
            });
            collector.on('collect', message => {
                let number2 = Math.floor(Math.random() * 10);
                if (number2 == number1) return message.channel.send("Both numbers were the same, it's a tie!");
                if (message.content.toLowerCase().startsWith("higher")) {
                    if (number2 > number1) {
                        const user = message.author;
                        const gargs = message.content.slice(7).split(" ");
                        if (gargs[0] > 100) return message.channel.send("You may only bet up to 100 points!");
                        let pointsToAdd = parseInt(gargs[0], 10);
                        if (gargs[0].startsWith("-")) return;
                        if (!pointsToAdd) {
                            pointsToAdd = parseInt(0, 10);
                        }
                        let userscore = client.getScore.get(user.id, message.guild.id);
                        if (userscore.points < pointsToAdd) return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        userscore.points += pointsToAdd;
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        client.setScore.run(userscore);
                        message.channel.send(number2 + `\nYou won ${pointsToAdd} points!\nYou have ${userscore.points} points!`);
                    }
                    if (number2 < number1) {
                        const user = message.author;
                        const gargs = message.content.slice(7).split(" ");
                        if (gargs[0] > 100) return message.channel.send("You may only bet up to 100 points!");
                        if (gargs[0].startsWith("-")) return;
                        let pointsToAdd = parseInt("-" + gargs[0], 10);
                        if (!pointsToAdd) {
                            pointsToAdd = 0;
                        }
                        let userscore = client.getScore.get(user.id, message.guild.id);
                        userscore.points += pointsToAdd;
                        if (userscore.points < "0") return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        client.setScore.run(userscore);
                        message.channel.send(number2 + `\nYou lost ${pointsToAdd} points!\nYou have ${userscore.points} points!`);
                    }
                }
                if (message.content.toLowerCase().startsWith("lower")) {
                    if (number2 > number1) {
                        const user = message.author;
                        const gargs = message.content.slice(6).split(" ");
                        if (gargs[0] > 100) return message.channel.send("You may only bet up to 100 points!");
                        if (gargs[0].startsWith("-")) return;
                        let pointsToAdd = parseInt("-" + gargs[0], 10);
                        if (!pointsToAdd) {
                            pointsToAdd = parseInt(0, 10);
                        }
                        let userscore = client.getScore.get(user.id, message.guild.id);
                        userscore.points += pointsToAdd;
                        if (userscore.points < "0") return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        client.setScore.run(userscore);
                        message.channel.send(number2 + `\nYou lost ${pointsToAdd} points!\nYou have ${userscore.points} points!`);
                    }
                    if (number2 < number1) {
                        const user = message.author;
                        const gargs = message.content.slice(6).split(" ");
                        if (gargs[0] > 100) return message.channel.send("You may only bet up to 100 points!");
                        if (gargs[0].startsWith("-")) return;
                        let pointsToAdd = parseInt(gargs[0], 10);
                        if (!pointsToAdd) {
                            pointsToAdd = parseInt(0, 10);
                        }
                        let userscore = client.getScore.get(user.id, message.guild.id);
                        if (userscore.points < pointsToAdd) return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        userscore.points += pointsToAdd;
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        client.setScore.run(userscore);
                        message.channel.send(number2 + `\nYou won ${pointsToAdd} points!\nYou have ${userscore.points} points!`);
                    }
                }
            })
        }
    }
    //require prefix
    if (!message.content.startsWith(prefix)) return;
    try {
        command.execute(message);
    } catch (error) {
        //console.error(error);
    }
});
client.on("messageReactionAdd", async (reaction, user) => {
    //report
    let limit1 = 1;
    if (reaction.emoji.name == '❌' && reaction.count == limit1) {
        if (reaction.message.author.id == '440892659264126997') return;
        if (reaction.users.first() == reaction.message.author) return reaction.remove(reaction.message.author.id);
        if (!reaction.message.attachments.size > 0) {
            const editmessage = new Discord.RichEmbed()
                .setTitle("A message got reported!")
                .setDescription("Message by: " + reaction.message.author)
                .setURL(reaction.message.url)
                .setColor('RANDOM')
                .addField('Reported Message:\n', reaction.message.content, true)
                .addField('Channel', reaction.message.channel, true)
                .addField('Reported by: ', reaction.users.first())
                .setFooter("Message ID: " + reaction.message.id)
                .setTimestamp();
            return client.channels.get('646672806033227797').send({
                embed: editmessage
            });
        }
        if (reaction.message.content === '') {
            const image = reaction.message.attachments.array()[0].url;
            const editmessage = new Discord.RichEmbed()
                .setTitle("A message got reported!")
                .setDescription("Message by: " + reaction.message.author)
                .setURL(reaction.message.url)
                .setColor('RANDOM')
                .addField('Channel', reaction.message.channel, true)
                .addField('Reported by: ', reaction.users.first())
                .setFooter("Message ID: " + reaction.message.id)
                .setImage(image)
                .setTimestamp();
            return client.channels.get('646672806033227797').send({
                embed: editmessage
            });
        }
        const image = reaction.message.attachments.array()[0].url;
        const editmessage = new Discord.RichEmbed()
            .setTitle("A message got reported!")
            .setDescription("Message by: " + reaction.message.author)
            .setURL(reaction.message.url)
            .setColor('RANDOM')
            .addField('Reported Message:\n', reaction.message.content, true)
            .addField('Reported by: ', reaction.users.first())
            .addField('Channel', reaction.message.channel, true)
            .setFooter("Message ID: " + reaction.message.id)
            .setImage(image)
            .setTimestamp();
        return client.channels.get('646672806033227797').send({
            embed: editmessage
        });
    }
    //reportdelete
    let limit2 = 3;
    if (reaction.emoji.name == '❌' && reaction.count == limit2) {
        if (reaction.message.author.id == '440892659264126997') return;
        if (reaction.message.author.id == '127708549118689280') return;
        if (reaction.users.first() == reaction.message.author) return reaction.remove(reaction.message.author.id);
        reaction.message.delete();
        if (reaction.message.content === '') return;
        const editmessage = new Discord.RichEmbed()
            .setTitle("A message that was reported got deleted!")
            .setDescription("Message by: " + reaction.message.author)
            .setColor('RANDOM')
            .addField('Reported Message:\n', reaction.message.content, true)
            .addField('Deleted by: ', reaction.users.last())
            .addField('Channel', reaction.message.channel, true)
            .setFooter("Message ID: " + reaction.message.id)
            .setTimestamp();
        return client.channels.get('646672806033227797').send({
            embed: editmessage
        });
    }
    //Highlights
    let limit = 3;
    if (reaction.emoji.name == '🍵' && reaction.count == limit) {
        if (reaction.message.author.id == '440892659264126997') return;
        if (!reaction.message.attachments.size > 0) {
            const editmessage = new Discord.RichEmbed()
                .setTitle("A message got highlighted!")
                .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
                .setDescription("Message by: " + reaction.message.author)
                .setURL(reaction.message.url)
                .setColor('RANDOM')
                .addField('Mintiest Message:\n', reaction.message.content, true)
                .addField('Channel', reaction.message.channel, true)
                .setFooter("Message ID: " + reaction.message.id)
                .setTimestamp();
            return client.channels.get('654447738070761505').send({
                embed: editmessage
            });
        }
        if (reaction.message.content === '') {
            const image = reaction.message.attachments.array()[0].url;
            const editmessage = new Discord.RichEmbed()
                .setTitle("A message got highlighted!")
                .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
                .setDescription("Message by: " + reaction.message.author)
                .setURL(reaction.message.url)
                .setColor('RANDOM')
                .addField('Channel', reaction.message.channel, true)
                .setFooter("Message ID: " + reaction.message.id)
                .setImage(image)
                .setTimestamp();
            return client.channels.get('654447738070761505').send({
                embed: editmessage
            });
        }
        const image = reaction.message.attachments.array()[0].url;
        const editmessage = new Discord.RichEmbed()
            .setTitle("A message got highlighted!")
            .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
            .setDescription("Message by: " + reaction.message.author)
            .setURL(reaction.message.url)
            .setColor('RANDOM')
            .addField('Mintiest Message:\n', reaction.message.content, true)
            .addField('Channel', reaction.message.channel, true)
            .setFooter("Message ID: " + reaction.message.id)
            .setImage(image)
            .setTimestamp();
        return client.channels.get('654447738070761505').send({
            embed: editmessage
        });
    }
    //reaction roles
    if (reaction.message.channel.id === '645033708860211206') {
        if (!user) return;
        if (user.bot) return;
        if (!reaction.message.channel.guild) return;
        for (let n in emojiname) {
            if (reaction.emoji.name == emojiname[n]) {
                const role = reaction.message.guild.roles.find(r => r.name == rolename[n]);
                const guildMember = reaction.message.guild.members.get(user.id);
                let haverole = guildMember.roles.has(role.id);
                if (!haverole) {
                    guildMember.addRole(role).catch(console.error);
                    reaction.remove(user.id);
                    client.channels.get('645033708860211206').send(user + " Joined " + role)
                        .then(message => {
                            message.delete(5000)
                        });
                } else {
                    guildMember.removeRole(role).catch(console.error);
                    reaction.remove(user.id);
                    client.channels.get('645033708860211206').send(user + " Left " + role)
                        .then(message => {
                            message.delete(5000)
                        });
                }
            }
        }
    }
});
client.login(token);