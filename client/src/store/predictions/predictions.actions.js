import axios from 'axios';
import {
    SET_FETCHING,
    SET_MATCHES,
    SET_USER_PREDICTIONS,
    SET_FILTERS
} from './predictions.constants.js';
import isEmpty from 'lodash/isEmpty';

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
})

export const setPredictionFilters = (filterKey, filterValue) => dispatch => {
    dispatch({
        type: SET_FILTERS,
        filterKey,
        filterValue
    })
};

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
        .then(({ data: results }) => {
            console.log(results[0].predictions);
            dispatch(setUserPredictions(results[0].predictions));
        });
};

// PULL INTO UTIL FILE
export const fetchMatches = () => (dispatch, getState) => {
    const { predictionReducer: state } = getState();
    const { year, tournament, section, stage, round } = state.filters;
    if (!isEmpty(state.matches)) {
        return Promise.resolve();
    }
    dispatch(setFetching(true));
    return axios.get(`http://localhost:4444/tournament/${tournament}/${year}?section=${section}&stage=${stage}&round=${round}`)
        .then(({ data: results }) => {
            dispatch(setMatches(results));
            dispatch(setFetching(false));
        });
};
