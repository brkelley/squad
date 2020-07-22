import axios from 'axios';
import {
    SET_USERS_METADATA,
    SET_USER,
    SET_USER_TOKEN,
    SET_DISCORD_INFO
} from '../constants/constants.js';
import firebase from 'firebase';
import Cookies from 'js-cookie';
import axios from 'axios';

let getAllUsersPromise;

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

export const setDiscordInfo = discordInfo => ({
    type: SET_DISCORD_INFO,
    discordInfo
});

export const setUserFetching = fetching => ({
    typ,
    fetching
});

export const setUserTokenToCookies = (userToken) => (dispatch) => {
    Cookies.remove('squadtoken');
    Cookies.set('squadtoken', userToken);
    dispatch(setUserToken(userToken));
    axios.defaults.headers.common['squadtoken'] = userToken;
}

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
    let usersMetadata;
    if (getAllUsersPromise) {
        return;
    }

    getAllUsersPromise = axios.get('/users');

    try {
        usersMetadata = await getAllUsersPromise;
        dispatch(setUsersMetadata(usersMetadata.data));
    } catch (error) {
        console.log(error);
    }
};

export const logout = () => async dispatch => {
    Cookies.remove('squadtoken');
    await firebase.auth().signOut();
    dispatch(setUserToken(null));
};

export const registerNewUser = body => dispatch => {
    return axios.post('/users', body)
        .then(({ data: results }) => {
            dispatch(setUser(results.user));
            dispatch(setUserTokenToCookies(results.jwtToken));
            setUpPendo(results.user);
        });
};

export const validateSummonerName = summonerName => () => {
    return axios.get(`/auth/riot/${summonerName}`)
        .catch(({ response }) => {
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
