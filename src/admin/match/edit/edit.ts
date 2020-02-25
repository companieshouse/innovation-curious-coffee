import {Request, Response} from 'express';

import Match from '../../../models/match';
import Participant from '../../../participant/participant';
import logger from '../../../logger';

export async function get(req: Request, res: Response): Promise<void> {
    logger.info('Rendering page: match-edit');

    const match = await Match.findById(req.params.id);
    const options = await Participant.find({verify: true});

    return res.render('match-edit', {
        match: match, 
        options: options, 
        messages: req.flash('info')
    });
}

export async function post(req: Request, res: Response): Promise<void> {

    logger.info("Validing match edit");

    const match1 = {
        name: req.body.match1name,
        email: req.body.match1email,
        department: req.body.match1department
    };

    const match2 = {
        name: req.body.match2name,
        email: req.body.match2email,
        department: req.body.match2department
    }

    if (match1.email == match2.email) {
        logger.info("Match edit failed: emails are identical");
        req.flash('info', "You cannot match somebody with themselves!");
        return res.redirect('/match-edit/' + req.params.id);
    } else if (match1.department == match2.department) {
        logger.info("Match edit failed: departments are identical");
        req.flash('info', "You cannot match people within the same department");
        return res.redirect('/match-edit/' + req.params.id);
    } else {
        const match = await Match.findById(req.params.id);

        if (match != null) {
            logger.info("Removing respective emails from participants match lists");
            //remove old matches from list
            await Participant.updateOne({email: match.person_1.email}, {$pull: {matches: match.person_2.email}});
            await Participant.updateOne({email: match.person_2.email}, {$pull: {matches: match.person_1.email}});

            match.person_1.name = match1.name;
            match.person_1.email = match1.email;
            match.person_1.department = match1.department;

            match.person_2.name = match2.name;
            match.person_2.email = match2.email;
            match.person_2.department = match2.department;

            logger.info("Saving new match");
            match.save();

            logger.info("Updating participant match lists");
            //add new matches to lists
            await Participant.updateOne({email: match1.email}, {$push: {matches: match2.email}});
            await Participant.updateOne({email: match2.email}, {$push: {matches: match1.email}});

            req.flash('info', 'Match updated successfully. Please check the matched list to ensure there are no duplicates as a result of your change.');
        }
        return res.redirect('/');
    }
}

export async function getData(req: Request, res: Response): Promise<Response> {

    logger.info("Retrieving participant data");
    res.setHeader('Content-Type', 'application/json');

    const participant = await Participant.findOne({email: req.params.email});

    return res.send({
        data: participant
    });
}