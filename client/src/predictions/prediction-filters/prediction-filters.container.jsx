import { connect } from 'react-redux';
import PredictionFilters from './prediction-filters.jsx';
import { updatePredictionFilter } from '../../store/predictions/predictions.actions.js';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    updatePredictionFilter: predictionFilter => dispatch(updatePredictionFilter(predictionFilter))
});

export default connect(mapStateToProps, mapDispatchToProps)(PredictionFilters);
