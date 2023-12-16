const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const classificationRoutes = require('./routes/classification');
const settingsRoutes = require('./routes/settings');
const loanClassifier = require('./loan_classifier.js')
const database = require('./database')
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/classification', classificationRoutes);
app.use('/settings', settingsRoutes);

// loanClassifier.relearn()
// loanClassifier.classify()
database.testDatabase()

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
