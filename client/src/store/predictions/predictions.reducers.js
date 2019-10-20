import {
    SET_FETCHING,
    SET_MATCHES,
    SET_USER_PREDICTIONS,
    SET_FILTERS,
    SET_MATCH_RESULTS
} from './predictions.constants.js';

const initialState = {
    matches: {},
    userPredictions: {},
    matchResults: {},
    fetching: false,
    filters: {
        year: '2019',
        tournament: 'worlds',
        section: 'main',
        stage: 'groups',
        round: 'round2'
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_FETCHING:
            return Object.assign({}, state, { fetching: action.fetching });
        case SET_MATCHES:
            return Object.assign({}, state, { matches: action.matches });
        case SET_USER_PREDICTIONS:
            return Object.assign({}, state, { userPredictions: action.userPredictions });
        case SET_MATCH_RESULTS:
            return Object.assign({}, state, { matchResults: action.matchResults });
        case SET_FILTERS:
            const filters = {
                ...state.filters,
                [action.filterKey]: action.filterValue
            };
            return Object.assign({}, state, { filters });
        default:
            return state;
    }
}
