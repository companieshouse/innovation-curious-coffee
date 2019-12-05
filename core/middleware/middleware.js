function validateAdmin(req, res, next) {

    if (req.session.user) {
        return next();
    }

    return res.redirect('/admin');
}

module.exports = validateAdmin;