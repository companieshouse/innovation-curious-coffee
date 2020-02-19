import {Request, Response} from 'express';
import Participant from '../../../models/participant';

export async function get(req: Request, res: Response): Promise<void> {

    const options = await Participant.find({verify: true});

    return res.render('remove', {
        options: options
    });
}

export async function post(req: Request, res: Response): Promise<void> {

    await Participant.deleteOne({
        email: req.body.email
    });

    return res.redirect('/');
}