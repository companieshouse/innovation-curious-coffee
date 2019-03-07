const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

class RegisterService {

    checkRegistered(email) {

        return new Promise(function(resolve, reject) {
            db.people.find({email: email}, function(err, docs) {
                if (docs.length < 1) {
                    resolve(docs);
                } else {
                    reject(new Error('Email address already registered!'));
                }
            })
        });
    };

    insert(name, department, email) {
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