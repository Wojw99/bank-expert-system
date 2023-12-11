const express = require('express');
var path = require("path");
var routes = require("./routes")
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/predictions', predictionRoutes);

app.set("views", path.join(__dirname, "views"))
app.set("view engine","ejs")

app.use(routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
