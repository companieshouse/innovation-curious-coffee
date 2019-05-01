var express = require('express');
var router = express.Router();
const middleware = require('../middleware/middleware');
const Participant = require('../models/participant');

router.get('/', middleware, function(req, res) {
    res.render('date_registered_chart');
});

router.get('/data', middleware, function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    getDateRegistered(function(err, docs) {
        if (err) {
            console.error(err);
            return res.redirect('/oops');
        }

        Promise.all(docs).then(function() {
            var labels = [];
            var data = [];

            docs.forEach(function(doc) {
                labels.push(doc._id.yearRegistered + "-" + doc._id.monthRegistered + "-" + doc._id.dayRegistered);
                data.push(doc.count);
            });

            Promise.all(labels, data).then(function() {
                var maxPlusOne = Math.max.apply(Math, data) + 1;
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
        });
        });
    });
});

function getDateRegistered(callback) {

    return Participant.aggregate([{
        $group: {
            _id: {
            yearRegistered: {"$year": "$date_registered"},
            monthRegistered: {"$month": "$date_registered"},
            dayRegistered: {"$dayOfMonth": "$date_registered"}},
            count: {"$sum": 1}
        }}, {
        $sort: {
            "_id": 1
        }
    }], callback);
}

module.exports = router;
