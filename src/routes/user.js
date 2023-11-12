const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/user.js');
const { addFriend } = require('../controllers/message.js');

const userRoutes = express.Router();

userRoutes.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10
  }));

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.post('/friends/add', addFriend)

module.exports = userRoutes;