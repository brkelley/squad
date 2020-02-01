import axios from 'axios';
import {
    SET_USERS_METADATA,
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';
import firebase from 'firebase';
import Cookies from 'js-cookie';

export const setUsersMetadata = usersMetadata => ({
    type: SET_USERS_METADATA,
    usersMetadata
});

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

export const getAllUsers = () => async (dispatch, getState) => {
    const { userReducer: state } = getState();
    let usersMetadata;
    if (state.usersMetadata.length > 0) {
        return;
    }

    try {
        usersMetadata = await axios.get('/users');
    } catch (error) {
        console.log(error);
    }
    dispatch(setUsersMetadata(usersMetadata.data));
};

export const logout = () => async dispatch => {
    Cookies.remove('userToken');
    await firebase.auth().signOut();
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

export const login = (summonerName, password) => async (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken && !['', 'INVALID'].includes(state.userToken)) {
        return Promise.resolve();
    }
    
    let token, user;
    try {
        const loginResults = await axios.post('/user/login', { summonerName, password });
        token = loginResults.data.token;
        user = loginResults.data.user;

        await firebase.auth().signInWithCustomToken(token);
    } catch (error) {
        console.error(error);
        return;
    }

    dispatch(setUser(user));
    dispatch(setUserToken(token));
    Cookies.set('userToken', token);
    axios.defaults.headers.common['squadToken'] = token;
};

export const validateUserToken = () => async (dispatch, getState) => {
    const { userReducer: state } = getState();
    if (state.userToken) {
        return Promise.resolve(state.userValid);
    }


    let results;
    try {
        firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                const idToken = await user.getIdToken();
                const data = await axios.post('/user/validateToken', { token: idToken });
                results = data.data;
    
                const { userToken, valid, summonerName, id } = results;
            
                if (!valid) {
                    dispatch(setUserToken('INVALID'));
                } else {
                    dispatch(setUser({ id, summonerName }));
                    dispatch(setUserToken(userToken));
                }
            }
        });
    } catch (error) {
        console.log('ERROR: ', error);
    }
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`/user/validateSummonerName?summonerName=${summonerName}`)
        .catch(({ response }) => {
            console.log(response);
            return Promise.reject({ message: response.data.message })
        });
};
