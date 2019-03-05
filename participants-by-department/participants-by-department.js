var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');

const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', middleware, function(req, res) {

    res.render('participants_department_chart');
});

router.get('/data', middleware, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    getParticipantsByDepartment().then(function(docs) {
        
        var labels = [];

        docs.forEach(function(doc) {
            labels.push(doc._id);
        });

        Promise.all(labels).then(function() {
            var data = [];

            docs.forEach(function(doc) {
                data.push(doc.count);
            });

            Promise.all(data).then(function() {

                res.send({
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],
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