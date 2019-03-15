var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');
const Participant = require('../models/participant');

router.get('/', middleware, function(req, res) {
    res.render('participants_department_chart');
});

router.get('/data', middleware, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    getParticipantsByDepartment(function(err, docs) {
        if (err) {
            console.error(err);
            return res.redirect('/oops');
        }

        Promise.all(docs).then(function() {
            var labels = [];
            var data = [];
            var bgColor = [];

            docs.forEach(function(doc) {
                labels.push(doc._id);
                data.push(doc.count);
                bgColor.push("rgba(" + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", 0.2)");
            });

            Promise.all(labels, data, bgColor).then(function() {
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
            });
        });
    });
});

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getParticipantsByDepartment(callback) {
    return Participant.aggregate([{
        "$group": {
            _id: "$department",
            count: {
                "$sum": 1
            }
        }
    }], callback);
};

module.exports = router;