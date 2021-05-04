import { SET_MATCHES, SET_TEAMS } from '../constants/constants.js';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

let loadAllMatchesPromise;
let loadAllTeamsPromise;

export const loadAllMatches = () => async (dispatch, getState) => {
    const state = getState();
    let { matches } = state.proPlayMetadataReducer;

    if (!isEmpty(matches) || loadAllMatchesPromise) return;

    loadAllMatchesPromise = axios.get('/pro-play/matches');

    try {
        const data = await loadAllMatchesPromise;
        matches = data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    dispatch({ type: SET_MATCHES, matches });
};

export const loadAllTeams = () => async (dispatch, getState) => {
    let teams;
    if (loadAllTeamsPromise) return;

    loadAllTeamsPromise = axios.get('/pro-play/teams');
    try {
        const data = await loadAllTeamsPromise;
        teams = data.data;
    } catch (error) {
        throw new Error(error);
    }
    dispatch({ type: SET_TEAMS, teams });
};

