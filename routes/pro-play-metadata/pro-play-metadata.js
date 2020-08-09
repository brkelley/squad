const axios = require('axios');
const cache = require('../../cache/cache.js');
const cloneDeep = require('lodash/cloneDeep');
const get = require('lodash/get');
const keyBy = require('lodash/keyBy');
const moment = require('moment');
const LEAGUES = require('../../constants/leagues.json');

const headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
};
const GET_SCHEDULE_URL = 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US';
const GET_COMPLETED_GAMES_URL = 'https://esports-api.lolesports.com/persisted/gw/getCompletedEvents?hl=en-US';
const GET_STANDINGS_URL = 'https://esports-api.lolesports.com/persisted/gw/getStandings?hl=en-US';
const REGULAR_SEASON_TIME_CARDINALITY = 70;

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

const populateMatchTimes = (schedules, matchMetadata) => {
    return schedules.map((schedule) => {
        return schedule.stages.map((stage) => {
            const sections = stage.sections
                .map((section) => {
                    const matches = section.matches
                        .map((match) => {
                            const metadataVal = get(matchMetadata, match.id);
                            const extraData = (metadataVal)
                                ? {
                                    startTime: metadataVal.startTime,
                                    blockName: metadataVal.blockName,
                                    strategy: metadataVal.match.strategy,
                                    league: metadataVal.league
                                }
                                : {};
    
                            return {
                                ...match,
                                ...extraData
                            }; 
                        })
                        .sort((a, b) => {
                            const aStartTime = new Date(a.startTime).getTime();
                            const bStartTime = new Date(b.startTime).getTime();
    
                            return aStartTime - bStartTime;
                        });
    
                    const startTime = matches[0].startTime;
                    const endOfArr = matches.length === 0 ? 0 : matches.length - 1;
                    const endTime = matches[endOfArr].startTime;
    
                    return {
                        ...section,
                        matches,
                        startTime,
                        endTime
                    }
                })
                .sort((a, b) => {
                    const aStartTime = new Date(a.startTime).getTime();
                    const bStartTime = new Date(b.startTime).getTime();
    
                    return aStartTime - bStartTime;
                });
            
            const startTime = sections[0].startTime;
            const endTime = sections[sections.length - 1].endTime;
    
            return { ...stage, sections, startTime, endTime };
        });
    });
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


    const stagesData = [];
    let scheduleData, matchMetadata; 
    try {
        scheduleData = await axios.get(`${GET_STANDINGS_URL}&tournamentId=${currentTournamentIds}`, { headers });
        matchMetadata = await getMatchMetadata(leagueIds, currentTournamentIds);
    } catch (error) {
        res.status(500).send(error);
        throw new Error(error);
    }

    const standings = get(scheduleData, 'data.data.standings');

    const populatedStandings = populateMatchTimes(standings, matchMetadata);

    populatedStandings.forEach((standing) => {
        stagesData.push({
            leagueId: 4444,
            leagueName: 'Worlds',
            schedule: standing
        });
    });

    res.status(200).json(stagesData);
};
