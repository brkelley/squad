import './prediction-breakdown.scss';
import React from 'react';
import PlayoffBracket from '../../../components/playoff-bracket/playoff-bracket';
import GroupStageGrid from './group-stage-grid/group-stage-grid';
import { TournamentSchedule, ScheduleStage } from '../../../types/pro-play-metadata';
import { Prediction } from '../../../types/predictions';
import { User } from '../../../types/user';
import moment from 'moment';
import startCase from 'lodash/startCase';

interface PredictionBreakdownProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    };
    schedule: TournamentSchedule[];
    users: User[];
};
export default ({
    predictionMap,
    schedule,
    users
}: PredictionBreakdownProps) => {
    const renderPlayoffs = (playoffSchedule) => {
        const playoffScheduleWithSectionIds = {
            ...playoffSchedule,
            sections: playoffSchedule.sections.map((el, index) => ({ ...el, id: index }))
        }
        return (
            <div
                className="playoff-bracket-wrapper"
                key={playoffSchedule.slug}>
                <div className="playoff-bracket-title">
                    {playoffSchedule.name}
                </div>
                <PlayoffBracket
                    playoffStage={playoffScheduleWithSectionIds}
                    users={users}
                    predictionMap={predictionMap}
                    showActiveSection={true} />
            </div>
        );
    };

    const renderGroupStage = (stage: ScheduleStage) => {
        return (
            <div
                className="prediction-group-stage"
                key={stage.slug}>
                {
                    ...stage.sections.map((section) => (
                        <div
                            className="section-container"
                            key={section.name}>
                            <div
                                className="group-stage-section-label"
                                key={`${section.id}-label`}>
                                {stage.name} - {startCase(section.name)}
                            </div>
                            <div
                                className="prediction-group"
                                key={`${section.id}-content`}>
                                <GroupStageGrid
                                    matches={section.matches}
                                    usersMetadata={users}
                                    predictionMap={predictionMap} />
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    };

    const renderPredictions = () => {
        return schedule.map((tournament) => {
            const now = moment();
            let nextStageIndex = tournament.schedule.findIndex((stage) => {
                const stageStartMoment = moment(stage.startTime);

                return now.isBefore(stageStartMoment);
            });

            if (nextStageIndex === -1) nextStageIndex = tournament.schedule.length;
            else nextStageIndex++;

            const schedule = tournament.schedule.slice(0, nextStageIndex).reverse();

            return (
                <div
                    className="prediction-breakdown"
                    key={tournament.leagueId}>
                    {
                        ...schedule.map((stage) => {
                            if (stage.type === 'groups') {
                                return renderGroupStage(stage);
                            } else if (stage.type === 'bracket') {
                                return renderPlayoffs(stage);
                            }
                        })
                    }
                </div>
            )
        });
    };

    const renderSchedule = () => {
        return (
            <>
                {
                    ...renderPredictions()
                }
            </>
        );
    };
    return renderSchedule();
};
