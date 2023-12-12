const express = require('express');
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt')
const session = require('express-session');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Pool } = require('pg');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = pgp('postgres://postgres:28899@34.123.89.96:5432/DefectsTracker');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await db.oneOrNone('SELECT * FROM Users WHERE username = $1', [username]);
        
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });
  
  passport.deserializeUser(async (username, done) => {
    try {
      const user = await db.oneOrNone('SELECT * FROM Users WHERE username = $1', [username]);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
  });
  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
      console.log( username)
      const newUser = await db.one('INSERT INTO Users(username, password) VALUES($1, $2) RETURNING *', [username, password]);
      req.login(newUser, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Error during login after registration.' });
        }
  
        return res.json({ message: 'Registration successful!', user: newUser });
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Internal server error during registration.' });
    }
  });
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  }));
      app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
      });
      app.get('/dashboard', isAuthenticated, (req, res) => {
        res.send(`Welcome to the dashboard, ${req.user.username}!`);
      });
      
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  }
  app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });

  //project details
  const pool1 = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DefectsTracker',
    password: '28899',
    port: 5432,
});

app.get('/projectDetail', async (req, res) => {
    try {
        const client = await pool1.connect();
        const result = await client.query('SELECT * FROM "ProjectDetail"');
        res.status(200).json(result.rows);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

app.post('/projectDetail', async (req, res) => {
    try {
        const { Name, ID, Category, Owner, Contributors, Date } = req.body;
        const client = await pool1.connect();
        const result = await client.query(
            'INSERT INTO "ProjectDetail" ("Name", "ID", "Category", "Owner", "Contributors", "Date") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [Name, ID, Category, Owner, Contributors, Date]
        );
        res.status(201).json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

app.put('/projectDetail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { Name, ID, Category, Owner, Contributors, Date } = req.body;
        const client = await pool1.connect();
        const result = await client.query(
            'UPDATE "ProjectDetail" SET "Name"=$1, "ID"=$2, "Category"=$3, "Owner"=$4, "Contributors"=$5, "Date"=$6 WHERE "ID"=$7 RETURNING *',
            [Name, ID, Category, Owner, Contributors, Date, id]
        );
        res.status(200).json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

app.delete('/projectDetail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const client = await pool1.connect();
        await client.query('DELETE FROM "ProjectDetail" WHERE "ID"=$1', [id]);
        res.status(204).json({ message: 'Deleted' });
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});
app.listen(port,()=>{
    console.log("Listening on port 3000");
})