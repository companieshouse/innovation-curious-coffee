import bodyParser from 'body-parser';
import express from 'express';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session';
import validator from 'express-validator';

import config from './config';
import connect from './db';
import routes from './routes';
import adminMiddleware from './admin/middleware';

const app = express();
const port = config.app.port;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(validator());

app.use(express.static(path.join(__dirname + '/public')));

app.use(session({secret: 'curious', resave: false, saveUninitialized: true}));

app.use(function(req, res, next) {

    res.locals.session = req.session;
    next();
});

app.use(flash());

app.use(adminMiddleware);

connect();

app.use('/', routes);

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
