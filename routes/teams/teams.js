const Team = require('../../models/team.schema.js');
const mockTeamData = require('../../mock-data/teams.json');

exports.getTeamData = (req, res) => {
    Team.find({}, (err, teams) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).send(teams);
    });
};

exports.getTeamByName = (req, res) => {
    Team.findOne({ name: req.params.name }, (err, team) => {
        if (err) {
            res.status(400).json(err);
            return;
        }

        if (!team) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json({data: team});
    });
};
