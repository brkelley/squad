import './playoff-bracket.scss';
import React, { useState, useEffect, useRef } from 'react';
import Bo5Grid from './prediction-grids/bo5-grid/bo5-grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ScheduleStage, ScheduleSection, ScheduleMatch } from '../../types/pro-play-metadata';
import { Prediction } from '../../types/predictions';
import { User } from '../../types/user';
import moment from 'moment';
import get from 'lodash/get';
import some from 'lodash/some';

interface PlayoffBracketProps {
    playoffStage: ScheduleStage;
    users: User[];
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    };
    showActiveSection: Boolean;
    dropdownContent?: Function;
};
export default ({
    playoffStage,
    users,
    predictionMap,
    showActiveSection,
    dropdownContent
}: PlayoffBracketProps) => {
    const [activeSection, setActiveSection] = useState<ScheduleSection | null>();
    const [isSmallScreen, setIsSmallScreen] = useState<Boolean>(false);
    const playoffBracketRef = useRef(null);

    useEffect(() => {
        const today = moment();
        const nextActiveSection = playoffStage.sections.find((section, index) => {
            if (index === playoffStage.sections.length - 1) return section;
            if (some(section.matches, { state: 'inProgress' })) return section;
            const sectionEnd = moment(section.endTime);

            return today.isBefore(sectionEnd);
        });
        setActiveSection(nextActiveSection);
    }, [playoffStage]);

    const checkWindowSize = () => {
        const combinedWidth = playoffStage.sections.length * 275;
        setIsSmallScreen(combinedWidth > get(playoffBracketRef, 'current.clientWidth', combinedWidth + 5));
    }

    useEffect(() => {
        checkWindowSize();
    }, [playoffBracketRef]);

    window.addEventListener('resize', checkWindowSize);

    const renderPlayoffMatch = (match) => {
        const matchIsCompleted = match.state === 'completed';
        return (
            <div
                key={match.id}
                className={`playoff-match ${isSmallScreen ? 'condensed-match' : ''}`}>
                {
                    match.teams.map((team, index) => {
                        const isLosingTeam = team.result && team.result.outcome && team.result.outcome !== 'win';

                        return (
                            <div
                                className="playoff-match-team"
                                key={index}>
                                <div className={`left-side ${isLosingTeam ? 'losing-team' : ''}`}>
                                    <div className="playoff-team-image-wrapper">
                                        <img
                                            className="playoff-team-image"
                                            src={team.image} />
                                    </div>
                                    {!isSmallScreen &&
                                        <div className="playoff-team-name">
                                            {team.name}
                                        </div>
                                    }
                                </div>
                                <div className="right-side">
                                    {
                                        matchIsCompleted &&
                                        (
                                            <div className={`team-score ${isLosingTeam ? 'losing-team' : ''}`}>
                                                {team.result.gameWins}
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        )
    };

    const renderPlayoffBracket = () => {
        return (
            <div
                className="playoff-bracket"
                ref={playoffBracketRef}>
                {
                    playoffStage.sections.map((section) => {
                        const isActiveSection = activeSection && section.name === activeSection.name;

                        return (
                            <div
                                key={section.id}
                                className={`playoff-bracket-section ${isActiveSection ? 'active-section' : ''}`}
                                onClick={() => setActiveSection(section)}>
                                <div className="playoff-section-title">
                                    {section.name}
                                </div>
                                <div className="playoff-section-title">
                                    {moment(section.startTime).format('MMMM Do')}
                                </div>
                                <div className="playoff-section-matches">
                                    {
                                        section.matches
                                            .sort((a, b) => moment(b.startTime).unix() - moment(a.startTime).unix())
                                            .map((match) => renderPlayoffMatch(match))
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const renderContentDropdown = () => {
        const activeSectionClass = (!activeSection) ? '' : 'section-visible';
        const dropdownFcn = dropdownContent ? dropdownContent : renderPlayoffGuesses;

        return (
            <div className={`playoff-section-wrapper ${activeSectionClass}`}>
                <div className="active-playoff-section">
                    {dropdownFcn(activeSection)}
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="close-section"
                        onClick={() => setActiveSection(null)} />
                </div>
            </div>
        );
    };

    const renderPlayoffGuesses = () => {
        if (!showActiveSection) return '';

        let activeSectionMatches: ScheduleMatch[] = get(activeSection, 'matches', []);
        const usersWithPredictions = users.filter((el) => el.flags.hasPredictions);

        if (activeSectionMatches && activeSectionMatches.length !== 0) {
            activeSectionMatches = activeSectionMatches.sort((a, b) => moment(a.startTime).unix() - moment(b.startTime).unix());
        }

        return (
            <Bo5Grid
                matches={activeSectionMatches}
                usersMetadata={usersWithPredictions}
                predictionMap={predictionMap} />
        );
    };

    return (
        <div className="playoff-bracket-and-predictions">
            {renderPlayoffBracket()}
            {renderContentDropdown()}
        </div>
    );
};
