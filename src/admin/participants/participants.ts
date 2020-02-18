import {Request, Response} from 'express';

import Participant from '../../models/participant';

export async function get(req: Request, res: Response): Promise<void> {

    const participants = await Participant.find({
        verify: true
    }).sort({
        "date_registered": 1
    });
    
    return res.render('participants', {
        participants: participants 
     });
}