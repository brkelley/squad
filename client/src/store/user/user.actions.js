import axios from 'axios';
import {
    SET_FETCHING,
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';

export const setFetching = fetching => ({
    type: SET_FETCHING,
    fetching
});

export const setUser = user => ({
    type: SET_USER,
    user
});

export const setUserToken = userToken => ({
    type: SET_USER_TOKEN,
    userToken
});

export const registerNewUser = ({username, summonerId, password }) => dispatch => {
    dispatch(setFetching(true));
    const body = { username, summonerId, password };
    return axios.post('http://localhost:4444/user/register', body)
        .then(({data: results}) => {
            console.log(results);
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            dispatch(setFetching(false));
        });
};

export const login = (username, password) => (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken && state.userToken !== '') {
        return Promise.resolve();
    }
    dispatch(setFetching(true));
    return axios.post('http://localhost:4444/user/login', { username, password })
        .then(({ data: results }) => {
            console.log(results);
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            dispatch(setFetching(false));
        })
        .catch(err => {
            console.log(err);
        });
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`http://localhost:4444/user/validate?summonerName=${summonerName}`);
};
