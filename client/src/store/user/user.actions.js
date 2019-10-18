import axios from 'axios';
import {
    SET_FETCHING,
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';
import Cookies from 'js-cookie';

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
            Cookies.set('userToken', results.token);
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
            Cookies.set('userToken', results.token);
            dispatch(setFetching(false));
        })
        .catch(err => {
            console.log(err);
        });
};

export const validateUserToken = token => dispatch => {
    return axios.post('http://localhost:4444/user/validateToken', { token })
        .then(({ data: results }) => {
            const { token, valid, username, _id } = results;
            dispatch(setUser({ _id, username }));
            dispatch(setUserToken(token));

            return { token, valid, username, _id };
        });
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`http://localhost:4444/user/validate?summonerName=${summonerName}`);
};
