import './pro-play-dashboard.scss';
import React, { useState, useEffect } from 'react';
import ProPlayDashboardConnector from './pro-play-dashboard.connector';
import { MatchMetadata, Team } from '../../types/pro-play-metadata';
import { Prediction } from '../../types/predictions';
import { User } from '../../types/user';
import { findNearestMatch } from '../../utils/pro-play-metadata/pro-play-metadata.utils';
import CurrentTournamentStatistics from './current-tournament-statistics/current-tournament-statistics';
import PredictionBreakdown from './prediction-breakdown/prediction-breakdown';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
import isEmpty from 'lodash/isEmpty';
import { groupBy, Dictionary } from 'lodash';
import some from 'lodash/some';

interface ProPlayDashboardProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    matches: MatchMetadata[]
    currentUser: User
    usersMetadata: User[]
    teams: Team[]
    loadAllPredictions: Function
    loadAllMatches: Function
    loadAllUsers: Function
    loadAllTeams: Function
}
const ProPlayDashboard = ({
    predictionMap,
    matches,
    currentUser,
    usersMetadata,
    teams,
    loadAllPredictions,
    loadAllMatches,
    loadAllUsers,
    loadAllTeams
}: ProPlayDashboardProps) => {
    const [currentPredictionUsers, setCurrentPredictionUsers] = useState<User[]>([]);

    useEffect(() => {
        loadAllMatches();
        loadAllPredictions();
        loadAllUsers();
        loadAllTeams();
    }, []);

    useEffect(() => {
        const filteredUsers = usersMetadata.filter((user) => user.userFlags.includes('hasPredictions'));
        setCurrentPredictionUsers(filteredUsers)
    }, [usersMetadata]);

    const renderProPlayDashboard = () => {
        return (
            <div className="pro-play-dashboard">
                <CurrentTournamentStatistics
                    predictionMap={predictionMap}
                    matches={matches}
                    currentUser={currentUser}
                    users={currentPredictionUsers}
                    teams={teams} />
                <PredictionBreakdown
                    predictionMap={predictionMap}
                    matches={matches}
                    users={currentPredictionUsers} />
            </div>
        );
    }

    if (!matches || isEmpty(matches)) {
        return (
            <div className="dashboard-loading">
                <LoadingIndicator />
            </div>
        )
    }

    return renderProPlayDashboard();
};

export default ProPlayDashboardConnector(ProPlayDashboard);
