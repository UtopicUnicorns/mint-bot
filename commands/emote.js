module.exports = {
	name: 'emote',
	description: 'hidden',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            
            let args = message.content.slice().split(' ');
       let emoji = message.guild.emojis.find(emoji => emoji.name === `${args[2]}`);

       if (!message.guild.emojis.find(emoji => emoji.name === `${args[2]}`)) {
           message.delete();
            message.channel.send("Enter a valid custom emote!")
            .then(message => {
             message.delete(5000);
            });
            return
       }
    message.channel.fetchMessage(args[1])
    .then(message => 
	message.react(emoji)).catch(err => {
        //console.error(err);
        message.channel.send("Wrong message ID, \nor you are using this command in the wrong channel.")
        .then(message => {
            message.delete(5000);
        })
    });

         }
         message.delete();
        },	
    };
