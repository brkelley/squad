import { connect } from 'react-redux';
import Predictions from './predictions.jsx';
import { retrievePredictions, updatePrediction } from '../store/predictions/predictions.actions.js';
import { retrieveLeagues } from '../store/pro-play-metadata/pro-play-metadata.actions.js';

const mapStateToProps = ({ userReducer, predictionReducer, proPlayMetadataReducer }) => ({
    userId: userReducer.user._id,
    predictionMap: predictionReducer.predictionMap,
    predictionFilters: predictionReducer.predictionFilters,
    leagues: proPlayMetadataReducer.leagues
});

const mapDispatchToProps = dispatch => ({
    retrievePredictions: options => dispatch(retrievePredictions(options)),
    updatePrediction: prediction => dispatch(updatePrediction(prediction)),
    retrieveLeagues: () => dispatch(retrieveLeagues())
});

export default connect(mapStateToProps, mapDispatchToProps)(Predictions);
