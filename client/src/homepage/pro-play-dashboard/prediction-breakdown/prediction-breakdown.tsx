import './prediction-breakdown.scss';
import React, { useState, useEffect } from 'react';
import PlayoffBracket from '../../../components/playoff-bracket/playoff-bracket';
import GroupStageGrid from './group-stage-grid/group-stage-grid';
import { findNearestMatch, getUniqueTournaments } from '../../../utils/pro-play-metadata/pro-play-metadata.utils';
import LEAGUES from '../../../constants/leagues.json';
import { TOURNAMENT_SLUG_MAP } from '../../../constants/pro-play-metadata.constants';
import { MatchMetadata, Tournament, TournamentMetadata, MatchLeague } from '../../../types/pro-play-metadata';
import { Prediction } from '../../../types/predictions';
import { User } from '../../../types/user';
import every from 'lodash/every';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import some from 'lodash/some';
import startCase from 'lodash/startCase';

interface PredictionBreakdownProps {
    predictionMap: {
        [userId: string]: {
            [matchId: string]: Prediction
        }
    }
    matches: MatchMetadata[]
    users: User[]
};
export default ({
    predictionMap,
    matches,
    users
}: PredictionBreakdownProps) => {
    const [activeTournamentMetadata, setActiveTournamentMetadata] = useState<TournamentMetadata>();
    const [activeLeague, setActiveLeague] = useState<MatchLeague>();
    const [activeTournament, setActiveTournament] = useState<string>();

    const [activeTournamentMap, setActiveTournamentMap] = useState<{ [name: string]: Tournament }>({});
    const [matchesByTournament, setMatchesByTournament] = useState<{ [tournamentId: string]: MatchMetadata[] }>();

    useEffect(() => {
        getMatchesByTournament();
        const closestMatch = findNearestMatch(matches);
        setActiveTournamentMetadata(closestMatch.tournamentMetadata);
        setActiveLeague(closestMatch.league);
        setActiveTournament(closestMatch.tournamentMetadata.tournament.id);
    }, [matches]);

    useEffect(() => {
        getCurrentActiveTournament();
    }, [matchesByTournament]);

    const getCurrentActiveTournament = () => {
        if (matchesByTournament) {
            const activeTournamentMap: { [name: string]: Tournament } = {};
            const currentTime = new Date().getTime();
            for (let [ _, matches ] of Object.entries(matchesByTournament)) {
                // find the match's region
                if (matches.length > 0) {
                    const leagueName = matches[0].league.name;
                    const tournament = matches[0].tournamentMetadata.tournament;
                    const isTournamentFuture = new Date(tournament.startDate).getTime() > currentTime;
                    if (isTournamentFuture) {
                        continue;
                    }
                    if (!activeTournamentMap[leagueName]) {
                        activeTournamentMap[leagueName] = tournament;
                    } else {
                        // if there's an active tournament, we don't care about tournaments in the past
                        const isActive = new Date(tournament.startDate).getTime() < currentTime && new Date(tournament.endDate).getTime() >= currentTime;
                        // choose the tournament with the smallest duration
                        const tempActiveTournament = activeTournamentMap[leagueName];
                        const activeTournamentDuration = new Date(tempActiveTournament.endDate).getTime() - new Date(tempActiveTournament.startDate).getTime();
                        const newTournamentDuration = new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime();

                        if (isActive && newTournamentDuration < activeTournamentDuration) {
                            activeTournamentMap[leagueName] = tournament;
                        }
                    }
                }
            }
        }
        setActiveTournamentMap(activeTournamentMap);
        if (Object.values(activeTournamentMap).length !== 0) {
            const tournamentId = Object.values(activeTournamentMap)[0].id;
            setActiveTournament(tournamentId);
        }
    }
    
    const getMatchesByTournament = () => {
        setMatchesByTournament(groupBy(matches, (match) => match.tournamentMetadata.tournament.id));
    };

    const renderPlayoffs = (playoffMatches) => {
        const { name, slug } = playoffMatches[0].tournamentMetadata.stage;
        return (
            <div
                className="playoff-bracket-wrapper"
                key={slug}>
                <div className="playoff-bracket-title">
                    {name}
                </div>
                <PlayoffBracket
                    playoffMatches={playoffMatches}
                    users={users}
                    predictionMap={predictionMap}
                    showActiveSection={true} />
            </div>
        );
    };

    const renderGroupStage = (matchesInStage: MatchMetadata[]) => {
        const stage = matchesInStage[0].tournamentMetadata.stage;
        // Sort matches by start time
        const matchesBySection = groupBy(matchesInStage, (match) => {
            if (match.blockName.includes('Week')) {
                return match.blockName;
            }

            return match.tournamentMetadata.section.name;
        });

        const sortedMatchesBySection: [string, MatchMetadata[]][] = Object.entries(matchesBySection)
            .map(([sectionName, matches]) => {
                return [
                    sectionName,
                    matches.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                ]
            });

        return (
            <div
                className="prediction-group-stage"
                key={stage.slug}>
                {
                    ...sortedMatchesBySection.map(([sectionName, sectionMatch]) => (
                        <div
                            className="section-container"
                            key={sectionName}>
                            <div
                                className="group-stage-section-label"
                                key={`${sectionName}-label`}>
                                {stage.name} - {startCase(sectionName)}
                            </div>
                            <div
                                className="prediction-group"
                                key={`${sectionName}-content`}>
                                <GroupStageGrid
                                    matches={sectionMatch}
                                    usersMetadata={users}
                                    predictionMap={predictionMap} />
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    };

    const renderLeagueHeader = () => {
        if (!activeLeague) return;

        if (['lcs', 'lec'].includes(activeLeague.slug)) {
            const lcsMetadata = LEAGUES.find((league) => league.slug === 'lcs');
            const lecMetadata = LEAGUES.find((league) => league.slug === 'lec');

            if (!lcsMetadata || !lecMetadata) return;

            return (
                <div className="league-header">
                    <img
                        src={lecMetadata.image}
                        className="league-icon" />
                    <img
                        src={lcsMetadata.image}
                        className="league-icon" />
                    <span className="league-name">
                        {lecMetadata.name} / {lcsMetadata.name}
                    </span>
                </div>
            )
        }

        const leagueMetadata = LEAGUES.find((league) => league.slug === activeLeague.slug);

        if (!leagueMetadata) return;

        return (
            <div className="league-header">
                <img
                    src={leagueMetadata.image}
                    className="league-icon" />
                <span className="league-name">
                    {leagueMetadata.name}
                </span>
            </div>
        )
    };

    const renderTournamentOptions = () => {
        if (!matches || matches.length === 0 || !activeLeague || !activeTournamentMetadata) return;

        let uniqueTournaments: Tournament[] = [];
        if (['lec', 'lcs'].includes(activeLeague.slug)) {
            uniqueTournaments = [
                ...getUniqueTournaments({ matches, leagueSlug: 'lec' }),
                ...getUniqueTournaments({ matches, leagueSlug: 'lcs' })
            ]
        } else {
            uniqueTournaments = getUniqueTournaments({ matches, leagueSlug: activeLeague.slug });
        }

        if (uniqueTournaments.length === 1) {
            return <></>;
        }

        return (
            <div className="tournament-options">
                {
                    ...uniqueTournaments.map((tournament) => {
                        const isActiveTournament = activeTournament === tournament.id;

                        return (
                            <div
                                key={tournament.id}
                                className={`tournament-option ${isActiveTournament ? 'active-tournament' : ''}`}
                                onClick={() => setActiveTournament(tournament.id)}>
                                {TOURNAMENT_SLUG_MAP[tournament.slug]}
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    const renderPredictions = () => {
        if (!matchesByTournament || !activeTournament) {
            return [];
        }
        const currentDate = new Date().getTime();
        // first, group the matches of the tournament into the stages
        const matchesByStage = groupBy(matchesByTournament[activeTournament], (match) =>
            match.blockName.includes('Week') ? match.blockName : match.tournamentMetadata.stage.slug
        );

        console.log('activeTournamentMetadata', activeTournamentMetadata)
        console.log('matchesByStage', matchesByStage)

        const pastAndPresentStageIndex = Object.entries(matchesByStage)
            .sort(([aName, aMatches], [bName, bMatches]) => {
                const aStartTime = new Date(aMatches[0].startTime).getTime();
                const bStartTime = new Date(bMatches[0].startTime).getTime();

                return bStartTime - aStartTime;
            })
            .findIndex(([stageName, matchesByStage]) => {
                return get(activeTournamentMetadata, 'stage.slug') === stageName
                // if all matches haven't yet occurred, return
                // if (every(matchesByStage, (match) => new Date(match.startTime).getTime() > currentDate)) {
                //     return true;
                // }

                // // return if some matches have occurred
                // return some(matchesByStage, (match) => new Date(match.startTime).getTime() < currentDate);
            });
        const pastAndPresentStages = Object.entries(matchesByStage).slice(0, pastAndPresentStageIndex + 1);

        // sort the active stages - this is assuming no 2 stages in a tournament
        // overlap each other
        return pastAndPresentStages
            .reverse()
            .map(([stageName, matchesByStage]) => {
                const stage = matchesByStage[0].tournamentMetadata.stage;
                const league = matchesByStage[0].league.slug;
                const key = `${league}:${stageName}`;
                if (stage.type === 'regular_season') {
                    return (
                        <div
                            key={key}
                            className="prediction-breakdown">
                            {renderGroupStage(matchesByStage)}
                        </div>
                    );
                } if (stage.type === 'groups') {
                    return (
                        <div
                            key={key}
                            className="prediction-breakdown">
                            {renderGroupStage(matchesByStage)}
                        </div>
                    );
                } else if (stage.type === 'bracket') {
                    return (
                        <div
                            key={key}
                            className="prediction-breakdown">
                            {renderPlayoffs(matchesByStage)}
                        </div>
                    );
                } else {
                    return (<></>)
                }
            });
    };

    const renderSchedule = () => {
        return (
            <>
                {renderLeagueHeader()}
                {renderTournamentOptions()}
                {...renderPredictions()}
            </>
        );
    };
    return renderSchedule();
};
