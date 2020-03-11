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
    SESSION_SECRET,
    CLIENT_SECRET,
    REDIRECT_URI
} = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const thankedRecently = new Set();
const streamedRecently = new Set();
const lovedRecently = new Set();
const borgRecently = new Set();
const spamRecently = new Set();
const congratulationsRecently = new Set();
const ln = require('nodejs-linenumber');
const {
    FeedEmitter
} = require("rss-emitter-ts");
const emitter = new FeedEmitter();
const oAuth = Discord.OAuth2Application;
// dotenv
require('dotenv').config();
// Dashboard package
const dashboard = require("./discord-bot-dashboard.js");
//
const htmlToText = require('html-to-text');
const getUsage = sql.prepare("SELECT * FROM usage WHERE command = ?");
const setUsage = sql.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    let usagecheck = getUsage.get(command.name);
    if (!usagecheck) {
        usagecheck = {
            command: command.name,
            number: `0`
        }
        setUsage.run(usagecheck);
    }
    client.commands.set(command.name, command);
}
client.once('ready', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has started, with ${client.users.size} users.\nI am in ${client.guilds.size} guilds:\n` + client.guilds.map(guild => guild.name + ' Users: ' + guild.memberCount + ' Owner: ' + guild.owner.user.username).join('\n') + '\n\n');
    //Level DB
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, warning INTEGER, muted INTEGER, translate INTEGER, stream INTEGER, notes TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
    //Guild Channel DB
    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildhub';").get();
    if (!table2['count(*)']) {
        sql.prepare("CREATE TABLE guildhub (guild TEXT PRIMARY KEY, generalChannel TEXT, highlightChannel TEXT, muteChannel TEXT, logsChannel TEXT, streamChannel TEXT, reactionChannel TEXT, streamHere TEXT, autoMod TEXT, prefix TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_guidhub_id ON guildhub (guild);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getGuild = sql.prepare("SELECT * FROM guildhub WHERE guild = ?");
    client.setGuild = sql.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
    //role DB
    const table3 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roles';").get();
    if (!table3['count(*)']) {
        sql.prepare("CREATE TABLE roles (guild TEXT, roles TEXT PRIMARY KEY);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_roles_id ON roles (roles);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getRoles = sql.prepare("SELECT * FROM roles WHERE guild = ?");
    client.setRoles = sql.prepare("INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);");
    //words DB
    const table5 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'words';").get();
    if (!table5['count(*)']) {
        sql.prepare("CREATE TABLE words (guild TEXT, words TEXT, wordguild TEXT PRIMARY KEY);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_wordguild_id ON words (wordguild);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getWords = sql.prepare("SELECT * FROM words WHERE guild = ?");
    client.setWords = sql.prepare("INSERT OR REPLACE INTO words (guild, words) VALUES (@guild, @words);");
    //levelup DB
    const table4 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'level';").get();
    if (!table4['count(*)']) {
        sql.prepare("CREATE TABLE level (guild TEXT PRIMARY KEY, lvl5 TEXT, lvl10 TEXT, lvl15 TEXT, lvl20 TEXT, lvl30 TEXT, lvl50 TEXT, lvl85 TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_level_id ON level (guild);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getLevel = sql.prepare("SELECT * FROM level WHERE guild = ?");
    client.setLevel = sql.prepare("INSERT OR REPLACE INTO level (guild, lvl5, lvl10, lvl15, lvl20, lvl30, lvl50, lvl85) VALUES (@guild, @lvl5, @lvl10, @lvl15, @lvl20, @lvl30, @lvl50, @lvl85);");
    //command usage DB
    const table9 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'usage';").get();
    if (!table9['count(*)']) {
        sql.prepare("CREATE TABLE usage (command TEXT PRIMARY KEY, number TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_usage_id ON usage (command);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getUsage = sql.prepare("SELECT * FROM usage WHERE command = ?");
    client.setUsage = sql.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");

    //change bot Status
    setInterval(() => {
        var RAN = [
            `https://artemisbot.eu`,
            `${client.guilds.size} servers`
        ];
        client.user.setActivity(RAN[~~(Math.random() * RAN.length)], {
            type: 'LISTENING'
        });
    }, 60000);
    //preload messages on reconnect
    const fetch2 = sql.prepare("SELECT * FROM guildhub").all();
    let array4 = [];
    for (const data of fetch2) {
        if (data.reactionChannel > 1) {
            array4.push(data.reactionChannel);
            if (client.channels.get(data.reactionChannel)) {
                client.channels.get(data.reactionChannel).fetchMessages();
            }
        }
    }
    const fetch3 = sql.prepare("SELECT * FROM guildhub").all();
    let array5 = [];
    for (const data of fetch3) {
        if (data.generalChannel > 1) {
            array5.push(data.generalChannel);
            if (client.channels.get(data.generalChannel)) {
                client.channels.get(data.generalChannel).fetchMessages();
            }
        }
    }
    dashboard.run(client, {
        port: 80,
        clientSecret: CLIENT_SECRET,
        redirectURI: REDIRECT_URI
    }, oAuth);
});
client.once('reconnecting', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has reconnected, with ${client.users.size} users.\nI am in ${client.guilds.size} guilds:\n` + client.guilds.map(guild => guild.name + ' Users: ' + guild.memberCount + ' Owner: ' + guild.owner.user.username).join('\n') + '\n\n');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});
client.on("guildMemberAdd", async (guildMember) => {
    //load shit
    let nowtime = new Date();
    const guildChannels = client.getGuild.get(guildMember.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var generalChannel1 = client.channels.get(guildChannels.generalChannel);
        if (!generalChannel1) {
            var generalChannel1 = '0';
        }
        var muteChannel1 = client.channels.get(guildChannels.muteChannel);
        if (!muteChannel1) {
            var muteChannel1 = '0';
        }
        var logsChannel1 = client.channels.get(guildChannels.logsChannel);
        if (!logsChannel1) {
            var logsChannel1 = '0';
        }
    } else {
        var generalChannel1 = '0';
        var muteChannel1 = '0';
        var logsChannel1 = '0';
    }
    if (guildMember.guild.id == '628978428019736619') {
        rolearray = ['674208095626592266', '674208167437139979', '674207678347608064', '674207950822440970'];
        for (let i of rolearray) {
            let role = guildMember.guild.roles.find(r => r.id === `${i}`);
            guildMember.addRole(role);
        }
    }
    //account age check
    let roleadd1 = guildMember.guild.roles.find(r => r.name === "~/Members");
    let roledel1 = guildMember.guild.roles.find(r => r.name === "Muted");
    let user = guildMember.user;
    let userscore2 = client.getScore.get(user.id, guildMember.guild.id);
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
            notes: 0
        };
        client.setScore.run(userscore2);
    } else {
        if (userscore2.muted == '1') {
            guildMember.addRole(roledel1);
            if (muteChannel1 == '0') {} else {
                return muteChannel1.send(user + ", You have been muted by our system due to breaking rules, trying to leave and rejoin will not work!");
            }
        }
    }
    var cdate = moment.utc(user.createdAt).format('YYYYMMDD');
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");
    //logs
    if (logsChannel1 == `0`) {} else {
        try {
            const embed = new Discord.RichEmbed()
                .setTitle(`User joined`)
                .setColor(`RANDOM`)
                .setDescription(guildMember.user)
                .addField(`This user has joined us.`, '\n' + guildMember.user.username + '\n' + guildMember.user.id + '\nAccount age: ' + ageA)
                .setTimestamp();
            logsChannel1.send({
                embed
            });
        } catch {
            let nowtime = new Date();
            console.log(nowtime + '\n' + guildMember.guild.id + ': index.js:' + ln());
        }
    }
    if (muteChannel1 == `0`) {} else {
        if (ageA[1] == "hours" || ageA[1] == "day" || ageA[1] == "days") {
            guildMember.addRole(roledel1);
            try {
                return muteChannel1.send(ageA + ' ' + guildMember.user + "\nYou have a rather new account so you have to verify!\nType your username(case sensitive) and attach 1337 to the end.\nExample: UtopicUnicorn1337");
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + guildMember.guild.id + ': index.js:' + ln());
            }
        }
    }
    //make nice image for welcoming
    guildMember.addRole(roleadd1).catch(error => {
        console.log(new Date() + '\n' + guildMember.guild.id + ': index.js:' + ln());
    });
    if (generalChannel1 == '0') {} else {
        try {
            var ReBeL = guildMember.user.username;
            var bel = ["\njust started brewing some minty tea!", "\nis using Arch BTW!", "\necho 'is here!'", "\nis sipping minty tea!", "\nuseradd -m -g users /bin/sh @"];
            var moon = bel[~~(Math.random() * bel.length)];
            moon = moon.replace('@', ReBeL)
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('./mintwelcome.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
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
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            const guildlogo = await Canvas.loadImage(guildMember.guild.iconURL);
            ctx.drawImage(guildlogo, 25, 25, 200, 200);
            const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
            await generalChannel1.send(attachment);
        } catch {
            let nowtime = new Date();
            console.log(nowtime + '\n' + guildMember.guild.id + ': index.js:' + ln());
        }
    }
});
client.on("guildMemberRemove", async (guildMember) => {
    //load shit
    const guildChannels = client.getGuild.get(guildMember.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var logsChannel1 = client.channels.get(guildChannels.logsChannel);
    } else {
        var logsChannel1 = '0';
    }
    if (logsChannel1 == '0') {} else {
        try {
            const embed = new Discord.RichEmbed()
                .setTitle(`User Left The Building`)
                .setColor(`RANDOM`)
                .setDescription(guildMember.user)
                .addField(`This user has left us.`, '\n' + guildMember.user.username + '\n' + guildMember.user.id)
                .setTimestamp();
            return logsChannel1.send({
                embed
            });
        } catch {
            let nowtime = new Date();
            console.log(nowtime + '\n' + guildMember.guild.id + ': index.js:' + ln());
        }
    }
});
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name + " Users: " + guild.memberCount + ' Owner: ' + guild.owner.user.username);
    newGuild1 = client.getGuild.get(guild.id);
    if (!newGuild1) {
        newGuild = client.getGuild.get(guild.id);
        if (!newGuild) {
            if (!guild.roles.find(r => r.name === `Muted`)) {
                guild.createRole({
                    name: `Muted`
                });
            }
            if (!guild.roles.find(r => r.name === `~/Members`)) {
                guild.createRole({
                    name: `~/Members`
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
                prefix: `!`
            };
            client.setGuild.run(newGuild);
        }
    }
});
client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name + " Users: " + guild.memberCount + ' Owner: ' + guild.owner.user.username);
    sql.prepare(`DELETE FROM guildhub WHERE guild = ${guild.id}`).run();
});
client.on("guildMemberUpdate", (oldMember, newMember) => {
    const guildChannels = client.getGuild.get(oldMember.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var logsChannel1 = client.channels.get(guildChannels.logsChannel);
    } else {
        var logsChannel1 = '0';
    }
    if (logsChannel1 == '0') {} else {
        if (oldMember.nickname !== newMember.nickname) {
            if (!oldMember.nickname) {
                var oldname = 'Had no nickname!';
            } else {
                var oldname = oldMember.nickname;
            }
            if (!newMember.nickname) {
                var newname = 'No nickname set!';
            } else {
                var newname = newMember.nickname;
            }
            try {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Nickname changed!`)
                    .setColor(`RANDOM`)
                    .setDescription(oldMember.user)
                    .addField(`Name changed: `, '\n' + 'Old nickname: ' + oldname + '\n' + 'New nickname: ' + newname)
                    .setFooter(newMember.user.id)
                    .setTimestamp();
                return logsChannel1.send({
                    embed
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + newMember.guild.id + ': index.js:' + ln());
            }
        }
    }

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
            //load shit
            const guildChannels = client.getGuild.get(newMember.guild.id);
            if (guildChannels) {
                var thisguild = client.guilds.get(guildChannels.guild);
            }
            if (thisguild) {
                var streamChannel1 = client.channels.get(guildChannels.streamChannel);
                var streamNotif = guildChannels.streamHere;
            } else {
                var streamChannel1 = '0';
                var streamNotif = '0';
            }
            if (streamChannel1 == '0') {} else {
                if (!streamChannel1) return;
                //check if user wants notifications
                let user = newMember.user;
                let streamcheck = client.getScore.get(user.id, newMember.guild.id);
                if (!streamcheck) {
                    streamcheck = {
                        id: `${newMember.guild.id}-${newMember.user.id}`,
                        user: newMember.user.id,
                        guild: newMember.guild.id,
                        points: 0,
                        level: 1,
                        warning: 0,
                        muted: 0,
                        translate: 0,
                        stream: 0,
                        notes: 0
                    };
                }
                client.setScore.run(streamcheck);
                if (streamcheck.stream == `2`) {} else {
                    //no double posts
                    if (streamedRecently.has(newMember.user.id + newMember.guild.id)) {

                    } else {
                        streamedRecently.add(newMember.user.id + newMember.guild.id);
                        setTimeout(() => {
                            streamedRecently.delete(newMember.user.id + newMember.guild.id);
                        }, 7200000);
                        request('https://api.rawg.io/api/games?page_size=5&search=' + newMember.presence.game.state, {
                            json: true
                        }, function (err, res, body) {
                            if (streamNotif == '2') {
                                try {
                                    streamChannel1.send("@here");
                                    if (!body.results[0].background_image) {
                                        const embed = new Discord.RichEmbed()
                                            .setTitle(newMember.presence.game.state)
                                            .setColor(`RANDOM`)
                                            .setURL(newMember.presence.game.url)
                                            .setDescription(newMember.user + ' went live!')
                                            .addField(newMember.presence.game.details, '\n' + newMember.presence.game.url)
                                            .setTimestamp();
                                        return streamChannel1.send({
                                            embed
                                        });
                                    }
                                    const embed = new Discord.RichEmbed()
                                        .setTitle(newMember.presence.game.state)
                                        .setColor(`RANDOM`)
                                        .setURL(newMember.presence.game.url)
                                        .setThumbnail(`${body.results[0].background_image}`)
                                        .setDescription(newMember.user + ' went live!')
                                        .addField(newMember.presence.game.details, '\n' + newMember.presence.game.url)
                                        .setTimestamp();
                                    return streamChannel1.send({
                                        embed
                                    });
                                } catch {
                                    let nowtime = new Date();
                                    console.log(nowtime + '\n' + newMember.guild.id + ': index.js:' + ln());
                                }
                            } else {
                                if (!body.results[0].background_image) {
                                    try {
                                        const embed = new Discord.RichEmbed()
                                            .setTitle(newMember.presence.game.state)
                                            .setColor(`RANDOM`)
                                            .setURL(newMember.presence.game.url)
                                            .setDescription(newMember.user + ' went live!')
                                            .addField(newMember.presence.game.details, '\n' + newMember.presence.game.url)
                                            .setTimestamp();
                                        return streamChannel1.send({
                                            embed
                                        });
                                    } catch {
                                        let nowtime = new Date();
                                        console.log(nowtime + '\n' + newMember.guild.id + ': index.js:' + ln());
                                    }
                                }
                                try {
                                    const embed = new Discord.RichEmbed()
                                        .setTitle(newMember.presence.game.state)
                                        .setColor(`RANDOM`)
                                        .setURL(newMember.presence.game.url)
                                        .setThumbnail(`${body.results[0].background_image}`)
                                        .setDescription(newMember.user + ' went live!')
                                        .addField(newMember.presence.game.details, '\n' + newMember.presence.game.url)
                                        .setTimestamp();
                                    return streamChannel1.send({
                                        embed
                                    });
                                } catch {
                                    let nowtime = new Date();
                                    console.log(nowtime + '\n' + newMember.guild.id + ': index.js:' + ln());
                                }
                            }
                        });
                    }
                }
            }
        }
    }
    const guildChannels = client.getGuild.get(oldMember.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var logsChannel1 = client.channels.get(guildChannels.logsChannel);
    } else {
        var logsChannel1 = '0';
    }
    if (logsChannel1 == '0') {} else {
        if (oldMember.user.username !== newMember.user.username) {
            try {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Username changed!`)
                    .setColor(`RANDOM`)
                    .setDescription(oldMember.user)
                    .addField(`Name changed: `, '\n' + oldMember.user.username + '\n' + newMember.user.username)
                    .setFooter(newMember.user.id)
                    .setTimestamp();
                return logsChannel1.send({
                    embed
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + newMember.guild.id + ': index.js:' + ln());
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
    try {
        const redditmessage = new Discord.RichEmbed()
            .setTitle(item.title.substr(0, 100))
            .setURL(item.link)
            .setColor('RANDOM')
            .setDescription(reddittext3)
            .addField(item.link + '\n', 'https://www.reddit.com' + item.author, true)
            .setTimestamp();
        return client.channels.get('656194923107713024').send({
            embed: redditmessage
        });
    } catch {
        if (spamRecently.has('REDDIT')) {} else {
            spamRecently.add('REDDIT');
            setTimeout(() => {
                spamRecently.delete('REDDIT');
            }, 1000);
            let nowtime = new Date();
            console.log(nowtime + '\n' + ': index.js:' + ln());
        }
    }
});
emitter.on("feed:error", (error) => {
    //console.error(error.message)
});
//On edit execute command
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;
    const prefixstart = client.getGuild.get(newMessage.guild.id);
    const prefix = prefixstart.prefix;
    const commandName = newMessage.content.slice(prefix.length).toLowerCase().split(/ +/);
    const command = client.commands.get(commandName.shift());
    if (!newMessage.content.startsWith(prefix)) return;
    try {
        command.execute(newMessage);
    } catch (error) {
        let nowtime = new Date();
        console.log(nowtime + '\n' + newMessage.guild.id + ' ' + newMessage.guild.owner.user.username + ': index.js:' + ln());
    }
});
client.on('message', async message => {
    //ignore bots
    if (message.author.bot) return;
    //Direct Message handle
    if (message.channel.type == "dm") {
        console.log(new Date() + '\n' + message.author.username + '\n' + message.content);
        try {
            const whoartemis = new Discord.RichEmbed()
                .setTitle('Artemis')
                .setColor('RANDOM')
                .setDescription('Hello, I am Artemis!\nMy master is UtopicUnicorn#0383\n\nI am open-source: https://github.com/UtopicUnicorns/mint-bot\nMy main discord server is: https://discord.gg/EVVtPpw\nInvite me to your server: https://discordapp.com/api/oauth2/authorize?client_id=440892659264126997&permissions=2147483127&scope=bot\nReport bugs and issues on Github or the main server. I also have a website: https://artemisbot.eu/')
                .setTimestamp()
            return message.channel.send({
                embed: whoartemis
            });
        } catch {
            console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln())
        }
    }
    //load shit
    const guildChannels = client.getGuild.get(message.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var generalChannel1 = message.guild.channels.get(guildChannels.generalChannel);
        if (!generalChannel1) {
            var generalChannel1 = '0';
        }
        var muteChannel1 = message.guild.channels.get(guildChannels.muteChannel);
        if (!muteChannel1) {
            var muteChannel1 = '0';
        }
        var logsChannel1 = message.guild.channels.get(guildChannels.logsChannel);
        if (!logsChannel1) {
            var logsChannel1 = '0';
        }
    } else {
        var generalChannel1 = '0';
        var muteChannel1 = '0';
        var logsChannel1 = '0';
    }
    const prefixstart = client.getGuild.get(message.guild.id);
    const prefix = prefixstart.prefix;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    //levelupstuff
    newLevel = client.getLevel.get(message.guild.id);
    if (!newLevel) {
        newLevel = {
            guild: message.guild.id,
            lvl5: `0`,
            lvl10: `0`,
            lvl15: `0`,
            lvl20: `0`,
            lvl30: `0`,
            lvl50: `0`,
            lvl85: `0`
        };
        client.setLevel.run(newLevel);
    }
    //autoMod START
    if (message.member.hasPermission('KICK_MEMBERS')) {} else {
        if (guildChannels.autoMod == 'strict' || guildChannels.autoMod == '2') {
            //Word/sentence filter
            let allwords = sql.prepare("SELECT * FROM words WHERE guild = ?;").all(message.guild.id);
            let wargs = message.content.toLowerCase().split(" ");
            for (i in wargs) {
                for (const data of allwords) {
                    if (wargs.includes(data.words)) {
                        return message.delete();
                    }
                }
            }
            //No Spam
            if (spamRecently.has(message.author.id + message.guild.id)) {
                message.delete();
            } else {
                spamRecently.add(message.author.id + message.guild.id);
                setTimeout(() => {
                    spamRecently.delete(message.author.id + message.guild.id);
                }, 1000);
            }
            //No discord invites
            if (message.content.toLowerCase().includes('discord.gg/') || message.content.toLowerCase().includes('discordapp.com/invite/')) {
                message.delete();
            }
            //Anti-mention
            if (message.mentions.users.size > 3) {
                message.delete();
                if (muteChannel1 == '0') return message.channel.send("You have not set up a mute channel!");
                const member = message.author;
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(member, {
                        VIEW_CHANNEL: false,
                        READ_MESSAGES: false,
                        SEND_MESSAGES: false,
                        READ_MESSAGE_HISTORY: false,
                        ADD_REACTIONS: false
                    });
                })
                setTimeout(() => {
                    muteChannel1.overwritePermissions(member, {
                        VIEW_CHANNEL: true,
                        READ_MESSAGES: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ATTACH_FILES: false
                    })
                }, 2000);
                const user = message.mentions.users.first();
                let userscore = client.getScore.get(user.id, message.guild.id);
                if (!userscore) {
                    userscore = {
                        id: `${message.guild.id}-${user.id}`,
                        user: user.id,
                        guild: message.guild.id,
                        points: 0,
                        level: 1,
                        warning: 0,
                        muted: 1,
                        translate: 0,
                        stream: 0,
                        notes: 0
                    }
                }
                userscore.muted = `1`;
                client.setScore.run(userscore);
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
                message.member.removeRole(memberrole).catch(console.error);
                message.member.addRole(mutedrole).catch(console.error);
                muteChannel1.send(member + `\nYou have tagged more than 3 users in the same message, for our safety,\nyou have been muted!\nYou may mention ONE Mod OR Admin to change their mind and unmute you.\n\nGoodluck!`).catch(error =>
                    console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln())
                );

            }
        }
    }
    //AutoMod END
    //Mute filter
    if (muteChannel1 == '0') {} else {
        if (message.channel.id === muteChannel1.id) {
            if (message.content == message.author.username + "1337") {
                if (guildChannels.autoMod == 'strict') {
                    return message.reply("Our sincere apologies, Automod Strict is ON\nWhich means that people have to be manually approved!");
                } else {
                    let userscore1 = client.getScore.get(message.author.id, message.guild.id);
                    if (!userscore1) {

                    } else {
                        if (userscore1.muted == '1') return message.reply("You have been muted by our system due to breaking rules, the verification system is not for you!");
                    }
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
                    ctx.font = '30px Zelda';
                    ctx.shadowColor = "black";
                    ctx.shadowBlur = 5;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(message.author.username, canvas.width / 3.0, canvas.height / 2.0);
                    const avatar = await Canvas.loadImage(message.author.displayAvatarURL);
                    ctx.drawImage(avatar, 600, 25, 50, 50);
                    ctx.beginPath();
                    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    const guildlogo = await Canvas.loadImage(message.guild.iconURL);
                    ctx.drawImage(guildlogo, 25, 25, 200, 200);
                    ctx.font = '21px sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
                    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
                    await generalChannel1.send(attachment).catch(error =>
                        console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln())
                    );
                    return message.channel.send(`${member} has been approved.`);
                }
            }
        }
    }
    //EVENT
    if (message.guild.id == '628978428019736619') {
        let eventnumber = 25;
        let eventnumber2 = Math.floor(Math.random() * 50);
        if (eventnumber2 == eventnumber) {
            let eventcheck = message.member.roles.find(r => r.name === `512Mb`);
            if (!eventcheck) {
                let eventr = message.guild.roles.find(r => r.name === `512Mb`);
                if (!eventr) return;
                message.member.addRole(eventr);
                const eventembed = new Discord.RichEmbed()
                    .setTitle('EVENT')
                    .setColor('RANDOM')
                    .setDescription(message.author + '\n earned the event title:\n512Mb\nCongratulations!')
                    .setTimestamp()
                client.channels.get(`628984660298563584`).send({
                    embed: eventembed
                });
            }
        }
    }
    //ping
    if (message.content === prefix + "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
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
                fs.writeFile('channelset.txt', cargs, function (err) {
                    if (err) throw err;
                });
                return message.channel.send('Set channel id to: ' + client.channels.get(`${cargs}`));
            }
            let channelcheck = fs.readFileSync('channelset.txt').toString().split("\n");
            if (!client.channels.get(`${channelcheck}`)) {
                return message.channel.send("Enter a valid channel ID first!\n!set ChannelID");
            }
            try {
                client.channels.get(`${channelcheck}`).send(message.content);
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln());
            }
            return;
        }
    }
    //Simulate guild member join
    if (message.content === prefix + 'guildmemberadd') {
        if (message.author.id === "127708549118689280" || message.author.id == message.guild.owner.id) {
            client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
        }
    }
    //Simulate guild member leave
    if (message.content === prefix + 'guildmemberremove') {
        if (message.author.id === "127708549118689280" || message.author.id == message.guild.owner.id) {
            client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
        }
    }
    //translate
    //Start db for opt
    translateopt = client.getScore.get(message.author.id, message.guild.id);
    if (!translateopt) {
        translateopt = {
            id: `${message.guild.id}-${message.author.id}`,
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1,
            warning: 0,
            muted: 0,
            translate: 0,
            stream: 0,
            notes: 0
        };
    }
    client.setScore.run(translateopt);
    //check opt
    if (translateopt.translate == `2` || message.content.startsWith(prefix + "tr")) {
        //commence translate if opt
        let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
        let key = yandex;
        if (message.content.startsWith(prefix + "tr")) {
            var text = message.content.slice(4);
        } else {
            var text = message.content;
        }
        let url = baseurl + "?key=" + key + "&hint=en,de,nl,fr,tr&lang=en" + "&text=" + encodeURIComponent(text) + "&format=plain";
        request(url, {
            json: true
        }, (err, res, body) => {
            if (!body.text) {
                return
            }
            if (message.content.startsWith(prefix + "tr")) {} else {
                if (JSON.stringify(body).startsWith('{"code":200,"lang":"en-en"')) {
                    return;
                }
            }
            translate(text, {
                to: 'en'
            }).then(res => {
                if (message.content.includes("ツ")) return;
                if (res == message.content) return;
                try {
                    const translationtext = new Discord.RichEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor('RANDOM')
                        .setDescription(res)
                        .setFooter('Translated from: ' + body.lang)
                        .setTimestamp()
                    message.channel.send({
                        embed: translationtext
                    });
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln());
                }
            }).catch(err => {
                console.error(err);
            });
            if (err) return message.channel.send(err);
        });
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
                level: 1,
                warning: 0,
                muted: 0,
                translate: 0,
                stream: 0,
                notes: 0
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
    const levelups = client.getLevel.get(message.guild.id);
    let levelers = [levelups.lvl5, levelups.lvl10, levelups.lvl15, levelups.lvl20, levelups.lvl30, levelups.lvl50, levelups.lvl85];
    let levelerstxt = ["5", "10", "15", "20", "30", "50", "85", "1000"];
    let count = -1;
    for (let i of levelers) {
        count++
        if (score.level >= levelerstxt[count] && score.level < levelerstxt[count + 1]) {
            const level = message.guild.roles.find(r => r.id === i);
            if (level) {
                let checking = message.member.roles.find(r => r.id === i);
                if (!checking) {
                    let remove = [levelups.lvl5, levelups.lvl10, levelups.lvl15, levelups.lvl20, levelups.lvl30, levelups.lvl50, levelups.lvl85];
                    for (let n of remove) {
                        const level2 = message.guild.roles.find(r => r.id === n);
                        if (level2) {
                            if (message.member.roles.find(r => r.id === n)) {
                                message.member.removeRole(level2).catch(error => {
                                    console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln());
                                });
                            }
                        }
                    }
                    message.member.addRole(level).catch(error => {
                        console.log(new Date() + '\n' + message.guild.id + ' ' + message.guild.owner.user.username + ': index.js:' + ln());
                    });
                    const embed = new Discord.RichEmbed()
                        .setTitle('Level Role get!')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor('RANDOM')
                        .addField('Gained the title: ', level, true)
                        .setTimestamp();
                    message.channel.send(embed);
                }
            }
        }
    }
    //console.log(message.member.roles.map(role => role.id));
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
    //love
    if (message.content.toLowerCase().includes("love")) {
        const user = message.mentions.users.first() || client.users.get(args[0]);
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
            let userscore = client.getScore.get(user.id, message.guild.id);
            if (!userscore) return message.reply("This user does not have a database index yet.");
            userscore.points += pointsToAdd;
            let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
            userscore.level = userLevel;
            client.setScore.run(userscore);
            return message.reply("Gave love to " + user.username + "\n" + user.username + " gets 20 points!");
        }
    }
    //Congratulations
    if (message.content.toLowerCase().includes("congrat")) {
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if (!user) return;
        if (user == message.author) return;
        if (congratulationsRecently.has(message.author.id)) {
            return
        } else {
            congratulationsRecently.add(message.author.id);
            setTimeout(() => {
                congratulationsRecently.delete(message.author.id);
            }, 600000);
            const pointsToAdd = parseInt(20, 10);
            let userscore = client.getScore.get(user.id, message.guild.id);
            if (!userscore) return message.reply("This user does not have a database index yet.");
            userscore.points += pointsToAdd;
            let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
            userscore.level = userLevel;
            client.setScore.run(userscore);
            return message.reply("Congratulated " + user.username + "\n" + user.username + " gets 20 points!");
        }
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
    //require prefix
    if (!message.content.startsWith(prefix)) return;
    try {
        command.execute(message);
    } catch (error) {
        //console.error(error);
    }
});
client.on("messageReactionAdd", async (reaction, user) => {
    //load shit
    const guildChannels = client.getGuild.get(reaction.message.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var logsChannel1 = client.channels.get(guildChannels.logsChannel);
        var highlightChannel1 = client.channels.get(guildChannels.highlightChannel);
        var reactionChannel1 = client.channels.get(guildChannels.reactionChannel);
    } else {
        var logsChannel1 = '0';
        var highlightChannel1 = '0';
        var reactionChannel1 = '0';
    }
    if (!logsChannel1 == '0') {
        //report
        let limit1 = 1;
        if (reaction.emoji.name == '❌' && reaction.count == limit1) {
            if (reaction.message.author.id == '440892659264126997') return;
            if (reaction.users.first() == reaction.message.author) return reaction.remove(reaction.message.author.id);
            if (!reaction.message.attachments.size > 0) {
                try {
                    logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
                    const editmessage = new Discord.RichEmbed()
                        .setTitle("A message got reported!")
                        .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                        .setDescription("Message by: " + reaction.message.author)
                        .setURL(reaction.message.url)
                        .setColor('RANDOM')
                        .addField('Reported Message:\n', reaction.message.content, true)
                        .addField('Channel', reaction.message.channel, true)
                        .addField('Reported by: ', reaction.users.first())
                        .setFooter("Message ID: " + reaction.message.id)
                        .setTimestamp();
                    return logsChannel1.send({
                        embed: editmessage
                    });
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
                }
            }
            if (reaction.message.content === '') {
                try {
                    logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
                    const image = reaction.message.attachments.array()[0].url;
                    const editmessage = new Discord.RichEmbed()
                        .setTitle("A message got reported!")
                        .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                        .setDescription("Message by: " + reaction.message.author)
                        .setURL(reaction.message.url)
                        .setColor('RANDOM')
                        .addField('Channel', reaction.message.channel, true)
                        .addField('Reported by: ', reaction.users.first())
                        .setFooter("Message ID: " + reaction.message.id)
                        .setImage(image)
                        .setTimestamp();
                    return logsChannel1.send({
                        embed: editmessage
                    });
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
                }
            }
            try {
                logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
                const image = reaction.message.attachments.array()[0].url;
                const editmessage = new Discord.RichEmbed()
                    .setTitle("A message got reported!")
                    .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                    .setDescription("Message by: " + reaction.message.author)
                    .setURL(reaction.message.url)
                    .setColor('RANDOM')
                    .addField('Reported Message:\n', reaction.message.content, true)
                    .addField('Reported by: ', reaction.users.first())
                    .addField('Channel', reaction.message.channel, true)
                    .setFooter("Message ID: " + reaction.message.id)
                    .setImage(image)
                    .setTimestamp();
                return logsChannel1.send({
                    embed: editmessage
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
            }
        }
        //reportdelete
        let limit2 = 3;
        if (reaction.emoji.name == '❌' && reaction.count == limit2) {
            try {
                logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
                if (reaction.message.author.id == '440892659264126997') return;
                if (reaction.message.author.id == '127708549118689280') return;
                if (reaction.users.first() == reaction.message.author) return reaction.remove(reaction.message.author.id);
                reaction.message.delete();
                if (reaction.message.content === '') return;
                const editmessage = new Discord.RichEmbed()
                    .setTitle("A message that was reported got deleted!")
                    .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                    .setDescription("Message by: " + reaction.message.author)
                    .setColor('RANDOM')
                    .addField('Reported Message:\n', reaction.message.content, true)
                    .addField('Deleted by: ', reaction.users.last())
                    .addField('Channel', reaction.message.channel, true)
                    .setFooter("Message ID: " + reaction.message.id)
                    .setTimestamp();
                return logsChannel1.send({
                    embed: editmessage
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
            }
        }
    }
    //Highlights
    let limit = 3;
    if (reaction.emoji.name == '🍵' && reaction.count == limit) {
        if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
        if (reaction.message.author.id == '440892659264126997') return;
        if (!reaction.message.attachments.size > 0) {
            try {
                const editmessage = new Discord.RichEmbed()
                    .setTitle("A message got highlighted!")
                    .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                    .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
                    .setDescription("Message by: " + reaction.message.author)
                    .setURL(reaction.message.url)
                    .setColor('RANDOM')
                    .addField('Mintiest Message:\n', reaction.message.content, true)
                    .addField('Channel', reaction.message.channel, true)
                    .setFooter("Message ID: " + reaction.message.id)
                    .setTimestamp();
                return highlightChannel1.send({
                    embed: editmessage
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
            }
        }
        if (reaction.message.content === '') {
            if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
            try {
                const image = reaction.message.attachments.array()[0].url;
                const editmessage = new Discord.RichEmbed()
                    .setTitle("A message got highlighted!")
                    .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                    .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
                    .setDescription("Message by: " + reaction.message.author)
                    .setURL(reaction.message.url)
                    .setColor('RANDOM')
                    .addField('Channel', reaction.message.channel, true)
                    .setFooter("Message ID: " + reaction.message.id)
                    .setImage(image)
                    .setTimestamp();
                return highlightChannel1.send({
                    embed: editmessage
                });
            } catch {
                let nowtime = new Date();
                console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
            }
        }
        if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
        try {
            const image = reaction.message.attachments.array()[0].url;
            const editmessage = new Discord.RichEmbed()
                .setTitle("A message got highlighted!")
                .setAuthor(reaction.message.author.username, reaction.message.author.avatarURL)
                .setThumbnail(`https://raw.githubusercontent.com/UtopicUnicorns/mint-bot/master/tea.png`)
                .setDescription("Message by: " + reaction.message.author)
                .setURL(reaction.message.url)
                .setColor('RANDOM')
                .addField('Mintiest Message:\n', reaction.message.content, true)
                .addField('Channel', reaction.message.channel, true)
                .setFooter("Message ID: " + reaction.message.id)
                .setImage(image)
                .setTimestamp();
            return highlightChannel1.send({
                embed: editmessage
            });
        } catch {
            let nowtime = new Date();
            console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
        }
    }
    //reaction roles
    if (!reactionChannel1 == '0') {
        if (reaction.message.channel.id === reactionChannel1.id) {
            if (!user) return;
            if (user.bot) return;
            if (!reaction.message.channel.guild) return;
            const allroles = sql.prepare("SELECT * FROM roles WHERE guild = ?;").all(reaction.message.guild.id);
            let array2 = [];
            for (const data of allroles) {
                try {
                    array2.push(reaction.message.guild.roles.find(r => r.id == data.roles).name);
                } catch {
                    let nowtime = new Date();
                    console.log(nowtime + '\n' + reaction.message.guild.id + ': index.js:' + ln());
                }
            }
            for (let n in array2) {
                if (reaction.emoji.name == array2[n]) {
                    const role = reaction.message.guild.roles.find(r => r.name == array2[n]);
                    const guildMember = reaction.message.guild.members.get(user.id);
                    let haverole = guildMember.roles.has(role.id);
                    if (!haverole) {
                        guildMember.addRole(role).catch(console.error);
                        reaction.remove(user.id);
                        const embed = new Discord.RichEmbed()
                            .setAuthor(user.username, user.avatarURL)
                            .setColor('RANDOM')
                            .addField('Joined: ', role, true)
                            .setTimestamp();
                        client.channels.get(reactionChannel1.id).send(embed)
                            .then(message => {
                                message.delete(5000)
                            });
                    } else {
                        guildMember.removeRole(role).catch(console.error);
                        reaction.remove(user.id);
                        const embed = new Discord.RichEmbed()
                            .setAuthor(user.username, user.avatarURL)
                            .setColor('RANDOM')
                            .addField('Left: ', role, true)
                            .setTimestamp();
                        client.channels.get(reactionChannel1.id).send(embed)
                            .then(message => {
                                message.delete(5000)
                            });
                    }
                }
            }
        }
    }
});
client.on("error", (e) => {});
client.on("warn", (e) => {});
client.on("debug", (e) => {});
client.login(token);