const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config');
const strings = require('../strings')
const loanClassifier = require('../loan_classifier.js')
const auth = require('./auth')
const ValidationError = require('../validation_error')  

router.post('/acceptRelearning', auth.authenticateJWT, async (req, res) => {
  if(req.user && req.user.role !== 'admin') {
    return res.status(401).send(strings.unauthorized)
  }
  await loanClassifier.acceptRelearning()
  return res.json({"Status": "updated"});
});

router.get('/classify', auth.authenticateJWT, async (req, res) => {
  var hyperParams = req.body;

  try {
    var prediction = await loanClassifier.classify(hyperParams)
    return res.json({prediction: prediction});
  } catch (error) {
    if(error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.post('/relearn', auth.authenticateJWT, async (req, res) => {
  const { user } = req.user;

  if(req.user && req.user.role !== 'admin') {
    return res.status(401).send(strings.unauthorized)
  }

  try {
    const reqHyperparameters = req.body;
    const accuracy = await loanClassifier.relearn(reqHyperparameters)
    return res.json({accuracy: accuracy});
  } catch (error) {
    if(error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

module.exports = router;