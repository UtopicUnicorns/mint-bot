# Documentation
*Artemis is a multi-server Discord bot build by a noob called UtopicUnicorn.   

## Index
  - [How to use](#how-to-use)
  - [Commands](#commands)

## How to use

1. Invite the bot to your server
2. visit Artemis's website, and login
3. Click on the tab control panel
4. Set up your channels.

`generalChannel`
This channel is mainly used to greet new users, so you can use the Welcome channel for this.

`logsChannel`
The logs channel keeps track of user joins (with account date),
When mods/admins resolve moderator and admin commands (the logs channel is intended to be public),
When users change their nickname/username,
and important update notices (When a command gets changed to the core that server owners will have to know about them)/

`muteChannel`
When Artemis joins your server it will create 2 roles:
muted and ~/Members
When you have set up a mute channel users who have been repeatedly warned, muted or use an account which is
 not a month old will get booted into this channel.
New users are supposed to verify themselves by writing their own username followed by 1337.
Muted users (who have been muted due too many warns or manual mute will not be able to use this system to bypass their mute.)

`highlightChannel`
This is Artemis's version of the starboard.
When a message (may not be a bot's message) gets 3 :tea: icons their message will be highlighted into this channel.

`reactionChannel`
This is the role reaction channel.
1. Create a role with your prefered name
2. use `!rolemanage RoleID` (Where roleID is the ID of the role you created), this will add the role to the self asignable list,
This enabled users to use `!join Role` `!leave Role` and the role will show their role size with `!numbers`
3. Create a custom emote that has the exact same name as the role you will want to use.
4. in the reaction channel use `!react MessageID EmojiName` (Where messageID is your placeholder message for the reactions and where EmojiName is the CUSTOM emoji you set up matching the role name)
5. If you followed all the steps you now have a reaction role set up, make sure that the reaction channel is otherwise empty.

`streamChannel`
This channel will show notifications when users go live on twitch.
Users can use `!stream on` or `!stream off` to enable or disable their own notifications.
Admins and Mods can use `!streamping on` of `!streamping off` to enable or disable an @here notification when a user goes live (This is off by default)


`automod`
Automod has a few features
When Automod is on it will:
Limit the amount of messages which a user can send per second (This includes attachments).
Delete messages that include discord invite links.
Mute users who mention more than 3 other users at the same time (this does not count for role mentions, as this may be intended)
Use a wordlist set up using `!wordlist add Word Word Word` (where Word is the word you want to censor), You can delete words from the wordlist by using `!wordlist del Word`.
When a word on the wordlist is used by a user when automod is on, the message will be instantly deleted.
Admins and Mods ALWAYS bypass automod, and thus will not affect them.


`server prefix`
This sets up the prefix of Artemis in your server.
By default the prefix is `!`
Using Artemis's website you can add an extra space on the end of your prefix to create a prefix like `artemis do `



## Commands
*A small list of notable commands*
To see all commands visit `Artemis's website > login > commands tab` or use `!help`, `!help general`, `!help fun` etc...

`warn`,	Warn a user
`warnings`,	Look up user warning
`set mute`, Mute a user
`set unmute`, Unmute a user
`set prefix`, Change the bot's prefix
`purge`, Purge a mentioned user or a specified ammount
`nick`, Change a user nickname
`levelmanage`, Manage level up roles
`remindme`, set a reminder
`opt`, opt `in` or `out` from auto translation (OFF by default)
`board`, Show leaderboard
