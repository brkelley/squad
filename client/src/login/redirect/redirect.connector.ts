import { connect } from 'react-redux';
import { setDiscordInfo, setUser, setUserTokenToCookies } from '../../store/user/user.actions';

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    setDiscordInfo: (discordInfo) => dispatch(setDiscordInfo(discordInfo)),
    setUser: (user) => dispatch(setUser(user)),
    setUserTokenToCookies: (token) => dispatch(setUserTokenToCookies(token))
});

export default connect(mapStateToProps, mapDispatchToProps);
