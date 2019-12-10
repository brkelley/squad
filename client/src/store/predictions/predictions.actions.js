import axios from 'axios';
import {
    SET_FETCHING,
    SET_MATCHES,
    SET_USER_PREDICTIONS,
    SET_FILTERS,
    SET_MATCH_RESULTS
} from './predictions.constants.js';
import { groupMatchesByDay } from './predictions.helper.js';
import get from 'lodash/get';

export const setFetching = fetching => ({
    type: SET_FETCHING,
    fetching
});

export const setMatches = matches => ({
    type: SET_MATCHES,
    matches
});

export const setUserPredictions = userPredictions => ({
    type: SET_USER_PREDICTIONS,
    userPredictions
});

export const setMatchResults = matchResults => ({
    type: SET_MATCH_RESULTS,
    matchResults
})

export const setPredictionFilters = (filterKey, filterValue) => dispatch => {
    dispatch({
        type: SET_FILTERS,
        filterKey,
        filterValue
    })
};

export const createUserPredictions = userPredictions => (dispatch, getState) => {
    const { predictionReducer, userReducer } = getState();
    const { year, tournament, section, stage, round } = predictionReducer.filters;
    const { _id } = userReducer.user;

    dispatch({
        type: SET_USER_PREDICTIONS,
        userPredictions
    });

    return axios.post(`http://localhost:4444/userPredictions/${tournament}/${year}/${_id}?section=${section}&stage=${stage}&round=${round}`, { predictions: userPredictions });
}

export const updateUserPredictions = userPredictions => (dispatch, getState) => {
    const { predictionReducer, userReducer } = getState();
    const { year, tournament, section, stage, round } = predictionReducer.filters;
    const { _id } = userReducer.user;

    dispatch({
        type: SET_USER_PREDICTIONS,
        userPredictions
    });

    return axios.patch(`http://localhost:4444/userPredictions/${tournament}/${year}/${_id}?section=${section}&stage=${stage}&round=${round}`, { predictions: userPredictions });
}

export const fetchUserPredictions = () => (dispatch, getState) => {
    const { predictionReducer, userReducer } = getState();
    const { year, tournament, section, stage, round } = predictionReducer.filters;
    const { _id } = userReducer.user;

    dispatch(setFetching(true));
    return axios.get(`http://localhost:4444/userPredictions/${tournament}/${year}/${_id}?section=${section}&stage=${stage}&round=${round}`)
        .then(({ data: predictions }) => {
            dispatch(setUserPredictions(predictions));
        });
};

export const fetchMatches = () => (dispatch, getState) => {
    const { predictionReducer: state } = getState();
    const { year, tournament, section, stage, round } = state.filters;

    dispatch(setFetching(true));
    return axios.get(`http://localhost:4444/tournament/${tournament}/${year}?section=${section}&stage=${stage}&round=${round}`)
        .then(({ data: results }) => {
            const formattedResults = groupMatchesByDay(results);
            dispatch(setMatches(formattedResults));
            dispatch(setFetching(false));
        });
};

export const fetchMatchResults = () => (dispatch, getState) => {
    const { predictionReducer: state } = getState();
    const { year, tournament, section, stage, round } = state.filters;

    return axios.get(`http://localhost:4444/matchResults/${tournament}/${year}?section=${section}&stage=${stage}&round=${round}`)
        .then(({ data: results }) => {
            dispatch(setMatchResults(results));
        });
}
