module.exports = {
	name: 'rank',
	description: 'Set your rank!',
	execute(message) {

              // client.on("message"), (message) => {
                if(message.content === "!rank debian") {
                message.channel.send("> Left Debian!");
                let role = message.guild.roles.find(r => r.name === "Debian");
                let member = message.member;
                if(message.member.roles.find(r => r.name === "Debian") {
                member.removeRole(role).catch(console.error);
                }
                else {
                message.channel.send("> Joined Debian!");
                member.addRole(role).catch(console.error);
                }
                }

                if(message.content === "!rank new") {
                message.channel.send("> Joined/Left New!");
                let role = message.guild.roles.find(r => r.name === "New");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank mint") {
                message.channel.send("> Joined/Left Mint!");
                let role = message.guild.roles.find(r => r.name === "Mint");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank arch") {
                message.channel.send("> Joined/Left Arch!");
                let role = message.guild.roles.find(r => r.name === "Arch");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank manjaro") {
                message.channel.send("> Joined/Left Manjaro!");
                let role = message.guild.roles.find(r => r.name === "Manjaro");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank ubuntu") {
                message.channel.send("> Joined/Left Ubuntu!");
                let role = message.guild.roles.find(r => r.name === "Ubuntu");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank opensuse") {
                message.channel.send("> Joined/Left OpenSUSE!");
                let role = message.guild.roles.find(r => r.name === "OpenSUSE");
                let member = message.member;
                member.addRole(role).catch(console.error);
                member.removeRole(role).catch(console.error);
                }
                if(message.content === "!rank") {
                message.channel.send("Ranks to join:\n*Case sensitive*\n >>> debian\nmint\narch\nmanjaro\nubuntu\nopensuse\nnew");
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
