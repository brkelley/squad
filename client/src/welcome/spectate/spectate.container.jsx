import { connect } from 'react-redux';
import Spectate from './spectate.jsx';
import { validateSummonerName, registerNewUser } from '../../store/user/user.actions.js';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    verifySummonerName: summonerName => dispatch(validateSummonerName(summonerName)),
    registerNewUser: registerBody => dispatch(registerNewUser(registerBody))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spectate);
