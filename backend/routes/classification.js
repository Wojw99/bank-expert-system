const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config');
const strings = require('../strings')
const loanClassifier = require('../loan_classifier.js')
const auth = require('./auth')
  
router.post('/acceptRelearning', auth.authenticateJWT, async (req, res) => {
  if(req.user && req.user.role !== 'admin') {
    return res.status(401).json({ message : strings.unauthorized}).send()
  }
  loanClassifier.acceptRelearning()
  return res.json({"Status": "updated"});
});

router.get('/classify', auth.authenticateJWT, async (req, res) => {
  var { age, job, balance, day, month, duration, education } = req.body;

  try {
    var prediction = await loanClassifier.classify(
      age = age,
      job = job,
      balance = balance,
      day = day,
      month = month,
      duration = duration, 
      education = education
    )
    return res.json({prediction: prediction});
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error');
  }
});

router.post('/relearn', auth.authenticateJWT, async (req, res) => {
  const { user } = req.user;

  if(req.user && req.user.role !== 'admin') {
    return res.status(401).json({ message : strings.unauthorized}).send()
  }

  var { random_state, n_estimators, max_depth, min_samples_split, min_samples_leaf } = req.body;

  try {
    var accuracy = await loanClassifier.relearn(
      random_state = random_state,
      n_estimators = n_estimators,
      max_depth = max_depth,
      min_samples_split = min_samples_split, 
      min_samples_leaf = min_samples_leaf,
    )
    return res.json({accuracy: accuracy});
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;