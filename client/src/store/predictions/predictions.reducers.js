import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS,
    SET_FETCHING
} from '../constants/constants.js';
import cloneDeep from 'lodash/cloneDeep';
import keyBy from 'lodash/keyBy';

const initialState = {
    predictionMap: {},
    unsavedPredictions: {},
    predictionFilters: {
        leagueId: '98767991302996019',
        blockName: ''
    },
    fetching: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PREDICTION_MAP:
            return Object.assign({}, state, { predictionMap: action.predictionMap });
        case SET_UNSAVED_PREDICTIONS:
            const unsavedPredictions = {
                ...state.unsavedPredictions,
                [action.prediction.matchId]: action.prediction
            };
            let predictionMap = cloneDeep(state.predictionMap);
            const mappedPredictions = keyBy(predictionMap[action.prediction.leagueId][action.prediction.userId], 'matchId');
            mappedPredictions[action.prediction.matchId] = action.prediction;
            predictionMap[action.prediction.leagueId][action.prediction.userId] = Object.values(mappedPredictions);
            return Object.assign({}, state, { unsavedPredictions, predictionMap });
        case RESET_UNSAVED_PREDICTIONS:
            return Object.assign({}, state, { unsavedPredictions: {} });
        case SET_PREDICTION_FILTER:
            const predictionFilters = {
                ...state.predictionFilters,
                [action.key]: action.value
            };
            return Object.assign({}, state, { predictionFilters });
        case SET_FETCHING:
            return Object.assign({}, state, { fetching: action.fetching });
        default:
            return state;
    }
};
