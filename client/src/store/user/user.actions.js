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

export const logout = () => dispatch => {
    Cookies.remove('userToken');
    dispatch(setUserToken(null));
};

export const registerNewUser = body => dispatch => {
    return axios.post('/user/register', body)
        .then(({data: results}) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
            axios.defaults.headers.common['squadToken'] = results.token;
        });
};

export const resetPassword = body => dispatch => {
    return axios.patch('/user/updatePassword', body)
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
        });
};

export const login = (summonerName, password) => (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken && !['', 'INVALID'].includes(state.userToken)) {
        return Promise.resolve();
    }
    return axios.post('/user/login', { summonerName, password })
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            Cookies.set('userToken', results.token);
            axios.defaults.headers.common['squadToken'] = results.token;
        });
};

export const validateUserToken = () => async (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken) {
        return Promise.resolve(state.userValid);
    }

    let results;
    try {
        const token = Cookies.get('userToken');
        const data = await axios.post('/user/validateToken', { token });
        results = data.data;
    } catch (error) {
        console.log('ERROR: ', error);
    }
    const { userToken, valid, summonerName, id } = results;

    if (!valid) {
        dispatch(setUserToken('INVALID'));
    } else {
        dispatch(setUser({ id, summonerName }));
        dispatch(setUserToken(userToken));
    }
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`/user/validateSummonerName?summonerName=${summonerName}`)
        .catch(({ response }) => {
            console.log(response);
            return Promise.reject({ message: response.data.message })
        });
};
