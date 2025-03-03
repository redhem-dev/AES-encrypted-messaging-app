require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// Connect to db
connectDB();

require('./auth');

function isLoggedIn(req, res, next) {
  req.user? next() : res.sendStatus(401);
}

const app = express();

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/protected', isLoggedIn, (req, res) =>  {
  console.log('Display Name:', req.user.displayName);
  console.log('Email:', req.user.emails[0].value);
  console.log('Profile Photo:', req.user.photos[0].value);
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/auth/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong!');
});

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
        console.error('Error during logout:', err);
        return res.status(500).send('Error during logout');
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/protected');
  });
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
})

