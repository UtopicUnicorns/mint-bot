const Discord = require('discord.js');
const request = require("request");
module.exports = {
    name: 'test2',
    description: '[admin] testing grounds2',
    execute(message) {
       message.channel.send("Test");
    }
};