import {
    SET_MATCHES,
    SET_TEAMS
} from '../constants/constants.js';
import { MatchMetadata, Team } from '../../types/pro-play-metadata';

interface ProPlayMetadataStateProps {
    matches: MatchMetadata[]
    teams: Team[]
}
const initialState: ProPlayMetadataStateProps = {
    matches: [],
    teams: []
};

const setMatches = (state, action) => {
    return Object.assign({}, state, { matches: action.matches });
}

const setTeams = (state, action) => {
    return Object.assign({}, state, { teams: action.teams });
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_MATCHES:
            return setMatches(state, action);
        case SET_TEAMS:
            return setTeams(state, action);
        default:
            return state;
    }
};
