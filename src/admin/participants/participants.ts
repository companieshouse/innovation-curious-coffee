import {Request, Response} from 'express';

import Participant from '../../participant/participant';
import logger from '../../logger';

export async function get(req: Request, res: Response): Promise<void> {

    logger.info('Rendering page: participants');

    const participants = await Participant.find({
        verify: true
    }).sort({
        "date_registered": 1
    });
    
    return res.render('participants', {
        participants: participants 
     });
}