import { connect } from 'react-redux';
import PredictionFilters from './prediction-filters.jsx';
import { setPredictionFilters, fetchMatches } from '../../store/predictions/predictions.actions.js';

const mapStateToProps = ({ predictionReducer: state }) => ({
    filters: state.filters
})

const mapDispatchToProps = dispatch => ({
    setPredictionFilters: (filterKey, filterValue) => dispatch(setPredictionFilters(filterKey, filterValue))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PredictionFilters);
