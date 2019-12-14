const Discord = require('discord.js');
const request = require("request");
module.exports = {
    name: 'test',
    description: '[admin] testing grounds',
    execute(message) {
        message.channel.send("owo");
    }
};