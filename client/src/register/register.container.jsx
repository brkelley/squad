import { connect } from 'react-redux';
import Register from './register.jsx';
import { validateSummonerName, registerNewUser } from '../store/user/user.actions.js';

const mapStateToProps = ({ userReducer: state }) => ({
    fetching: state.fetching
});

const mapDispatchToProps = dispatch => ({
    verifySummonerName: summonerName => dispatch(validateSummonerName(summonerName)),
    registerNewUser: (registerBody) => dispatch(registerNewUser(registerBody))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
