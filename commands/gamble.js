const Discord = require('discord.js');
const db = require('better-sqlite3')('./scores.sqlite');
const talkedRecently = new Set();
module.exports = {
    name: 'gamble',
    description: '[fun] Lose those points!',
    execute(message) {
        const getScore = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        const setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
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
                        let userscore = getScore.get(user.id, message.guild.id);
                        if (userscore.points < pointsToAdd) return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        userscore.points += pointsToAdd;
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        setScore.run(userscore);
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
                        let userscore = getScore.get(user.id, message.guild.id);
                        userscore.points += pointsToAdd;
                        if (userscore.points < "0") return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        setScore.run(userscore);
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
                        let userscore = getScore.get(user.id, message.guild.id);
                        userscore.points += pointsToAdd;
                        if (userscore.points < "0") return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        setScore.run(userscore);
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
                        let userscore = getScore.get(user.id, message.guild.id);
                        if (userscore.points < pointsToAdd) return message.channel.send("Looks like you tried to bet more points than you actually have!");
                        userscore.points += pointsToAdd;
                        let userLevel = Math.floor(0.5 * Math.sqrt(userscore.points));
                        userscore.level = userLevel;
                        setScore.run(userscore);
                        message.channel.send(number2 + `\nYou won ${pointsToAdd} points!\nYou have ${userscore.points} points!`);
                    }
                }
            })
        }
    }
};