import { connect } from 'react-redux';
import Login from './login.tsx';
import { login } from '../../store/user/user.actions.js';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    login: (username, password) => dispatch(login(username, password))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
);