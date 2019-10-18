import { connect } from 'react-redux';
import PrivateRoute from './private-route.jsx';
import { validateUserToken } from '../../store/user/user.actions.js';

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    validateUserToken: token => dispatch(validateUserToken(token))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateRoute);
