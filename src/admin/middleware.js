"use strict";

module.exports.validate = function(req, res, next) {

    if (req.originalUrl.startsWith("/admin/")) {
        if (!req.session.user) {
            return res.redirect('/admin');
        }
    }
    
    return next();
};