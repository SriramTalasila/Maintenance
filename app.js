const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
const config= require('./config')

const host = config.dev.db.host;
const dbport = config.dev.db.port;
const db = config.dev.db.name;
mongoose.connect("mongodb://"+host+":"+dbport+"/"+db,{useNewUrlParser: true});
const UserRoutes = require('./api/routes/user');

// to log requests
app.use(morgan('dev'));

// to parse the incoming request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling cross origin resource  sharing error 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

// routing the reequest to specific handler

app.use('/user',UserRoutes);


// Handing wrong routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;