import { connect } from 'react-redux';
import Predictions from './predictions.jsx';
import {
    setPredictionFilters,
    fetchUserPredictions,
    fetchMatches,
    updateUserPredictions
} from '../store/predictions/predictions.actions.js';

const mapStateToProps = ({ predictionReducer, userReducer }) => ({
    fetching: predictionReducer.fetching,
    matches: predictionReducer.matches,
    filters: predictionReducer.filters,
    userPredictions: predictionReducer.userPredictions,
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    fetchUserPredictions: () => dispatch(fetchUserPredictions()),
    fetchMatches: () => dispatch(fetchMatches()),
    updateUserPredictions: userPredictions => dispatch(updateUserPredictions(userPredictions)),
    setPredictionFilters: (filterKey, filterValue) => dispatch(setPredictionFilters(filterKey, filterValue))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Predictions);
