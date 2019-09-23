import { SET_FETCHING, SET_MATCHES } from './predictions.constants.js';

const initialState = {
    matches: {},
    fetching: false
};


export default function (state = initialState, action) {
    switch (action.type) {
        case SET_FETCHING:
            return Object.assign({}, state, { fetching: action.fetching });
        case SET_MATCHES:
            return Object.assign({}, state, { matches: action.matches });
        default:
            return state;
    }
}
