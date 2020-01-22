import { SET_PREDICTION_MAP, SET_PREDICTION,SET_PREDICTION_FILTER } from './predictions.constants.js';
import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import axios from 'axios';

export const setPredictionMap = predictionMap => ({
    type: SET_PREDICTION_MAP,
    predictionMap
});

export const setPrediction = prediction => ({
    type: SET_PREDICTION,
    prediction
});

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});

let debouncedPredictions = {};
const debouncedSavePrediction = debounce(async () => {
    try {
        await axios.post('/predictions', Object.values(debouncedPredictions));
        debouncedPredictions = {};
    } catch (error) {
        throw new Error(error);
    }
}, 1000);

export const updatePrediction = prediction => async dispatch => {
    debouncedSavePrediction.cancel();
    debouncedPredictions[prediction.matchId] = prediction;
    debouncedSavePrediction(prediction);
    dispatch(setPrediction(prediction));
};

export const retrievePredictions = ({ forceReload, leagueId }) => async (dispatch, state) => {
    let predictionData;

    if (!forceReload && !isEmpty(state.predictionMap)) return;
    try {
        const data = await axios.get(`/predictions?leagueId=${leagueId}`);
        predictionData = data.data;
    } catch (error) {
        throw new Error(error);
    }

    const predictionMap = keyBy(predictionData, obj => obj.match.id);
    dispatch(setPredictionMap(predictionMap));
};

export const updatePredictionFilter = predictionFilter => dispatch => {
    dispatch(setPredictionFilter(predictionFilter));
};
