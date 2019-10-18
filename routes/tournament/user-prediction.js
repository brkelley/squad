const UserPrediction = require('../../models/user-prediction.schema.js');

exports.getUserPrediction = (req, res) => {
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

    UserPrediction.find(findQuery).then((predictions, error) => {
        if (error) {
            res.status(400).json({ error });
            return;
        }
        res.status(200).json(predictions);
    });
};

exports.createUserPrediction = (req, res) => {
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

    userPrediction.save().then((result, err) => {
        if (err) {
            res.status(400).json({ err });
            return;
        }
        res.status(201).json(result);
    });
};

exports.updateUserPredictions = (req, res) => {

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

    UserPrediction.findOneAndUpdate({ year, tournament, userId, section, stage, round }, { predictions })
        .then(() => {
            res.status(201).json(userPrediction);
        });
};
