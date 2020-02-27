/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require('express');
const passport = require("passport");
const session = require('express-session');

const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();
const {
  SESSION_SECRET
} = require('../config.json');

const http = require('http');
const https = require('https');
const fs = require('fs');
const SQLite = require("better-sqlite3");
const db = new SQLite('./scores.sqlite');
const bodyParser = require('body-parser');

exports.run = (client, config) => {

  // App view
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  // Asset directories
  app.use('/static', express.static('./src/add'));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  }));

  // passport login strategy
  passport.use(new DiscordStrategy({
      clientID: client.user.id,
      clientSecret: config.clientSecret,
      callbackURL: config.redirectURI,
      scope: ["identify"]
    },
    function (accessToken, refreshToken, profile, done) {
      //Handle Database Query Addition Here.
      //console.log(profile);
      return done(null, profile);
    }
  ));

  passport.serializeUser(function (u, d) {
    d(null, u);
  });
  passport.deserializeUser(function (u, d) {
    d(null, u);
  });

  // Index page
  app.get('/', (req, res) => {
    if (!req.session.user) {
      const test = {
        client: client
      };
      res.render('index2', {
        page: "dashboard",
        test: test,
      });
    } else {
      //userstuff
      getScore = db.prepare("SELECT * FROM scores WHERE user = ? ORDER BY guild DESC");
      setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
      //Guildchannels
      getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ? ORDER BY guild DESC");
      setGuild = db.prepare("INSERT OR REPLACE INTO guildhub (guild, generalChannel, highlightChannel, muteChannel, logsChannel, streamChannel, reactionChannel, streamHere, autoMod, prefix) VALUES (@guild, @generalChannel, @highlightChannel, @muteChannel, @logsChannel, @streamChannel, @reactionChannel, @streamHere, @autoMod, @prefix);");
      //rolesdb
      getRoles = db.prepare("SELECT * FROM roles WHERE guild = ? ORDER BY guild DESC");
      setRoles = db.prepare("INSERT OR REPLACE INTO roles (guild, roles) VALUES (@guild, @roles);");
      //Worddb
      getWords = db.prepare("SELECT * FROM words WHERE guild = ? ORDER BY guild DESC");
      setWords = db.prepare("INSERT OR REPLACE INTO words (guild, words) VALUES (@guild, @words);");
      //levelup
      getLevel = db.prepare("SELECT * FROM level WHERE guild = ? ORDER BY guild DESC");
      setLevel = db.prepare("INSERT OR REPLACE INTO level (guild, lvl5, lvl10, lvl15, lvl20, lvl30, lvl50, lvl85) VALUES (@guild, @lvl5, @lvl10, @lvl15, @lvl20, @lvl30, @lvl50, @lvl85);");

      function data1(user) {
        const array = [];
        const image = [];
        let count = -1;
        client.guilds.map(guild => image.push(guild.iconURL));
        for (const data of getScore.all(user.id)) {
          for (let i of image) {
            if (i.includes(data.guild)) {
              if (data.translate == '2') {
                var translation = 'ON';
              } else {
                var translation = 'OFF';
              }
              if (data.stream == '2') {
                var streaming = 'OFF';
              } else {
                var streaming = 'ON';
              }
              count++
              array.push('<button class="collapsible"><img src ="' +
                i + '" width="30px" height="30px" style="border-radius: 50%;"><div class="textcol">' +
                client.guilds.get(data.guild) +
                '</div></button><div class="colpanel"><table width="100%" border="0" align="center"><tr style="text-align:left"><th>Level:</th><th>' +
                data.level + '</th></tr><tr style="text-align:left"><td>Points:</td><td>' +
                data.points + '</td></tr><tr style="text-align:left"><td>Warning points:</td><td>' +
                data.warning + '</td></tr><tr style="text-align:left"><td>Auto Translation:</td><td><div id="' + count + 'TRA">' +
                translation + '</div></td></tr><tr style="text-align:left"><td></td><td><form action="/" method="post"><select name="data3"><option value="' +
                count + ' TR OFF">off</option><option value="' +
                count + ' TR ON">on</option></select><input type="submit" onclick="document.getElementById(`' + count + 
                'TRA`).innerHTML = `Changed!`" value="Save"></form></td></tr><tr style="text-align:left"><td>Stream Notifications:</td><td><div id="' + 
                count + 'STR">' +
                streaming + '</div></td></tr><tr style="text-align:left"><td></td><td><form action="/" method="post"><select name="data3"><option value="' +
                count + ' ST OFF">off</option><option value="' +
                count + ' ST ON">on</option></select><input type="submit" onclick="document.getElementById(`' + count + 'STR`).innerHTML = `Changed!`" value="Save"></form></td></tr></table></div>\n')
            }
          }
        }
        return array.toString().replace(/,/g, '');
      }
      const test = {
        client: client
      };
      res.render('index', {
        page: "dashboard",
        test: test,
        data: data1(req.session.user),
        userInfo: req.session.user,
      });
    }
  });

  //post
  app.post('/', function (req, res) {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////USER CHANGES///////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //recycle
    const array = [];
    const image = [];
    client.guilds.map(guild => image.push(guild.iconURL));
    for (const data of getScore.all(req.session.user.id)) {
      for (let i of image) {
        if (i.includes(data.guild)) {
          array.push(data)
        }
      }
    }
    //change data to array
    var data3 = req.body.data3.split(" ");
    //num err
    if (isNaN(data3[0])) return console.log("Error");
    //numlength err
    if (data3[0] > array.length) return console.log("Error2");
    //num is c
    let c = data3[0]
    //renew db
    getScore2 = db.prepare("SELECT * FROM scores WHERE user = ? AND guild = ? ORDER BY guild DESC");
    setScore2 = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, warning, muted, translate, stream, notes) VALUES (@id, @user, @guild, @points, @level, @warning, @muted, @translate, @stream, @notes);");
    //Translate
    if (data3[1] == 'TR') {
      let translate = getScore2.get(req.session.user.id, array[c].guild);
      if (data3[2] == 'ON') {
        translate.translate = `2`;
        setScore.run(translate);
        res.status(204).send();
      }
      if (data3[2] == 'OFF') {
        translate.translate = `1`;
        setScore.run(translate);
        res.status(204).send();
      }
    }
    //stream
    if (data3[1] == 'ST') {
      let stream = getScore2.get(req.session.user.id, array[c].guild);
      if (data3[2] == 'ON') {
        stream.stream = `1`;
        setScore.run(stream);
        res.status(204).send();
      }
      if (data3[2] == 'OFF') {
        stream.stream = `2`;
        setScore.run(stream);
        res.status(204).send();
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////ADMIN/MOD CHANGES//////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //res.redirect("#");
  });

  app.get("/auth/discord", passport.authenticate("discord.js"));
  app.get("/auth/discord/callback", passport.authenticate("discord.js", {
    failureRedirect: "/auth/discord/error"
  }), function (req, res) {
    req.session.user = req.session.passport.user;
    console.log(`(${req.session.user.id}) ${req.session.user.username}: Logged in.`);
    res.redirect("/");
  });

  const privateKey = fs.readFileSync('/etc/letsencrypt/live/artemisbot.eu/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/artemisbot.eu/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/artemisbot.eu/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  const httpsServer = https.createServer(credentials, app);
  const httpServer = http.createServer(app);

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });

  httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
  });
}