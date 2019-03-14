var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');
const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

router.get('/', middleware, function(req, res) {

    res.render('participants_department_chart');
});

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

router.get('/data', middleware, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    getParticipantsByDepartment().then(function(docs) {
        
        var labels = [];

        docs.forEach(function(doc) {
            labels.push(doc._id);
        });

        Promise.all(labels).then(function() {
            var data = [];
            var bgColor = [];

            docs.forEach(function(doc) {
                data.push(doc.count);
                bgColor.push("rgba(" + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", " + randomIntFromInterval(0,255) + ", 0.2)");
            });

            Promise.all(data, bgColor).then(function() {

                res.send({
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

var getParticipantsByDepartment = function() {

    return new Promise(function(resolve, reject) {
        db.people.aggregate({"$group": {
            _id: "$department", count: {"$sum": 1}
        }}, function(err, docs) {
            
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
}

module.exports = router;