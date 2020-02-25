import {Request, Response, NextFunction} from 'express';
import {check} from 'express-validator/check';
import logger from '../logger';

const validation = [
    check('feedbackModel[email]', 'Please enter a valid email address').isEmail(),
    check('feedbackModel[feedback]', 'Please enter some feedback').isLength({min:1}).trim()
];

export function checkValidation(req: Request, res: Response, next: NextFunction): void {
    const errors = req.validationErrors();

        if (errors) {
            logger.info("Errors in feedback data, rendering page: feedback");
            return res.render('feedback', {
                feedbackModel: req.body.feedbackModel,
                errors: errors
            });
        } else {
            return next();
        }
}

export default validation;