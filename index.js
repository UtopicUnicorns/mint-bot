const fs = require('fs')
const Discord = require('discord.js');
//
const request = require("request");
//
const Client = require('./client/Client');
const {
	prefix,
    token,
    yandex,
    dadjokes,
} = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');

const client = new Client();
client.commands = new Discord.Collection();

const queue = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

console.log(client.commands);

client.once('ready', () => {
	 console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
     //client.channels.get('628992550836895744').send("Oh no, I think I just crashed!");
     

     const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
     if (!table['count(*)']) {
       sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
       sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
       sql.pragma("synchronous = 1");
       sql.pragma("journal_mode = wal");
     }
   
     client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
     client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
   



function jokes() {
var joker = dadjokes;
var laugh = joker[Math.floor(Math.random() * joker.length)];
client.channels.get('628984660298563584').send(laugh);
}
setInterval(jokes, 43200000);




       function myFunc() {
        //client.channels.get('628984660298563584').send("test");
        var RAN = [
        `!help`, 
        `!rank`, 
        `!userinfo`,
        `!top`,
        `${client.users.size} total users`
        ]
        var DOM = RAN[Math.floor(Math.random() * RAN.length)];
        client.user.setActivity(DOM, { type: 'LISTENING'});

        }
        setInterval(myFunc, 10000);

});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
    //client.channels.get('628992550836895744').send("I had to reconnect!");
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

	client.on("guildMemberAdd", (guildMember) => {
        var ReBeL = guildMember.user.username;
        var bel = ["@ just started brewing some minty tea!", "Smells like debian in here, oh it's just @ !", "@ is using Arch BTW!", "Ubuntu: The lovechild of Debian and @!"]
        var moon = bel[Math.floor(Math.random() * bel.length)];
        moon = moon.replace('@', ReBeL)
		client.channels.get('628984660298563584').send(moon)
        guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Member"));
	  });




      client.on("presenceUpdate", (oldMember, newMember) => {

        console.log("something");
        if(oldMember.presence.game !== newMember.presence.game) {

           // let streamer = newMember.roles.find(r => r.name === `Streamer`);
           // if(streamer) {
            

            //console.log(newMember.presence.game);
            if(!newMember.presence.game) {
                return
            }
            if(!newMember.presence.game.url) {
                return
            }
            if(newMember.presence.game.url.includes("twitch")) {
                //elervated
                if(client.guilds.get('356642342184288258')) {
                 client.channels.get('356642342184288259').send(`@here` + " " + newMember.user.username + " just went live!" + "\n" + newMember.presence.game.name + "\n" + newMember.presence.game.url);
                }
                //mint
                if(client.guilds.get('628978428019736619')) {
                 client.channels.get('628992550836895744').send(` ` + " " + newMember.user.username + " just went live!" + "\n" + newMember.presence.game.name + "\n" + newMember.presence.game.url);
                }
                //utopic
                if(client.guilds.get('638687097880051723')) {
                  client.channels.get('638687098316128268').send(`@here` + " " + newMember.user.username + " just went live!" + "\n" + newMember.presence.game.name + "\n" + newMember.presence.game.url);
                }
            }
      //  }
    }


        if(oldMember.presence.status !== newMember.presence.status){
            //
            if(`${newMember.user.username}` === "UtopicUnicorn") {
                if(`${newMember.presence.status}` === "dnd") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "UtopicUnicorn") {
                if(`${newMember.presence.status}` === "dnd") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "Trap Connoisseur") {
                if(`${newMember.presence.status}` === "online") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "azadad96") {
                if(`${newMember.presence.status}` === "online") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "GardenData61371") {
                if(`${newMember.presence.status}` === "online") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "LCP") {
                if(`${newMember.presence.status}` === "online") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
            if(`${newMember.user.username}` === "LGBTQueen") {
                if(`${newMember.presence.status}` === "online") {
                client.channels.get('628984660298563584').setTopic(`${newMember.user.username} has enlightened us with their presence!`);
                }
            }
            //
        }
    });


client.on('message', async message => {




	const args = message.content.slice(1).split(/ +/);
	const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    
    if (message.author.bot) return;


    if (message.channel.type == "dm") {
        if(message.author.username === "UtopicUnicorn") {
        client.channels.get('628984660298563584').send(message.content);
        return;
      }
    }
    
    if(message.content.includes("Stop it artemis")) {
        if(message.author.username === "UtopicUnicorn") {
        message.channel.send(`THIS IS NOT A PHASE DAD, YOU DONT KNOW ME!`);
        }
    }

    HELLNO = ['uwu', 'UWU', 'OWO', 'UwU', 'OwO'];
    if(HELLNO.includes(message.content)) {
        if(message.author.username === "LGBTQueen") {
            client.channels.get('628984660298563584').setTopic(`LGB UwU'd again`);
        //message.channel.send(`Please don't`);
        }
    }

    if(message.content.includes("Why artemis")) {
        if(message.author.username === "UtopicUnicorn") {
        message.channel.send(`THIS IS THE REAL ME!`);
        }
    }

    if(message.content.includes("Arch")) {
        let archemote = client.emojis.find(emoji => emoji.name === "arch");
        message.channel.send(`I am using Arch BTW! ${archemote}`);
    }

    if(message.content.includes("Fedora")) {
        message.channel.send("M'Linux");
    }

    if(message.content.includes("Artemis")) {
        message.react("👀");
    }


    //
        let baseurl = "https://translate.yandex.net/api/v1.5/tr.json/translate";
        let key = yandex;
        let text = message.content;
        let url = baseurl + "?key=" + key + "&hint=en,de,nl,fr,tr&lang=en" + "&text=" + encodeURIComponent(text) + "&format=plain";
        request(url, { json: true }, (err, res, body) => {
            //console.log(JSON.stringify(body.text));
            if(!body.text) {
                return
            }
            if(JSON.stringify(body).startsWith('{"code":200,"lang":"en-en"')) {
                return //console.log("Omit");
            }
            if (err) return message.channel.send(err);
            message.channel.send(body.text);
            //console.log(body.text);
        });
    //

    if (message.author.bot) return;
    if(message.content.startsWith("^")) {
        message.channel.send("I agree!");
    }


    if(message.content.startsWith("!uptime")) {
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.ceil(totalSeconds % 60);
		message.reply(`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`);
    }


    let score;
  if (message.guild) {
    score = client.getScore.get(message.author.id, message.guild.id);
    if (!score) {
      score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
    }
    score.points++;
    const curLevel = Math.floor(0.5 * Math.sqrt(score.points));
    if(score.level < curLevel) {
      score.level++;
      message.react("⬆");
      //message.reply(`You are now level **${curLevel}**!`);
    }
    client.setScore.run(score);
  }


  if(message.content.startsWith("!give")) {
    if(message.author.username == "UtopicUnicorn") {
        //return message.reply("Go Away");
    
  
    const user = message.mentions.users.first() || client.users.get(args[0]);
    if(!user) return message.reply("You must mention someone or give their ID!");
  
    const pointsToAdd = parseInt(args[1], 10);
    if(!pointsToAdd) return message.reply("You didn't tell me how many points to give...")
  
    let userscore = client.getScore.get(user.id, message.guild.id);
    if (!userscore) {
      userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
    }
    userscore.points += pointsToAdd;
  
    let userLevel = Math.floor(0.1 * Math.sqrt(score.points));
    userscore.level = userLevel;
  
    client.setScore.run(userscore);
  
    return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
  }
}
  

//5    
if(score.level > 4 && score.level < 9) {
    let checking2 = message.member.roles.find(r => r.name === `Minty Messenger`);
    if(checking2) {
        
    }
    else {
let freshnew = message.guild.roles.find(r => r.name === `Minty Messenger`);
message.member.addRole(freshnew);
message.reply("You earned the title " + freshnew);
}}
//10
if(score.level > 9 && score.level < 14) {
let checking3 = message.member.roles.find(r => r.name === `Ruler of Messages`);
    if(checking3) {
        
    }
    else{
let freshnew = message.guild.roles.find(r => r.name === `Minty Messenger`);
let rulerofmessages = message.guild.roles.find(r => r.name === `Ruler of Messages`);
message.member.addRole(rulerofmessages);
message.member.removeRole(freshnew);
message.reply("You earned the title " + rulerofmessages);
}}
//15
if(score.level > 14 && score.level < 19) {
let checking4 = message.member.roles.find(r => r.name === `Fresh Messenger`);
    if(checking4) {
        
    }
    else {
let freshmessenger = message.guild.roles.find(r => r.name === `Fresh Messenger`);
let rulerofmessages = message.guild.roles.find(r => r.name === `Ruler of Messages`);
message.member.addRole(freshmessenger);
message.member.removeRole(rulerofmessages);
message.reply("You earned the title " + freshmessenger);
}}
//20
if(score.level > 19 && score.level < 29) {
let checking5 = message.member.roles.find(r => r.name === `Red Hot Keyboard Warrior`);
    if(checking5) {
        
    }
    else {
let freshmessenger = message.guild.roles.find(r => r.name === `Fresh Messenger`);
let rhkw = message.guild.roles.find(r => r.name === `Red Hot Keyboard Warrior`);
message.member.addRole(rhkw);
message.member.removeRole(freshmessenger);
message.reply("You earned the title " + rhkw);
}}
//30
if(score.level > 29 && score.level < 49) {
let checking6 = message.member.roles.find(r => r.name === `Basically a Cheater`);
    if(checking6) {
        
    }
    else{
let rhkw = message.guild.roles.find(r => r.name === `Red Hot Keyboard Warrior`);
let bac = message.guild.roles.find(r => r.name === `Basically a Cheater`);
message.member.addRole(bac);
message.member.removeRole(rhkw);
message.reply("You earned the title " + bac);
}}
//50
if(score.level > 49 && score.level < 99) {
let checking7 = message.member.roles.find(r => r.name === `Sage of Messages`);
    if(checking7) {
        
    }
    else {
let bac = message.guild.roles.find(r => r.name === `Basically a Cheater`);
let sageom = message.guild.roles.find(r => r.name === `Sage of Messages`);
message.member.addRole(sageom);
message.member.removeRole(bac);
message.reply("You earned the title " + sageom);
}}


  if(message.content.startsWith("!points")) {
    message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
        

}

if(message.content.startsWith("!top")) {
    const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

const embed = new Discord.RichEmbed()
.setTitle("Leaderboard")
.setAuthor(client.user.username, client.user.avatarURL)
.setDescription("Our top 10 points leaders!")
.setColor(0x00AE86);

for(const data of top10) {
embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
}
message.channel.send({embed});
}


    if (!message.content.startsWith(prefix)) return;




	try {
		command.execute(message);
	} catch (error) {
		//console.error(error);
	}




});

client.login(token);
