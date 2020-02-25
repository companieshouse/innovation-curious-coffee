import {Request, Response} from 'express';
import mongoose from 'mongoose';

import Participant from '../../participant/ParticipantModel';
import logger from '../../logger';

export function get(req: Request, res: Response): void {
    logger.info("Rendering page: dateRegisteredChart");
    return res.render('dateRegisteredChart');
}

interface Aggregation {
    _id: {
        yearRegistered: Date;
        monthRegistered: Date;
        dayRegistered: Date;
    };
    count: number;
}

function getDateRegistered(): mongoose.Aggregate<Aggregation[]> {
    logger.info("Aggregating info");

    return Participant.aggregate([{
        $group: {
            _id: {
                yearRegistered: {"$year": "$date_registered"},
                monthRegistered: {"$month": "$date_registered"},
                dayRegistered: {"$dayOfMonth": "$date_registered"}
        },
            count: {"$sum": 1}
        }
    }, {
        $sort: {
            "_id": 1
        }
    }]);
}

export async function getData(req: Request, res: Response): Promise<Response> {
    logger.info("Attempting to get data to see how many registered on each date");
    res.setHeader('Content-Type', 'application/json');

    const dateRegisteredData = await getDateRegistered();

    const labels: string[] = [];
    const data: number[] = [];

    dateRegisteredData.forEach(element => {
        labels.push(element._id.yearRegistered + "-" + element._id.monthRegistered + "-" + element._id.dayRegistered);
        data.push(element.count);
    });

    await labels, data;

    const maxPlusOne = Math.max(...data) + 1;
    data.push(maxPlusOne);

    return res.send({
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                fill: false,
                showLine: true,
                data: data,
                borderWidth: 1,
                borderColor: "rgb(75, 192, 192)"
            }]
        },
        options: {
            title: {
                display: true,
                text: "Registration trends"
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                        display: true,
                        ticks: {
                          beginAtZero: true,
                          stepSize: 1
                        }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    });
}