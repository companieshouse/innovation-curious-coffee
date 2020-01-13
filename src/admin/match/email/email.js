const Match = require('../../../../models/match');
const aws = require('aws-sdk');

aws.config.update({region: 'eu-west-1'});

function get(req, res) {
    return res.render('email');
};

async function post(req, res) {
    let matches = await Match.find();

    matches.forEach(function(match) {

        var params = {
            Destination: {
                ToAddresses: [
                    match.person_1.email,
                    match.person_2.email
                ]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: 'Congratulations! You have both been matched together to go and get a #CuriousCoffee. Now its over to you to start the conversation!'
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'It\'s a match!'
                }
            },
            Source: 'curious-coffee@companieshouse.gov.uk'
        };

        var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        sendPromise.then(function(data) {
            console.log(data.MessageId);
        }).catch(function(err) {
            console.log(err);
        });
    });

    return res.redirect('/');
};

module.exports.get = get;
module.exports.post = post;