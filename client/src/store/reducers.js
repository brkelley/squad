import { combineReducers } from 'redux';
import predictionReducer from './predictions/predictions.reducers.js';
import userReducer from './user/user.reducers.js';

export default combineReducers({
    predictionReducer,
    userReducer
});
