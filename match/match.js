const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const MasterMatch = require('../models/masterMatch');
const Match = require('../models/match');
const Participant = require('../models/participant');

const config = require('../config/config');
const mongojs = require('mongojs');

const db = mongojs(config.db.name, config.db.collections);

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

        getMasterMatches(participants, function(err, masterMatches) {
            if (err) {
                console.error(err);
                return err;
            }

            participants = shuffle(participants);
            var participantsCopy = participants.slice();

            var matchedArray = [];
            
            for (var i = 0, notEnough = false; i < participants.length && notEnough == false; i++) {
                
                if (participantsCopy.length > 1)  {

                    let x = 0;
                    let diffDepartments = false;
                    let previouslyMatched = false;

                    let first = participantsCopy.splice(0, 1);

                    //Love a good hack
                    if (masterMatches === undefined || masterMatches.length == 0) {
                        masterMatches = [];
                    }

                    let masterMatch = masterMatches.find(function(element) {
                        console.log('Element: ' + element);
                        return element.participant === first[0];
                    });

                    console.log ('masterMatch: ' + masterMatch);

                    let second = participantsCopy.slice(0, 1);

                    while (diffDepartments == false && previouslyMatched == false) {

                        let potential = participantsCopy.slice(x, x + 1);

                        if (masterMatch !== undefined) {
                            let found = masterMatch.matches.find(function(element) {
                                console.log('Element: ' + element);
                                return element === potential[0];
                            });

                            if (found !== undefined) {
                                previouslyMatched = true;
                            }
                        }

                        if (first[0].department != potential[0].department) {
                            second = participantsCopy.splice(x, 1);
                            diffDepartments = true;
                        }

                        x++;
                    }

                    if (previouslyMatched == false) {
                        matchedArray.push({
                            "person_1": first[0],
                            "person_2": second[0]
                        });

                        if (masterMatch !== undefined) {
                            masterMatch.matches.push(second[0]);
                        } else {
                            let matchesForMaster = [];
                            matchesForMaster.push(second[0]);
                            masterMatches.push({
                                participant : first[0],
                                matches : matchesForMaster
                            });
                        }

                        let otherMatch = masterMatches.find(function(element) {
                            return element == second[0];
                        });

                        if (otherMatch == undefined) {
                            let matchesForMaster = [];
                            matchesForMaster.push(first[0]);
                            masterMatches.push({
                                participant : second[0],
                                matches : matchesForMaster
                            });
                        } else {
                            otherMatch.matches.push(first[0]);
                        }
                    }
                } else {
                    notEnough = true;
                }
            } 

            db.matches.insert(matchedArray);

            masterMatches.forEach(function(match) {
                MasterMatch.findOneAndUpdate({participant: match.participant}, match, {upsert: true, new: true}, function(err, doc) {
                    if (err) {
                        console.error(err);
                        return err;
                    }
                });
            });
        });

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

//Retrieves all the master match lists for a given set of participants
function getMasterMatches(participants, callback) {
    return MasterMatch.find({participant : {$in: participants}}).exec(callback);
}

module.exports = router;