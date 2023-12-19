const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const strings = require('../strings')
const database = require('../database')
const config = require('../config');
const auth = require('./auth');

router.get('/all', auth.authenticateJWT, (req, res) => {
  database.getParameters(function (error, params) {
    if(params !== null) {
      try {
        const settings = config.settings
        return res.json({settings: settings, lastParameters: params});
      } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    }
  })
});

module.exports = router