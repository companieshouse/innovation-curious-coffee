import mongoose from 'mongoose';

import ParticipantImpl, {Participant} from './ParticipantModel';
import logger from '../logger';
import { Match } from '../admin/match/MatchService';

interface DepartmentAggregation {
    _id: string;
    count: number;
}

interface DateRegisteredAggregation {
    _id: {
        yearRegistered: Date;
        monthRegistered: Date;
        dayRegistered: Date;
    };
    count: number;
}

export interface ParticipantRepository {
    getOne(email: string): Promise<Participant|null>;
    getAllVerified(): Promise<Participant[]>;
    getAllGroupedByDepartment(): mongoose.Aggregate<DepartmentAggregation[]>;
    getAllGroupedByDateRegistered(): mongoose.Aggregate<DateRegisteredAggregation[]>;
}

export default class ParticipantRepositoryImpl implements ParticipantRepository {
    public getOne = async (email: string): Promise<Participant|null> => {
        const participant = await ParticipantImpl.findOne({
            email: email
        });

        return participant;
    }

    public getAllVerified = async (): Promise<Participant[]> => {
        const participants = await ParticipantImpl.find({
           verify: true 
        }).sort({
            "date_registered": 1
        });

        return participants;
    }

    public getAllGroupedByDepartment = (): mongoose.Aggregate<DepartmentAggregation[]> => {
        logger.info("Getting all participants grouped by department");
        return ParticipantImpl.aggregate([{
            "$group": {
                _id: "$department",
                count: {
                    "$sum": 1
                }
            }
        }]);
    }

    public getAllGroupedByDateRegistered = (): mongoose.Aggregate<DateRegisteredAggregation[]> => {
        logger.info("Getting all participants grouped by date registered");

        return ParticipantImpl.aggregate([{
            $group: {
                _id: {
                    yearRegistered: {
                        "$year": "$date_registered"
                    },
                    monthRegistered: {
                        "$month": "$date_registered"
                    },
                    dayRegistered: {
                        "$dayOfMonth": "$date_registered"
                    }
            },
                count: {
                    "$sum": 1
                }
            }
        }, {
            $sort: {
                "_id": 1
            }
        }]);
    }

    public saveMatchesToPreviousMatches = async (matches: Array<Match>): Promise<unknown[]> => {
        const promises: Array<Promise<unknown>> = []
        for (let { participant_1: p1, participant_2: p2 } of matches) {
            p1.matches.push(p2.email)
            p2.matches.push(p1.email)

            promises.push(
                p1.save(), 
                p2.save()
            )
        }

        return Promise.all(promises)
    }
}