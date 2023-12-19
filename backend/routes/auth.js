const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const strings = require('../strings')
const database = require('../database')
const bcrypt = require('bcrypt');
const accessTokenSecret = config.accessTokenSecret

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = database.users.find(user => user.username === username);
    var passwordMatch = ""

    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch(error) {
      res.status(401).send(strings.invalidCredentials);  
    }

    if (user && passwordMatch) {
      const token = jwt.sign({ username: username, role: user.role }, accessTokenSecret, { expiresIn: '1h' });
  
      return res.json({ token: token, role: user.role });
    }
  
    res.status(401).send(strings.invalidCredentials);  
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    database.getAllUsersCallback((error, users) => {
      if (users && users.find(user => user.username === username)) {
        return res.status(400).send(strings.userExists);
      } else if (error || users === null) {
        return res.status(500).send(strings.internalError);
      }
      database.addUser(hashedPassword, username, strings.userRole)
      return res.status(201).json({ role: strings.userRole });  
    })
});

router.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.status(403).send(strings.authTokenIvalid).send();
          }

          req.user = user;
          console.log("setting", req.user)
          next();
      });
  } else {
      res.status(401).send(strings.authTokenMissing);
  }
};

module.exports = router;
