const UserPrediction = require('../../models/user-prediction.schema.js');
const MatchResults = require('../../models/match-results.schema.js');

exports.getUserPrediction = async (req, res) => {
    const { year, tournament, userId } = req.params;
    const { section, stage, round } = req.query;

    const findQuery = {
        ...year && { year },
        ...tournament && { tournament },
        ...section && { section },
        ...stage && { stage },
        ...round && { round },
        ...userId && { userId }
    };

    try {
        const predictions = await UserPrediction.find(findQuery);
        res.status(200).json(predictions);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.createUserPrediction = async (req, res) => {
    const { year, tournament, userId } = req.params;
    const { section, stage, round } = req.query;
    const { predictions } = req.body;

    const userPrediction = new UserPrediction({
        year,
        tournament,
        userId,
        section,
        stage,
        round,
        predictions
    });

    try {
        const result = await userPrediction.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ err });
    }
};

exports.updateUserPredictions = async (req, res) => {
    const { year, tournament, userId } = req.params;
    const { section, stage, round } = req.query;
    const { predictions } = req.body;

    try {
        const userPrediction = await UserPrediction.findOneAndUpdate({ year, tournament, userId, section, stage, round }, { predictions });
        res.status(201).json(userPrediction);
    } catch (error) {
        res.status(400).json({ err });
    }
};

exports.getCurrentStandings = async (req, res) => {
    const { year, tournament } = req.params;
    let results, userPredictions;

    console.log('IN HERE');

    try {
        results = MatchResults.find({ year, tournament });
        userPredictions = UserPrediction.find({ year, tournament });
    } catch (error) {
        res.status(400).json({ error });
        return;
    }

    console.log('results: ', results);
    console.log('userPredictions: ', userPredictions);

    res.status(200).json({ results, userPredictions });
};
