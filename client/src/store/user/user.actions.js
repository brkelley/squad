import axios from 'axios';
import {
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';
import Cookies from 'js-cookie';

export const setUser = user => ({
    type: SET_USER,
    user
});

export const setUserToken = userToken => ({
    type: SET_USER_TOKEN,
    userToken
});

export const setUserObject = ({ username }) => dispatch => {
    dispatch(setUser({ username }));
}

export const registerNewUser = body => dispatch => {
    return axios.post('http://172.125.170.167:4444/user/register', body)
        .then(({data: results}) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
            axios.defaults.headers.common['squadToken'] = results.token;
        });
};

export const resetPassword = body => dispatch => {
    return axios.patch('http://172.125.170.167:4444/user/updatePassword', body)
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
        });
};

export const login = (summonerName, password) => (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken && state.userToken !== '') {
        return Promise.resolve();
    }
    return axios.post('http://172.125.170.167:4444/user/login', { summonerName, password })
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
            axios.defaults.headers.common['squadToken'] = results.token;
        });
};

export const validateUserToken = token => dispatch => {
    return axios.post('http://172.125.170.167:4444/user/validateToken', { token })
        .then(({ data: results }) => {
            const { token, valid, username, _id } = results;
            dispatch(setUser({ _id, username }));
            dispatch(setUserToken(token));
            return { token, valid, username, _id };
        });
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`http://172.125.170.167:4444/user/validateSummonerName?summonerName=${summonerName}`)
        .catch(({ response }) => {
            console.log(response);
            return Promise.reject({ message: response.data.message })
        });
};
