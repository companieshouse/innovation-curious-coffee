import {check} from 'express-validator/check';

function departmentValidation(value: string): boolean {
    if (value === "choose the department you belong to") {
        return false;
    } else {
        return true;
    }
}

function consentChecked(value: string): boolean {
    if (value === "on") {
        return true;
    } else {
        return false;
    }
}

const validation = [
    check('name', 'Name cannot be blank').isLength({min:1}).trim(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('department', 'Please select a department').custom(departmentValidation),
    check('consent', 'You must consent for your data to be used to register').custom(consentChecked)
];

export = validation;