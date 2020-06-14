import { connect } from 'react-redux';
import { resyncSummonerName, updateUser } from '../store/user/user.actions.js';
import { loadAllTeams } from '../store/pro-play-metadata/pro-play-metadata.actions';

const mapStateToProps = ({ userReducer, proPlayMetadataReducer }) => ({
    user: userReducer.user,
    teamMetadata: proPlayMetadataReducer.teams
});

const mapDispatchToProps = dispatch => ({
    resyncSummonerName: (userId, summonerId) => dispatch(resyncSummonerName(userId, summonerId)),
    updateUser: user => dispatch(updateUser(user)),
    loadAllTeams: () => dispatch(loadAllTeams())
});

export default connect(mapStateToProps, mapDispatchToProps);
