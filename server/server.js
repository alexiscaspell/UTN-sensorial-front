const express = require('express');
require('dotenv').config()
const routes = require('./router.js');
var mongoose = require('mongoose');
var cors  = require('cors');
var timeout = require('connect-timeout')

const app = express();

app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(timeout('18s'))
app.use(express.json());
app.use(haltOnTimedout)

app.use(express.urlencoded({ extended: true }));

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }

mongoose.connect(process.env.CLOUD_DB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(db => {
        console.log("Connected to MongoDB!")
        routes(app, db)
    })
    .catch(error => console.log(error));
