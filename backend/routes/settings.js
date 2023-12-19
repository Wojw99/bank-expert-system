const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const strings = require('../strings')
const database = require('../database')
const config = require('../config');
const auth = require('./auth');

router.parameters = {}

database.getParameters(function (error, params) {
  if(params !== null) {
    router.parameters = params
  }
})

router.get('/all', auth.authenticateJWT, (req, res) => {
    try {
        const settings = config.settings
        const lastParams = router.parameters
        return res.json({settings: settings, lastParameters: lastParams});
      } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router