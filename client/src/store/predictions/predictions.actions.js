import { SET_PREDICTION_MAP, SET_PREDICTION,SET_PREDICTION_FILTER, SET_UNSAVED_PREDICTIONS } from './predictions.constants.js';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';

export const setPredictionMap = predictionMap => ({
    type: SET_PREDICTION_MAP,
    predictionMap
});

export const setPrediction = prediction => ({
    type: SET_PREDICTION,
    prediction
});

export const setUnsavedPredictions = prediction => ({
    type: SET_UNSAVED_PREDICTIONS,
    prediction
});

export const resetUnsavedPredictions = () => ({
    type: 'RESET_UNSAVED_PREDICTIONS'
})

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});

export const savePredictions = () => async (dispatch, getState) => {
    const predictionsToSave = Object.values(getState().predictionReducer.unsavedPredictions);
    try {
        await axios.post('/predictions', Object.values(predictionsToSave));
    } catch (error) {
        throw new Error(error);
    }
    dispatch(resetUnsavedPredictions());
};

export const updatePrediction = prediction => async dispatch => {
    dispatch(setUnsavedPredictions(prediction));
};

export const retrievePredictions = ({ forceReload }) => async (dispatch, getState) => {
    let predictionData;

    if (!forceReload && !isEmpty(getState().predictionReducer.predictionMap)) return;
    try {
        const data = await axios.get('/predictions');
        predictionData = data.data;
    } catch (error) {
        throw new Error(error);
    }

    dispatch(setPredictionMap(predictionData));
};

export const updatePredictionFilter = predictionFilter => dispatch => {
    dispatch(setPredictionFilter(predictionFilter));
};
