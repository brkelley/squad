import { connect } from 'react-redux';

import { loadAllPredictions } from '../store/predictions/predictions.actions.js';
import { loadAllSchedule } from '../store/pro-play-metadata/pro-play-metadata.actions.js';
import { loadAllUsers } from '../store/user/user.actions.js';

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer, userReducer }) => ({
    users: userReducer.usersMetadata,
    user: userReducer.user,
    userFetching: userReducer.userFetching,
    predictionMap: predictionReducer.predictionMap,
    schedule: proPlayMetadataReducer.schedule
});

const mapDispatchToProps = (dispatch) => ({
    loadAllUsers: () => dispatch(loadAllUsers()),
    loadAllPredictions: () => dispatch(loadAllPredictions()),
    loadAllSchedule: () => dispatch(loadAllSchedule())
});

export default connect(mapStateToProps, mapDispatchToProps);
