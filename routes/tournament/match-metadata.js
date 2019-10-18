const MatchMetadata = require('../../models/match-metadata.schema.js');
const Team = require('../../models/team.schema.js');

exports.getMatchMetadata = (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;

    const findQuery = {
        ...year && { year },
        ...tournament && { tournament },
        ...section && { section },
        ...stage && { stage },
        ...round && { round }
    };

    MatchMetadata.find(findQuery).then((matches, error) => {
        if (error) {
            res.status(400).json({ error });
            return;
        }
        Team.find().then((teams, error) => {
            if (error) {
                res.status(400).json({ error });
                return;
            }

            matches[0].matches = matches[0].matches.map(match => {
                if (!teams.find(team => team.name === match.redSide)) {
                    console.log('YO WHAT THE FUCK: ', match.redSide);
                }
                if (!teams.find(team => team.name === match.blueSide)) {
                    console.log('YO WHAT THE FUCK: ', match.blueSide);
                }
                return {
                    ...match,
                    redSide: teams.find(team => team.name === match.redSide),
                    blueSide: teams.find(team => team.name === match.blueSide)
                };
            });

            res.status(200).json(matches);
        });
    });
};

exports.saveMatchMetadata = (req, res) => {
    const matchMetadata = new MatchMetadata();

    matchMetadata.year = req.params.year;
    matchMetadata.tournament = req.params.tournament;
    matchMetadata.section = req.query.section;
    matchMetadata.stage = req.query.stage;
    matchMetadata.round = req.query.round;
    matchMetadata.bestOf = req.body.bestOf;
    matchMetadata.matches = req.body.matches;

    matchMetadata.save().then((result, err) => {
        if (err) {
            res.status(401).json({ err });
            return;
        }
        res.status(201).json(result);
    });
};
