import { SET_PREDICTION_MAP, SET_PREDICTION, SET_PREDICTION_FILTER } from './predictions.constants.js';
import cloneDeep from 'lodash/cloneDeep';

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
            const predictionMap = cloneDeep(state.predictionMap);

            predictionMap[action.prediction.matchId].match.prediction = {
                team: action.prediction.prediction,
                id: action.prediction.id
            };
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
