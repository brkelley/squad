import { connect } from 'react-redux';
import { loadAllSchedule, loadAllTeams } from '../../store/pro-play-metadata/pro-play-metadata.actions';
import { loadAllPredictions } from '../../store/predictions/predictions.actions';
import { loadAllUsers } from '../../store/user/user.actions';

const mapStateToComponents = ({
    predictionReducer,
    proPlayMetadataReducer,
    userReducer
}) => ({
    predictionMap: predictionReducer.predictionMap,
    schedule: proPlayMetadataReducer.schedule,
    currentUser: userReducer.user,
    usersMetadata: userReducer.usersMetadata,
    teams: proPlayMetadataReducer.teams
});

const mapDispatchToComponents = (dispatch) => ({
    loadAllSchedule: () => dispatch(loadAllSchedule()),
    loadAllPredictions: () => dispatch(loadAllPredictions()),
    loadAllUsers: () => dispatch(loadAllUsers()),
    loadAllTeams: () => dispatch(loadAllTeams())
});

export default connect(mapStateToComponents, mapDispatchToComponents);
