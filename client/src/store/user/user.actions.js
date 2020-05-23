import axios from 'axios';
import {
    SET_USERS_METADATA,
    SET_USER,
    SET_USER_TOKEN,
    SET_USER_FETCHING
} from '../constants/constants.js';
import firebase from 'firebase';
import Cookies from 'js-cookie';

const setUpPendo = user => {
    // in your authentication promise handler or callback
    // eslint-disable-next-line no-undef
    pendo.initialize({
        visitor: {
            id: user.id, // Required if user is logged in
            summonerName: user.summonerName
            // email:        // Recommended if using Pendo Feedback, or NPS Email
            // full_name:    // Recommended if using Pendo Feedback
            // role:         // Optional

            // You can add any additional visitor level key-values here,
            // as long as it's not one of the above reserved names.
        },

        account: {
            id: 'SQUAD' // Highly recommended
            // name:         // Optional
            // is_paying:    // Recommended if using Pendo Feedback
            // monthly_value:// Recommended if using Pendo Feedback
            // planLevel:    // Optional
            // planPrice:    // Optional
            // creationDate: // Optional

            // You can add any additional account level key-values here,
            // as long as it's not one of the above reserved names.
        },

        apiKey: '5a6321cf-9dc7-4e22-5e04-1b9efeb83778'
    });
};

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

export const setUserFetching = fetching => ({
    type: SET_USER_FETCHING,
    fetching
});

export const updateUser = user => async dispatch => {
    let updatedUser;
    try {
        updatedUser = await axios.post(`/users/${user.id}`, user);
        updatedUser = updatedUser.data;
        dispatch(setUser(updatedUser));
    } catch (error) {
        console.error('error');
    }
};

export const loadAllUsers = () => async (dispatch, getState) => {
    const { userReducer: state } = getState();
    let usersMetadata;
    if (state.usersMetadata.length > 0) {
        return;
    }

    dispatch(setUserFetching(true));
    try {
        usersMetadata = await axios.get('/users');
        dispatch(setUsersMetadata(usersMetadata.data));
    } catch (error) {
        console.log(error);
    }
    dispatch(setUserFetching(false));
};

export const logout = () => async dispatch => {
    Cookies.remove('userToken');
    await firebase.auth().signOut();
    dispatch(setUserToken(null));
};

export const registerNewUser = body => dispatch => {
    return axios.post('/user/register', body)
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserToken(results.token));
            setUpPendo(results.user);
            Cookies.set('userToken', results.token);
            axios.defaults.headers.common.squadToken = results.token;
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
    setUpPendo(user);
    Cookies.set('userToken', token);
    axios.defaults.headers.common.squadToken = token;
};

export const validateUserToken = idToken => async dispatch => {
    const data = await axios.post('/user/validateToken', { token: idToken });
    const results = data.data;

    const { token, valid, user } = results;

    if (!valid) {
        dispatch(setUserToken('INVALID'));
    } else {
        dispatch(setUser(user));
        dispatch(setUserToken(token));
        setUpPendo(user);
        Cookies.set('userToken', token);
        axios.defaults.headers.common['squadToken'] = token;
    }
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`/user/validateSummonerName?summonerName=${summonerName}`)
        .catch(({ response }) => {
            console.log(response);
            return Promise.reject({ message: response.data.message })
        });
};

export const resyncSummonerName = (userId, summonerId) => async (dispatch, getState) => {
    let updatedFields;
    try {
        const newSummonerName = await axios.patch(`/users/${userId}/syncSummonerName`, { id: summonerId });
        updatedFields = newSummonerName.data;
    } catch (error) {
        console.error(error);
        return;
    }

    const { user } = getState().userReducer;
    dispatch(setUser({
        ...user,
        ...updatedFields
    }));
};
