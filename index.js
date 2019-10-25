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
     client.channels.get('628992550836895744').send("Oh no, I think I just crashed!");
     

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
var joker = [
 "What time did the man go to the dentist? Tooth hurt-y",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Want to hear a joke about a piece of paper? Never mind... it's tearable.",
  "I just watched a documentary about beavers. It was the best dam show I ever saw!",
  "If you see a robbery at an Apple Store does that make you an iWitness?",
  "Spring is here! I got so excited I wet my plants!",
  "A ham sandwich walks into a bar and orders a beer. The bartender says, \"Sorry we don’t serve food here.\"",
  "What’s Forrest Gump’s password? 1forrest1",
  "I bought some shoes from a drug dealer. I don't know what he laced them with, but I was tripping all day!",
  "Why do chicken coops only have two doors? Because if they had four, they would be chicken sedans!",
  "What do you call a factory that sells passable products? A satisfactory.",
  "A termite walks into a bar and asks, \"Is the bar tender here?\"",
  "When a dad drives past a graveyard: Did you know that's a popular cemetery? Yep, people are just dying to get in there!",
  "Two peanuts were walking down the street. One was a salted.",
  "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
  "I used to have a job at a calendar factory but I got the sack because I took a couple of days off.",
  "How do you make holy water? You boil the hell out of it.",
  "A three-legged dog walks into a bar and says to the bartender, \"I’m looking for the man who shot my paw.\"",
  "When you ask a dad if he's alright: \"No, I’m half left.\"",
  "I had a dream that I was a muffler last night. I woke up exhausted!",
  "How do you tell the difference between a frog and a horny toad? A frog says, \"Ribbit, ribbit\" and a horny toad says, \"Rub it, rub it.\"",
  "Did you hear the news? FedEx and UPS are merging. They’re going to go by the name Fed-Up from now on.",
  "5/4 of people admit that they’re bad with fractions.",
  "MOM: \"How do I look?\" DAD: \"With your eyes.\"",
  "What is Beethoven’s favorite fruit? A ba-na-na-na.",
  "What did the horse say after it tripped? \"Help! I’ve fallen and I can’t giddyup!\”",
  "Did you hear about the circus fire? It was in tents!",
  "Don't trust atoms. They make up everything!",
  "What do you get when you cross an elephant with a rhino? Elephino.",
  "How many tickles does it take to make an octopus laugh? Ten-tickles.",
  "What's the best part about living in Switzerland? I don't know, but the flag is a big plus.",
  "What do prisoners use to call each other? Cell phones.",
  "Why couldn't the bike standup by itself? It was two tired.",
  "What do you call a dog that can do magic? A Labracadabrador.",
  "Why didn't the vampire attack Taylor Swift? She had bad blood.",
  "NURSE: \"Blood type?\" DAD: \"Red.\"",
  "SERVER: \"Sorry about your wait.\" DAD: \"Are you saying I’m fat?\”",
  "What do you call a fish with two knees? A “two-knee” fish.",
  "I was interrogated over the theft of a cheese toastie. Man, they really grilled me.",
  "What do you get when you cross a snowman with a vampire? Frostbite.",
  "Can February March? No, but April May!",
  "When you ask a dad if they got a haircut: \"No, I got them all cut!\"",
  "What does a zombie vegetarian eat? “GRRRAAAAAIIIINNNNS!”",
  "What does an angry pepper do? It gets jalapeño your face.",
  "Why wasn't the woman happy with the velcro she bought? It was a total ripoff.",
  "What did the buffalo say to his son when he dropped him off at school? Bison.",
  "What do you call someone with no body and no nose? Nobody knows.",
  "Where did the college-aged vampire like to shop? Forever 21.",
  "You heard of that new band 1023MB? They're good but they haven't got a gig yet.",
  "Why did the crab never share? Because he's shellfish."
]
var laugh = joker[Math.floor(Math.random() * joker.length)];
client.channels.get('628984660298563584').send(laugh);
}
setInterval(jokes, 43200000);




       function myFunc() {
        //client.channels.get('628984660298563584').send("test");
        var RAN = [
        "!help", 
        "!rank", 
        "!userinfo"
        ]
        var DOM = RAN[Math.floor(Math.random() * RAN.length)];
        client.user.setActivity(DOM, { type: 'LISTENING'});

        }
        setInterval(myFunc, 10000);

});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
    client.channels.get('628992550836895744').send("I had to reconnect!");
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
        if(oldMember.presence.status !== newMember.presence.status){
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
            if(`${newMember.user.username}` === "-phobos") {
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

    if(message.content.includes("uwu")) {
        if(message.author.username === "LGBTQueen") {
        message.channel.send(`Please don't`);
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
		let seconds = totalSeconds % 60;
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

  if(message.content.startsWith("!points")) {
    message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
            if(score.level > 4 && score.level < 9) {
                let checking2 = message.member.roles.find(r => r.name === `Fresh New Leaf`);
                if(checking2) {
                    return
                }
          let freshnew = message.guild.roles.find(r => r.name === `Fresh New Leaf`);
            message.member.addRole(freshnew);
            return message.channel.send("You earned the title **Fresh New Leaf**");
        }
        if(score.level > 9) {
            let checking3 = message.member.roles.find(r => r.name === `Ruler of Messages`);
                if(checking3) {
                    return
                }
            let freshnew = message.guild.roles.find(r => r.name === `Fresh New Leaf`);
            let rulerofmessages = message.guild.roles.find(r => r.name === `Ruler of Messages`);
            message.member.addRole(rulerofmessages);
            message.member.removeRole(freshnew);
            return message.channel.send("You earned the title **Ruler of Messages**");
        }


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
