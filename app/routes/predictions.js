const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config');
const strings = require('../strings')
  
  router.post('/predict', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: strings.authTokenMissing });
    }

    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ message: strings.authTokenMissing });
    }

    jwt.verify(authToken, accessTokenSecret, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: strings.authTokenIvalid });
        }

        // const userId = decoded.userId; 
        const { age, job, marital, education, balance } = req.body;
        console.log(req.body);

        res.json(true);
    });
  });

module.exports = router;