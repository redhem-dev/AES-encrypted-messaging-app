require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cors = require('cors');

// Connect to db
connectDB();

require('./routes/auth');

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
}

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/chat',
    failureRedirect: 'http://localhost:5173/',
  })
);

app.get('/protected', isLoggedIn, (req, res) =>  {
  console.log('Display Name:', req.user.displayName);
  console.log('Email:', req.user.emails[0].value);
  res.send(`Hello ${req.user.displayName}`);
});


app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
        console.error('Error during logout:', err);
        return res.status(500).send('Error during logout');
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true });
  });
});

app.use('/', require('./routes/api/messages'));


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
})

