import {Request, Response} from 'express';
import Participant from '../../../participant/ParticipantModel';
import logger from '../../../logger';

export async function get(req: Request, res: Response): Promise<void> {
    logger.info("Rendering page: remove");

    const options = await Participant.find({verify: true});

    return res.render('remove', {
        options: options
    });
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Attempting to delete participant");

    await Participant.deleteOne({
        email: req.body.email
    });

    logger.info("Participant deleted");

    return res.redirect('/');
}