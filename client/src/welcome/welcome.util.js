import axios from 'axios';

export const validateSummonerName = async summonerName => {
    return await axios.get(`/user?summonerName=${summonerName}`);
};
