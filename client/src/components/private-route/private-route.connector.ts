import { connect } from 'react-redux';
import { logout, setUserTokenToCookies, setUser } from '../../store/user/user.actions';

const mapStateToProps = ({ userReducer }) => ({
    userToken: userReducer.userToken
});

const mapDispatchToProps = (dispatch) => ({
    setUserTokenToCookies: (token) => dispatch(setUserTokenToCookies(token)),
    setCurrentUser: (user) => dispatch(setUser(user)),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps);
