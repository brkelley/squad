import {
    SET_LEAGUES,
    SET_LEAGUES_FETCHING,
    SET_SCHEDULE,
    SET_SCHEDULE_FETCHING
} from '../constants/constants.js';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

export const loadAllSchedule = () => async (dispatch, getState) => {
    let { schedule, scheduleFetching } = getState();

    if (!isEmpty(schedule) || scheduleFetching) return;

    dispatch(setScheduleFetching(true));
    try {
        const data = await axios.get('/pro-play/schedule');
        schedule = data.data;
        dispatch(setScheduleFetching(false));
    } catch (error) {
        console.log(error);
        dispatch(setScheduleFetching(false));
        throw new Error(error);
    }
    schedule['98767991302996019'] = schedule['98767991302996019']
        .filter(el => el.type !== 'show')
        .map(el => {
            return {
                ...el,
                blockName: el.blockName.replace('Playoffs - ', '')
            };
        });
    dispatch(setSchedule(schedule));
};

export const retrieveLeagues = () => async (dispatch, getState) => {
    let { leagues, leaguesFetching } = getState();
    if (!isEmpty(leagues) || leaguesFetching) return;

    dispatch(setLeaguesFetching(true));
    try {
        const data = await axios.get('/pro-play/leagues');
        leagues = data.data;
        dispatch(setLeaguesFetching(false));
    } catch (error) {
        console.error(error);
        dispatch(setLeaguesFetching(false));
        throw new Error(error);
    }
    dispatch(setLeagues(leagues));
};

const setLeagues = leagues => ({
    type: SET_LEAGUES,
    leagues
});

const setLeaguesFetching = fetching => ({
    type: SET_LEAGUES_FETCHING,
    fetching
});

const setSchedule = schedule => ({
    type: SET_SCHEDULE,
    schedule
});

const setScheduleFetching = fetching => ({
    type: SET_SCHEDULE_FETCHING,
    fetching
});
