import { connect } from 'react-redux';

import { getAllUsers } from '../store/user/user.actions.js';

const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user,
    userFetching: userReducer.userFetching
});

const mapDispatchToProps = (dispatch) => ({
    getAllUsers: () => dispatch(getAllUsers())
});

export default connect(mapStateToProps, mapDispatchToProps);
