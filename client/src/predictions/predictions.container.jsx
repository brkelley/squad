import { connect } from 'react-redux';
import Predictions from './predictions.jsx';
import get from 'lodash/get';

import {
    setPredictionFilters,
    fetchUserPredictions,
    fetchMatches,
    createUserPredictions,
    updateUserPredictions,
    fetchMatchResults
} from '../store/predictions/predictions.actions.js';

const mapStateToProps = ({ predictionReducer, userReducer }) => ({
    fetching: predictionReducer.fetching,
    matches: predictionReducer.matches,
    filters: predictionReducer.filters,
    matchResults: predictionReducer.matchResults,
    userPredictions: get(predictionReducer, 'userPredictions[0].predictions'),
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    fetchUserPredictions: () => dispatch(fetchUserPredictions()),
    fetchMatches: () => dispatch(fetchMatches()),
    createUserPredictions: userPredictions => dispatch(createUserPredictions(userPredictions)),
    updateUserPredictions: userPredictions => dispatch(updateUserPredictions(userPredictions)),
    setPredictionFilters: (filterKey, filterValue) => dispatch(setPredictionFilters(filterKey, filterValue)),
    fetchMatchResults: () => dispatch(fetchMatchResults())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Predictions);
