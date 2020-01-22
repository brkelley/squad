import {
    SET_USER,
    SET_USER_TOKEN
} from './user.constants.js';

const initialState = {
    user: {},
    userToken: '',
    userType: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return Object.assign({}, state, { user: action.user });
        case SET_USER_TOKEN:
            return Object.assign({}, state, { userToken: action.userToken });
        default:
            return state;
    }
}
