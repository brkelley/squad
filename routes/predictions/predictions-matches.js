const matchData = require('../../mock-data/match-schedule.json');

exports.matches = (req, res) => {
    res.status(200).json(matchData);
}
