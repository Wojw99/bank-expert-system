const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/classification');
const loanClassifier = require('./loan_classifier.js')

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/classification', predictionRoutes);

// loanClassifier.relearn()
// loanClassifier.classify()

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
