const express = require('express');
const dbname = 'people';

const mongojs = require('mongojs');
const db = mongojs('curious', [dbname]);

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
                email: email
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