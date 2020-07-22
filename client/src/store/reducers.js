import { combineReducers } from 'redux';
import predictionReducer from './predictions/predictions.reducers.js';
import userReducer from './user/user.reducers.js';
import proPlayMetadataReducer from './pro-play-metadata/pro-play-metadata.reducers';

export default combineReducers({
    predictionReducer,
    userReducer,
    proPlayMetadataReducer
});
