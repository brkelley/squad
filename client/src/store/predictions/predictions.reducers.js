import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_AT_KEY,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS
} from '../constants/constants.js';
import cloneDeep from 'lodash/cloneDeep';
import keyBy from 'lodash/keyBy';

const initialState = {
    predictionMap: {},
    unsavedPredictions: {},
    predictionFilters: {
        tournamentId: '',
        stageSlug: '',
        sectionName: ''
    },
    predictionScoresByUser: {},
    fetching: false
};

const setPredictionMap = (state, action) => {
    return Object.assign({}, state, { predictionMap: action.predictionMap });
};

const setPredictionAtKey = (state, action) => {
    const clonedMap = cloneDeep(state.predictionMap);
    const updatedPredictionMap = keyBy(action.updatedPredictions, 'matchId');

    if (!clonedMap[action.userId]) {
        clonedMap[action.userId] = {};
    }
    if (!clonedMap[action.userId][action.leagueId]) {
        clonedMap[action.userId][action.leagueId] = {};
    }

    clonedMap[action.userId][action.leagueId] = {
        ...clonedMap[action.userId][action.leagueId],
        ...updatedPredictionMap
    };

    return Object.assign({}, state, { predictionMap: clonedMap });
};

const setUnsavedPredictions = (state, action) => {
    const { userId, matchId } = action.prediction;
    const predictionMap = cloneDeep(state.predictionMap);
    const unsavedPredictions = {
        ...state.unsavedPredictions,
        [action.prediction.matchId]: action.prediction
    };    

    if (!predictionMap[userId]) {
        predictionMap[userId] = {};
    }
    if (!predictionMap[userId]) {
        predictionMap[userId] = {};
    }

    const mappedPredictions = keyBy(predictionMap[userId], 'matchId');
    mappedPredictions[matchId] = action.prediction;
    predictionMap[userId] = mappedPredictions;

    return Object.assign({}, state, { unsavedPredictions, predictionMap });
};

const resetUnsavedPredictions = (state) => {
    return Object.assign({}, state, { unsavedPredictions: {} });
};

const setPredictionFilter = (state, action) => {
    const predictionFilters = {
        ...state.predictionFilters,
        [action.key]: action.value
    };

    return Object.assign({}, state, { predictionFilters });
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PREDICTION_MAP:
            return setPredictionMap(state, action);
        case SET_PREDICTION_AT_KEY:
            return setPredictionAtKey(state, action);
        case SET_UNSAVED_PREDICTIONS:
            return setUnsavedPredictions(state, action);
        case RESET_UNSAVED_PREDICTIONS:
            return resetUnsavedPredictions(state);
        case SET_PREDICTION_FILTER:
            return setPredictionFilter(state, action);
        default:
            return state;
    }
}
