import { connect } from 'react-redux';
import { loadAllMatches, loadAllTeams } from '../../store/pro-play-metadata/pro-play-metadata.actions';
import { loadAllPredictions } from '../../store/predictions/predictions.actions';
import { loadAllUsers } from '../../store/user/user.actions';

const mapStateToComponents = ({
    predictionReducer,
    proPlayMetadataReducer,
    userReducer
}) => ({
    predictionMap: predictionReducer.predictionMap,
    matches: proPlayMetadataReducer.matches,
    currentUser: userReducer.user,
    usersMetadata: userReducer.usersMetadata,
    teams: proPlayMetadataReducer.teams
});

const mapDispatchToComponents = (dispatch) => ({
    loadAllMatches: () => dispatch(loadAllMatches()),
    loadAllPredictions: () => dispatch(loadAllPredictions()),
    loadAllUsers: () => dispatch(loadAllUsers()),
    loadAllTeams: () => dispatch(loadAllTeams())
});

export default connect(mapStateToComponents, mapDispatchToComponents);
