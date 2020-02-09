import {
    SET_PREDICTION_MAP,
    SET_PREDICTION,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS,
    SET_FETCHING,
    SET_OR_UPDATE_PREDICTION_SCORE
} from '../constants/constants.js';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});

export const savePredictions = () => async (dispatch, getState) => {
    const predictionsToSave = Object.values(getState().predictionReducer.unsavedPredictions);
    dispatch(setFetching(true));
    try {
        await axios.post('/predictions', Object.values(predictionsToSave));
    } catch (error) {
        throw new Error(error);
    }
    dispatch(setFetching(false));
    dispatch(resetUnsavedPredictions());
};

export const updatePrediction = prediction => async dispatch => {
    dispatch(setUnsavedPredictions(prediction));
};

export const retrievePredictions = ({ forceReload }) => async (dispatch, getState) => {
    let predictionData;
    const { predictionMap, fetching } = getState().predictionReducer;
    const dataExists = (!forceReload && !isEmpty(predictionMap));

    if (dataExists || fetching) return;
    dispatch(setFetching(true));

    try {
        const data = await axios.get('/predictions');
        predictionData = data.data;
    } catch (error) {
        throw new Error(error);
    }

    dispatch(setPredictionMap(predictionData));
    dispatch(setFetching(false));
};

export const updatePredictionFilter = predictionFilter => dispatch => {
    dispatch(setPredictionFilter(predictionFilter));
};

export const updatePredictionScore = (userId, predictionAddition) => dispatch => {
    dispatch(setPredictionScore(userId, predictionAddition));
}

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
    type: RESET_UNSAVED_PREDICTIONS
});

export const setFetching = fetching => ({
    type: SET_FETCHING,
    fetching
});

export const setPredictionScore = (userId, predictionAddition) => ({
    type: SET_OR_UPDATE_PREDICTION_SCORE,
    userId,
    predictionAddition
});
