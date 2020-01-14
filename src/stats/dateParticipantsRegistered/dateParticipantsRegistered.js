const Participant = require('../../models/participant');

function get(req, res) {
    return res.render('date_registered_chart');
}

async function getData(req, res) {
    res.setHeader('Content-Type', 'application/json');

    let dateRegisteredData = await getDateRegistered();

    let labels = [];
    let data = [];

    dateRegisteredData.forEach(element => {
        labels.push(element._id.yearRegistered + "-" + element._id.monthRegistered + "-" + element._id.dayRegistered);
        data.push(element.count);
    });

    await labels, data;

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
};

function getDateRegistered() {

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
    }]);
};

module.exports.get = get;
module.exports.getData = getData;
