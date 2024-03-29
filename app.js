const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/keys');
const passport = require('passport');

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

//Load Routes
const users = require('./routes/users');
const pets = require('./routes/pets');
const vendors = require('./routes/vendors');
const events =  require('./routes/events');

//CORS Middleware
app.use(cors());

//BodyParser Middleware
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 10000
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Set Static folder
app.use(express.static(`${__dirname}/build`));

//Port Number
const port = process.env.PORT || 8080;

//Set up Routes
app.use('/users', users);
app.use('/pets', pets);
app.use('/vendors', vendors);
app.use('/events', events);

//INDEX Route
app.get('/', (req, res) => {
    res.send('index');
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