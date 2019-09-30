import { SET_FETCHING, SET_USER, SET_USER_TOKEN } from './user.constants.js';

const initialState = {
    user: {},
    userToken: '',
    fetching: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_FETCHING:
            return Object.assign({}, state, { fetching: action.fetching });
        case SET_USER:
            return Object.assign({}, state, { user: action.user });
        case SET_USER_TOKEN:
            return Object.assign({}, state, { userToken: action.userToken });
        default:
            return state;
    }
}
