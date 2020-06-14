import { connect } from 'react-redux';
import { logout } from '../../store/user/user.actions';

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps);