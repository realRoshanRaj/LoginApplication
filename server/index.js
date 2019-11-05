const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// Auth
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const passport = require('passport');
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
require('./configs/passport');
config.dev = process.env.NODE_ENV !== 'production';

const uri = process.env.DB_URL;

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
    app.use(sslRedirect());
    console.log('Using https redirect');
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to mongodb');
    });

  app.use(
    session({
      secret: process.env.COOKIE_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }
    })
  ); // session secret
  // app.use(
  //   cookieSession({
  //     maxAge: 24 * 60 * 60 * 1000,
  //     keys: [process.env.COOKIE_KEY]
  //   })
  // );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on https://${host}:${port}`,
    badge: true
  });
}
start();
