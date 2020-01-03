import axios from 'axios';

export const validateSummonerName = async summonerName => {
    return await axios.get(`http://localhost:4444/user?summonerName=${summonerName}`);
};
