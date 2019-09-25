import axios from 'axios';
import { SET_FETCHING, SET_MATCHES } from './predictions.constants.js';
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
    return axios.get('http://localhost:4444/matches').then(({ data: results }) => {
        console.log(results);
        dispatch(setMatches(results));
        dispatch(setFetching(false));
    });
};
