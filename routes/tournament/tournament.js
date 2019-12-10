const MatchMetadata = require('../../models/match-metadata.schema.js');
const Team = require('../../models/team.schema.js');
const UserPrediction = require('../../models/user-prediction.schema.js');
const MatchResults = require('../../models/match-results.schema.js');
const jwt = require('jsonwebtoken');

exports.getTournamentPredictions = async (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;
    const { _id } = jwt.decode(req.headers.squadtoken);

    const findQuery = {
        ...year && { year },
        ...tournament && { tournament },
        ...section && { section },
        ...stage && { stage },
        ...round && { round }
    };

    const matchMetadata = await MatchMetadata.findOne(findQuery);
    const teams = await Team.find();
    const userPredictions = await UserPrediction.find({ ...findQuery, userId: _id });
    const matchResults = await MatchResults.findOne(findQuery);

    const mappedMatches = matchMetadata.matches.map(match => {
        return {
            ...match,
            redSide: teams.find(team => team.name === match.redSide),
            blueSide: teams.find(team => team.name === match.blueSide)
        };
    });

    res.status(200).json(mappedMatches);
};
