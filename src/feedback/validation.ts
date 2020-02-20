import {check} from 'express-validator/check';

const validation = [
    check('feedbackModel[email]', 'Please enter a valid email address').isEmail(),
    check('feedbackModel[feedback]', 'Please enter some feedback').isLength({min:1}).trim()
];

export = validation;