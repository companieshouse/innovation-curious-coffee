const express = require('express');
const app = express();
const config = require('./config/config');
const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');

const routes = require('./routes');

const register = require('./registration/register/registerController');
const deregister = require('./registration/deregister/deregister');
const match = require('./matching/match/match');
const emailMatched = require('./matching/emailMatched/emailMatched');
const participantsByDepartment = require('./stats/participants-by-department/participants-by-department');
const dateParticipantsRegistered = require('./stats/date-participants-registered/dateParticipantsRegistered');
const verify = require('./verification/verify/verify');
const matchEdit = require('./matching/match-edit/matchEdit');

require('console-stamp')(console, '[HH:MM:ss.l]');

const port = config.app.port;

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

app.use(express.static('public'));
app.use(session({secret: 'curious', resave: false, saveUninitialized: true}));

app.use(function(req, res, next) {

    res.locals.session = req.session;
    next();
});

app.use(flash());

//MongoDB setup
const mongoose = require('mongoose');
mongoose.connect(config.db.url.server + config.db.url.port + "/" + config.db.name, {useNewUrlParser: true, useFindAndModify: false});
global.db = mongoose.connection;

global.db.on('error', console.error.bind(console, 'connection error: '));

global.db.on('open', function() {
    console.log('Mongoose connection opened');
});

app.use('/', routes);

app.use('/register', register);
app.use('/deregister', deregister);

app.use('/match', match);
app.use('/emailMatched', emailMatched);
app.use('/participants-by-department', participantsByDepartment);
app.use('/date-participants-registered', dateParticipantsRegistered);
app.use('/verify', verify);
app.use('/match-edit', matchEdit);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
