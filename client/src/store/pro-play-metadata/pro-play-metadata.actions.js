import { SET_LEAGUES, SET_SCHEDULE } from './pro-play-metadata.constants.js';
import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const setLeagues = leagues => ({
    type: SET_LEAGUES,
    leagues
});

export const setSchedule = schedule => ({
    type: SET_SCHEDULE,
    schedule
});

export const retrieveSchedule = () => async (dispatch, state) => {
    if (!isEmpty(state.schedule)) return;

    let schedule;
    try {
        const data = await axios.get('/pro-play/schedule');
        schedule = data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    dispatch(setSchedule(schedule));
};

export const retrieveLeagues = () => async (dispatch, state) => {
    if (get(state, 'leagues', []).length > 0) {
        return;
    }

    let leagues;
    try {
        const data = await axios.get('/pro-play/leagues');
        leagues = data.data;
    } catch (error) {
        throw new Error(error);
    }
    dispatch(setLeagues(leagues));
};
