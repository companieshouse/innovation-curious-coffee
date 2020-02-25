import {Request, Response} from 'express';

import Match from '../../models/match';
import Participant, {InterfaceParticipant} from '../../participant/participant';
import logger from '../../logger';

function shuffle(array: Array<InterfaceParticipant>): Array<InterfaceParticipant> {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

export function get(req: Request, res: Response): void {
    logger.info('Rendering page: match');
    return res.render('match');
}

async function getShuffledParticipants(): Promise<Array<InterfaceParticipant>> {
    const participants = await Participant.find({verify: true});
    return shuffle(participants);
}

export async function post(req: Request, res: Response): Promise<void> {
    logger.info("Attempting to match participants");
    const participants = await getShuffledParticipants();

    const participantsCopy = participants.slice();
    
    for (let i = 0, notEnough = false; i < participants.length && notEnough == false; i++) {
        
        if (participantsCopy.length > 1)  {

            let x = 0;
            let diffDepartments = false;
            let previouslyMatched = false;

            const first = participantsCopy.splice(0, 1);
            const firstPerson = first[0];

            let second = participantsCopy.slice(0, 1);

            while (diffDepartments == false && previouslyMatched == false) {

                const potential = participantsCopy.slice(x, x + 1);
                const potentialPerson = potential[0];

                if (firstPerson.matches !== undefined) {
                    const found = firstPerson.matches.find(function(element) {
                        return element === potentialPerson.email;
                    });

                    if (found !== undefined) {
                        previouslyMatched = true;
                    }
                }

                if (firstPerson.department != potentialPerson.department) {
                    second = participantsCopy.splice(x, 1);
                    diffDepartments = true;
                }

                x++;
            }

            if (previouslyMatched == false) {

                const match = new Match({
                    "person_1": {
                        name: firstPerson.name,
                        email: firstPerson.email,
                        department: firstPerson.department
                    },
                    "person_2": {
                        name: second[0].name,
                        email: second[0].email,
                        department: second[0].department
                    }
                });

                logger.info("Match created, saving the following: " + match);

                match.save();

                logger.info("Updating participant match lists");

                await Participant.findOneAndUpdate({
                    email: firstPerson.email
                }, {
                    $push: {
                        matches: second[0].email
                    }});

                await Participant.findOneAndUpdate({
                    email: second[0].email
                }, {
                    $push: {
                        matches: firstPerson.email
                    }});
            }
        } else {
            notEnough = true;
        }
    }

    return res.redirect('/');
}