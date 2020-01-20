import { SET_LEAGUES } from './pro-play-metadata.constants.js';
import axios from 'axios';
import get from 'lodash/get';

export const setLeagues = leagues => ({
    type: SET_LEAGUES,
    leagues
});

export const retrieveLeagues = () => async (dispatch, state) => {
    if (get(state, 'leagues', []).length > 0) {
        return;
    }

    let leagues;
    try {
        const data = await axios.get('/pro-play/leagues');
        leagues = data.data;
    } catch (error) {
        throw new Error(error);
    }
    dispatch(setLeagues(leagues));
};
