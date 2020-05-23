import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_AT_KEY,
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
    predictionScoresByUser: {},
    fetching: false
};

const setPredictionMap = (state, action) => {
    return Object.assign({}, state, { predictionMap: action.predictionMap });
};

const setPredictionAtKey = (state, action) => {
    const clonedMap = cloneDeep(state.predictionMap);
    const updatedPredictionMap = keyBy(action.updatedPredictions, 'matchId');

    if (!clonedMap[action.leagueId]) {
        clonedMap[action.leagueId] = {};
    }
    if (!clonedMap[action.leagueId][action.userId]) {
        clonedMap[action.leagueId][action.user] = {};
    }

    clonedMap[action.leagueId][action.userId] = {
        ...clonedMap[action.leagueId][action.userId],
        ...updatedPredictionMap
    };

    return Object.assign({}, state, { predictionMap: clonedMap });
};

const setUnsavedPredictions = (state, action) => {
    const { leagueId, userId, matchId } = action.prediction;
    const predictionMap = cloneDeep(state.predictionMap);
    const unsavedPredictions = {
        ...state.unsavedPredictions,
        [action.prediction.matchId]: action.prediction
    };    

    if (!predictionMap[leagueId]) {
        predictionMap[leagueId] = {};
    }
    if (!predictionMap[leagueId][userId]) {
        predictionMap[leagueId][userId] = {};
    }

    const mappedPredictions = keyBy(predictionMap[leagueId][userId], 'matchId');
    mappedPredictions[matchId] = action.prediction;
    predictionMap[leagueId][userId] = Object.values(mappedPredictions);

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

const setFetching = (state, action) => {
    return Object.assign({}, state, { fetching: action.fetching });
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
        case SET_FETCHING:
            return setFetching(state, action);
        default:
            return state;
    }
}
