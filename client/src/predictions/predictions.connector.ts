import { connect } from 'react-redux';
import { loadAllSchedule } from '../store/pro-play-metadata/pro-play-metadata.actions';
import { loadAllPredictions } from '../store/predictions/predictions.actions';
import { updatePredictionFilter } from '../store/predictions/predictions.actions';

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer, userReducer }) => ({
    schedule: proPlayMetadataReducer.schedule,
    filters: predictionReducer.predictionFilters,
    users: userReducer.users,
    predictionMap: predictionReducer.predictionMap
});

const mapDispatchToProps = (dispatch) => ({
    loadAllSchedule: () => dispatch(loadAllSchedule()),
    loadAllPredictions: () => dispatch(loadAllPredictions()),
    updatePredictionFilter: (predictionFilter) => dispatch(updatePredictionFilter(predictionFilter))
});

export default connect(mapStateToProps, mapDispatchToProps);
