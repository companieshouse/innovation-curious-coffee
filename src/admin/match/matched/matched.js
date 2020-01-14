const Match = require('../../../models/match');

async function get(req, res) {
    let matches = await Match.find();

    return res.render('matched', {matches: matches});
};

module.exports.get = get;