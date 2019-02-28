const express = require('express');
const app = express();

const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');

const index = require('./index/index');
const register = require('./register/registerController');
const deregister = require('./deregister/deregister');
const match = require('./match/match');
const participants = require('./participants/participants');
const matched = require('./matched/matched');
const email = require('./email/email');
const participantsByDepartment = require('./participants-by-department/participants-by-department');
const feedback = require('./feedback/feedback');
const admin = require('./admin/admin');
const error = require('./error/error');

//const email_test = require('./email_test');

const port = 3000;

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

app.use('/', index);
app.use('/register', register);
app.use('/deregister', deregister);
app.use('/feedback', feedback);

app.use('/admin', admin);

app.use('/match', match);
app.use('/participants', participants);
app.use('/matched', matched);
app.use('/email', email);
app.use('/participants-by-department', participantsByDepartment);
app.use('/oops', error);
//app.use('/email_test', email_test);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
