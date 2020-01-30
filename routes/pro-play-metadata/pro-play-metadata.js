const axios = require('axios');
const get = require('lodash/get');
const groupBy = require('lodash/groupBy');
const entries = require('lodash/entries');
const cache = require('../../cache/cache.js');
const leagueMetadata = require('../../constants/leagues.json');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};
const GET_SCHEDULE_URL = 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US';
const GET_COMPLETED_GAMES_URL = 'https://esports-api.lolesports.com/persisted/gw/getCompletedEvents?hl=en-US';

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

module.exports.getSchedule = async (req, res) => {
    let scheduleFilters = get(req, 'query.leagueId')
        ? `&leagueId=${req.query.leagueId}`
        : '&leagueId=98767991302996019,98767991299243165';
    let scheduleData;

    try {
        // get unstarted games
        scheduleData = await axios.get(`${GET_SCHEDULE_URL}${scheduleFilters}`, { headers });
        scheduleData = scheduleData.data.data.schedule;
        let newerPageToken = get(scheduleData, 'pages.newer');

        while (newerPageToken) {
            const newerScheduleData = await axios.get(`${GET_SCHEDULE_URL}${scheduleFilters}&pageToken=${newerPageToken}`, { headers });
            scheduleData.events.push(...get(newerScheduleData.data.data.schedule, 'events', []));
            newerPageToken = get(newerScheduleData.data.data.schedule, 'pages.newer', null);
        }
        scheduleData = scheduleData.events;
        scheduleData = scheduleData.filter(el => ['unstarted', 'inProgress'].includes(el.state));

        // now, get completed games (this way we can get only the tournament games)
        const leagueIds = get(req, 'query.leagueId')
            ? get(cache.get('currentTournamentIds'), req.query.leagueId)
            : Object.values(cache.get('currentTournamentIds')).join(',');

        let completedGamesData = await axios.get(`${GET_COMPLETED_GAMES_URL}&tournamentId=${leagueIds}`, { headers });

        completedGamesData = completedGamesData.data.data.schedule.events.map(el => {
            el.state = 'completed';
            delete el.games;
            return el;
        });

        scheduleData.push(...completedGamesData);

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
        return;
    }

    // Sort the data into the separate leagues, then sort by start time
    scheduleData = scheduleData.sort((first, second) => {
        return new Date(first.startTime).getTime() - new Date(second.startTime).getTime();
    });
    let scheduleGroupedByRegion = groupBy(scheduleData, 'league.name');
    const scheduleGroupedByRegionId = {};

    scheduleGroupedByRegion = entries(scheduleGroupedByRegion).map(([key, value]) => {
        const league = leagueMetadata.find(el => el.name === key);
        scheduleGroupedByRegionId[league.id] = value;
    });

    res.status(200).json(scheduleGroupedByRegionId);
}
