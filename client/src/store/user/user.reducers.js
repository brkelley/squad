import {
    SET_USERS_METADATA,
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';

const initialState = {
    usersMetadata: [],
    user: {},
    userToken: '',
    userType: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USERS_METADATA:
            return Object.assign({}, state, { usersMetadata: action.usersMetadata });
        case SET_USER:
            return Object.assign({}, state, { user: action.user });
        case SET_USER_TOKEN:
            return Object.assign({}, state, { userToken: action.userToken });
        default:
            return state;
    }
}
