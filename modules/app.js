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

// Util modules
const chalk = require('chalk');
const http = require('http');
const https = require('https');
const fs = require('fs');
const log = console.log;

// Run
exports.run = (client, config) => {

  /*
   * App setup
   */

  // App view
  app.set('view engine', 'ejs');
  app.set('views', './src/views');

  // Asset directories
  app.use('/static', express.static('./src/add'));
  app.use('/static', express.static('./src/plugins'));
  //app.use('/.well-known', express.static('./src/.well-known'));

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

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    guilds: client.guilds.size
  };

  function accountImage(user) {
    return `<img src="${"https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png"}" width="90px" height="90px" alt="User Image"></img>`
  }

  /*
   * Routing
   */
  // Index page
  app.get('/', (req, res) => {
    if (!req.session.user) {
      res.render('index2', {
        page: "dashboard",
        botInfo: botInfo,
      });
    } else {
      res.render('index', {
        page: "dashboard",
        botInfo: botInfo,
        userInfo: req.session.user,
        image: accountImage(req.session.user)
      });
      //res.send(`Hello ${req.session.user.username}`);
    }
  });

  // Authorizing pages
  app.get("/auth/discord", passport.authenticate("discord.js"));
  // Callback for the Discord login
  app.get("/auth/discord/callback", passport.authenticate("discord.js", {
    failureRedirect: "/auth/discord/error"
  }), function (req, res) {
    // Accessing the user object easier
    req.session.user = req.session.passport.user;
    // Successful authentication, redirect home.
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
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
  });

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
  // Listener
  //app.listen(config.port, () => {
  //  log('INFO >> ' + chalk.green('Dashboard is running on port ' + config.port));
  //});
}