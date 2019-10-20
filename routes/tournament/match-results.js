const MatchResults = require('../../models/match-results.schema.js');

exports.createResults = (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;
    const { results } = req.body;

    const matchResults = new MatchResults();

    matchResults.year = year;
    matchResults.tournament = tournament;
    matchResults.section = section;
    matchResults.stage = stage;
    matchResults.round = round;
    matchResults.results = results;

    matchResults.save().then((result, err) => {
        if (err) {
            res.status(400).json({ err });
            return;
        }
        res.status(201).json(result);
    });
};

exports.getResults = (req, res) => {
    const { year, tournament } = req.params;
    const { section, stage, round } = req.query;

    const findQuery = {
        ...year && { year },
        ...tournament && { tournament },
        ...section && { section },
        ...stage && { stage },
        ...round && { round }
    };

    MatchResults.findOne(findQuery).then((results, error) => {
        if (error) {
            res.status(400).json({ error });
            return;
        }
        res.status(200).json(results);
    });
}
