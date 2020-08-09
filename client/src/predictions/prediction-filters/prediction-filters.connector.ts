import { connect } from 'react-redux';
import { updatePredictionFilter, savePredictions } from '../../store/predictions/predictions.actions';

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer }) => ({
    unsavedPredictions: predictionReducer.unsavedPredictions,
    getStageType: ({ tournamentId, stageSlug }) => {
        const selectedTournament = proPlayMetadataReducer.schedule.find((tourn) => tourn.leagueId === tournamentId);
        if (!selectedTournament) return '';

        const selectedStage = selectedTournament.schedule.find((stage) => stage.slug === stageSlug);
        if (!selectedStage) return '';

        return selectedStage.type;
    }
});

const mapDispatchToProps = (dispatch) => ({
    updatePredictionFilter: (predictionFilter) => dispatch(updatePredictionFilter(predictionFilter)),
    savePredictions: () => dispatch(savePredictions())
});

export default connect(mapStateToProps, mapDispatchToProps);
