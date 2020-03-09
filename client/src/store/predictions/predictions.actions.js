import {
    setPredictionMap,
    setUnsavedPredictions,
    resetUnsavedPredictions,
    setPredictionFilter
} from './predictions.commits.js';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';

export const savePredictions = () => async (dispatch, getState) => {
    const predictionsToSave = Object.values(getState().predictionReducer.unsavedPredictions);
    try {
        let updatedPredictions = await axios.post('/predictions', Object.values(predictionsToSave));
        updatedPredictions = updatedPredictions.data;
        const updatedPredictionsIds = updatedPredictions.map(el => el.matchId);
        const clonedMap = cloneDeep(getState().predictionReducer.predictionMap);
        const leagueFilter = getState().predictionReducer.predictionFilters.leagueId;
        const userId = getState().userReducer.user.id;
        clonedMap[leagueFilter][userId] = [
            ...clonedMap[leagueFilter][userId].filter(el => !updatedPredictionsIds.includes(el.id)),
            ...updatedPredictions
        ];
        dispatch(setPredictionMap(clonedMap));
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
    const { predictionMap, fetching } = getState().predictionReducer;
    const dataExists = (!forceReload && !isEmpty(predictionMap));

    if (dataExists || fetching) return;

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
