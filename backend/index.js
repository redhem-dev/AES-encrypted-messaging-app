const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});