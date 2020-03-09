import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS
} from '../constants/constants.js';

export const setPredictionMap = predictionMap => ({
    type: SET_PREDICTION_MAP,
    predictionMap
});

export const setUnsavedPredictions = prediction => ({
    type: SET_UNSAVED_PREDICTIONS,
    prediction
});

export const resetUnsavedPredictions = () => ({
    type: RESET_UNSAVED_PREDICTIONS
});

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});
