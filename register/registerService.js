const Participant = require('../models/participant');

class RegisterService {

    getEmailError() {

        var error = {
            msg: 'Email address already registered!',
            param: 'email'
        };

        return error;
    }

    checkRegistered(email, callback) {
        return Participant.findOne({email: email}).exec(callback);
    };

    insert(body, callback) {

        var participant = new Participant({
            name: body.name,
            department: body.department,
            email: body.email,
            date_registered: new Date(),
            verify: false
        });
        
        return participant.save(callback);
    };
};

module.exports = RegisterService;