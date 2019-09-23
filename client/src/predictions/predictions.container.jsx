import { connect } from 'react-redux';
import Predictions from './predictions.jsx';
import { fetchMatches } from '../store/predictions/predictions.actions.js';

const mapStateToProps = ({ predictionReducer: state }) => ({
    fetching: state.fetching,
    matches: state.matches
})

const mapDispatchToProps = dispatch => ({
    fetchMatches: () => dispatch(fetchMatches())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Predictions);