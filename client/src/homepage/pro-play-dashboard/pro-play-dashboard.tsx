import './pro-play-dashboard.scss';
import React, { useState, useEffect } from 'react';
import ProPlayDashboardConnector from './pro-play-dashboard.connector';

import CurrentTournamentStatistics from './current-tournament-statistics/current-tournament-statistics';
import PredictionBreakdown from './prediction-breakdown/prediction-breakdown';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator';
import { User } from '../../types/user';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';

const ProPlayDashboard = ({
    predictionMap,
    schedule,
    currentUser,
    usersMetadata,
    teams,
    loadAllPredictions,
    loadAllSchedule,
    loadAllUsers,
    loadAllTeams
}) => {
    const [currentTournamentLabel, setCurrentTournamentLabel] = useState<string>();
    const [currentPredictionUsers, setCurrentPredictionUsers] = useState<User[]>([]);

    useEffect(() => {
        loadAllSchedule();
        loadAllPredictions();
        loadAllUsers();
        loadAllTeams();
    }, []);

    useEffect(() => {
        const isRegularSeason = some(schedule, (el) => ['LCS', 'LEC'].includes(el.leagueName));
        if (isRegularSeason) {
            setCurrentTournamentLabel('LEC / LCS Split');
        }
    }, [schedule]);

    useEffect(() => {
        const filteredUsers = usersMetadata.filter((user) => user.flags.hasPredictions);
        setCurrentPredictionUsers(filteredUsers)
    }, [usersMetadata]);

    const renderProPlayDashboard = () => {
        return (
            <div className="pro-play-dashboard">
                <div className="tournament-label">
                    {currentTournamentLabel}
                </div>
                <CurrentTournamentStatistics
                    predictionMap={predictionMap}
                    schedule={schedule}
                    currentUser={currentUser}
                    users={currentPredictionUsers}
                    teams={teams} />
                <PredictionBreakdown
                    predictionMap={predictionMap}
                    schedule={schedule}
                    users={currentPredictionUsers} />
            </div>
        );
    }

    if (!schedule || isEmpty(schedule)) {
        return (
            <div className="dashboard-loading">
                <LoadingIndicator />
            </div>
        )
    }

    return renderProPlayDashboard();
};

export default ProPlayDashboardConnector(ProPlayDashboard);
