const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ram:userram@cluster0-xnxgj.mongodb.net/maintenance?retryWrites=true", { useNewUrlParser: true });

const UserRoutes = require('./api/routes/user');

const AdminRoutes = require('./api/routes/adminRoutes');

const StudentRoutes = require('./api/routes/studentRoutes');

const staffRoutes = require('./api/routes/staffRoutes');

const otherRoutes = require('./api/routes/otherData');

const studentAuth = require('./api/middleware/studentAuth');

const auth = require('./api/middleware/Auth');

// to log requests
app.use(morgan('dev'));
app.use(cors());
// to parse the incoming request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling cross origin resource  sharing error 


// routing the reequest to specific handler
app.use('/static', express.static('public'));   

app.use('/user', UserRoutes);

app.use('/admin', AdminRoutes);

app.use('/student',studentAuth, StudentRoutes);

app.use('/staff', auth, staffRoutes);

app.use('/other', otherRoutes);


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