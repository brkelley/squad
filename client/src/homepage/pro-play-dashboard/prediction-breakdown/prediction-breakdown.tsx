import './prediction-breakdown.scss';
import React, { useState, useEffect } from 'react';
import PlayoffBracket from '../../../components/playoff-bracket/playoff-bracket';
import GroupStageGrid from './group-stage-grid/group-stage-grid';
import { ScheduleByLeague, ScheduleStage } from '../../../types/pro-play-metadata';
import { Prediction } from '../../../types/predictions';
import { User } from '../../../types/user';
import flatMap from 'lodash/flatMap';
import startCase from 'lodash/startCase';

interface PredictionBreakdownProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    };
    schedule: ScheduleByLeague[];
    users: User[];
};
export default ({
    predictionMap,
    schedule,
    users
}: PredictionBreakdownProps) => {
    const [activeTournament, setActiveTournament] = useState<string>();

    useEffect(() => {
        const nowTimestamp = new Date().getTime();
        let activeTournament;
        for (let leagueTournaments of schedule) {
            for (let schedule of leagueTournaments.schedule) {
                const tournamentStart = new Date(schedule.startTime).getTime();
                const tournamentEnd = new Date(schedule.endTime).getTime();

                if (tournamentStart < nowTimestamp && tournamentEnd > nowTimestamp) {
                    activeTournament = schedule;
                    break;
                }
            }

            if (activeTournament) break;
        }

        if (activeTournament) {
            setActiveTournament(activeTournament.tournamentName);
        }
    }, [schedule]);

    const renderPlayoffs = (playoffSchedule) => {
        return (
            <div
                className="playoff-bracket-wrapper"
                key={playoffSchedule.slug}>
                <div className="playoff-bracket-title">
                    {playoffSchedule.name}
                </div>
                <PlayoffBracket
                    playoffStage={playoffSchedule}
                    users={users}
                    predictionMap={predictionMap}
                    showActiveSection={true} />
            </div>
        );
    };

    const renderGroupStage = (stage: ScheduleStage, isSplit: Boolean = false) => {
        const nowTimestamp = new Date().getTime();
        let filteredSections;
        if (isSplit) {
            let nextSection = stage.sections.findIndex((section) => {
                const sectionStartTimestamp = new Date(section.startTime).getTime();
                const sectionEndTimestamp = new Date(section.endTime).getTime();

                return (nowTimestamp > sectionStartTimestamp && nowTimestamp < sectionEndTimestamp)
                    || nowTimestamp < sectionStartTimestamp;
            });

            if (nextSection === -1) {
                nextSection = stage.sections.length - 1;
            }
            filteredSections = stage.sections.slice(0, nextSection + 1).reverse();
        } else {
            filteredSections = stage.sections;
        }
        
        return (
            <div
                className="prediction-group-stage"
                key={stage.slug}>
                {
                    ...filteredSections.map((section) => (
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

    const renderTournamentPills = () => {
        // first, find all the tournaments
        const tournamentNames: string[] = schedule.reduce((acc: string[], leagueTournaments): string[] => {
            acc.push(...leagueTournaments.schedule.map((schedule) => schedule.tournamentName));

            return acc;
        }, []);

        return (
            <div className="tournament-pills">
                {
                    tournamentNames.map((name, index) => (
                        <div
                            key={index}
                            className={`tournament-pill ${name === activeTournament ? 'active-tournament' : ''}`}
                            onClick={() => setActiveTournament(name)}>
                            {name}
                        </div>
                    ))
                }
            </div>
        );
    };

    const renderPredictions = () => {
        let activeStages = schedule.reduce((tournAcc: ScheduleStage[], tournamentsByLeague) => {
            const applicableTournaments = tournamentsByLeague.schedule
                .filter((el) => el.tournamentName === activeTournament)
                .map((el) => el.stages);

            tournAcc.push(...flatMap(applicableTournaments))

            return tournAcc;
        }, []);

        const nowTimestamp = new Date().getTime();
        let activeStageIndex = activeStages.findIndex((stage) => {
            const stageStartTimestamp = new Date(stage.startTime).getTime();
            const stageEndTimestamp = new Date(stage.endTime).getTime();

            return (nowTimestamp > stageStartTimestamp && nowTimestamp < stageEndTimestamp)
                || nowTimestamp < stageStartTimestamp;
        });
        if (activeStageIndex === -1) {
            activeStageIndex = activeStages.length - 1;
        }

        activeStages = activeStages
            .slice(0, activeStageIndex + 1)
            .reverse();

        return activeStages
            .map((stage) => {
                if (stage.type === 'split') {
                    return (
                        <div
                            key={stage.slug}
                            className="prediction-breakdown">
                            {renderGroupStage(stage, true)}
                        </div>
                    );
                } if (stage.type === 'groups') {
                    return (
                        <div
                            key={stage.slug}
                            className="prediction-breakdown">
                            {renderGroupStage(stage)}
                        </div>
                    );
                } else if (stage.type === 'bracket') {
                    return (
                        <div
                            key={stage.slug}
                            className="prediction-breakdown">
                            {renderPlayoffs(stage)}
                        </div>
                    );
                }
            });
    };

    const renderSchedule = () => {
        return (
            <>
                {renderTournamentPills()}
                {...renderPredictions()}
            </>
        );
    };
    return renderSchedule();
};
