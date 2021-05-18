const path = require('path');
const express = require("express");
const helmet = require("helmet");
// const cors = require("cors");
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const UsersRouter = require('./users/users-router')
const AuthRouter = require('./auth/auth-router')

const sessionConfig = {
  name: 'chocolatechip',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('../data/db-config.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}

const server = express();

server.use(express.static(path.join(__dirname, '../client')));
server.use(session(sessionConfig))
server.use(helmet());
server.use(express.json());
// server.use(cors());

server.use('/api/users', UsersRouter)
server.use('/api/auth', AuthRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

server.use('*', (req, res) => {
  res.status(404).json({ message: 'not found!' })
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
