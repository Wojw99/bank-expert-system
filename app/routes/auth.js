const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const accessTokenSecret = require('../config');
const strings = require('../strings')

const users = [
  {
    username: 'admin',
    password: 'admin123',
    role: strings.adminRole
  },
  {
    username: 'jan',
    password: '123',
    role: strings.userRole
  }
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
      // generate an accesse token
      const token = jwt.sign({ username: username, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
  
      return res.json({ token });
    }
  
    res.status(401).json({ message: strings.invalidCredentials });  
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: strings.userExists });
    }
  
    const newUser = { 
      username: username, 
      password: password, 
      role: strings.userRole 
    };
    users.push(newUser);
  
    res.status(201).json({ message: strings.userSuccess });  
});

router.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.status(403).json({ message: strings.authTokenIvalid}).send();
          }

          req.user = user;
          console.log("setting", req.user)
          next();
      });
  } else {
      res.status(401).json({ message: strings.authTokenMissing}).send();
  }
};

module.exports = router;
