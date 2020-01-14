const axios = require('axios');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};

module.exports.getLeagues = async (req, res) => {
    let leagues;
    try {
        const data = await axios.get(`https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US`, { headers });
        leagues = data.data.data.leagues; // lol.
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
        return;
    }
    res.status(200).json(leagues);
};
