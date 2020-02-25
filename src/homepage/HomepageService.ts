import {Request, Response} from 'express';
import Participant from '../models/participant';
import logger from '../logger';

export default class HomepageService {
    private getMatchCount = async (): Promise<number> => {
        logger.info("Getting total number of matches");
        const participants = await Participant.find({
            verify: true, matches: {
                $exists: true
            }});

        let count = 0;

        participants.forEach(function(value) {
            count += value.matches.length;
        });

        return Math.round(count / 2);    
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const numParticipants = await Participant.countDocuments({verify: true});
        const numMatches = await this.getMatchCount();

        logger.info("Rendering page: homepage");
        return res.render('homepage', {
            homepageModel: {
                numParticipants: numParticipants,
                numMatches: numMatches
            },
            messages: req.flash('info')
        });
    }
}