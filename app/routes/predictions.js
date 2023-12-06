const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config');
const strings = require('../strings')
const auth = require('./auth')
  
router.post('/predict', auth.authenticateJWT, (req, res) => {
  let list = [
    {x : 'sdfsd', y : '436346'},
    {x : 'sdaf', y : '0000'},
    {x : '4564', y : '345'},
    {x : 'asda', y : '433456346'},
  ];
  res.json(list);
});

router.post('/relearn', auth.authenticateJWT, (req, res) => {
  const { user } = req.user;

  if(req.user && req.user.role !== 'admin') {
    return res.status(401).json({ message : strings.unauthorized}).send()
  }

  return res.json({messege: "Hello Relearning!"});
});

module.exports = router;