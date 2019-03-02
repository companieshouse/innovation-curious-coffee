var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');

const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

router.get('/', middleware, function(req, res) {

    res.render('date_registered_chart');
});

router.get('/data', middleware, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    getDateRegistered().then(function(docs) {
        
        var labels = [];

        docs.forEach(function(doc) {
            labels.push(doc._id.yearRegistered + "-" + doc._id.monthRegistered + "-" + doc._id.dayRegistered);
        });

        Promise.all(labels).then(function() {
            var data = [];

            docs.forEach(function(doc) {
                data.push(doc.count);
            });

            Promise.all(data).then(function() {

                res.send({
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
                            }]
                        },
                        elements: {
                            line: {
                                tension: 0
                            }
                        }
                    }
                });
            });
        });
    });
});

var getDateRegistered = function() {

    return new Promise(function(resolve, reject) {
        db.people.aggregate({"$group": {
            _id: {
            yearRegistered: {"$year": "$date_registered"},
            monthRegistered: {"$month": "$date_registered"},
            dayRegistered: {"$dayOfMonth": "$date_registered"}},
            count: {"$sum": 1}
        }}, function(err, docs) {
            
            if (err) {
                reject(err);
            }

            resolve(docs);
        });
    });
}

module.exports = router;