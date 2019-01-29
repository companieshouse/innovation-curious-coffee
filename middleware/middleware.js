var fs = require('fs');

var adminJSON = fs.readFileSync("./admin/admin.json");

function validateAdmin(req, res, next) {

    if (req.session.user) {
        return next();
    }
     
    res.redirect('/admin');
}

module.exports = validateAdmin;