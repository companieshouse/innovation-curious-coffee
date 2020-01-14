const express = require('express');
const app = express();
const config = require('./config');
const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const path = require ('path');

const routes = require('./routes');
const adminMiddleware = require('./admin/middleware');
const port = config.app.port;

require('console-stamp')(console, '[HH:MM:ss.l]');

app.set('view engine', 'pug');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(validator({
    customValidators: {
        departmentError: function(value) {
            if (value == "choose the department you belong to") {
                return false;
            } else {
                return true;
            }
        },
        consentChecked: function(value) {
            if (value == "on") {
                return true;
            } else {
                return false;
            }
        }
    }
}));

app.use(express.static(path.join(__dirname + '/public')));
app.use(session({secret: 'curious', resave: false, saveUninitialized: true}));

app.use(function(req, res, next) {

    res.locals.session = req.session;
    next();
});

app.use(flash());

app.use(adminMiddleware.validate);

//MongoDB setup
const mongoose = require('mongoose');
mongoose.connect(config.db.url.server + config.db.url.port + "/" + config.db.name, {useNewUrlParser: true, useFindAndModify: false});
global.db = mongoose.connection;

global.db.on('error', console.error.bind(console, 'connection error: '));

global.db.on('open', function() {
    console.log('Mongoose connection opened');
});

app.use('/', routes);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
