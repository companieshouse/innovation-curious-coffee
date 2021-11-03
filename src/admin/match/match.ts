import {Request, Response} from 'express';

import { matchService } from './MatchService';
import logger from '../../logger';
import ParticipantRepositoryImpl from '../../participant/ParticipantRepository';
import { MongoMatchRepository } from './MatchRepository';

const participantRepository = new ParticipantRepositoryImpl()
const matchRepository = new MongoMatchRepository()

export function get(req: Request, res: Response): void {
    logger.info('Rendering page: match');
    return res.render('match');
}

export async function post(req: Request, res: Response): Promise<void> {
    const participants = await participantRepository.getAllVerified()
    
    const { matches } = matchService.createMatches(participants)

    matchRepository.saveMatches(matches)
    participantRepository.saveMatchesToPreviousMatches(matches)

    return res.redirect('/');
}