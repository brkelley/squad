import { connect } from 'react-redux';
import { resyncSummonerName, updateUser } from '../store/user/user.actions.js';

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    beginSummonerResync: (userId, summonerId) => dispatch(resyncSummonerName(userId, summonerId)),
    beginUserUpdate: user => dispatch(updateUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps);
