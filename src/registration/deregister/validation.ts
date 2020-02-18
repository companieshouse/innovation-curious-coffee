import {check} from 'express-validator/check';

const validation = [
    check('email', 'Please enter a valid email address').isEmail()
];

export = validation;