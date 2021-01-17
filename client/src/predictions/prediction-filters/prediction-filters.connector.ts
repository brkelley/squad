import { connect } from 'react-redux';
import { updatePredictionFilter, savePredictions } from '../../store/predictions/predictions.actions';

const mapStateToProps = ({ predictionReducer, proPlayMetadataReducer }) => ({
    unsavedPredictions: predictionReducer.unsavedPredictions,
    getStageType: ({ leagueId, tournamentSlug, stageSlug }) => {
        const selectedLeagueTournaments = proPlayMetadataReducer.schedule.find((league) => league.leagueId === leagueId);
        if (!selectedLeagueTournaments) return '';

        const selectedTournament = selectedLeagueTournaments.schedule.find((tourn) => tourn.tournamentSlug === tournamentSlug);
        if (!selectedTournament) return '';

        const selectedStage = selectedTournament.stages.find((stage) => stage.slug === stageSlug);
        if (!selectedStage) return '';

        return selectedStage.type;
    }
});

const mapDispatchToProps = (dispatch) => ({
    updatePredictionFilter: (predictionFilter) => dispatch(updatePredictionFilter(predictionFilter)),
    savePredictions: () => dispatch(savePredictions())
});

export default connect(mapStateToProps, mapDispatchToProps);
