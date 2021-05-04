import './playoff-bracket.scss';
import React, { useState, useEffect, useRef } from 'react';
import Bo5Grid from './prediction-grids/bo5-grid/bo5-grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatchMetadata } from '../../types/pro-play-metadata';
import { Prediction } from '../../types/predictions';
import { User } from '../../types/user';
import moment from 'moment';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

interface PlayoffBracketProps {
    playoffMatches: MatchMetadata[];
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
    playoffMatches,
    users,
    predictionMap,
    showActiveSection,
    dropdownContent
}: PlayoffBracketProps) => {
    const [matchesBySection, setMatchesBySection] = useState<{ [sectionName: string]: MatchMetadata[] }>({});
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isSmallScreen, setIsSmallScreen] = useState<Boolean>(false);
    const playoffBracketRef = useRef(null);

    useEffect(() => {
        const localTime = new Date().getTime();
        const localMatchesBySection = groupBy(playoffMatches, 'tournamentMetadata.section.name');

        const sortedMatchesBySection: { [sectionName: string]: MatchMetadata[] } = Object.entries(localMatchesBySection)
            .sort(([sectionNameA, matchesA], [sectionNameB, matchesB]) => {
                return new Date(matchesA[0].startTime).getTime() - new Date(matchesB[0].startTime).getTime();
            })
            .reduce((acc, [sectionName, matches]) => {
                const sortedMatches = matches.sort((a, b) => {
                    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
                });

                return {
                    ...acc,
                    [sectionName]: sortedMatches
                }
            }, {});
        setMatchesBySection(sortedMatchesBySection);

        let localActiveSection: string | null = null;
        for (let matchEntries of Object.entries(sortedMatchesBySection)) {
            const [sectionName, sectionMatches] = matchEntries;

            const sectionStart = new Date(sectionMatches[0].startTime).getTime();
            const sectionEnd = new Date(sectionMatches[sectionMatches.length - 1].startTime).getTime();

            if (sectionStart > localTime || (localTime > sectionStart && localTime < sectionEnd)) {
                localActiveSection = sectionName;
                break;
            }
        }

        setActiveSection(localActiveSection);
    }, [playoffMatches]);

    const checkWindowSize = () => {
        const combinedWidth = Object.keys(matchesBySection).length * 275;
        setIsSmallScreen(combinedWidth > get(playoffBracketRef, 'current.clientWidth', combinedWidth + 5));
    }

    useEffect(() => {
        checkWindowSize();
    }, [playoffBracketRef, matchesBySection]);

    window.addEventListener('resize', checkWindowSize);

    const renderPlayoffMatch = (match) => {
        const matchIsCompleted = match.state === 'completed';
        return (
            <div
                key={match.match.id}
                className={`playoff-match ${isSmallScreen ? 'condensed-match' : ''}`}>
                {
                    match.match.teams.map((team, index) => {
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
        const upperBracketSections = Object.entries(matchesBySection).filter(([sectionName]) => sectionName.includes('Upper Bracket') || sectionName === 'Finals');
        const lowerBracketSections = Object.entries(matchesBySection).filter(([sectionName]) => sectionName.includes('Lower Bracket'));

        return (
            <>
                <div
                    className="playoff-bracket"
                    ref={playoffBracketRef}>
                    {
                        upperBracketSections.map(([sectionName, matches], index) => {
                            const isActiveSection = activeSection && sectionName === activeSection;

                            return (
                                <div
                                    key={index}
                                    className={`playoff-bracket-section ${isActiveSection ? 'active-section' : ''}`}
                                    onClick={() => setActiveSection(sectionName)}>
                                    <div className="playoff-section-title">
                                        {sectionName}
                                    </div>
                                    <div className="playoff-section-title">
                                        {moment(matches[0].startTime).format('MMMM Do')}
                                    </div>
                                    <div className="playoff-section-matches">
                                        {
                                            matches
                                                .map((match) => renderPlayoffMatch(match))
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div
                    className="playoff-bracket lower-bracket"
                    ref={playoffBracketRef}>
                    {
                        lowerBracketSections.map(([sectionName, matches], index) => {
                            const isActiveSection = activeSection && sectionName === activeSection;

                            return (
                                <div
                                    key={index}
                                    className={`playoff-bracket-section ${isActiveSection ? 'active-section' : ''}`}
                                    onClick={() => setActiveSection(sectionName)}>
                                    <div className="playoff-section-title">
                                        {sectionName}
                                    </div>
                                    <div className="playoff-section-title">
                                        {moment(matches[0].startTime).format('MMMM Do')}
                                    </div>
                                    <div className="playoff-section-matches">
                                        {
                                            matches
                                                .map((match) => renderPlayoffMatch(match))
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </>
        )
    };

    const renderContentDropdown = () => {
        if (!activeSection) return '';

        const activeSectionClass = (!activeSection) ? '' : 'section-visible';
        let activeSectionMatches = matchesBySection[activeSection];
        if (activeSectionMatches && activeSectionMatches.length !== 0) {
            activeSectionMatches = activeSectionMatches.sort((a, b) => moment(a.startTime).unix() - moment(b.startTime).unix());
        }
        const dropdownFcn = dropdownContent ? dropdownContent : renderPlayoffGuesses;

        return (
            <div className={`playoff-section-wrapper ${activeSectionClass}`}>
                <div className="active-playoff-section">
                    {dropdownFcn(activeSectionMatches)}
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="close-section"
                        onClick={() => setActiveSection(null)} />
                </div>
            </div>
        );
    };

    const renderPlayoffGuesses = (activeSectionMatches: MatchMetadata[]) => {
        if (!activeSection || activeSectionMatches.length === 0) {
            return;
        }

        const usersWithPredictions = users.filter((el) => el.userFlags.includes('hasPredictions'));

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
