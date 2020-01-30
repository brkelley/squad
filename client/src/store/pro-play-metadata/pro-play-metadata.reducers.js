import {
    SET_LEAGUES,
    SET_SCHEDULE
} from './pro-play-metadata.constants.js';

const initialState = {
    leagues: [],
    schedule: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_LEAGUES:
            return Object.assign({}, state, { leagues: action.leagues });
        case SET_SCHEDULE:
            return Object.assign({}, state, { schedule: action.schedule });
        default:
            return state;
    }
};
