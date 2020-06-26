import './favorite-team-news.scss';
import React, { useState, useEffect } from 'react';

import { Team } from '../../types/predictions';
import { ScheduleTeam, ScheduleMatchMetadata } from '../../types/pro-play-metadata';
import get from 'lodash/get';

const FavoriteTeamNews = ({ favoriteTeam, schedule }) => {
    const [upcomingMatches, setUpcomingMatches] = useState<ScheduleMatchMetadata[]>();

    const findUpcomingMatches = () => {
        if (!schedule) return;

        const currentDate = new Date().getTime();
        const upcomingBlockIndex = schedule.findIndex((match) => new Date(match.startTime).getTime() > currentDate);
        const upcomingBlockString = get(schedule, `[${upcomingBlockIndex + 1}].blockName`);
        const upcomingBlockGames = schedule.filter((match) => (
            match.blockName === upcomingBlockString
            && match.match.teams.map((el) => el.name).includes(favoriteTeam.name)
        ));

        setUpcomingMatches(upcomingBlockGames);
    }

    useEffect(findUpcomingMatches, [schedule]);

    const renderTeamScore = () => {
        const teamInfo: ScheduleTeam = get(upcomingMatches, '[0].match.teams', [])
            .find((el: Team) => el.name === favoriteTeam.name);

        if (!teamInfo || !teamInfo.record) return;
        
        return (
            <div className="favorite-team-subtitle team-record">
                {teamInfo.record.wins} - {teamInfo.record.losses}
            </div>
        )
    };

    const renderUpcomingMatches = () => {
        if (!upcomingMatches || !upcomingMatches.length) return;

        const upcomingOpponents: ScheduleTeam[] = upcomingMatches.map((match) => {
            const team = match.match.teams.find((team) => team.name !== favoriteTeam.name);

            if (!team) {
                throw new Error('team is undefined!');
            }

            return team;
        });

        return (
            <div className="upcoming-matches-wrapper">
                <div className="upcoming-matches-title">
                    upcoming matches:
                </div>
                <div className="upcoming-matches">
                    {
                        ...upcomingOpponents.map((opponent) => {
                            if (!opponent || !opponent.record) return;

                            return (
                                <div
                                    key={opponent.name}
                                    className="upcoming-match">
                                    <div className="upcoming-opponent-image-wrapper">
                                        <img
                                            className="upcoming-opponent-image"
                                            src={opponent.image} />
                                    </div>
                                    <div className="upcoming-opponent-subtitle opponent-name">
                                        {opponent.name}
                                    </div>
                                    <div className="upcoming-opponent-subtitle opponent-record">
                                        {opponent.record.wins} - {opponent.record.losses}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    };

    return (
        <div 
            style={{
                backgroundImage: `url(${favoriteTeam.backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '15px'
            }}
            className="favorite-team-news-wrapper">
            <div className="favorite-team-icon-wrapper">
                <img
                    className="favorite-team-icon"
                    src={favoriteTeam.image} />
                <div className="favorite-team-subtitle team-name">
                    {favoriteTeam.name}
                </div>
                {renderTeamScore()}
            </div>
            {renderUpcomingMatches()}
        </div>
    );
};

export default FavoriteTeamNews;
