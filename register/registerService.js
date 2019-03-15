const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

const Participant = require('../models/participant');

class RegisterService {

    getEmailError() {

        var error = {
            msg: 'Email address already registered!',
            param: 'email'
        };

        return error;
    }

    checkRegistered(email) {
        return Participant.find({email: email}).exec();
    };

    insert(body) {

        var participant = new Participant({
            name: body.name,
            department: body.department,
            email: body.email,
            date_registered: new Date(),
            verify: false
        });
        
        return participant.save();

        return new Promise(function(resolve, reject) {
            db.people.insert({
                name: name,
                department: department,
                email: email,
                date_registered: new Date(),
                verify: false
            }, function(err, doc) {
    
                if (err) {
                    reject(err);
                }
    
                resolve(doc);
            });
        });
    };
};

module.exports = RegisterService;