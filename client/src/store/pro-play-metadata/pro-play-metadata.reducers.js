import { SET_LEAGUES } from './pro-play-metadata.constants.js';

const initialState = {
    leagues: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_LEAGUES:
            return Object.assign({}, state, { leagues: action.leagues });
        default:
            return state;
    }
};
