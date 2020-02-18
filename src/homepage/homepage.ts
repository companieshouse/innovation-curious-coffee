import {Request, Response} from 'express';
import Participant from '../models/participant';

async function getMatchCount(): Promise<number> {
    const participants = await Participant.find({verify: true, matches: {$exists: true}});

    let count = 0;

    participants.forEach(function(value) {
        count += value.matches.length;
    });

    return Math.round(count / 2);
}

export async function get(req: Request, res: Response): Promise<void> {
    const numParticipants = await Participant.countDocuments({verify: true});
    const numMatches = await getMatchCount();

    return res.render('homepage', {
        homepageModel: {
            numParticipants: numParticipants,
            numMatches: numMatches
        },
        messages: req.flash('info')
    });
}