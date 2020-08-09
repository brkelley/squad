import { connect } from 'react-redux';
import { updatePrediction } from '../../../store/predictions/predictions.actions';
import get from 'lodash/get';

const mapStateToProps = ({ predictionReducer, userReducer }) => ({
    predictionMap: predictionReducer.predictionMap,
    userId: get(userReducer, 'user.id')
});

const mapDispatchToProps = (dispatch) => ({
    updatePrediction: (prediction) => dispatch(updatePrediction(prediction))
});

export default connect(mapStateToProps, mapDispatchToProps);
