const ProPlayMetadataUtils = require('./pro-play-metadata.util.js');
const axios = require('axios');
const cache = require('../../cache/cache.js');
const get = require('lodash/get');
const keyBy = require('lodash/keyBy');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};
const GET_SCHEDULE_URL = 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US';
const GET_COMPLETED_GAMES_URL = 'https://esports-api.lolesports.com/persisted/gw/getCompletedEvents?hl=en-US';
const GET_STANDINGS_URL = 'https://esports-api.lolesports.com/persisted/gw/getStandings?hl=en-US';

module.exports.getTeams = async (req, res) => {
    res.status(200).json(cache.get('currentTeams'));
}

const getMatchMetadata = async (leagueIds, tournamentIds) => {
    const scheduleFilters = `&leagueId=${leagueIds.join(',')}`;

    try {
        let scheduleData = await axios.get(`${GET_SCHEDULE_URL}&leagueId=${leagueIds.join(',')}`, { headers });
        scheduleData = scheduleData.data.data.schedule;
        let newerPageToken = get(scheduleData, 'pages.newer');

        while (newerPageToken) {
            const newerScheduleData = await axios.get(`${GET_SCHEDULE_URL}${scheduleFilters}&pageToken=${newerPageToken}`, { headers });
            scheduleData.events.push(...get(newerScheduleData.data.data.schedule, 'events', []));
            newerPageToken = get(newerScheduleData.data.data.schedule, 'pages.newer', null);
        }
        scheduleData = scheduleData.events;
        scheduleData = scheduleData.filter(el => ['unstarted', 'inProgress'].includes(el.state) && el.type === 'match');

        let completedGamesData = await axios.get(`${GET_COMPLETED_GAMES_URL}&tournamentId=${tournamentIds}`, { headers });

        completedGamesData = completedGamesData.data.data.schedule.events.map(el => {
            el.state = 'completed';
            delete el.games;
            return el;
        });
        scheduleData.push(...completedGamesData);

        return keyBy(scheduleData, 'match.id');
    } catch (error) {
        throw new Error(error);
    }
};



module.exports.getSchedule = async (req, res) => {
    if (!req.query.leagueId) {
        res.status(400).send('Required: league ID(s)');
        return;
    }
    const leagueIds = req.query.leagueId.split(',');

    const currentTournaments = cache.get('currentTournaments');
    const currentTournamentIdArr = currentTournaments.map((tournament) => tournament.id);
    const currentTournamentIds = currentTournamentIdArr.join(',');


    const schedulesData = [];
    try {
        const matchMetadata = await getMatchMetadata(leagueIds, currentTournamentIds);
        for (let i = 0; i < currentTournaments.length; i++) {
            const currentTournament = currentTournaments[i];
            const currentScheduleData = await axios.get(`${GET_STANDINGS_URL}&tournamentId=${currentTournament.id}`, { headers });
            console.log('tournament IDs', currentTournament.id)
            let currentSchedule = get(currentScheduleData, 'data.data.standings[0]'); // need to be able to group tournaments by league in the future
            currentSchedule.tournamentSlug = currentTournament.slug;
            currentSchedule.tournamentName = ProPlayMetadataUtils.convertTournamentSlug(currentTournament.slug);
            currentSchedule = ProPlayMetadataUtils.populateMatchTimes(currentSchedule, matchMetadata);

            currentSchedule.stages = currentSchedule.stages.map((stage) => {
                if (stage.slug === 'regular_season') {
                    return ProPlayMetadataUtils.convertRegularSeasonStage(stage);
                }

                return stage;
            });

            const existingLeagueSchedule = schedulesData.find((schedule) => schedule.leagueId === currentTournament.leagueId);
            if (existingLeagueSchedule) {
                existingLeagueSchedule.schedule.push(currentSchedule);
            } else {
                schedulesData.push({
                    leagueId: currentTournament.leagueId,
                    leagueName: currentTournament.leagueName,
                    schedule: [currentSchedule]
                });
            }
        };
    } catch (error) {
        res.status(500).send(error);
        console.log(error)
    }

    res.status(200).json(schedulesData);
};
