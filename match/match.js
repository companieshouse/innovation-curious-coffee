const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

var getParticipants = function() {
    return new Promise(function(resolve, reject) {
        db.people.find({verify: true}, function(err, docs) {

            if (err) {
                reject(err);
            }

            resolve(docs);
        });    
    });
}

router.get('/', middleware, function(req, res) {
    res.render('match');
});

router.post('/', middleware, function(req, res) {
    getParticipants().then(function(participants) {

        participants = shuffle(participants);
        var participantsCopy = participants.slice();

        var matchedArray = [];
        
        
        for (var i = 0, notEnough = false; i < participants.length && notEnough == false; i++) {
            
            if (participantsCopy.length > 1)  {

                let x = 0;
                let diffDepartments = false;

                let first = participantsCopy.splice(0, 1);

                let second = participantsCopy.slice(0, 1);

                while (diffDepartments == false) {

                    let potential = participantsCopy.slice(x, x + 1);

                    if (first[0].department != potential[0].department) {
                        second = participantsCopy.splice(x, 1);
                        diffDepartments = true;
                    }

                    x++;
                }

                matchedArray.push({
                    "person_1": first[0],
                    "person_2": second[0]
                });
            } else {
                notEnough = true;
            }
        } 

        db.matches.insert(matchedArray);

        res.redirect('/');
    });
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

module.exports = router;