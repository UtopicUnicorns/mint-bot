module.exports = {
	name: 'role',
	description: 'Display amount of users in different distributions.',
	execute(message) {

              // client.on("message"), (message) => {
                if(message.content === "!role debian") {
                message.channel.send("> Joined/Left Debian!");
                let role = message.guild.roles.find(r => r.name === "Debian");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role new") {
                message.channel.send("> Joined/Left New!");
                let role = message.guild.roles.find(r => r.name === "New");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role mint") {
                message.channel.send("> Joined/Left Mint!");
                let role = message.guild.roles.find(r => r.name === "Mint");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role arch") {
                message.channel.send("> Joined/Left Arch!");
                let role = message.guild.roles.find(r => r.name === "Arch");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role manjaro") {
                message.channel.send("> Joined/Left Manjaro!");
                let role = message.guild.roles.find(r => r.name === "Manjaro");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role ubuntu") {
                message.channel.send("> Joined/Left Ubuntu!");
                let role = message.guild.roles.find(r => r.name === "Ubuntu");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!role opensuse") {
                message.channel.send("> Joined/Left OpenSUSE!");
                let role = message.guild.roles.find(r => r.name === "OpenSUSE");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }

              //  }
             // let role = message.guild.roles.find(r => r.name === message);
         //  let role = message.guild.roles.find(r => r.name === "test", "New");

        // Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
      // let member = message.member;

        // or the person who made the command: let member = message.member;

        // Add the role!
       // member.addRole(role).catch(console.error);

        // Remove a role!
        //member.removeRole(role).catch(console.error);message.channel.send('Adjusted role Test');
      //  }



		
	},
};
