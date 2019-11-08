const Discord = module.require('discord.js');
module.exports = {
	name: 'massdell',
	description: 'Mass dell a role',
	async execute(message) {
    if (message.member.hasPermission('KICK_MEMBERS')) {


        let array = await message.guild.members.map(m=>m);
        let args = message.content.slice(10);
        let role = message.guild.roles.find(r => r.name === args);
        console.log(args);
        if(!role) {
          return message.channel.send(`${args} does not exist!!!!!!!`);
        }
        message.channel.send(`Deleting ${role} for everyone. This may take a while.`);
        let str = "";
            for(let i of array) {
                    //str += await i.addRole(role).catch(console.error);
                    str += await i.removeRole(role).catch(console.error);
            }
            message.channel.send(`Done! deleted ${role}`);
            console.log("done");
        
            
    }
	},
};
