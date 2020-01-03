import { connect } from 'react-redux';
import ResetPassword from './reset-password.jsx';
import { resetPassword } from '../../store/user/user.actions.js';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    resetPassword: (id, password) => dispatch(resetPassword({ id, password }))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword);
