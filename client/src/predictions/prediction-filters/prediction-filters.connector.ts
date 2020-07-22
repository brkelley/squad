import { connect } from 'react-redux';
import { updatePredictionFilter, savePredictions } from '../../store/predictions/predictions.actions';

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer }) => ({
    unsavedPredictions: predictionReducer.unsavedPredictions
});

const mapDispatchToProps = (dispatch) => ({
    updatePredictionFilter: (predictionFilter) => dispatch(updatePredictionFilter(predictionFilter)),
    savePredictions: () => dispatch(savePredictions())
});

export default connect(mapStateToProps, mapDispatchToProps);
