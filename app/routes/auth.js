const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config');
const strings = require('../strings')

const users = [];

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
  
    if (user && user.password === password) {
      const token = jwt.sign({ username }, accessTokenSecret, { expiresIn: '1h' });
  
      return res.json({ token });
    }
  
    res.status(401).json({ message: strings.invalidCredentials });  
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: strings.userExists });
    }
  
    const newUser = { username, password };
    users.push(newUser);
  
    res.status(201).json({ message: strings.userSuccess });  
});

module.exports = router;
