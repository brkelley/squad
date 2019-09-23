import { SET_FETCHING, SET_MATCHES } from './predictions.constants.js';
import matchData from '../fakeData/match-schedule.json';
import isEmpty from 'lodash/isEmpty';

export const setFetching = fetching => ({
    type: SET_FETCHING,
    fetching
});

export const setMatches = matches => ({
    type: SET_MATCHES,
    matches
});

export const fetchMatches = () => (dispatch, getState) => {
    if (!isEmpty(getState().matches)) {
        return Promise.resolve();
    }
    dispatch(setFetching(true));
    return Promise.resolve(matchData).then(results => {
        console.log(results);
        dispatch(setMatches(results));
        dispatch(setFetching(false));
    });
};
