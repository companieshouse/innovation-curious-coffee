import { Request, Response } from 'express';

import { ParticipantRepository } from './ParticipantRepository';
import logger from '../logger';

export default class ParticipantsByDepartmentService {
    constructor(private repository: ParticipantRepository) {
    }

    private randomIntFromInterval = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    public getGroupedByDepartment = (req: Request, res: Response): void => {
        logger.info("Rendering page: participantsDepartmentChart");
        return res.render('participantsDepartmentChart');
    };

    public getGroupedByDepartmentData = async(req: Request, res: Response): Promise<Response> => {
        logger.info("Attempting to get data to see how many registered from each department");
        const participantsByDepartmentData = await this.repository.getAllGroupedByDepartment();

        const labels: string[] = [];
        const data: number[] = [];
        const bgColor: string[] = [];

        participantsByDepartmentData.forEach(element => {
            labels.push(element._id); // eslint-disable-line no-underscore-dangle
            data.push(element.count);
            bgColor.push("rgba(" + this.randomIntFromInterval(0, 255) + ", " + this.randomIntFromInterval(0, 255) + ", " + this.randomIntFromInterval(0, 255) + ", 0.2)");
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
    };
}
