const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const Match = require('../models/match');
const Participant = require('../models/participant');

var getParticipants = function(callback) {
    return Participant.find({verify: true}, callback);
}

router.get('/', middleware, function(req, res) {
    res.render('match');
});

router.post('/', middleware, function(req, res) {
    getParticipants(function(err, participants) {
        if (err) {
            console.error(err);
            return err;
        }

        if (err) {
            console.error(err);
            return err;
        }

        participants = shuffle(participants);

        const iter = participants.values();

        for (const val of iter) {
            console.log('Participants: ' + val);
        }

        var participantsCopy = participants.slice();
        
        for (var i = 0, notEnough = false; i < participants.length && notEnough == false; i++) {
            
            if (participantsCopy.length > 1)  {

                let x = 0;
                let diffDepartments = false;
                let previouslyMatched = false;

                let first = participantsCopy.splice(0, 1);
                let firstPerson = first[0];

                let second = participantsCopy.slice(0, 1);

                while (diffDepartments == false && previouslyMatched == false) {

                    let potential = participantsCopy.slice(x, x + 1);
                    let potentialPerson = potential[0];

                    if (firstPerson.matches !== undefined) {
                        let found = firstPerson.matches.find(function(element) {
                            return element === potentialPerson.email;
                        });

                        if (found !== undefined) {
                            previouslyMatched = true;
                        }
                    }

                    if (firstPerson.department != potentialPerson.department) {
                        second = participantsCopy.splice(x, 1);
                        diffDepartments = true;
                    }

                    x++;
                }

                if (previouslyMatched == false) {

                    var match = new Match({
                        person_1: {
                            name: firstPerson.name,
                            email: firstPerson.email,
                            department: firstPerson.department
                        },
                        person_2: {
                            name: second[0].name,
                            email: second[0].email,
                            department: second[0].department
                        }
                    });

                    match.save();

                    Participant.findOneAndUpdate({email: firstPerson.email}, {$push: {matches: second[0].email}}, function(err, doc) {
                        if (err) {
                            console.error(err);
                            return err;
                        }
                    });

                    Participant.findOneAndUpdate({email: second[0].email}, {$push: {matches: firstPerson.email}}, function(err, doc) {
                        if (err) {
                            console.error(err);
                            return err;
                        }
                    });
                }
            } else {
                notEnough = true;
            }
        }

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
};

module.exports = router;