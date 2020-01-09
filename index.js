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
    linuxhints
} = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const thankedRecently = new Set();
const welcomeRecently = new Set();
const streamedRecently = new Set();
const queue = new Map();
const botInfo = JSON.parse(fs.readFileSync("botinfo.json", "utf8"));
const {
    FeedEmitter
} = require("rss-emitter-ts");
const emitter = new FeedEmitter();
const htmlToText = require('html-to-text');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.once('ready', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has started, with ${client.users.size} users.\n\n`);
    //Level DB
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, warning INTEGER, muted INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted) VALUES (@id, @user, @guild, @points, @level, @warning, @muted);");
    //Guild Channel DB
    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildhub';").get();
    if (!table2['count(*)']) {
        sql.prepare("CREATE TABLE guildhub (guild TEXT PRIMARY KEY, generalChannel TEXT, highlightChannel TEXT, muteChannel TEXT, logsChannel TEXT, streamChannel TEXT, reactionChannel TEXT);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_guidhub_id ON guildhub (guild);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getGuild = sql.prepare("SELECT * FROM guildhub WHERE guild = ?");
    client.setGuild = sql.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel);");
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
    //Linux tips, no longer dad jokes
    setInterval(() => {
        const linuxhint = new Discord.RichEmbed()
            .setTitle("Hint:")
            .setColor('RANDOM')
            .setDescription(linuxhints[~~(Math.random() * linuxhints.length)])
        client.channels.get('628984660298563584').send({
            embed: linuxhint
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
    const fetch2 = sql.prepare("SELECT * FROM guildhub").all();
    let array4 = [];
    for (const data of fetch2) {
        if (data.reactionChannel > 1) {
            array4.push(data.reactionChannel);
            client.channels.get(data.reactionChannel).fetchMessages();
        }
    }
});
client.once('reconnecting', () => {
    let nowtime = new Date();
    console.log(`${nowtime} \nBot has reconnected, with ${client.users.size} users.\n\n`);
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});
client.on("guildMemberAdd", async (guildMember) => {
    //load shit
    const guildChannels = client.getGuild.get(guildMember.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var generalChannel1 = client.channels.get(guildChannels.generalChannel);
        var muteChannel1 = client.channels.get(guildChannels.muteChannel);
    } else {
        var generalChannel1 = '0';
        var muteChannel1 = '0';
    }
    if (generalChannel1 == '0') return;
    if (muteChannel1 == '0') return;
    //account age check
    let roleadd1 = guildMember.guild.roles.find(r => r.name === "~/Members");
    let roledel1 = guildMember.guild.roles.find(r => r.name === "Muted");
    let user = guildMember.user;
    var cdate = moment.utc(user.createdAt).format('YYYYMMDD');
    let ageS = moment(cdate, "YYYYMMDD").fromNow(true);
    let ageA = ageS.split(" ");
    if (ageA[1] == "hours" || ageA[1] == "day" || ageA[1] == "days") {
        guildMember.addRole(roledel1);
        return muteChannel1.send(ageA + ' ' + guildMember.user + "\nYour account is younger than 30 days!\nTo prevent spammers and ban evaders we have temporarely muted you.\nWrite your own username with 1337 at the end to gain access.\nExample utopicunicorn1337");
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
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const guildlogo = await Canvas.loadImage(guildMember.guild.iconURL);
    ctx.drawImage(guildlogo, 25, 25, 200, 200);
    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    generalChannel1.send(attachment);
    guildMember.addRole(roleadd1);
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
    if (logsChannel1 == '0') return;
    logsChannel1.send(guildMember.user.username + ' left the server!');
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
            } else {
                var streamChannel1 = '0';
            }
            if (streamChannel1) {
                //no double posts
                if (streamedRecently.has(newMember.user.id + newMember.guild.id)) {

                } else {
                    streamedRecently.add(newMember.user.id + newMember.guild.id);
                    setTimeout(() => {
                        streamedRecently.delete(newMember.user.id + newMember.guild.id);
                    }, 6000);
                    request('https://api.rawg.io/api/games?page_size=5&search=' + newMember.presence.game.state, {
                        json: true
                    }, function (err, res, body) {
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
                    });
                }
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
        .setTitle(item.title.substr(0, 100))
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
    //load shit
    const guildChannels = client.getGuild.get(message.guild.id);
    if (guildChannels) {
        var thisguild = client.guilds.get(guildChannels.guild);
    }
    if (thisguild) {
        var generalChannel1 = message.guild.channels.get(guildChannels.generalChannel);
        var muteChannel1 = message.guild.channels.get(guildChannels.muteChannel);
        var logsChannel1 = message.guild.channels.get(guildChannels.logsChannel);
    } else {
        var generalChannel1 = '0';
        var muteChannel1 = '0';
        var logsChannel1 = '0';
    }
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    let prefix = fs.readFileSync('./set/prefix.txt').toString();
    //Reaction roles
    if (message.content.startsWith(prefix + "reaction")) {
        if (!message.channel.guild) return;
        message.channel.send("Available roles");
        const allroles2 = sql.prepare("SELECT * FROM roles WHERE guild = ?;").all(message.guild.id);
        let array3 = [];
        for (const data of allroles2) {
            array3.push(message.guild.roles.find(r => r.id == data.roles).name);
        }
        let channelstuff = client.channels.get(message.channel.id);
        channelstuff.fetchMessages({
                limit: 1
            }).then(messages => {
                for (let n in array3) {
                    if (n > 19) return;
                    var emoji3 = [message.guild.emojis.find(r => r.name == array3[n])];
                    for (let i in emoji3) {
                        let lastMessage = messages.first();
                        lastMessage.react(emoji3[i]);
                    }
                }
            })
            .catch(console.error);
    }
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
    //Artemis welcome
    newGuild1 = client.getGuild.get(message.guild.id);
    if (!newGuild1) {
        //Greet intervals
        if (welcomeRecently.has(message.guild.id)) {

        } else {
            //And add interval
            welcomeRecently.add(message.guild.id);
            setTimeout(() => {
                welcomeRecently.delete(message.guild.id);
            }, 1800000);
            //Hello I am Artemis!
            const hellothereguilde = new Discord.RichEmbed()
                .setTitle('Thanks for choosing Artemis')
                .setDescription(botInfo.version)
                .setURL('https://discord.gg/EVVtPpw')
                .setColor('RANDOM')
                .addField('Welcome new guild!\n', 'I see that you have not yet set me up properly.')
                .addField('Setting me up is rather simple.', 'just speak the words\n`setup auto`\nand I will do the work for you')
                .addField('You can choose to skip the setup process by speaking the words `setup skip` you can then manually set the channels with `!channelmanage`')
                .addField('What does the setup do you ask?', 'I will look for 4 channels:\ngeneral\nmute\nlogs\nhighlights\n\nIf these are not there I will create them for you.')
                .setFooter('Artemis is not perfect and is created by a noob called UtopicUnicorn#0383')
                .setTimestamp();
            message.channel.send({
                embed: hellothereguilde
            });
        }
    }
    //Welcome new guild?
    if (message.content.startsWith("setup")) {
        newGuild = client.getGuild.get(message.guild.id);
        if (!newGuild) {
            //Deny setup by any other than owner
            if (message.author.id !== message.guild.owner.id) {
                return message.channel.send("Only the server owner may set me up!");
            }
            //start setups
            if (message.content == "setup") {
                return message.channel.send("setup\nGeneralChannelID\nHighlightChannelID\nMuteChannelID\nLogsChannelID");
            }
            //skip setup setup channels to 0
            if (message.content == "setup skip") {
                newGuild = {
                    guild: message.guild.id,
                    generalChannel: `0`,
                    highlightChannel: `0`,
                    muteChannel: `0`,
                    logsChannel: `0`,
                    streamChannel: `0`,
                    reactionChannel: `0`
                };
                const hellothereguilders = new Discord.RichEmbed()
                    .setTitle('Setup skipped!')
                    .setDescription('No worries, you can manually setup your channels')
                    .setURL('https://discord.gg/EVVtPpw')
                    .setColor('RANDOM')
                    .addField('!channelmanage\n', 'This command allows you to manually set up your channels!')
                    .setFooter('Artemis has more commands, check them out with !help')
                    .setTimestamp();
                message.channel.send({
                    embed: hellothereguilders
                });
                return client.setGuild.run(newGuild);
            }
            //setup auto, create channels sets channels ID
            if (message.content == "setup auto") {
                if (!message.guild.roles.find(r => r.name === `Muted`)) {
                    message.guild.createRole({
                        name: `Muted`
                    });
                }
                if (!message.guild.roles.find(r => r.name === `~/Members`)) {
                    message.guild.createRole({
                        name: `~/Members`
                    });
                }
                if (!message.guild.channels.find(channel => channel.name === "general")) {
                    message.guild.createChannel("general", {
                        type: "text"
                    });
                }
                if (!message.guild.channels.find(channel => channel.name === "mute")) {
                    message.guild.createChannel("mute", {
                        type: "text"
                    });
                }
                if (!message.guild.channels.find(channel => channel.name === "logs")) {
                    message.guild.createChannel("logs", {
                        type: "text"
                    });
                }
                if (!message.guild.channels.find(channel => channel.name === "highlights")) {
                    message.guild.createChannel("highlights", {
                        type: "text"
                    });
                }
                setTimeout(() => {
                    let gcheck = message.guild.channels.find(channel => channel.name === "general").id;
                    let mcheck = message.guild.channels.find(channel => channel.name === "mute").id;
                    let lcheck = message.guild.channels.find(channel => channel.name === "logs").id;
                    let hcheck = message.guild.channels.find(channel => channel.name === "highlights").id;
                    newGuild = {
                        guild: message.guild.id,
                        generalChannel: gcheck,
                        highlightChannel: hcheck,
                        muteChannel: mcheck,
                        logsChannel: lcheck,
                        streamChannel: `0`,
                        reactionChannel: `0`
                    };
                    const hellothereguilder = new Discord.RichEmbed()
                        .setTitle('Channels have been set up!')
                        .setDescription('Here is a list of commands')
                        .setURL('https://discord.gg/EVVtPpw')
                        .setColor('RANDOM')
                        .addField('!join !leave\n', 'Are the main ways to join/leave a role')
                        .addField('!rolemanage', 'Is the command used to add/remove roles to the self assignable role list.')
                        .addField('!board !level', 'These commands hold the top chatter and extra info including warnings')
                        .setFooter('Artemis has more commands, check them out with !help')
                        .setTimestamp();
                    message.channel.send({
                        embed: hellothereguilder
                    });
                    return client.setGuild.run(newGuild);
                }, 5000);
            }
            //Manually setup all channels if present
            let newGuildArgs = message.content.slice().split('\n');
            if (!newGuildArgs[1]) return;
            if (!newGuildArgs[2]) return message.channel.send("Provide a highlightChannel ID!");
            if (!newGuildArgs[3]) return message.channel.send("Provide a muteChannel ID!");
            if (!newGuildArgs[4]) return message.channel.send("Provide a logsChannel ID!");
            newGuild = {
                guild: message.guild.id,
                generalChannel: newGuildArgs[1],
                highlightChannel: newGuildArgs[2],
                muteChannel: newGuildArgs[3],
                logsChannel: newGuildArgs[4],
                streamChannel: `0`,
                reactionChannel: `0`
            };
            const hellothereguilder = new Discord.RichEmbed()
                .setTitle('Channels have been set up!')
                .setDescription('Here is a list of commands')
                .setURL('https://discord.gg/EVVtPpw')
                .setColor('RANDOM')
                .addField('!join !leave\n', 'Are the main ways to join/leave a role')
                .addField('!rolemanage', 'Is the command used to add/remove roles to the self assignable role list.')
                .addField('!board !level', 'These commands hold the top chatter and extra info including warnings')
                .setFooter('Artemis has more commands, check them out with !help')
                .setTimestamp();
            message.channel.send({
                embed: hellothereguilder
            });
        }
        client.setGuild.run(newGuild);
    }
    //Anti-mention
    if (message.mentions.users.size > 3) {
        message.delete();
        if (muteChannel1 == '0') return message.channel.send("You have not set up a mute channel!");
        const member = message.author;
        message.guild.channels.forEach(async (channel, id) => {
            if (id == guildChannels.muteChannel) return;
            await channel.overwritePermissions(member, {
                VIEW_CHANNEL: false,
                READ_MESSAGES: false,
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false,
                ADD_REACTIONS: false
            });
        })
        let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
        let memberrole = message.guild.roles.find(r => r.name === `~/Members`);
        message.member.removeRole(memberrole).catch(console.error);
        message.member.addRole(mutedrole).catch(console.error);
        muteChannel1.send(member + `\nYou have tagged more than 3 users in the same message, for our safety,\nyou have been muted!\nYou may mention ONE Mod OR Admin to change their mind and unmute you.\n\nGoodluck!`);
    }
    //ignore bots
    if (message.author.bot) return;
    //Mute filter
    if (message.channel.id === muteChannel1.id) {
        if (muteChannel1 == '0') return message.channel.send("You have not set up a mute channel!");
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
            generalChannel1.send(attachment);
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
    //update
    if (message.content.startsWith(prefix + "update")) {
        if (message.author.id !== '127708549118689280') return;
        const logslist = sql.prepare("SELECT * FROM guildhub").all();
        const logschannels = []
        for (const data of logslist) {
            logschannels.push(data.logsChannel);
        }
        for (let i of logschannels) {
            if (client.channels.get(`${i}`)) {
                const updatetext = new Discord.RichEmbed()
                    .setTitle("Update")
                    .setDescription(message.author)
                    .setURL('https://discord.gg/EVVtPpw')
                    .setColor('RANDOM')
                    .addField('Update text:\n', message.content.slice(8))
                    .addField('Channel', message.channel, true)
                    .setFooter("Message ID: " + message.id)
                    .setTimestamp();
                client.channels.get(`${i}`).send({
                    embed: updatetext
                });
            }
        }
    }
    //Logs
    const commandusage = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandusage) {
        const commandlogger = require(`./commands/${file}`);
        if (message.content.startsWith(`${prefix}`)) {
            if (message.content.includes(`${prefix}` + commandlogger.name)) {
                if (commandlogger.description.includes(`[mod]`) || commandlogger.description.includes(`[admin]`)) {
                    if (logsChannel1 == '0') return message.channel.send("You have not set up a logs channel!");
                    if (message.member.hasPermission('KICK_MEMBERS')) {
                        const logsmessage = new Discord.RichEmbed()
                            .setTitle(commandlogger.name)
                            .setDescription("Used by: " + message.author)
                            .setURL(message.url)
                            .setColor('RANDOM')
                            .addField('Usage:\n', message.content, true)
                            .addField('Channel', message.channel, true)
                            .setFooter("Message ID: " + message.id)
                            .setTimestamp();
                        logsChannel1.send({
                            embed: logsmessage
                        });
                    }
                }
            }
        }
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
        if (!message.content.startsWith(prefix)) {
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
            client.channels.get(`${channelcheck}`).send(message.content);
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
    if (message.content === prefix + 'guildmemberadd') {
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
                level: 1,
                warning: 0,
                muted: 0
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
    const lvl5 = message.guild.roles.find(r => r.id === levelups.lvl5);
    const lvl10 = message.guild.roles.find(r => r.id === levelups.lvl10);
    const lvl15 = message.guild.roles.find(r => r.id === levelups.lvl15);
    const lvl20 = message.guild.roles.find(r => r.id === levelups.lvl20);
    const lvl30 = message.guild.roles.find(r => r.id === levelups.lvl30);
    const lvl50 = message.guild.roles.find(r => r.id === levelups.lvl50);
    const lvl85 = message.guild.roles.find(r => r.id === levelups.lvl85);
    //lvl5
    if (score.level > 4 && score.level < 9) {
        if (lvl5) {
            let checking = message.member.roles.find(r => r.name === lvl5.name);
            if (!checking) {
                message.member.addRole(lvl5);
                message.reply("You earned the title " + lvl5);
            }
        }
    }
    //lvl10
    if (score.level > 9 && score.level < 14) {
        if (lvl10) {
            let checking = message.member.roles.find(r => r.name === lvl10.name);
            if (!checking) {
                message.member.addRole(lvl10);
                message.member.removeRole(lvl5);
                message.reply("You earned the title " + lvl10);
            }
        }
    }
    //lvl15
    if (score.level > 14 && score.level < 19) {
        if (lvl15) {
            let checking = message.member.roles.find(r => r.name === lvl15.name);
            if (!checking) {
                message.member.addRole(lvl15);
                message.member.removeRole(lvl10);
                message.reply("You earned the title " + lvl15);
            }
        }
    }
    //lvl20
    if (score.level > 19 && score.level < 29) {
        if (lvl20) {
            let checking = message.member.roles.find(r => r.name === lvl20.name);
            if (!checking) {
                message.member.addRole(lvl20);
                message.member.removeRole(lvl15);
                message.reply("You earned the title " + lvl20);
            }
        }
    }
    //lvl30
    if (score.level > 29 && score.level < 49) {
        if (lvl30) {
            let checking = message.member.roles.find(r => r.name === lvl30.name);
            if (!checking) {
                message.member.addRole(lvl30);
                message.member.removeRole(lvl20);
                message.reply("You earned the title " + lvl30);
            }
        }
    }
    //lvl50
    if (score.level > 49 && score.level < 84) {
        if (lvl50) {
            let checking = message.member.roles.find(r => r.name === lvl50.name);
            if (!checking) {
                message.member.addRole(lvl50);
                message.member.removeRole(lvl30);
                message.reply("You earned the title " + lvl50);
            }
        }
    }
    //lvl85
    if (score.level > 84 && score.level < 99) {
        if (lvl85) {
            let checking = message.member.roles.find(r => r.name === lvl85.name);
            if (!checking) {
                message.member.addRole(lvl85);
                message.member.removeRole(lvl50);
                message.reply("You earned the title " + lvl85);
            }
        }
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
    if (logsChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
    //report
    let limit1 = 1;
    if (reaction.emoji.name == '❌' && reaction.count == limit1) {
        if (reaction.message.author.id == '440892659264126997') return;
        if (reaction.users.first() == reaction.message.author) return reaction.remove(reaction.message.author.id);
        if (!reaction.message.attachments.size > 0) {
            logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
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
            return logsChannel1.send({
                embed: editmessage
            });
        }
        if (reaction.message.content === '') {
            logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
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
            return logsChannel1.send({
                embed: editmessage
            });
        }
        logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
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
        return logsChannel1.send({
            embed: editmessage
        });
    }
    //reportdelete
    let limit2 = 3;
    if (reaction.emoji.name == '❌' && reaction.count == limit2) {
        logsChannel1.send('<@&628980538274873345> <@&628980016813703178>');
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
        return logsChannel1.send({
            embed: editmessage
        });
    }
    //Highlights
    let limit = 3;
    if (reaction.emoji.name == '🍵' && reaction.count == limit) {
        if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
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
            return highlightChannel1.send({
                embed: editmessage
            });
        }
        if (reaction.message.content === '') {
            if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
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
            return highlightChannel1.send({
                embed: editmessage
            });
        }
        if (highlightChannel1 == '0') return reaction.message.channel.send("You did not set up a logs channel!");
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
        return highlightChannel1.send({
            embed: editmessage
        });
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
                array2.push(reaction.message.guild.roles.find(r => r.id == data.roles).name);
            }
            for (let n in array2) {
                if (reaction.emoji.name == array2[n]) {
                    const role = reaction.message.guild.roles.find(r => r.name == array2[n]);
                    const guildMember = reaction.message.guild.members.get(user.id);
                    let haverole = guildMember.roles.has(role.id);
                    if (!haverole) {
                        guildMember.addRole(role).catch(console.error);
                        reaction.remove(user.id);
                        client.channels.get(reactionChannel1.id).send(user + " Joined " + role)
                            .then(message => {
                                message.delete(5000)
                            });
                    } else {
                        guildMember.removeRole(role).catch(console.error);
                        reaction.remove(user.id);
                        client.channels.get(reactionChannel1.id).send(user + " Left " + role)
                            .then(message => {
                                message.delete(5000)
                            });
                    }
                }
            }
        }
    }
});
client.login(token);
