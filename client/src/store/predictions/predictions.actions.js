import {
    SET_PREDICTION_MAP,
    SET_PREDICTION_AT_KEY,
    SET_PREDICTION,
    SET_PREDICTION_FILTER,
    SET_UNSAVED_PREDICTIONS,
    RESET_UNSAVED_PREDICTIONS,
    SET_FETCHING
} from '../constants/constants.js';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';

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

export const setFetching = fetching => ({
    type: SET_FETCHING,
    fetching
});

export const setPredictionFilter = predictionFilter => ({
    type: SET_PREDICTION_FILTER,
    key: predictionFilter.key,
    value: predictionFilter.value
});

export const savePredictions = () => async (dispatch, getState) => {
    const predictionsToSave = Object.values(getState().predictionReducer.unsavedPredictions);
    dispatch(setFetching(true));
    try {
        let updatedPredictions = await axios.post('/predictions', Object.values(predictionsToSave));
        updatedPredictions = updatedPredictions.data;
        const updatedPredictionsIds = updatedPredictions.map(el => el.matchId);
        const clonedMap = cloneDeep(getState().predictionReducer.predictionMap);
        const leagueFilter = getState().predictionReducer.predictionFilters.leagueId;
        const userId = getState().userReducer.user.id;

        clonedMap[userId][leagueFilter] = [
            ...clonedMap[userId][leagueFilter].filter(el => !updatedPredictionsIds.includes(el.id)),
            ...updatedPredictions
        ];
        dispatch(setPredictionMap(clonedMap));
    } catch (error) {
        throw new Error(error);
    }
    dispatch(setFetching(false));
    dispatch(resetUnsavedPredictions());
};

export const updatePrediction = prediction => async dispatch => {
    dispatch(setUnsavedPredictions(prediction));
};

export const loadAllPredictions = ({ forceReload } = {}) => async (dispatch, getState) => {
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
