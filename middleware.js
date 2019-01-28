var fs = require('fs');

var adminJSON = fs.readFileSync("admin.json");

function validateAdmin(req, res, next) {

    var app = req.app;

    if (app.locals.user) {
        return next();
    }    
    res.redirect('/admin');
}

module.exports = validateAdmin;