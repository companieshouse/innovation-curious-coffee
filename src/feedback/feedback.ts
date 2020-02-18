import {Request, Response} from 'express';
import Feedback, {InterfaceFeedback} from '../models/feedback';

export function get(req: Request, res: Response): void {
    return res.render('feedback', {
        feedbackModel: new Feedback()
    });
}

export async function post(req: Request, res: Response): Promise<void> {

    req.checkBody('feedbackModel[email]', 'Please enter a valid email address').isEmail();
    req.checkBody('feedbackModel[feedback]', 'Please enter some feedback').isLength({min:1}).trim();

    const errors = req.validationErrors();

    if (errors) {

        return res.render('feedback', {
            feedbackModel: req.body.feedbackModel,
            errors: errors
        });
    } else {

        const feedback: InterfaceFeedback = new Feedback({
            email: req.body.feedbackModel.email,
            feedback: req.body.feedbackModel.feedback
        });

        feedback.save();

        req.flash('info', 'Thank you for your feedback!');
        return res.redirect('/');
    }
}