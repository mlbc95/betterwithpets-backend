const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/keys');

mongoose.Promise = global.Promise
mongoose.connect(config.mongoURI, {
        useMongoClient: true
    })
    .then(
        () => {
            console.log(`Connected to database`);
        }
    )
    .catch(
        (err) => {
            console.log(`ERROR ON DB CONNECTION: ${err}`);
        }
    );

//Set Express App Variable
const app = express();

//CORS Middleware
app.use(cors());

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Set Static folder
app.use(express.static(`${__dirname}/build`));

//Port Number
const port = process.env.PORT || 8080;

//INDEX Route
app.get('/', (req, res) => {
    res.render('index');
});

//All Route re-Route
app.all('/*', (req, res, next) => {
    res.sendFile('build/index.html', {
        root: __dirname
    });
});

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});