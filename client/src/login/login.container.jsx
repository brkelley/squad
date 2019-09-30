import { connect } from 'react-redux';
import Login from './login.jsx';
import { login } from '../store/user/user.actions.js';

const mapStateToProps = ({ userReducer: state }) => ({
    fetching: state.fetching
});

const mapDispatchToProps = dispatch => ({
    login: (username, password) => dispatch(login(username, password))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
