import { SET_PREDICTION_MAP, SET_PREDICTION, SET_PREDICTION_FILTER } from './predictions.constants.js';
import cloneDeep from 'lodash/cloneDeep';
import keyBy from 'lodash/keyBy';

const initialState = {
    predictionMap: {},
    predictionFilters: {
        leagueId: '98767991302996019'
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PREDICTION_MAP:
            return Object.assign({}, state, { predictionMap: action.predictionMap });
        case SET_PREDICTION:
            let predictionMap = cloneDeep(state.predictionMap);
            const mappedPredictions = keyBy(predictionMap[action.prediction.leagueId][action.prediction.userId], 'matchId');
            mappedPredictions[action.prediction.matchId] = action.prediction;
            predictionMap[action.prediction.leagueId][action.prediction.userId] = Object.values(mappedPredictions);
            return Object.assign({}, state, { predictionMap });
        case SET_PREDICTION_FILTER:
            const predictionFilters = {
                [action.key]: action.value
            };
            return Object.assign({}, state, { predictionFilters });
        default:
            return state;
    }
};
