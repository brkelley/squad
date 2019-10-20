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

    MatchMetadata.findOne(findQuery).then((results, error) => {
        if (error) {
            res.status(400).json({ error });
            return;
        }
        Team.find().then((teams, error) => {
            if (error) {
                res.status(400).json({ error });
                return;
            }

            results.matches = results.matches.map(match => {
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

            res.status(200).json(results);
        });
    });
};

exports.saveMatchMetadata = (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;

    const findQuery = {
        ...year && { year },
        ...tournament && { tournament },
        ...section && { section },
        ...stage && { stage },
        ...round && { round }
    };

    MatchMetadata.findOneAndUpdate(findQuery, req.body, { new: true }).then((result, err) => {
        if (err) {
            res.status(401).json({ err });
            return;
        }
        res.status(201).json(result);
    });
};

exports.addMatchMetadata = (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;
    const { bestOf, matches } = req.body;

    const matchMetadata = new MatchMetadata();
    matchMetadata.year = year;
    matchMetadata.tournament = tournament;
    matchMetadata.section = section;
    matchMetadata.stage = stage;
    matchMetadata.round = round;
    matchMetadata.bestOf = bestOf;
    matchMetadata.matches = matches;

    matchMetadata.save().then((result, err) => {
        if (err) {
            res.status(401).json({ err });
            return;
        }
        res.status(201).json(result);
    });
};
