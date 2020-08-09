import {
    SET_SCHEDULE,
    SET_SCHEDULE_FETCHING,
    SET_TEAMS,
    SET_TEAMS_FETCHING
} from '../constants/constants.js';
import { LEAGUES_IDS } from '../../constants/pro-play-metadata.constants';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

export const loadAllSchedule = () => async (dispatch, getState) => {
    const state = getState();
    let { schedule, scheduleFetching } = state.proPlayMetadataReducer;

    if (!isEmpty(schedule) || scheduleFetching) return;

    dispatch(setScheduleFetching(true));
    try {
        const data = await axios.get(`/pro-play/schedule?leagueId=${LEAGUES_IDS.join(',')}`);
        schedule = data.data;
        dispatch(setScheduleFetching(false));
    } catch (error) {
        console.log(error);
        dispatch(setScheduleFetching(false));
        throw new Error(error);
    }
    dispatch(setSchedule(schedule));
};

export const loadAllTeams = () => async (dispatch, getState) => {
    let { teams, teamsFetching } = getState();
    if (!isEmpty(teams) || teamsFetching) return;

    dispatch(setTeamsFetching(true));
    try {
        const data = await axios.get('/pro-play/teams');
        teams = data.data;
        dispatch(setTeamsFetching(false));
    } catch (error) {
        dispatch(setTeamsFetching(false));
        throw new Error(error);
    }
    dispatch(setTeams(teams));
};

const setSchedule = schedule => ({
    type: SET_SCHEDULE,
    schedule
});

const setScheduleFetching = fetching => ({
    type: SET_SCHEDULE_FETCHING,
    fetching
});

const setTeams = teams => ({
    type: SET_TEAMS,
    teams
});

const setTeamsFetching = fetching => ({
    type: SET_TEAMS_FETCHING,
    fetching
});
