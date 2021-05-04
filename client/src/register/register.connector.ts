import { connect } from 'react-redux';
import { registerNewUser, validateSummonerName } from '../store/user/user.actions';

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user,
    userToken: userReducer.userToken,
    discordInfo: userReducer.discordInfo
});

const mapDispatchToProps = dispatch => ({
    registerNewUser: (registerBody) => dispatch(registerNewUser(registerBody)),
    validateSummonerName: (summonerName) => dispatch(validateSummonerName(summonerName))
});

export default connect(mapStateToProps, mapDispatchToProps);
