import {
    SET_LEAGUES,
    SET_LEAGUES_FETCHING,
    SET_SCHEDULE,
    SET_SCHEDULE_FETCHING,
    SET_TEAMS,
    SET_TEAMS_FETCHING
} from '../constants/constants.js';

const initialState = {
    leagues: [],
    leaguesFetching: false,
    schedule: {},
    scheduleFetching: false,
    teams: [],
    teamsFetching: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_LEAGUES:
            return Object.assign({}, state, { leagues: action.leagues });
        case SET_LEAGUES_FETCHING:
            return Object.assign({}, state, { leaguesFetching: action.fetching });
        case SET_SCHEDULE:
            return Object.assign({}, state, { schedule: action.schedule });
        case SET_SCHEDULE_FETCHING:
            return Object.assign({}, state, { scheduleFetching: action.fetching });
        case SET_TEAMS:
            return Object.assign({}, state, { teams: action.teams });
        case SET_TEAMS_FETCHING:
            return Object.assign({}, state, { teamsFetching: action.fetching });
        default:
            return state;
    }
};
