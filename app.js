const express = require('express');
const app = express();

const validator = require('express-validator');

const index = require('./index');
const register = require('./register');
const deregister = require('./deregister');
const match = require('./match');
const participants = require('./participants');
const matched = require('./matched');
const email = require('./email');
const participantsByDepartment = require('./participants-by-department');
const feedback = require('./feedback');
const admin = require('./admin');

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
            if (value == "--choose a department--") {
                return false;
            } else {
                return true;
            }
        }
    }
}));
app.use(express.static('public'));

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

app.listen(port, () => {
    console.log('Listening on port ' + port);
});