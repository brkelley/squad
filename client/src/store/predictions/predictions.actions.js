import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_AT_KEY,
    SET_PREDICTION,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS
} from '../constants/constants.js';
import cloneDeep from 'lodash/cloneDeep';
import keyBy from 'lodash/keyBy';
import axios from 'axios';

let loadAllPredictionsPromise;

export const setPredictionMap = predictionMap => ({
    type: SET_PREDICTION_MAP,
    predictionMap
});

export const setPredictionAtKey = (userId, leagueId, updatedPredictions) => ({
    type: SET_PREDICTION_AT_KEY,
    userId,
    leagueId,
    updatedPredictions
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

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});

export const savePredictions = () => async (dispatch, getState) => {
    const predictionsToSave = Object.values(getState().predictionReducer.unsavedPredictions);
    try {
        let updatedPredictions = await axios.post('/predictions', Object.values(predictionsToSave));
        updatedPredictions = updatedPredictions.data;
        const clonedMap = cloneDeep(getState().predictionReducer.predictionMap);
        const userId = getState().userReducer.user.id;

        clonedMap[userId] = {
            ...clonedMap[userId],
            ...keyBy(updatedPredictions, 'matchId')
        };
        dispatch(setPredictionMap(clonedMap));
    } catch (error) {
        throw new Error(error);
    }
    dispatch(resetUnsavedPredictions());
};

export const updatePrediction = prediction => async dispatch => {
    dispatch(setUnsavedPredictions(prediction));
};

export const loadAllPredictions = ({ forceReload } = {}) => async (dispatch, getState) => {
    let predictionData;
    const dataExists = !forceReload && loadAllPredictionsPromise;

    if (dataExists) return;

    loadAllPredictionsPromise = axios.get('/predictions');
    try {
        const data = await loadAllPredictionsPromise;
        predictionData = data.data;
    } catch (error) {
        throw new Error(error);
    }
    const mappedPredictions = predictionData.reduce((acc, prediction) => {
        const { userId, matchId } = prediction
        if (!acc[userId]) {
            acc[userId] = {
                [matchId]: prediction
            }
        } else {
            acc[userId][matchId] = prediction;
        }

        return acc;
    }, {});

    dispatch(setPredictionMap(mappedPredictions));
};

export const updatePredictionFilter = predictionFilter => dispatch => {
    dispatch(setPredictionFilter(predictionFilter));
};
