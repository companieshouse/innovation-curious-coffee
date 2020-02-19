import {Request, Response} from 'express';
import mongoose from 'mongoose';

import Participant from '../../models/participant';
import logger from '../../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: participantsDepartmentChart");
    return res.render('participantsDepartmentChart');
}

interface Aggregation {
    _id: string;
    count: number;
}

function getParticipantsByDepartment(): mongoose.Aggregate<Aggregation[]> {
    logger.info("Aggregating info");
    return Participant.aggregate([{
        "$group": {
            _id: "$department",
            count: {
                "$sum": 1
            }
        }
    }]);
}

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getData(req: Request, res: Response): Promise<Response> {
    logger.info("Attempting to get data to see how many registered from each department");
    const participantsByDepartmentData = await getParticipantsByDepartment();

    const labels: string[] = [];
    const data: number[] = [];
    const bgColor: string[] = [];

    participantsByDepartmentData.forEach(element => {
        labels.push(element._id);
        data.push(element.count);
        bgColor.push("rgba(" + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", 0.2)");
    });

    await labels, data, bgColor;

    return res.send({
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColor,
                borderWidth: 1
            }]
        },
        options: {
            title: {     
                display: true,
                text: "Number of participants by department"
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                        display: true,
                    ticks: {
                        beginAtZero: true,
                        stepValue: 10,
                        stepSize: 1
                    }
                    }],
                xAxes: [{
                    ticks: {
                        autoSkip: false
                    }
                }]
            }
        }
    });
}