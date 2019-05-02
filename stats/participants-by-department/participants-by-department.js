var express = require('express');
var router = express.Router();
const Participant = require('../../models/participant');

router.get('/', function(req, res) {
    res.render('participants_department_chart');
});

router.get('/data', getData);

async function getData(req, res) {
    let participantsByDepartmentData = await getParticipantsByDepartment();

    var labels = [];
    var data = [];
    var bgColor = [];

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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getParticipantsByDepartment() {
    return Participant.aggregate([{
        "$group": {
            _id: "$department",
            count: {
                "$sum": 1
            }
        }
    }]);
};

module.exports = router;