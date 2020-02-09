import {
    SET_USERS_METADATA,
    SET_USER,
    SET_USER_TOKEN,
    SET_USER_FETCHING
} from '../constants/constants.js';

const initialState = {
    usersMetadata: [],
    user: {},
    userToken: '',
    fetching: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USERS_METADATA:
            return Object.assign({}, state, { usersMetadata: action.usersMetadata });
        case SET_USER:
            return Object.assign({}, state, { user: action.user });
        case SET_USER_TOKEN:
            return Object.assign({}, state, { userToken: action.userToken });
        case SET_USER_FETCHING:
            return Object.assign({}, state, { fetching: action.fetching });
        default:
            return state;
    }
}
