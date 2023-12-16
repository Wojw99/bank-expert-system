const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/classification');
const loanClassifier = require('./loan_classifier.js')
const database = require('./database')
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/classification', predictionRoutes);


// loanClassifier.relearn()
// loanClassifier.classify()
database.testDatabase()

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
