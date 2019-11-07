
require('dotenv').config();
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const hbs = require('hbs');
const port = process.env.PORT;

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const router = require('./routes/auth');

const mongoose = require('mongoose');
// const userModel = require('./models');

mongoose.connect('mongodb://localhost/basicAuth', { userNewParser: true})
    .then(() => {
        console.log('Connected to Mongo!');
    }).catch(err => {
        console.error('Error connecting to mongo', err);
    });

app.use('/', router);

app.listen(port, () => console.log("My bcrypt project is running on port 3000"));