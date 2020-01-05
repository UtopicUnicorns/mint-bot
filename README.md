# Documentation
*Mint-Bot is a multi-server Discord bot build by a noob called UtopicUnicorn.
The bot was created in response to Dyno-bot being down a lot.
[Main Discord Server](https://discord.gg/EVVtPpw)*

## Index
  - Instalation
  - Commands
  - 

### Installation
Clone or download the bot files
Download and Install node.js and NPM(usually comes in one package)
Download and install Python 2.7
Download and Install ffmpeg
```sh 
$ npm config set python python2.7
$ npm install discord.js fs canvas request node-opus simple-youtube-api ytdl-core node-ddg translate-google moment better-sqlite3 rss-emitter-ts curl html-to-text 
```
Change ./set/prefix.txt to
```
!
```

Change ./config.json
```json
{
    "token": "DISCORD_BOT_TOKEN",
    "yandex": "YANDEX_KEY",
    "youtubekey": "YOUTUBE_API_KEY",
    "dadjokes": [""]
}
```

Time to start the bot for the very first time
You can quit the bot with ctrl+c
```sh
while true; do node index.js; done
```

The database should have been setup now too.
The first time you speak in a server with the bot it will prompt you to type in your discord chat:
```
install auto
```
This will setup a few basic channels the bot needs to function properly.

### Commands
*A small rundown of how some commands work*

#### Admin Commands
- !add, [admin] Give a user points or take them 
*!add @mention XX
*You can also use !add @mention -XX* to substract points.*

- !channelmanage, [admin] Manage preset channels 
*!channelmanage mute/general/highlight/logs chanID/chanNAME
This will change the targetted channel's ID in the database*

- !massadd, [admin] Mass add a role 
*This will apply a role to every member in your server*

- !massdell, [admin] Mass dell a role 
*This will take away a role from every member in your server*

- !master, [admin] Download and insert scripts 
*My own command to quickly change the code in the bot.*

- !rolemanage, [admin] Manage self assignable roles 
*!rolemanage roleID
This will add or take away the role from the database, depending on if it was there already.
You can use !numbers to check if the role is in the database.*

- !restart, [admin] well restart the bot
*My own command again, to quickly restart the bot from a discord channel*

- !channel, [admin] Display sentient channelname
*As the description suggests already*

- !set, [admin] Set sentient channel ID
*Change the bots sentient channel with !set chanID*

- !join, [admin] simulate a guildmemberjoin
*Self explaining*
