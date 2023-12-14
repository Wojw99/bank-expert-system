const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/predictions', predictionRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
