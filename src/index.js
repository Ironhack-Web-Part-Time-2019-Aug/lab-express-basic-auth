
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



// const router = require('./routes/auth');

const mongoose = require('mongoose');
// const userModel = require('./models');

mongoose.connect('mongodb://localhost/basicAuth', { userNewParser: true})
    .then(() => {
        console.log('Connected to Mongo!');
    }).catch(err => {
        console.error('Error connecting to mongo', err);
});

app.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
}));

// app.use('/', router);

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/site-routes'));

app.listen(port, () => console.log("My bcrypt project is running on port 3000"));