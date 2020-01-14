import axios from 'axios';

export const validateSummonerName = async summonerName => {
    return await axios.get(`http://172.125.170.167:4444/user?summonerName=${summonerName}`);
};
